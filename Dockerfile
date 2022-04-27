FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server-spa

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# Need the argument to access the company NPM registry
ARG NPM_TOKEN

# Configure NPM registry and install modules
RUN npm config set @sonamsamdupkhangsar:registry=https://npm.pkg.github.com && \
    npm config set //npm.pkg.github.com/:_authToken $PERSONAL_ACCESS_TOKEN && \
    npm ci --quiet
    
# build app for production with minification
RUN NODE_ENV=production npm run build

EXPOSE 8080

CMD ["npm", "start"]
