<template>
  <v-container>
   <v-data-table
    :page="page"
    :pageCount="numberOfPages"
    :headers="headers"
    :items="content"
    :options.sync="options"    
    :loading="loading"
    class="elevation-1"
    @update:page="updatePagination"    
    @update:items-per-page="setItemsPerPage"
    :search="search"
    :custom-filter="filterOnlyCapsText"
    
  >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search (UPPER CASE ONLY)"
          class="mx-4"
        ></v-text-field>
      </template>


      <template v-slot:[`item.applicationName`]="{ item }">          
          <span v-on:click="applicationTab()">{{item.applicationName}}</span>
      </template>
       <template v-slot:[`item.platform`]="{ item }">          
          <span>{{item.platform}}</span>
      </template>
        <template v-slot:[`item.devStatus`]="{ item }">
          <div  v-on:click="openTab(item.applicationId, item.devEnvironmentId)">
          <img v-if="item.devStatus == 'green'" src="@/assets/images/thumbs-up-green.png" width="25px" height="25px"/> 
          <img v-else-if="item.devStatus == 'up'" src="@/assets/images/trendup.png" width="25px" height="25px"/> 
          <img v-else-if="item.devStatus == 'red'" src="@/assets/images/redx.png" width="25px" height="25px"/> 
          <img v-else src="@/assets/images/sadface.png" width="25px" height="25px"/>
          </div>
        </template>
       <template v-slot:[`item.stageStatus`]="{ item }">
          <div  v-on:click="openTab(item.applicationId, item.stageEnvironmentId)">
          <img v-if="item.stageStatus == 'green'" src="@/assets/images/thumbs-up-green.png" width="25px" height="25px"/> 
          <img v-else-if="item.stageStatus == 'up'" src="@/assets/images/trendup.png" width="25px" height="25px"/> 
          <img v-else-if="item.stageStatus == 'red'" src="@/assets/images/redx.png" width="25px" height="25px"/> 
          <img v-else src="@/assets/images/sadface.png" width="25px" height="25px"/>
          </div>
        </template>
        <template v-slot:[`item.prodStatus`]="{ item }">        
           <div  v-on:click="openTab(item.applicationId, item.prodEnvironmentId)">
          <img v-if="item.prodStatus == 'green'" alt="green" src="@/assets/images/thumbs-up-green.png" width="25px" height="25px"/> 
          <img v-else-if="item.prodStatus == 'up'"  alt="up" src="@/assets/images/trendup.png" width="25px" height="25px"/> 
          <img v-else-if="item.prodStatus == 'red'" alt="red" src="@/assets/images/redx.png" width="25px" height="25px"/> 
          <img v-else src="@/assets/images/sadface.png" width="25px" height="25px"/>
           </div>
        </template>
  </v-data-table>
  </v-container>

</template>
<script>
import axios from 'axios'

  export default {
    props: ['serviceUrl'],
    data() {
      return {
         search: '',
         headers: [
           { 
             text: "Platform",
             value: "platform"
           },
          {
            text: 'name',            
            value: 'applicationName'            
          },
          {
            text: 'Dev status',            
            value: 'devStatus'
          },
          {
            text: 'Stage status',            
            value: 'stageStatus'
            
          },
          {
            text: 'Prod status',            
            value: 'prodStatus'            
          }
        ],       
        fields: ['applicationName', 'devStatus', 'stageStatus', "prodStatus"],
        msg: "hello people",
       
        page: 1,
        totalElements: 0,
        numberOfPages: 0,
        content: [],
        loading: true,
        options: {},
        tab: '',
        props: ['active_tab'],        
      }
    },
    options: {
      handler() {
        this.getApplicationStatus();
      },
    },
    methods: {
      filterOnlyCapsText (value, search, item) {
        console.log('item: ', item)
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
      },
      
      openTab(appId, envId) {
        console.log("open status tab with appid: ", appId, " and envId: ", envId)
        
        console.log("set status tab as active") 
        let tabIndex = 5  //status tab index is 5, from 0     
        this.$emit('activateTab', tabIndex, appId, envId)
      },
      applicationTab() {
        console.log("open application Tab");
        this.tab = "Application"
      },

      updatePagination (pagination) {
        console.log('update:pagination', pagination, ", substract 1: ", pagination-1)
        this.getApplicationStatus()
      },
        
      setItemsPerPage(items) {
        this.itemsPerPage = items
        console.log("itemsPerpage: ", items)
        this.getApplicationStatus()
      },

      getApplicationStatus() {        
        this.loading = true;
        const { page, itemsPerPage } = this.options;
        let pageNumber = 0
        if (page == 0) {
          pageNumber = 0          
        }
        else {
          pageNumber = page - 1;
        }
        console.info("serviceUrl: ", this.serviceUrl)
        try {
        axios
          .get(
            this.serviceUrl + "/appstatus?size=" +
              itemsPerPage +
              "&page=" +
              pageNumber +
              "&sort=applicationName"
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
            console.info("got response, totalElements: ", this.totalElements, ', numberOfPages: ', this.numberOfPages)
            this.loading = false;
          });
        }
          catch (e) {
            console.error(`Errors! ${e}`)
        }  
      },

      
    },


    async created () {
        this.getApplicationStatus()               
    }
  }
</script>
