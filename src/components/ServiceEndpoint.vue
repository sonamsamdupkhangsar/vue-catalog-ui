<template>
  <v-container>
       <v-expansion-panel-header>Service Endpoint <v-spacer />
                          <div class="text-center">
                            <v-btn
                              rounded
                              color="primary"
                              dark
                              v-on:click="addNewEndpointForm()"                            
                            >
                           Create New Endpoint
                            </v-btn>
                          </div>
                        </v-expansion-panel-header>
       <v-expansion-panel-content>
                          <v-expansion-panels v-model="serviceEndpoints" multiple>
                            <v-expansion-panel
                              v-for="serviceEndpoint in serviceEndpoints"
                              :key="serviceEndpoint.id"
                            >
                              <v-expansion-panel-header
                                >{{ service.name }}
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-list-item-content>
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
                                      <v-checkbox
                                        v-model="serviceEndpoint.accessTokenRequired"
                                        label="Access token required"
                                      ></v-checkbox>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-checkbox
                                        v-model="serviceEndpoint.pingIt"
                                        label="ping it"
                                      ></v-checkbox>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col>
                                      <v-checkbox
                                        v-model="serviceEndpoint.healthEndpoint"
                                        label="Health endpoint"
                                      ></v-checkbox>
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

  export default {
    props: [ 'serviceUrl', 'service'],
    data() {
      return {
        msg: "hello people",
        loading: false,       
        tab: '',
        serviceEndpointCount: 0,        
       // service: '',
        serviceEndpoints: [],
        
        selectedServiceEndpoint : {
        id: "",
        name: "",
        description: "",
        restMethod: "",
        endpoint: "",
        accessTokenRequired: false,
        pingIt: false,
        healthEndpoint: false
      },
 //this.panel = [this.services.length];
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
        name: "",
        description: "",
        restMethod: "",
        endpoint: "",
        accessTokenRequired: false,
        pingIt: false,
        healthEndpoint: false
      }
      this.serviceEndpoints.push(serviceEndpoint)
    },
   
    },

    async created () {      
        //this.getServiceStatus(this.appId, this.envId)
        console.log("serviceEndpoint got created for service.id: ", this.service.id, ", service.name: ", this.service.name)
        this.getServiceEndpoints()
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
