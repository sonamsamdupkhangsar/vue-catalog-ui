import Vue from 'vue'
import App from './App.vue'

import Auth from '@okta/okta-vue'
import VueRouter from 'vue-router'
import cors from 'cors'
import vuetify from './plugins/vuetify';


const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/implicit/callback', component: Auth.handleCallback() },        
  ]
})
const vueUrl = 'https://sonamsamdupkhangsar.github.io/vue-catalog-ui'
//const vueUrl = "http://localhost:8080"

Vue.use(VueRouter)
console.log('issuer: ', process.env)
Vue.use(Auth, {
  issuer: 'https://dev-975443.okta.com/oauth2/default',
  clientId: '0oasdq16pWdVhJl9W4x6',  
  redirectUri: vueUrl + '/implicit/callback', // Handle the response from Okta and store the returned tokens.
  scopes: ['openid', 'profile', 'email'],
  pkce: true 
})

Vue.config.productionTip = false

Vue.use(cors)

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
