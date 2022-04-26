require('dotenv').config();
const express = require('express');

const Package = require('../package.json');

const SERVER = {
  port                   : process.env.PORT || 8080,
  appName                : Package.name,
  envVarsRegEx           : /^VUE_APP.+/,
  globalConfigObjectName : 'chgEdmConfig',
};

const server = express()
  
  .get('/liveness', (req, res) => {
    console.info("returning ok on liveness check")
    res.send('ok')
  })
  .get('/readiness', (req, res) => {
    console.info("returning ok on readiness check")
    res.send('ok')
  })
  .get('/config', (req, res) => {
    const envVars = getEnvironmentVariables(process.env, SERVER.envVarsRegEx);

    const envVarsString = `window.${SERVER.globalConfigObjectName}=${JSON.stringify(envVars)}`;

    res.type('text/javascript').send(envVarsString);
  })
  // route requests for static files to appropriate directory
  .use('/', express.static(`${__dirname}`))
  // final catch-all route to index.html defined last
  .get('/*', (req, res) => {    
    res.sendFile(`${__dirname}/index.html`)
  })
  .listen(SERVER.port, () => {
    const { address, port } = server.address();

    let ip = address;
    if (ip === '0.0.0.0' || ip === '::') ip = '127.0.0.1';

    console.info(`Started server for '${SERVER.appName}'. Listening at http://${ip}:${port}`);
  });

  function getEnvironmentVariables (procEnv = {}, pattern) {
    return Object.entries(procEnv)
      .filter(([k]) => pattern.test(k))
      .reduce((acc,[k,v]) => ({ ...acc,[k]: v }),{});
  }