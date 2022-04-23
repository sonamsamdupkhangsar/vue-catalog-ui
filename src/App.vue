<template>
  <v-app>
    <router-view></router-view>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>Application Catalogue</h2>
      </div>

      <v-spacer></v-spacer>

      <span v-if="authenticated" class="mr-0">Welcome {{ claims.name }}! </span>

      <v-btn v-if="authenticated" v-on:click="logout" id="logout-button">
        Logout
      </v-btn>
      <v-btn v-else v-on:click="login" id="login-button"> Login </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="active_tab" align-with-title v-if="authenticated">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item.tab">
            {{ item.tab }}
          </v-tab>
        </v-tabs>
        <v-tabs v-model="active_tab" align-with-title v-if="!authenticated">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab> Welcome </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <v-tabs-items v-model="active_tab" v-if="authenticated">
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-card flat>
            <v-card-text>
              <component
                v-bind:is="item.content"
                v-on:activateTab="activateTab"
                v-on:login="login"
                :appId="appId"
                :envId="envId"
                :serviceUrl="serviceUrl"
              ></component>
             
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <v-tabs-items v-model="active_tab" v-if="!authenticated">
        <v-tab-item>
          <v-card flat>
            <v-card-text>Login required</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import AppCatLog from "./components/AppCatLogHome";
import Applications from "./components/Applications";
import Environment from "./components/Environment";
import Services from "./components/Services";
import Platforms from "./components/Platforms";
import Status from "./components/Status";
import Component from './components/Component'
//import Connections from './components/Connections'

export default {
  name: "App",

  components: {
    AppCatLog,
    Applications,
    Environment,
    Services,
    Platforms,
  },

  data: () => ({
    authenticated: false,
    jwtToken: "",
    pageMessage: "This is Home page",
    claims: "",
    userTabs: [
      { tab: "Application State", content: AppCatLog },
      { tab: "Services", content: Services },
    ],
    adminTabs: [
      { tab: "Application State", content: AppCatLog },
      { tab: "Application", content: Applications },
      { tab: "Environment", content: Environment },
      { tab: "Services", content: Services },
      { tab: "Platforms", content: Platforms },
      { tab: "Component", content: Component },
      { tab: "Status", content: Status },      
      //{ tab: "Connections", content: Connections},
    ],
    active_tab: "",
    items: [],
    isAdmin: false,
    appId: "",
    envId: "",
    serviceUrl: "https://catalog-rest-service.sonam.cloud"    
  }),
  async created() {
    console.log("created serviceUrl: ", this.serviceUrl);
    this.setResponseInterceptor();
    this.isAuthenticated();
  },

  watch: {
    // Everytime the route changes, check for auth status
    $route: "isAuthenticated",
  },
  methods: {
    async setup() {
      this.claims = await this.$auth.getUser();

      if (this.claims) {
        for (let i = 0; i < this.claims.groups.length; i++) {
          if (this.claims.groups[i] == "appcatlog_admins") {
            this.isAdmin = true;
            this.items = this.adminTabs;
            console.log("user is admin, break");
            break;
          }
          console.log("claims.group: ", this.claims.groups[i])
        }
        if (this.items.length == 0) {
          this.items = this.userTabs;
        }
      }
      //this.active_tab = 2  //show 3 tab Environment (starts at 0)
    },
    async isAuthenticated() {
      this.authenticated = await this.$auth.isAuthenticated();
      console.log("is authenticated: ", this.authenticated);
      this.token = `Bearer ${await this.$auth.getAccessToken()}`;
      //this.token = `Bearer eyJraWQiOiJDX3NUbWE0RFBqNFZGWndnMGxDS0FsZHJvbDVoVnEzbmRXcFVKUnNfWk1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlZlNTVhVUhlZ2d6TnRDV0o0cTNuVmRjOGdHSXBHZGJqeF8zRDhrVTh6dDgiLCJpc3MiOiJodHRwczovL2NoZ2hlYWx0aGNhcmUub2t0YXByZXZpZXcuY29tL29hdXRoMi9hdXNrbXRqYWNmRWk4ZmZNNjBoNyIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2MDgxMzkzNTAsImV4cCI6MTYwODE0Mjk1MCwiY2lkIjoiMG9hdjN5dXhwZ2M3REdGSlAwaDciLCJ1aWQiOiIwMHVybndmZzI1VnFEcktzVTBoNyIsInNjcCI6WyJwcm9maWxlIiwiZW1haWwiLCJvcGVuaWQiXSwic3ViIjoic3NhbWR1cGtAbXljaGcuY29tIiwiZ3JvdXBzIjpbIkV2ZXJ5b25lIiwiYXBwY2F0bG9nX2FkbWlucyJdfQ.b_rXGKno5uXPtrdf3SSZoq4qrj9HHDW7HurskTOJOq__Mafs1bFEKnzHprIid5Pw2Sw5N-1zn3kJcdushWM4pMr91YaGrDATsK7nnKe4msvfx_FvaIPs0V_8TxVOG0QyE9UPKAwAznraP2f1qz5bZHZ0YYgMPPjSpmAeSghe3tjwQ7ducNaK3BPx761KuS2DAwt4R0Vbzyi6mub5FiH9hJUn92jBWFWj6cYeTzw3winlbMHWAJm1cY09JFNaehO00mvLRpgX0KVtO8WznHpKkvWETirh7NcED59PJD9fgzfpnfzgxrHx8PrEkQ2rQ4N81SNWgiBHZ-7TxolsCiJb6A`;
      console.log( "token: ", this.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${await this.$auth.getAccessToken()}`;

      
      console.log("is authenticated: ", this.authenticated);
      if (this.authenticated == true) {
        console.log("authenticated is true");
        this.setup();
      }
    },

    login() {
      console.log("login redirect");
      this.$auth.loginRedirect("/");
    },
    async logout() {
      await this.$auth.logout();
      await this.isAuthenticated();

      // Navigate back to home
      //  this.$router.push({ path: "/" });
    },

    activateTab(tabIndex, appId, envId) {
      //status tab is index 5 (starting at 0 (zero))
      this.active_tab = 6;
      this.appId = appId;
      this.envId = envId;
      console.log(
        "tabIndex: ",
        tabIndex,
        ": appId: ",
        appId,
        ", envId: ",
        envId
      );

      this.$emit("statusTab", appId, envId);
    },
    setResponseInterceptor() {
    axios.interceptors.response.use(
      (response) => {
        if (response.status === 200 || response.status === 201) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(response);
        }
      },
      (error) => {
        if (error.response.status) {
          switch (error.response.status) {
            case 400:
              console.log("400, bad request")
              //this.logout()
              break;

            case 401:
             console.log("401, request user to login")
               this.logout()
              break;
            case 403:
              console.log("403, request user to login")
               this.logout()
              break;
            case 404:
              alert("404, page not exist");
              break;
            case 502:
              setTimeout(() => {
                console.log("502, request user to login")
               this.logout()
              }, 1000);
          }
          return Promise.reject(error.response);
        }
      }
    );
  },
  },

  
  mounted() {},
};
</script>
