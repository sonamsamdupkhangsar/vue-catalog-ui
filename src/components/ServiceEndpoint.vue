<template>
  <v-container>
  Service Endpoints <v-spacer />
                          <div class="text-center">
                            <v-btn
                              rounded
                              color="primary"
                              dark
                              v-on:click="addNewEndpointForm()"
                            :disabled="newEndpointFormDisabled"                            
                            >
                           Create New Endpoint
                            </v-btn>
                          </div>
                    
       <v-expansion-panel-content>
                          <v-expansion-panels v-model="count" >
                            <v-expansion-panel
                              v-for="serviceEndpoint in serviceEndpoints"
                              :key="serviceEndpoint.id"
                            >
                              <v-expansion-panel-header>{{ serviceEndpoint.name }}
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-list-item-content>
                                    <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.id"
                                        label="id"
                                        readonly
                                        :counter="36"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row> 
                                           <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.name"
                                        label="name"                                        
                                        :counter="100"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>                                                 
                                    <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.description"
                                        label="description"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>                                                 
                                  <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.restMethod"
                                        label="rest method"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.endpoint"
                                        label="endpoint"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.requestBody"
                                        label="requestBody"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                   <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.responseBody"
                                        label="responseBody"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                    <v-row>
                                    <v-col>
                                      <v-text-field
                                        v-model="serviceEndpoint.apiMethod"
                                        label="apiMethod"
                                        :counter="1024"
                                      ></v-text-field>
                                    </v-col>
                                  </v-row>
                                   <v-row>
                                    <v-col>
                                      <v-btn
                                        v-on:click="
                                          updateServiceEndpoint($event, serviceEndpoint)
                                        "
                                        :loading="updatingServiceEndpoint"
                                        class="mr-4"
                                      >
                                        Update Endpoint
                                      </v-btn>
                                      <v-btn
                                        v-on:click="deleteEndpoint(serviceEndpoint)"
                                        :loading="updatingServiceEndpoint"
                                        class="mr-4" v-if="serviceEndpoint.id"
                                      >
                                        Delete
                                      </v-btn>
                                    </v-col>
                                  </v-row>

                                   <v-row>
                                    <v-col>
                                      <service-connections :serviceEndpoint="serviceEndpoint"  :serviceUrl="serviceUrl" :application="application"></service-connections>
                                    </v-col>
                                  </v-row>
                                     </v-list-item-content>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-expansion-panel-content>
                     
  <v-snackbar
      v-model="snackbar"
    > {{ snackbarMessage }}</v-snackbar>
  </v-container>

