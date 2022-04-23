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
          :items="environments"
          :options.sync="options"
          :server-items-length="totalElements"
          :loading="loading"
          class="elevation-1"
          @update:page="updatePagination"
          @update:items-per-page="updateItemsPerPage"
        >
          <!--
    <template v-slot:header>
        <v-toolbar
          dark
          color="blue darken-3"
          class="mb-1"
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                large
                depressed
                color="blue"
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                large
                depressed
                color="blue"
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>
      -->


          <template v-slot:no-data>
                <v-card>
              <v-card-title>
                <h4>Environments</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewEnvironmentForm()"
                >
                  Create New Enviroment
                </v-btn>
              </v-card-title>
                </v-card>
          </template>     

          <template v-slot:default="{ items }">
            <v-card>
              <v-card-title>
                <h4>Environments</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewEnvironmentForm()"
                >
                  Create New Enviroment
                </v-btn>
              </v-card-title>
              <v-row>
                <v-col>
                  <v-list-item
                    v-for="item in items"
                    :key="item.name"
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
              <h4>Environment Detail</h4>
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
                            label="Environment name"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="selectedItem.sortOrder"
                            label="Sort order"
                            :counter="1024"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>                       
                          <v-select
                            v-model="selectedItem.environmentType"
                            :items="environmentTypes"     
                            item-text="environmentTypes"                                                                     
                            label="Environment Type"                            
                            @input="selectEnvironmentType"                            
                            return-object
                            single-line
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="selectedItem.domain"
                            label="domain"
                            :counter="1024"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="selectedItem.deploymentLink"
                            label="deploymentLink"
                            :counter="1024"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <span v-if="defaultSelectedCluster">
                          Selected Cluster: {{ defaultSelectedCluster.name}}
                          </span>
                          <v-select
                            v-model="defaultSelectedCluster"
                            :items="platforms"     
                            item-text="name"                                                                     
                            label="Platforms"                            
                            @input="selectCluster"
                            
                            return-object
                            single-line
                          ></v-select>
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
                            @click="deleteEnvironment"
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
      environments: [],
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
      defaultSelectedCluster: '',
      selectedClusterId: '',
      platforms: [],
      environmentTypes: [],
      props: ['active_tab'],
    };
  },
  options: {
    handler() {
      this.getEnvironments();
    },
  },
  deep: true,
  computed: {
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    addNewEnvironmentForm() {
      this.selectedItem = {
        id: "",
        name: "",
        domain: "",
        deploymentLink: "",
        clusterId: "",
      };
    },

    selectItem(item) {
      this.selectedItem = item;
      //this.defaultSelectedCluster = this.selectedItem.cluster
      if (this.selectedItem.clusterId) {
        this.getCluster(this.selectedItem.clusterId)
      }
      else {
        console.log("no clusterId in selectedItem: ", this.selectedItem.clusterId)
      }
      console.log("item got selected: ", item.id, " name: " + item.name);
      this.getEnvironmentTypes()
      this.getPlatforms()
    },

    fetchApiData() {},

    updatePagination(pagination) {
      console.log(
        "update:pagination",
        pagination,
        ", substract 1: ",
        pagination - 1
      );
      this.getEnvironments();
    },

    updateItemsPerPage(items) {
      this.itemsPerPage = items;
      console.log("itemsPerpage: ", items);
      this.getEnvironments();
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },

    getEnvironments() {
      this.loading = true
      console.log("get environments");
      try {
        axios.get(this.serviceUrl + "/environments").then((response) => {
          if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
          }
          this.environments = response.data.content;
          this.totalElements = response.data.totalElements;
          this.numberOfPages = response.data.totalPages;

          this.loading = false
          console.log(
            "got environments response, environments.length: ",
            this.environments.length,
            " total: ",
            response.data.totalElements,
            ", numberOfPages: ",
            response.data.totalPages
          );
        });
      } catch (e) {
        this.loading = false
        console.error(` failed to get environments, Errors! ${e}`);
      }
    },

  selectCluster(item) {
    console.log("selected cluster item: ",  item.id, ", name: ",item.name)
    this.selectedCluster = item
    //this.selectedCluster = item
    // this.selectedItem.clusterId = item.id,
    this.updateEnvironment()
  },

  selectEnvironmentType(item) {
    console.log("selected environment Type: ", item)
    this.selectedItem.environmentType = item
    this.updateEnvironment()
  },


  getCluster(id) {
      console.log("get cluster for id: ", id);
      try {
        axios.get(this.serviceUrl + "/clusters/"+id).then((response) => {
          if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
          }
          this.defaultSelectedCluster = response.data;
          
          console.log(
            "got selected cluster response: ",
            this.defaultSelectedCluster.id, ", name: ", this.defaultSelectedCluster.name,
            " response.data: ", response.data            
          );
        });
      } catch (e) {
        console.error(` failed to get cluster, Errors! ${e}`);
      }
    },

  getPlatforms() {
      console.log("get platforms");
      try {
        axios.get(this.serviceUrl + "/clusters/environments/"+this.selectedItem.id).then((response) => {
          if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
          }
          this.platforms = response.data;
          
          console.log(
            "got platforms response, length: ",
            this.platforms.length            
          );
        });
      } catch (e) {
        console.error(` failed to get platforms, Errors! ${e}`);
      }
    },

  getEnvironmentTypes() {
      console.log("get environmentTypes");
      try {
        axios.get(this.serviceUrl + "/environments/environmentTypes").then((response) => {
          if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }
          this.environmentTypes = response.data;
          
          console.log(
            "got environmentTypes response, length: ",
            this.environmentTypes.length            
          );
        });
      } catch (e) {
        console.error(` failed to get environmentTypes, Errors! ${e}`);
      }
    },

    deleteEnvironment() {
      console.log("delete environment: ", this.selectedItem.id);
      try {
        this.submitting = true;
        axios
          .delete(this.serviceUrl + 
            "/environments/delete/" + this.selectedItem.id
          )
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }
            this.submitting = false;
            //Then injecting the result to datatable parameters.
            console.log("deleted Environment  response ", response.data);
            this.snackbarMessage = "Environment delete";
            this.snackbar = true;
            this.getEnvironments();
            this.selectedItem = "";
          });
      } catch (e) {
        console.error(` failed to delete Environment, Errors! ${e}`);
      }
    },

    updateEnvironment() {
      console.log("update environment for applicationid: ", this.selectedItem.id);
      const environment = {
        id: this.selectedItem.id,
        name: this.selectedItem.name,
        sortOrder: this.selectedItem.sortOrder,
        domain: this.selectedItem.domain,
        deploymentLink: this.selectedItem.deploymentLink,
        clusterId: this.defaultSelectedCluster ? this.defaultSelectedCluster.id: '',
        environmentType: this.selectedItem.environmentType,
      };
      console.log("environment: ", environment)

      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/environments", environment)
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }
            this.submitting = false;
            //Then injecting the result to datatable parameters.
            this.selectedItem = response.data;
            console.log("got services response ", this.selectedItem.id);
            this.snackbarMessage = "Environment updated";
            this.snackbar = true;
            this.getEnvironments();
          });
      } catch (e) {
        console.error(` failed to update Environment, Errors! ${e}`);
      }
    },

    submit() {
      console.log("submit form");
      this.updateEnvironment();
    },
    reset() {
      console.log("clear form");
      this.$refs.observer.reset();
    },
  },

  async created() {    
    this.getEnvironments();
  },
};
</script>
