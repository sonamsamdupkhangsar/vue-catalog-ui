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
          @update:items-per-page="updateItemsPerPage">
        


          <template v-slot:no-data>
                <v-card>
              <v-card-title>
                <h4>Platforms</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewPlatformForm()"
                >
                  Create New Platform
                </v-btn>
              </v-card-title>
                </v-card>
          </template>     

          <template v-slot:default="{ items }">
            <v-card>
              <v-card-title>
                <h4>Platforms</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewPlatformForm()"
                >
                  Create New Platform
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
                      {{ item.name }}</v-list-item-content
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
              <h4>Platform Detail</h4>
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
                        <v-col>
                          <v-btn
                            :loading="submitting"
                            class="mr-4"
                            @click="submit"
                          >
                            submit
                          </v-btn>      
                           <v-btn
                            :loading="submitting"
                            class="mr-4"
                            @click="deletePlatform"
                          >
                            Delete
                          </v-btn>                        
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            
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
  props: ['serviceUrl'],
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
      itemsPerPageArray: [4, 8, 12],
      itemsPerPage: 4,
      search: "",
      filter: {},
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
      platforms: [],
      props: ['active_tab'],
    };
  },
  options: {
    handler() {
      this.getPlatforms();
    },
  },
  deep: true,
  computed: {
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    addNewPlatformForm() {
      this.selectedItem = {
        id: "",
        name: "",        
      };
    },
    selectItem(item) {
      this.selectedItem = item;
      this.newServiceFormDisabled = false
      console.log("item got selected: ", item.id, " name: " + item.name);
           
    },
    fetchApiData() {},

    updatePagination(pagination) {
      console.log(
        "update:pagination",
        pagination,
        ", substract 1: ",
        pagination - 1
      );
      this.getPlatforms();
    },

    updateItemsPerPage(items) {
      this.itemsPerPage = items;
      console.log("itemsPerpage: ", items);
      this.getPlatforms();
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },

    getPlatforms() {
      this.loading = true;
      //const { page, itemsPerPage } = this.options;
      let pageNumber = 0;
      const { page, itemsPerPage } = this.options;
      if (page == 0) {
        pageNumber = 0;
        console.log("set page to 1 when 0");
      } else {
        pageNumber = page - 1;
        console.log("pageNumber is ", pageNumber);
      }
      console.log("getPlatforms: pageNumber: ", pageNumber);
      try {
        axios
          .get(this.serviceUrl + 
            "/clusters?size=" +
              itemsPerPage +
              "&page=" +
              pageNumber
          )
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
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

    submit() {
      console.log("submit form");
      this.updatePlatform();
      // this.$refs.observer.validate()
    },
    reset() {
      console.log("clear form");
      this.$refs.observer.reset();
    },

    updatePlatform() {
      console.log("get services for applicationid: ", this.selectedItem.id);
      let isNew = this.selectedItem.id;
      const platform = {
        id: this.selectedItem.id,
        name: this.selectedItem.name,        
      };
      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/clusters", platform)
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }

            this.submitting = false;
            //Then injecting the result to datatable parameters.
            this.selectedItem = response.data;
            console.log("got services response ", this.selectedItem.id);
            this.snackbarMessage = "Application updated";
            this.snackbar = true;

            if (isNew == "") {
              console.log("refresh the list of applications");
              this.getPlatforms();
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
          .post(this.serviceUrl + 
            "/applications/" +
              this.selectedItem.id +
              "/environments/update",
            props
          )
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }

            //Then injecting the result to datatable parameters.
            this.associatedEnvironments = response.data;
            console.log(
              "got updated associated environment response ",
              this.associatedEnvironments
            );
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
      }
      this.newServiceFormDisabled = true
      this.services.push(serviceItem)
      //this.panel = [...Array(this.services).keys()].map((k, i) => i)

      console.log("expand new added service form")    
      this.panel =  [this.services.length]      
    },

     deletePlatform() {
      console.log("delete environment: ", this.selectedItem.id)
      try {
        this.submitting = true;
        axios
          .delete(this.serviceUrl + "/clusters/delete/"+this.selectedItem.id)
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }

            this.submitting = false;
            //Then injecting the result to datatable parameters.            
            console.log("deleted Platform response ", response.data);
            this.snackbarMessage = "Platform deleted";
            this.snackbar = true;
            this.getPlatforms()
            this.selectedItem = ''
          });
      } catch (e) {
        console.error(` failed to delete Platform, Errors! ${e}`);
      }
    },
  },

  async created() {
    this.getPlatforms();
  },
};
</script>
