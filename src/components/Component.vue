<template>
  <v-container fluid>
    <v-row>
      <v-col>      

        <v-card v-if="totalElements == 0">
              <v-card-title>
                <h4>Components</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewComponentForm()"
                >
                  Create New Component
                </v-btn>
              </v-card-title>
        </v-card>
       
        <v-data-iterator v-if="totalElements > 0"
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
                <h4>Components</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewComponentForm()"
                >
                  Create New Component
                </v-btn>
              </v-card-title>
                </v-card>
          </template>     

          <template v-slot:default="{ items }">
            <v-card>
              <v-card-title>
                <h4>Components</h4>
                <v-spacer /><v-btn
                  rounded
                  color="primary"
                  dark
                  v-on:click="addNewComponentForm()"
                >
                  Create New Component
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
              <h4>Component Detail</h4>
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
                            label="Component name"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>                     
                      <v-row>
                             
                        <v-col>                       
                          <v-select
                            v-model="selectedItem.parent"
                            :items="parents"     
                            item-text="name"                                                                     
                            label="Component Parent"                            
                            @input="selectParent"                            
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
                            @click="deleteComponent"
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
      components: [],
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
      Components: [],
      props: ['active_tab'],
      parents: [],
    };
  },
  options: {
    handler() {
      this.getComponents();
    },
  },
  deep: true,
  computed: {
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    addNewComponentForm() {
      this.selectedItem = {
        id: "",
        name: "",        
      };
    },
    selectItem(item) {
      this.selectedItem = item;
      this.newServiceFormDisabled = false
      console.log("item got selected: ", item);
           
      this.getParent()     
    },
    fetchApiData() {},

    updatePagination(pagination) {
      console.log(
        "update:pagination",
        pagination,
        ", substract 1: ",
        pagination - 1
      );
      this.getComponents();
    },

    updateItemsPerPage(items) {
      this.itemsPerPage = items;
      console.log("itemsPerpage: ", items);
      this.getComponents();
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },

    getComponents() {
      this.loading = true;
      //const { page, itemsPerPage } = this.options;
      let pageNumber = 0;
      const { page, itemsPerPage } = this.options;
      let size = 0
      if (!itemsPerPage) {
        size = 4
      }
      else {
        size = itemsPerPage
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
          .get(this.serviceUrl + 
            "/components?size=" +
              size +
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
              "components response, totalElements: ",
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

  selectParent(item) {
    console.log("selected parent Type: ", item)
    this.selectedItem.parentId = item.id
    this.update()
  },


  getParent() {
      console.log("get parent");
      try {
        axios.get(this.serviceUrl + "/components/parents").then((response) => {
          if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }
          this.parents = response.data;
          
          console.log(
            "got parents response, length: ",
            this.parents.length            
          );
        });
      } catch (e) {
        console.error(` failed to get environmentTypes, Errors! ${e}`);
      }
    },

    submit() {
      console.log("submit form");
      this.update();      
    },
    reset() {
      console.log("clear form");
      this.$refs.observer.reset();
    },

    update() {
      console.log("get services for Componentid: ", this.selectedItem.id);
      let isNew = this.selectedItem.id;
      const component = {
        id: this.selectedItem.id,
        name: this.selectedItem.name,             
        parentId: this.selectedItem.parentId   
      };
      console.info("component to be updated: ", component)

      try {
        this.submitting = true;
        axios
          .post(this.serviceUrl + "/components", component)
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }

            this.submitting = false;
            //Then injecting the result to datatable parameters.
            this.selectedItem = response.data;
            console.log("got component update response ", this.selectedItem);
            this.snackbarMessage = "Component updated";
            this.snackbar = true;

            if (isNew == "") {
              console.log("refresh the list of Components");
              this.getComponents();
            }
          });
      } catch (e) {
        console.error(` failed to get services by Componentid, Errors! ${e}`);
      }
    },

   
     deleteComponent() {
      console.log("delete environment: ", this.selectedItem.id)
      try {
        this.submitting = true;
        axios
          .delete(this.serviceUrl + "/components/delete/"+this.selectedItem.id)
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }
            console.info("response: ", response)
            if (response.data != "deleted") {
              this.snackbarMessage = response.data;  
            }
            else {
              this.snackbarMessage = "Component deleted";
              this.selectedItem = ''
            }

            this.submitting = false;            
            this.snackbar = true;
            this.getComponents()
          
          });
      } catch (e) {
        console.error(` failed to delete Component, Errors! ${e}`);
      }
    },
  },

  async created() {
    this.getComponents();
  },
};
</script>
