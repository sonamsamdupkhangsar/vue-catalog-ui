<template>
  <v-container fluid fill-height>
    <v-card width="100vw">
      <v-data-table
        :page="page"
        :pageCount="numberOfPages"
        :headers="headers"
        :items="services"
        :options.sync="options"
        :loading="loading"
        class="elevation-1"
        @update:page="updatePagination"
        @update:items-per-page="setItemsPerPage"
        :search="search"
        :custom-filter="filterOnlyCapsText"
        :calculate-widths="true"
        :expanded.sync="expanded"
        show-expand
        single-expand
        @item-expanded="getEndpoints"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search (UPPER CASE ONLY)"
            class="mx-4"
          ></v-text-field>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <span> {{ services.indexOf(item) + 1 }}. {{ item.name }} </span>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <div class="row sp-details">
              <div class="col-8 text-right">
                <v-textarea
                  v-model="item.description"
                  label="Description"
                  auto-grow
                  name="input-7-1"
                  filled
                ></v-textarea>
              </div>
              <div class="col-8 text-right">
                <v-simple-table light>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Endpoint Name</th>
                        <th class="text-left">description</th>
                        <th class="text-left">path</th>

                        <th class="text-left">Rest method</th>
                        <th class="text-left">Request body</th>
                        <th class="text-left">Response body</th>                        
                        <th class="text-left">Api method</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="endpoint in item.serviceEndpoints"
                        :key="endpoint.id"
                      >
                        <td>{{ endpoint.name }}</td>
                        <td>{{ endpoint.description }}</td>
                        <td>{{ endpoint.endpoint }}</td>
                        <td>{{ endpoint.restMethod }}</td>
                        <td>{{ endpoint.requestBody }}</td>
                        <td>{{ endpoint.responseBody }}</td>
                        <td>{{item.apiController }} - {{ endpoint.apiMethod }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
              <div class="col-8 text-right">
                <v-text-field
                  v-model="item.endpoint"
                  label="Endpoint"
                ></v-text-field>
              </div>
              <div class="col-4 text-right">
                <v-breadcrumbs divider=".">
                  <v-breadcrumbs-item
                    v-for="e of item.environmentList"
                    :key="e.id"
                  >
                    {{ e.name }}
                  </v-breadcrumbs-item>
                </v-breadcrumbs>
              </div>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  props: ["serviceUrl"],
  data() {
    return {
      search: "",
      dialog: false,
      expanded: [],
      headers: [
        {
          text: "Service",
          value: "name",
        },
        {
          text: "Application",
          value: "application.name",
        },
        {
          text: "Platform",
          value: "platformName",
        },
      ],
      page: 1,
      totalElements: 0,
      numberOfPages: 0,
      services: [],
      loading: true,
      options: {},
      props: ["active_tab"],
    };
  },

  options: {
    handler() {
      console.log("handler got called");
    },
    deep: true,
  },
  methods: {
    filterOnlyCapsText(value, search, item) {
      console.log("item: ", item);
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    replaceString: function (domain, application, endpoint) {
      if (domain.startsWith("http://${feature--project-name}")) {
        return (
          domain.replace("${feature--project-name}", application.name) +
          endpoint
        );
      } else {
        return domain.replace("${project-name}", application.name) + endpoint;
      }
    },
    fetchApiData() {},

    sortBy(evt) {
      console.log("sort by called: ", evt);
    },
    updateOptions(evt) {
      console.log("update options:", evt.sortBy);
    },
    updatePagination(pagination) {
      console.log(
        "update:pagination",
        pagination,
        ", substract 1: ",
        pagination - 1
      );
      this.getServices();
    },

    setItemsPerPage(items) {
      this.itemsPerPage = items;
      console.log("itemsPerpage: ", items);

      if (items == "-1") {
        this.itemsPerPage = this.totalElements;
        console.log(
          "set to max pages: ",
          this.itemsPerPage,
          ", totalElements: ",
          this.totalElements
        );
      }

      this.getServices();
    },

    getServices() {
      this.loading = true;
      const { page, itemsPerPage } = this.options;
      let pageNumber = 0;
      if (!page || page == 0) {
        pageNumber = 0;
        console.log("set page to 1 when 0");
      } else {
        pageNumber = page - 1;
        console.log("pageNumber is ", pageNumber);
      }

      console.log(
        "getServices: pageNumber: ",
        pageNumber,
        ", itemsPerPage: ",
        this.itemsPerPage,
        ", itemsPerPage: ",
        itemsPerPage
      );
      try {
        axios
          .get(
            this.serviceUrl +
              "/services?size=" +
              itemsPerPage +
              "&page=" +
              pageNumber
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }
            //Then injecting the result to datatable parameters.
            this.services = response.data.content;
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

    getEndpoints({ item }) {
      console.log("get serviceEndpoints for serviceId: ", item.id);

      try {
        axios
          .get(this.serviceUrl + "/serviceendpoint/" + item.id)
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            //this.serviceEndpoints = response.data
            // this.service.endpoints = []
            item.serviceEndpoints = response.data;
            console.log(
              "got serviceEndpoints response, totalElements: ",
              item.serviceEndpoints.length
            );
          });
      } catch (e) {
        console.error(
          ` failed to get serviceEndpoints by serviceId, Errors! ${e}`
        );
      }
    },
  },

  async created() {
    this.getServices();
  },
};
</script>
