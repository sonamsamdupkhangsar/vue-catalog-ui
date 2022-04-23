<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-data-iterator
          item-key="name"
          :single-expand="singleExpand"
          hide-default-footer
          :items-per-page.sync="itemsPerPage"
          :page="page"
          :pageCount="numberOfPages"
          :headers="headers"
          :items="content"
          :options.sync="options"
          :server-items-length="totalElements"
          :loading="loading"
          class="elevation-1"
          @update:page="updatePagination"
          @update:items-per-page="updateItemsPerPage"          
        >
          <template v-slot:no-data>
                <v-card>
              <v-card-title>
                <h4>Applications</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewApplicationForm()"
                >
                  Create New Application
                </v-btn>
              </v-card-title>
                </v-card>
          </template>     

          <template v-slot:default="{ items }">
            <v-card>
              <v-card-title>
                <h4>Applications</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewApplicationForm()"
                >
                  Create New Application
                </v-btn>
              </v-card-title>

              <v-card-text> </v-card-text>
              <v-row>
                <v-col>
                  
                  <v-list-item
                    v-for="item in items"
                    :key="item.id"
                    @click="selectItem(item)"                     
                  >
                    <v-list-item-content>
                      {{ items.indexOf(item) + 1 }}.
                      {{ item.name }} - {{ item.platformName }}</v-list-item-content
                    >
                  </v-list-item>
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
                    {{ itemsPerPage }}
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(number, index) in itemsPerPageArray"
                    :key="index"
                    @click="updateItemsPerPage(number)"
                  >
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-spacer></v-spacer>

              <span class="mr-4 grey--text">
                Page {{ page }} of {{ numberOfPages }}
              </span>
              <v-btn
                fab
                dark
                color="blue darken-3"
                class="mr-1"
                @click="formerPage"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                color="blue darken-3"
                class="ml-1"
                @click="nextPage"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-data-iterator>
      </v-col>
      <v-col>
        <template v-if="selectedItem">
          <v-card>
            <v-card-title>
              <h4>Application Detail</h4>
            </v-card-title>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  {{ selectedItem.name }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-form v-model="valid">
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="selectedItem.id"
                            label="id"
                            readonly
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="selectedItem.name"
                            :counter="256"
                            label="Application name"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-textarea
                            name="input-7-1"
                            filled
                            auto-grow
                            v-model="selectedItem.description"
                            label="Description"
                          ></v-textarea>

                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="selectedItem.gitRepo"
                            label="Github"
                            :counter="1024"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="selectedItem.documentationUrl"
                            label="Documentation Url"
                            :counter="1024"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-btn
                            :loading="submitting"
                            class="mr-4"
                            @click="submit"
                          >
                            submit
                          </v-btn>
                          <v-btn v-on:click="reset()" reset> clear </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-row>
              <v-col>
                <template>
                  <v-container fluid>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          >Platform Association</v-expansion-panel-header
                        >
                        <v-expansion-panel-content>
                          <span v-if="defaultSelectedPlatform">
                            Selected Platform: {{ defaultSelectedPlatform.name }}
                          </span>
                          <v-select
                            v-if="this.selectedItem.id"
                            v-model="defaultSelectedPlatform"
                            :items="platforms"
                            item-text="name"
                            label="Platforms"
                            @input="selectPlatform"
                            return-object
                            single-line
                          ></v-select>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-container>
                </template>
                <template>
                  <v-container fluid>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          >Environment Association</v-expansion-panel-header
                        >
                        <v-expansion-panel-content>
                          <v-checkbox
                            v-model="ae.associated"
                            v-for="ae in associatedEnvironments"
                            :key="ae.environmentName"
                            :label="ae.environmentName"
                          ></v-checkbox>
                          <v-btn
                            :loading="updatingEnvironmentAssociation"
                            class="mr-4"
                            @click="updateEnvironmentAssociation"
                          >
                            Update
                          </v-btn>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-container>
                </template>
                <template>
                  <v-container fluid>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          >Services <v-spacer />
                          <div class="text-center">
                            <v-btn
                              rounded
                              color="primary"
                              dark
                              v-on:click="addNewServiceForm()"
                              :disabled="newServiceFormDisabled"
                            >
                              Create New Service
                            </v-btn>
                          </div>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <v-expansion-panels v-model="panel" multiple>
                            <v-expansion-panel
                              v-for="service in services"
                              :key="service.id"
                            >
                              <v-expansion-panel-header
                                >{{ service.name }}
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-list-item-content>
                                  <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="service.name"
                                        label="Name"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="service.description"
                                        label="description"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="service.restMethod"
                                        label="rest method"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="service.endpoint"
                                        label="endpoint"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-checkbox
                                        v-model="service.accessTokenRequired"
                                        label="Access token required"
                                      ></v-checkbox>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-checkbox
                                        v-model="service.pingIt"
                                        label="ping it"
                                      ></v-checkbox>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-checkbox
                                        v-model="service.healthEndpoint"
                                        label="Health endpoint"
                                      ></v-checkbox>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-btn
                                        v-on:click="
                                          updateService($event, service)
                                        "
                                        :loading="updatingService"
                                        class="mr-4"
                                      >
                                        Update Service
                                      </v-btn>
                                      <v-btn
                                        v-on:click="deleteService(service)"
                                        :loading="updatingService"
                                        class="mr-4"
                                      >
                                        Delete
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-list-item-content>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-container>
                </template>
                <template>
                  <v-container fluid>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          >Connections
                        </v-expansion-panel-header>

                        <v-expansion-panel-content>
                          <v-expansion-panels v-model="panel" multiple>
                            <v-expansion-panel>
                              <v-expansion-panel-header>
                                Apps
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-data-iterator
                                  v-if="totalElements > 0"
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
                                    <v-row
                                      class="mt-2"
                                      align="center"
                                      justify="center"
                                    >
                                      <span class="grey--text"
                                        >Items per page</span
                                      >
                                      <v-menu offset-y>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
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
                                            v-for="(number,
                                            index) in itemsPerPageArray"
                                            :key="index"
                                            @click="
                                              updateAppItemsPerPage(number)
                                            "
                                          >
                                            <v-list-item-title>{{
                                              number
                                            }}</v-list-item-title>
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
                              <v-expansion-panel-header>
                                Components
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-data-iterator
                                  v-if="totalElements > 0"
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
                                  @update:items-per-page="
                                    updateComponentItemsPerPage
                                  "
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
                                            v-on:change="
                                              updateConnectedComponent()
                                            "
                                          ></v-combobox>                                          
                                        </v-col>
                                      </v-row>
                                    </v-card>
                                  </template>
                                  <template v-slot:footer>
                                    <v-row
                                      class="mt-2"
                                      align="center"
                                      justify="center"
                                    >
                                      <span class="grey--text"
                                        >Items per page</span
                                      >
                                      <v-menu offset-y>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
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
                                            v-for="(number,
                                            index) in itemsPerPageArray"
                                            :key="index"
                                            @click="
                                              updateComponentItemsPerPage(
                                                number
                                              )
                                            "
                                          >
                                            <v-list-item-title>{{
                                              number
                                            }}</v-list-item-title>
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
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  props: ["serviceUrl"],
  data() {
    return {     
      singleExpand: false,
      headers: [
        {
          text: "name",
          value: "name",
          width: "1%",
        },
      ],
      page: 1,
      totalElements: 0,
      numberOfPages: 0,
      content: [],
      loading: true,
      options: {},

      msg: "hello people",
      applications: [],
      itemsPerPageArray: [10, 20, 100],
      itemsPerPage: 10,
      previousPageSize: -1,      
      sortDesc: false,
      keys: ["Name"],
      sortBy: "name",
      selectedItem: "",
      services: [],
      valid: false,
      submitting: false,
      snackbar: false,
      timeout: 1000,
      associatedEnvironments: [],
      updatingEnvironmentAssociation: false,
      snackbarMessage: "",
      updatingService: false,
      serviceButtonLoading: [],
      panel: [],
      newServiceFormDisabled: false,
      defaultSelectedPlatform: "",
      platforms: [],
      props: ["active_tab"],
      connectedApps: [],
      connectedComponents: [],

      componentPage: 1,
      componentItemsPerPage: 4,
      componentNumberOfPages: 0,

      componentHeaders: [
        {
          text: "name",
          value: "name",
          width: "1%",
        },
      ],

      components: [],
      componentOptions: {},
      componentTotalElements: 0,
      componentLoading: true,

      apps: [],
      appOptions: {},
      appTotalElements: 0,
      appLoading: true,

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

      connections_choice: [
        { connection: "read" },
        { connection: "write" },
      ],
      selected: [],
    };
  },
  options: {
    handler() {
      this.getApplications();
    },
  },
  deep: true,
   
  methods: {
      
    componentSelection(item, connectionName) {
      console.info("item got selected with conneciton ", item.name, connectionName)
    },
    addNewApplicationForm() {
      this.selectedItem = {
        id: "",
        name: "",
        deprecated: false,
        description: "",
        gitRepo: "",
        documentationUrl: "",
      };
      this.services = [];
      this.defaultSelectedPlatform = "";
      this.associatedEnvironments = [];
    },
    selectItem(item) {       
      this.platforms = [];
      this.defaultSelectedPlatform = "";
      this.associatedEnvironments = [];
      this.selectedItem = item;
      this.newServiceFormDisabled = false;
      this.components = [];
      this.connectedComponents = [];

      this.apps = [];
      this.connectedApps = [];

      console.log("item got selected: ", item.id, " name: " + item.name);

      this.getServices(item.id);
      if (item.platformId) {
        this.getPlatform(item.platformId);
      }
      this.getUnAssociatedPlatforms();
      this.getAssociatedEnvironments();

      this.getConnectedComponents();
      this.getComponents();

      this.getConnectedApps();
      this.getApps();
    },

    selectComponentItem(item) {
      console.info("item size now: {}", this.connectedComponents.length);
      this.connectedComponents.push(item);
      console.info(
        "after adding, item size now: {}",
        this.connectedComponents.length
      );
    },

    selectAppItem(item) {
      console.info("item size now: {}", this.connectedApps.length);
      this.connectedApps.push(item);
      console.info(
        "after adding, item size now: {}",
        this.connectedApps.length
      );
    },

    fetchApiData() {},

    updateComponentPagination(componentPagination) {
      console.log(
        "update componentPagination",
        componentPagination,
        ", substract 1: ",
        componentPagination - 1
      );
      this.getComponents();
    },

    updateAppPagination(appPagination) {
      console.log(
        "update appPagination",
        appPagination,
        ", substract 1: ",
        appPagination - 1
      );
      this.getApps();
    },

    updatePagination(pagination) {
      console.log(
        "update:pagination",
        pagination,
        ", substract 1: ",
        pagination - 1
      );
      this.getApplications();
    },

    updateAppItemsPerPage(items) {
      this.appItemsPerPage = items;
      console.log("appItemsPerpage: ", items);
      this.getApps();
    },

    updateComponentItemsPerPage(items) {
      this.componentItemsPerPage = items;
      console.log("componentItemsPerpage: ", items);
      this.getComponents();
    },

    updateItemsPerPage(items) {
      //this.itemsPerPage = items;
      //this.options[0] = 0;
      this.pageSizeChange = true
      console.log("items: ", items, ", this.itemsPerPage: ", this.itemsPerPage);
      this.getApplications(items);
    },

    appNextPage() {
      if (this.appPage + 1 <= this.appNumberOfPages) this.appPage += 1;
    },

    componentNextPage() {
      if (this.componentPage + 1 <= this.componentNumberOfPages)
        this.componentPage += 1;
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },

    appFormerPage() {
      if (this.appPage - 1 >= 1) this.appPage -= 1;
    },

    componentFormerPage() {
      if (this.componentPage - 1 >= 1) this.componentPage -= 1;
    },

    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },

    getApplications(items) {
      this.loading = true;
      //const { page, itemsPerPage } = this.options;
      let pageNumber = 0;
      const { page, itemsPerPage } = this.options;
      
      var pageSize = items

      if (!page) {
        pageNumber = 0;
        console.log("set page to 0 when not defined");        
        if (!itemsPerPage) { //indicates initial page loading
          pageSize = this.itemsPerPage
          console.log("set to default pageSize: ", pageSize)
        }
        else {
          pageSize = itemsPerPage
          console.log("use itemsPerPage from options: ", pageSize)
        }
      } else {
        if (!items) {
          pageNumber = page - 1
          console.log('items undefined')      
          pageSize = itemsPerPage

        }
        else if (this.previousPageSize != items) {  //if items per page was updated then reset pageNumber = 0
          console.log("this.previousPageSize ", this.previousPageSize, " does not match items: ", items)
          pageNumber = 0
          this.itemsPerPage = items
          pageSize = this.itemsPerPage
        }
        else {
          pageNumber = page - 1;
          console.log("pageNumber is ", pageNumber);
           console.log("this.itemsPerPage ", this.itemsPerPage, ", items: ", items, 
           ", previousPageSize: ", this.previousPageSize, ", this.itemsPerPage: ", this.itemsPerPage)
        }
      }
      
      this.page = pageNumber+1
      this.previousPageSize = pageSize
      //if (itemsPerPage) {
      //  pageSize = itemsPerPage
     // }

      console.log("pageSize ", pageSize, " page=", pageNumber)

      try {
        axios
          .get(
            this.serviceUrl +
              "/applications?size=" +
              pageSize +
              "&page=" +
              pageNumber +
              "&sort=name"
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }
            
            //Then injecting the result to datatable parameters.
            this.content = response.data.content;            
            this.totalElements = response.data.totalElements;
            this.numberOfPages = response.data.totalPages;
            
            console.log(
              "got response, totalElements: ",
              this.totalElements,
              ", numberOfPages: ",
              this.numberOfPages
            );
            this.loading = false;
          });
      } catch (e) {
        console.error(`Errors! ${e}`);
      }
    },

    getServices(applicationId) {
      console.log("get services for applicationid: ", applicationId);
      try {
        axios
          .get(this.serviceUrl + "/applications/services/" + applicationId)
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.services = response.data.content;
            console.log(
              "got services response, totalElements: ",
              response.data.totalElements,
              ", numberOfPages: ",
              response.data.totalPages
            );
          });
      } catch (e) {
        console.error(` failed to get services by applicationid, Errors! ${e}`);
      }
    },

    getAssociatedEnvironments() {
      console.log(
        "get associated environments for applicationid: ",
        this.selectedItem.id
      );
      try {
        axios
          .get(
            this.serviceUrl +
              "/applications/" +
              this.selectedItem.id +
              "/environments"
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            //Then injecting the result to datatable parameters.
            this.associatedEnvironments = response.data;
            console.log(
              "got  getAssociatedEnvironments response: ",
              response.data
            );
          });
      } catch (e) {
        console.error(
          ` failed to get associated envrionments by applicationid, Errors! ${e}`
        );
      }
    },

    selectPlatform(item) {
      console.log("selected Platform item: ", item.id, ", name: ", item.name);
      this.defaultSelectedPlatform = item;
      console.log(
        "update Platform for application: ",
        this.selectedItem.id,
        "with: ",
        this.defaultSelectedPlatform.id
      );

      try {
        this.submitting = true;
        axios
          .post(
            this.serviceUrl +
              "/applications/" +
              this.selectedItem.id +
              "/cluster/update/" +
              this.defaultSelectedPlatform.id
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.submitting = false;
            //Then injecting the result to datatable parameters.
            this.selectedItem.platformId = this.defaultSelectedPlatform.id;
            this.associatedEnvironments = response.data;
            console.log("received associated environments");
            this.snackbarMessage = "Application Platform updated";
            this.snackbar = true;
          });
      } catch (e) {
        console.error(` failed to get services by applicationid, Errors! ${e}`);
      }
    },

    getPlatform(id) {
      console.log("get Platform for id: ", id);
      try {
        axios.get(this.serviceUrl + "/clusters/" + id).then((response) => {
          if (response.status == 401) {
            console.log("request user to login");
            this.$emit("login");
          }

          this.defaultSelectedPlatform = response.data;

          console.log(
            "got selected Platform response: ",
            this.defaultSelectedPlatform.id,
            ", name: ",
            this.defaultSelectedPlatform.name
          );
        });
      } catch (e) {
        console.error(` failed to get Platform, Errors! ${e}`);
      }
    },

    getUnAssociatedPlatforms() {
      console.log("get Platforms");
      try {
        axios
          .get(
            this.serviceUrl +
              "/applications/" +
              this.selectedItem.id +
              "/clusters"
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.platforms = response.data;

            console.log(
              "got Platforms response, length: ",
              this.platforms.length
            );
          });
      } catch (e) {
        console.error(` failed to get Platforms, Errors! ${e}`);
      }
    },

    showApplicationDetail() {
      console.log("show application detail");
    },

    submit() {
      console.log("submit form");
      this.updateApplication();
      // this.$refs.observer.validate()
    },
    reset() {
      console.log("clear form");
      this.$refs.observer.reset();
    },

    updateApplication() {
      console.log("update application: ", this.selectedItem.id);
      let isNew = this.selectedItem.id;
      const application = {
        id: this.selectedItem.id,
        name: this.selectedItem.name,
        deprecated: this.selectedItem.deprecated,
        description: this.selectedItem.description,
        gitRepo: this.selectedItem.gitRepo,
        documentationUrl: this.selectedItem.documentationUrl,
        platformId: this.defaultSelectedPlatform
          ? this.defaultSelectedPlatform.id
          : "",
      };
      console.log('application: ', application, ", gitRepo: ", this.selectedItem.gitRepo)
      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/applications", application)
          .then((response) => {
            this.submitting = false;

            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            //Then injecting the result to datatable parameters.
            this.selectedItem = response.data;
            console.log("got application response ", this.selectedItem.id);
            this.snackbarMessage = "Application updated";
            this.snackbar = true;

            if (!isNew) {
              console.log("refresh the list of applications");
              this.getApplications();
              this.getUnAssociatedPlatforms();
            }          
          });
      } catch (e) {
        console.error(` failed to get services by applicationid, Errors! ${e}`);
      }
    },

    updateEnvironmentAssociation() {
      console.log("update environment association: ", this.selectedItem.id);
      this.updatingEnvironmentAssociation = true;

      let props = [];
      for (let i = 0; i < this.associatedEnvironments.length; i++) {
        let prop = {
          associated: this.associatedEnvironments[i].associated,
          environmentId: this.associatedEnvironments[i].environmentId,
          environmentName: this.associatedEnvironments[i].environmentName,
        };
        props.push(prop);
      }
      console.log("props: ", props);

      try {
        axios
          .post(
            this.serviceUrl +
              "/applications/" +
              this.selectedItem.id +
              "/environments/update",
            props
          )
          .then((response) => {
            //Then injecting the result to datatable parameters.
            this.associatedEnvironments = response.data;

            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.snackbarMessage = "Environment updated";
            this.snackbar = true;
            this.updatingEnvironmentAssociation = false;
          });
      } catch (e) {
        console.error(` failed to get services by applicationid, Errors! ${e}`);
      }
    },

    addNewServiceForm() {
      console.log("add a new service form");
      const serviceItem = {
        id: "",
        name: "",
        applicationId: "",
        description: "",
        endpoint: "",
        healthEndpoint: false,
        accessTokenRequired: false,
        pingIt: false,
        restMethod: "",
      };
      this.newServiceFormDisabled = true;
      this.services.push(serviceItem);
      //this.panel = [...Array(this.services).keys()].map((k, i) => i)

      console.log("expand new added service form");
      this.panel = [this.services.length];
    },

    updateService: function(event, service) {
      console.log(
        "update service, event: ",
        event,
        " target: ",
        event.target,
        ", service: ",
        service
      );

      const serviceItem = {
        id: service.id,
        name: service.name,
        applicationId: this.selectedItem.id,
        description: service.description,
        endpoint: service.endpoint,
        healthEndpoint: service.healthEndpoint,
        accessTokenRequired: service.accessTokenRequired,
        pingIt: service.pingIt,
        restMethod: service.restMethod,
      };

      let isNewService = service.id;
      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/services", serviceItem)
          .then((response) => {
            this.submitting = false;

            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            //Then injecting the result to datatable parameters.
            service = response.data;
            for (let i = 0; i < this.services.length; i++) {
              if (this.services[i].id == "") {
                this.services[i] = service;
                console.log(
                  "break after assigning new service to array services"
                );
                break;
              }
              console.log("should not execute after break");
            }
            console.log("got service update response ", service);
            this.snackbarMessage = "Service updated";
            this.snackbar = true;
            if (isNewService == "") {
              this.newServiceFormDisabled = false;
            }
            // this.getServices(service.applicationId)
          });
      } catch (e) {
        console.error(` failed to update service, Errors! ${e}`);
      }
    },

    deleteService: function(service) {
      console.log("delete service ", service.id);

      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/services/" + service.id)
          .then((response) => {
            console.log("response: ", response);

            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            this.submitting = false;

            this.snackbarMessage = "Service deleted";
            this.snackbar = true;

            this.getServices(service.applicationId);
          });
      } catch (e) {
        console.error(` failed to delete service, Errors! ${e}`);
      }
    },

    updateConnectedComponent() {
      console.info("update connected component");

      let targetIds = [];
      for (let i = 0; i < this.connectedComponents.length; i++) {
        targetIds[i] = this.connectedComponents[i].id;
        console.info("targetId: ", targetIds[i]);
      }
      const connectionForm = {
        appId: this.selectedItem.id,
        connecting: "COMPONENT",
        targetIdList: targetIds,
      };

      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/applications/connection", connectionForm)
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

    getConnectedComponents() {
      console.log("get connected connections");
      try {
        axios
          .get(
            this.serviceUrl +
              "/applications/" +
              this.selectedItem.id +
              "/connection/component"
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

    //
    updateConnectedApp() {
      console.info("update connected app");

      let targetIds = [];
      for (let i = 0; i < this.connectedApps.length; i++) {
        targetIds[i] = this.connectedApps[i].id;
        console.info("targetId: ", targetIds[i]);
      }
      const connectionForm = {
        appId: this.selectedItem.id,
        connecting: "APP",
        targetIdList: targetIds,
      };

      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/applications/connection", connectionForm)
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
              this.appsTotalElements,
              ", numberOfPages: ",
              this.appNumberOfPages
            );
            this.appLoading = false;
          });
      } catch (e) {
        console.error(`Errors! ${e}`);
      }
    },

    getConnectedApps() {
      console.log("get connected connections");
      try {
        axios
          .get(
            this.serviceUrl +
              "/applications/" +
              this.selectedItem.id +
              "/connection/app"
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
  },

  async created() {
    this.getApplications();
    
  },
};
</script>