</template>
<script>
import axios from 'axios'
import ServiceConnections from './ServiceConnections.vue'

  export default {
    components: { ServiceConnections },
    props: [ 'serviceUrl', 'service', 'application'],
    data() {
      return {
        msg: "hello people",
        count: 0,
        newEndpointFormDisabled: false,
        updatingServiceEndpoint: false,        
        lastNotSaved: false,
        serviceEndpointCount: 0,        
        serviceEndpoints: [],        
        snackbar: false,
        snackbarMessage: '',
      }
    },
    deep: true,
    
    methods: {  
     getServiceEndpoints() {
        console.log("get serviceEndpoints for service.id: ", this.service.id);
        try {
            axios
            .get(this.serviceUrl + "/serviceendpoint/" + this.service.id)
            .then((response) => {
                if (response.status == 401) {
                console.log("request user to login");
                this.$emit("login");
                }

                this.serviceEndpoints = response.data;
                this.count = this.serviceEndpoints.length
                console.log(
                "got serviceEndpoints response, totalElements: ",
                response.data.length
                
                );
            });
        } catch (e) {
            console.error(` failed to get serviceEndpoints by serviceId, Errors! ${e}`);
        }
      },

    addNewEndpointForm() {
      let serviceEndpoint = {
        id: "",
        serviceId: this.service.id,
        name: "",
        description: "",
        restMethod: "",
        endpoint: "",
        requestBody: "",
        responseBody: "",
        apiMethod: ""      
      }
      
      this.serviceEndpoints.push(serviceEndpoint)
      this.newEndpointFormDisabled = true
      console.log("added new ndpoint to serviceEndpoints: ", this.serviceEndpoints.length)
      this.count = this.serviceEndpoints.length
    },

    updateServiceEndpoint: function(event, serviceEndpoint) {
      console.log(
        "update serviceEndpoint, event: ",
        event,
        " target: ",
        event.target,
        ", serviceEndpoint: ",
        serviceEndpoint
      );
      this.updatingServiceEndpoint = true

      let isNewService = serviceEndpoint.id;
      try {
        this.submitting = true;
        console.log("send serviceEndpoint body: ", serviceEndpoint)
        axios
          .post(this.serviceUrl + "/serviceendpoint", serviceEndpoint)
          .then((response) => {
            this.submitting = false;

            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }

            //Then injecting the result to datatable parameters.
            serviceEndpoint = response.data;
            for (let i = 0; i < this.serviceEndpoints.length; i++) {
              if (this.serviceEndpoints[i].id == "") {
                this.serviceEndpoints[i] = serviceEndpoint;
                console.log(
                  "break after assigning new serviceEndpoint to array serviceEndpoints"
                );
                break;
              }
              console.log("should not execute after break");
            }
            console.log("got serviceEndpoint update response ", serviceEndpoint);
            this.snackbarMessage = "ServiceEndpoint updated";
            this.snackbar = true;
            if (isNewService == "") {              
              this.newEndpointFormDisabled = false
            }
            this.updatingServiceEndpoint = false

            //this.newServiceFormDisabled = false
            // this.getServices(service.applicationId)
          });
      } catch (e) {
        console.error(` failed to update service, Errors! ${e}`);
      }
    },

    deleteEndpoint: function(serviceEndpoint) {
      console.log("delete service ", serviceEndpoint.id);

      if (serviceEndpoint.id == "") {
          this.serviceEndpoints.pop(serviceEndpoint)  
          console.log("just pop the serviceEndpoint that is not in db")
          this.newEndpointFormDisabled = false
      }
      else {
        try {
          this.submitting = true;
          axios
            .delete(this.serviceUrl + "/serviceendpoint/" + serviceEndpoint.id)
            .then((response) => {
              console.log("response: ", response);

              if (response.status == 401) {
                console.log("request user to login");
                this.$emit("login");
              }

              this.submitting = false;

              this.snackbarMessage = "ServiceEndpoint deleted";
              this.snackbar = true;

              this.getServiceEndpoints()
              this.deleteConnections(serviceEndpoint)
            });
        } catch (e) {
          console.error(` failed to delete serviceEndpoint, Errors! ${e}`);
        }
      }
    },

    deleteConnections: function(serviceEndpoint) {
      console.log("delete serviceConnections by ", serviceEndpoint.id);


        try {
          this.submitting = true;
          axios
            .delete(this.serviceUrl + "/connections/deleteby/serviceEndpointId/" + serviceEndpoint.id)
            .then((response) => {
              console.log("response: ", response);

              if (response.status == 401) {
                console.log("request user to login");
                this.$emit("login");
              }

              this.submitting = false;

              this.snackbarMessage = "Connections deleted when ServiceEndpoint deleted";
              this.snackbar = true;             
            });
        } catch (e) {
          console.error(` failed to delete connections, Errors! ${e}`);
        }
      }
   
    },

    async created () {      
        //this.getServiceStatus(this.appId, this.envId)
        console.log("serviceEndpoint got created for service.id: ", this.service.id, ", service.name: ", this.service.name)
        if (this.service && this.service.id != "") {
          this.getServiceEndpoints()
        }
    },
    mounted() {
      //console.log("mounted, appId: ", this.service.id, ", envId: ", this.envId)      
         console.log("mounted for service.id: ", this.service.id, ", service.name: ", this.service.name)
    },
    updated() {
      console.log("updated  appId")
    },
  }
</script>

  <!--   -->