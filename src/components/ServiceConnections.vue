 <template>
  <v-container fluid>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Connections </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-expansion-panels multiple>
            <v-expansion-panel>
              <v-expansion-panel-header> Apps {{ appTotalElements }} </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-iterator
                  v-if="appTotalElements > 0"
                  item-key="name"
                  :single-expand="singleExpand"
                  hide-default-footer
                  :items-per-page.sync="appItemsPerPage"
                  :page="appPage"
                  :pageCount="appNumberOfPages"
                  :headers="appHeaders"
                  :items="apps"
                  :options.sync="appOptions"
                  :server-items-length="appTotalElements"
                  :loading="appLoading"
                  class="elevation-1"
                  @update:page="updateAppPagination"
                  @update:items-per-page="updateAppItemsPerPage"
                >
                  <template v-slot:default="{ items }">
                    <v-card>
                      <v-card-title>
                        <h4>apps</h4>
                      </v-card-title>

                      <v-card-text> </v-card-text>
                      <v-row>
                        <v-col>
                          <v-combobox
                            v-model="connectedApps"
                            :items="items"
                            item-text="name"
                            label="Apps"
                            multiple
                            outlined
                            dense
                            v-on:change="updateConnectedApp()"
                          ></v-combobox>
                        </v-col>
                      </v-row>
                    </v-card>
                  </template>
                  <template v-slot:footer>
                    <v-row class="mt-2" align="center" justify="center">
                      <span class="grey--text">Items per page</span>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            dark
                            text
                            color="primary"
                            class="ml-2"
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ appItemsPerPage }}
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(number, index) in itemsPerPageArray"
                            :key="index"
                            @click="updateAppItemsPerPage(number)"
                          >
                            <v-list-item-title>{{ number }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-spacer></v-spacer>

                      <span class="mr-4 grey--text">
                        Page {{ appPage }} of
                        {{ appNumberOfPages }}
                      </span>
                      <v-btn
                        fab
                        dark
                        color="blue darken-3"
                        class="mr-1"
                        @click="appFormerPage"
                      >
                        <v-icon>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn
                        fab
                        dark
                        color="blue darken-3"
                        class="ml-1"
                        @click="appNextPage"
                      >
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header> Components </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-data-iterator
                  v-if="componentTotalElements > 0"
                  item-key="name"
                  :single-expand="singleExpand"
                  hide-default-footer
                  :items-per-page.sync="componentItemsPerPage"
                  :page="componentPage"
                  :pageCount="componentNumberOfPages"
                  :headers="componentHeaders"
                  :items="components"
                  :options.sync="componentOptions"
                  :server-items-length="componentTotalElements"
                  :loading="componentLoading"
                  class="elevation-1"
                  @update:page="updateComponentPagination"
                  @update:items-per-page="updateComponentItemsPerPage"
                >
                  <template v-slot:default="{ items }">
                    <v-card>
                      <v-card-title>
                        <h4>components</h4>
                      </v-card-title>

                      <v-card-text> </v-card-text>
                      <v-row>
                        <v-col>
                          <v-combobox
                            v-model="connectedComponents"
                            :items="items"
                            item-text="name"
                            label="Components"
                            multiple
                            outlined
                            dense
                            v-on:change="updateConnectedComponent()"
                          ></v-combobox>
                        </v-col>
                      </v-row>
                    </v-card>
                  </template>
                  <template v-slot:footer>
                    <v-row class="mt-2" align="center" justify="center">
                      <span class="grey--text">Items per page</span>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            dark
                            text
                            color="primary"
                            class="ml-2"
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ componentItemsPerPage }}
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            v-for="(number, index) in itemsPerPageArray"
                            :key="index"
                            @click="updateComponentItemsPerPage(number)"
                          >
                            <v-list-item-title>{{ number }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>

                      <v-spacer></v-spacer>

                      <span class="mr-4 grey--text">
                        Page {{ componentPage }} of
                        {{ componentNumberOfPages }}
                      </span>
                      <v-btn
                        fab
                        dark
                        color="blue darken-3"
                        class="mr-1"
                        @click="componentFormerPage"
                      >
                        <v-icon>mdi-chevron-left</v-icon>
                      </v-btn>
                      <v-btn
                        fab
                        dark
                        color="blue darken-3"
                        class="ml-1"
                        @click="componentNextPage"
                      >
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-btn>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  props: ["serviceUrl", "serviceEndpoint", "application"],
  data() {
    return {
      singleExpand: false,
      itemsPerPageArray: [10, 20, 100],
      apps: [],
      appOptions: {},
      appTotalElements: 0,
      appLoading: true,

      page: 1,
      appPage: 1,
      appItemsPerPage: 4,
      appNumberOfPages: 0,

      appHeaders: [
        {
          text: "name",
          value: "name",
          width: "1%",
        },
      ],
      componentHeaders: [
        {
          text: "name",
          value: "name",
          width: "1%",
        },
      ],
      connectedApps: [],
      connectedComponents: [],
      componentPage: 1,
      componentItemsPerPage: 4,
      componentNumberOfPages: 0,
      totalElements: 0,
      

      components: [],
      componentOptions: {},
      componentTotalElements: 0,
      componentLoading: true,

    };
  },
  deep: true,

  methods: {
    updateAppPagination(appPagination) {
      console.log(
        "update appPagination",
        appPagination,
        ", substract 1: ",
        appPagination - 1
      );
      this.getApps();
    },

     updateAppItemsPerPage(items) {
      this.appItemsPerPage = items;
      console.log("appItemsPerpage: ", items);
      this.getApps();
    },

    getConnectedComponents() {
      console.log("get connected connections");
      try {
        axios
          .get(
            this.serviceUrl +
              "/connections/serviceEndpointId/" +
              this.serviceEndpoint.id +
              "/component"
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.connectedComponents = response.data;

            console.log(
              "got connected components response, length: ",
              this.connectedComponents.length
            );
          });
      } catch (e) {
        console.error(` failed to get connections, Errors! ${e}`);
      }
    },

    getConnectedApps() {
      console.log("get connected connections");
      try {
        axios
          .get(
            this.serviceUrl +
              "/connections/serviceEndpointId/" +
              this.serviceEndpoint.id +
              "/app"
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.connectedApps = response.data;

            console.log(
              "got connected apps response, length: ",
              this.connectedApps.length
            );
          });
      } catch (e) {
        console.error(` failed to get app connections, Errors! ${e}`);
      }
    },


    updateComponentItemsPerPage(items) {
      this.componentItemsPerPage = items;
      console.log("componentItemsPerpage: ", items);
      this.getComponents();
    },

    componentFormerPage() {
      if (this.componentPage - 1 >= 1) this.componentPage -= 1;
    },

    componentNextPage() {
      if (this.componentPage + 1 <= this.componentNumberOfPages)
        this.componentPage += 1;
    },

    getComponents() {
      this.componentLoading = true;
      //const { page, itemsPerPage } = this.options;
      let pageNumber = 0;
      const { page, itemsPerPage } = this.componentOptions;
      let size = 0;
      if (!itemsPerPage) {
        size = 4;
      } else {
        size = itemsPerPage;
      }

      if (!page) {
        pageNumber = 0;
        console.log("set page to 1 when 0");
      } else {
        pageNumber = page - 1;
        console.log("pageNumber is ", pageNumber);
      }
      console.log("getComponents: pageNumber: ", pageNumber);
      try {
        axios
          .get(
            this.serviceUrl + "/components?size=" + size + "&page=" + pageNumber
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }
            //Then injecting the result to datatable parameters.
            this.components = response.data.content;
            this.componentTotalElements = response.data.totalElements;
            this.componentNumberOfPages = response.data.totalPages;
            console.log(
              "get components response, totalElements: ",
              this.componentTotalElements,
              ", numberOfPages: ",
              this.componentNumberOfPages
            );
            this.componentLoading = false;
          });
      } catch (e) {
        console.error(`Errors! ${e}`);
      }
    },

    getApps() {
      this.appLoading = true;
      //const { page, itemsPerPage } = this.options;
      let pageNumber = 0;
      const { page, itemsPerPage } = this.appOptions;
      let size = 0;
      if (!itemsPerPage) {
        size = 4;
      } else {
        size = itemsPerPage;
      }

      if (!page) {
        pageNumber = 0;
        console.log("set page to 1 when 0");
      } else {
        pageNumber = page - 1;
        console.log("pageNumber is ", pageNumber);
      }
      console.log("getApps: pageNumber: ", pageNumber);
      try {
        console.log("serviceUrl: ",  this.serviceUrl +
              "/applications?size=" +
              size +
              "&page=" +
              pageNumber)
        axios
          .get(
            this.serviceUrl +
              "/applications?size=" +
              size +
              "&page=" +
              pageNumber
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }          

            this.apps = response.data.content;
            this.appTotalElements = response.data.totalElements;
            this.appNumberOfPages = response.data.totalPages;
            console.log(
              "get apps response, totalElements: ",
              this.appTotalElements,
              ", numberOfPages: ",
              this.appNumberOfPages
            );
            this.appLoading = false;
          });
      } catch (e) {
        console.error(`Errors! ${e}`);
      }
    },

    updateComponentPagination(componentPagination) {
      console.log(
        "update componentPagination",
        componentPagination,
        ", substract 1: ",
        componentPagination - 1
      );
      this.getComponents();
    },


    appFormerPage() {
      if (this.appPage - 1 >= 1) this.appPage -= 1;
    },



    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },


    appNextPage() {
      if (this.appPage + 1 <= this.appNumberOfPages) this.appPage += 1;
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },


    updateConnectedComponent() {
      console.info("update connected component");

      let targetIds = [];
      for (let i = 0; i < this.connectedComponents.length; i++) {
        targetIds[i] = this.connectedComponents[i].id;
        console.info("targetId: ", targetIds[i]);
      }
      const connectionForm = {
        serviceEndpointId: this.serviceEndpoint.id,
        serviceId: this.serviceEndpoint.serviceId,
        appId: this.application.id,
        connecting: "COMPONENT",
        targetIdList: targetIds,
      };

      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/connections", connectionForm)
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.submitting = false;
            //Then injecting the result to datatable parameters.         
            console.log("received associated environments");
            this.snackbarMessage = "Connection updated";
            this.snackbar = true;
          });
      } catch (e) {
        console.error(` failed to get services by applicationid, Errors! ${e}`);
      }
    },


    updateConnectedApp() {
      console.info("update connected app");

      let targetIds = [];
      for (let i = 0; i < this.connectedApps.length; i++) {
        targetIds[i] = this.connectedApps[i].id;
        console.info("targetId: ", targetIds[i]);
      }
      const connectionForm = {
        serviceEndpointId: this.serviceEndpoint.id,
        serviceId: this.serviceEndpoint.serviceId,
        appId: this.application.id,
        connecting: "APP",
        targetIdList: targetIds,
      };

      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/connections", connectionForm)
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.submitting = false;
            //Then injecting the result to datatable parameters.      
            this.snackbarMessage = "Connection updated";
            this.snackbar = true;
          });
      } catch (e) {
        console.error(` failed to get services by applicationid, Errors! ${e}`);
      }
    },
  },

  async created() {
    //this.getServiceStatus(this.appId, this.envId)
    console.log(
      "serviceEndpoint got created for service.id: "
    );
    if (this.serviceEndpoint && this.serviceEndpoint.id != "") {
      this.getConnectedComponents();
      this.getComponents();

      this.getConnectedApps();
      this.getApps();
    }
  },
  mounted() {
    //console.log("mounted, appId: ", this.service.id, ", envId: ", this.envId)
    console.log(
      "mounted for service.id: ")
      
  },
  updated() {
    console.log("updated  appId");
  },
};
</script>

  <!--   -->