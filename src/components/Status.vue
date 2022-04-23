<template>
  <v-container>
    <v-chip>Application: {{application.name}}</v-chip> 

    <v-chip>Environment {{environment.name}}</v-chip>
   <v-data-table
    :headers="headers"
    :items="content"
    :loading="loading"
    class="elevation-1"   
    :hide-default-footer="true"
  >     
  </v-data-table>
  <v-snackbar
      v-model="snackbar"
    > {{ snackbarMessage }}</v-snackbar>
  </v-container>

</template>
<script>
import axios from 'axios'

  export default {
     props: ["appId", "envId", "serviceUrl"],
     watch: {
      'appId': function(appId) {
         console.log("appId watch:  appId: ", appId);
         this.appId = appId
         this.getServiceStatus(this.appId, this.envId)
      },
      'envId': function(envId) {
         console.log("envId watch:  envId: ", envId);
         this.envId = envId
         this.getServiceStatus(this.appId, this.envId)
      }

     },
     
   
    data() {
      return {
         headers: [
         
          {
            text: 'service',            
            value: 'service.name',
            sortable: false
          },
          {
            text: 'endpoint',            
            value: 'serviceEndpoint',
            sortable: false
          },
          {
            text: 'httpStatusValue',            
            value: 'httpStatusValue',
            sortable: false
          },
          {
            text: "lastPingDateTime",
            value: "lastPingDateTime",
            sortable: false
          },
          {
            text: "successPingCount",
            value: "successPingCount",
            sortable: false
          },
            {
            text: "error",
            value: "exceptionMessage",
            sortable: false
          },
        ],
        fields: ['applicationName', 'devStatus', 'stageStatus', "prodStatus"],
        msg: "hello people",
       
       
        content: [],
        loading: false,       
        tab: '',        
        application: '',
        environment: '',
        deploymentLink: '',
        snackbar: false,
        snackbarMessage: '',
      }
    },
    deep: true,
    
    methods: {  
      statusTab(appId, envId) {
        console.log("appId: ", appId, ", envId: ", envId)
        this.getServiceStatus(appId, envId)
      },

      getServiceStatus(appId, envId) {     
        console.log("get service for appId: ", appId, ", envId: ", envId)
        
        if (!appId  || !envId ) {
          console.log("appId or envId is null")
          this.snackbar = true
          this.snackbarMessage = "selected app status shown here only"
          return
        }
        this.snackbar = false

        this.application = ''
        this.environment = ''
        this.content = []
        this.loading = true;
        try {
        axios
          .get(this.serviceUrl + 
            "/appstatus/app/" + appId + "/env/" + envId
          )
          .then((response) => {
            if (response.status == 401) {
               console.log("request user to login")
               this.$emit('login')
            }
            //Then injecting the result to datatable parameters.            
            this.content = response.data;
            let i = 0;
            for (i = 0; i < this.content.length; i++) {
              this.application = this.content[i].application
              this.environment = this.content[i].environment
              console.log("extracted application and environment")
              break
            }
            console.log("got response")
            this.loading = false;
            this.snackbar = false
          });
        }
          catch (e) {
            console.error(`Errors on getting applicationServiceStatus! ${e}`)
        }  
      },
      
    },

    async created () {      
        this.getServiceStatus(this.appId, this.envId)
    },
    mounted() {
      console.log("mounted, appId: ", this.appId, ", envId: ", this.envId)      
    },
    updated() {
      console.log("updated  appId: ", this.appId, ", envId: ", this.envId)
    },
  }
</script>
