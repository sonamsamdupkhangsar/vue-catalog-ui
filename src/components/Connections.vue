<template>
  <v-container>
    <canvas
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      @mouseout="handleMouseUp"
      id="canvas"  width=500 height=300
      
     ></canvas>

    
    <v-snackbar v-model="snackbar"> {{ snackbarMessage }}</v-snackbar>
  </v-container>
</template>
<style scoped>
body {
    background-color: ivory;
    padding:20px;
}
#canvas {
    border:1px solid red;
}
</style>
<script>
import axios from "axios";

export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      painting: false,
      vueCanvas: null,
      snackbar: false,
      snackbarMessage: "",
      pageNumber: 0,
      appPageNumber: 0,
      apps: [],
      appsTotalElements: 0,
      appNumberOfPages: 0,
      appItemsPerPage: 100,
      boxes: [],
      offsetX: 0,
      offsetY: 0,
      startX: 0,
      startY: 0,
      isDown: false,
      dragTarget: null,
      connectors: [],
    };
  },
  deep: true,

  methods: {
    statusTab(appId, envId) {
      console.log("appId: ", appId, ", envId: ", envId);
      this.getServiceStatus(appId, envId);
    },

    getServiceStatus(appId, envId) {
      console.log("get service for appId: ", appId, ", envId: ", envId);

      if (!appId || !envId) {
        console.log("appId or envId is null");
        this.snackbar = true;
        this.snackbarMessage = "selected app status shown here only";
        return;
      }
      this.snackbar = false;

      this.application = "";
      this.environment = "";
      this.content = [];
      this.loading = true;
      try {
        axios
          .get(this.serviceUrl + "/appstatus/app/" + appId + "/env/" + envId)
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }
            //Then injecting the result to datatable parameters.
            this.content = response.data;
            let i = 0;
            for (i = 0; i < this.content.length; i++) {
              this.application = this.content[i].application;
              this.environment = this.content[i].environment;
              console.log("extracted application and environment");
              break;
            }
            console.log("got response");
            this.loading = false;
            this.snackbar = false;
          });
      } catch (e) {
        console.error(`Errors on getting applicationServiceStatus! ${e}`);
      }
    },

    getApplications() {
      this.appLoading = true;

      console.log("getApplications: pageNumber: ", this.pageNumber);
      try {
        axios
          .get(
            this.serviceUrl +
              "/applications?size=" +
              this.appItemsPerPage +
              "&page=" +
              this.appPageNumber
          )
          .then((response) => {
            if (response.status == 401) {
              console.log("request user to login");
              this.$emit("login");
            }
            this.pageNumber += 1;

            //Then injecting the result to datatable parameters.
            this.apps = response.data.content;
            this.appsTotalElements = response.data.totalElements;
            this.appNumberOfPages = response.data.totalPages;
            console.log(
              "got response, totalElements: ",
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
/*
    startPainting(e) {
      this.painting = true;
      console.log("start painting: ", this.painting);
      this.draw(e);
    },

    finishedPainting() {
      this.painting = false;
      console.log("finish painting: ", this.painting);
      this.ctx.beginPath();
    },

    draw(e) {
      if (!this.painting) return;
      this.ctx.lineWidth = 10;
      this.ctx.lineCap = "round";

      this.ctx.lineTo(e.clientX, e.clientY);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(e.clientX, e.clientY);
    },
*/
    handleMouseDown(e) {
      console.info("mouseDown")
      this.startX = parseInt(e.clientX - this.offsetX);
      this.startY = parseInt(e.clientY - this.offsetY);

      // Put your mousedown stuff here
      this.isDown = this.hit(this.startX, this.startY);
    },

    handleMouseUp(e) {
      // Put your mouseup stuff here
      console.log("mouseUp e: ", e)
      this.dragTarget = null;
      this.isDown = false;
    },

    handleMouseOut(e) {
      console.info("mouseOut")
      this.handleMouseUp(e);
    },

    handleMouseMove(e) {
      console.info("mouseMove")
      if (!this.isDown) {
        return;
      }

      let mouseX = parseInt(e.clientX - this.offsetX);
      let mouseY = parseInt(e.clientY - this.offsetY);

      // Put your mousemove stuff here
      var dx = mouseX - this.startX;
      var dy = mouseY - this.startY;
      this.startX = mouseX;
      this.startY = mouseY;
      this.dragTarget.x += dx;
      this.dragTarget.y += dy;
      this.drawBox();
    },
    
    drawBox() {
      // clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (var i = 0; i < this.boxes.length; i++) {
        var box = this.boxes[i];
        this.ctx.fillRect(box.x, box.y, box.w, box.h);
      }
      /*
      for (i = 0; i < this.connectors.length; i++) {
        var connector = this.connectors[i];
        
        
        var box1 = this.boxes[connector.box1];
        var box2 = this.boxes[connector.box2];
        this.ctx.beginPath();
        this.ctx.moveTo(box1.x + box1.w / 2, box1.y + box1.h / 2);
        this.ctx.lineTo(box2.x + box2.w / 2, box2.y + box2.h / 2);
        this.ctx.stroke();
        
      }*/
    },

    hit(x, y) {
      for (var i = 0; i < this.boxes.length; i++) {
        var box = this.boxes[i];
        if (
          x >= box.x &&
          x <= box.x + box.w &&
          y >= box.y &&
          y <= box.y + box.h
        ) {

          this.dragTarget = box;
          return true;
        }
      }
      return false;
    },

    initBox() {
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");

       console.log("canvas.x: ", this.canvas.offsetLeft, "canvas.y: ", this.canvas.offsetTop) 
      //this.canvasOffset = this.canvas.left;
      this.offsetX = 66//this.canvas.offsetLeft;
      this.offsetY = 144//this.canvas.offsetTop;
      console.info("offsetX: ", this.offsetX, ", offsetY: ", this.offsetY)

      let xv = 50
      let yv = 25
      let width1 = 75
      let height1 = 50  

      for(let i = 0; i < 10; i++) {
        var box= {
          x: xv,
          y: yv,
          w: width1,
          h: height1,
        }
        this.boxes.push(box) // x,y,width,height  
        xv += width1 + 20
        console.info("box.x: ", box.x)
        this.connectors.push(box)
      }

/*

      this.boxes.push({
        x: 50,
        y: 25,
        w: 75,
        h: 50,
      }); // x,y,width,height
      this.boxes.push({
        x: 200,
        y: 100,
        w: 50,
        h: 50,
      });
      this.connectors.push({
        box1: 0,
        box2: 1,
      });
      */
      this.drawBox()
    },
  },

  async created() {
    this.getServiceStatus(this.appId, this.envId);
  },
  mounted() {
    this.initBox();
    /*
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.vueCanvas = this.ctx;

    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.ctx.fillRect(100, 100, 300, 300);
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(100, 100, 300, 300);
    let x = 0;
    let y = 0;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(200, 100);
    this.ctx.stroke();
    this.ctx.lineTo(200, 150);
    this.ctx.beginPath();
    this.ctx.moveTo(100, 100);
    this.ctx.lineTo(200, 100);
    this.ctx.lineTo(200, 150);
    this.ctx.closePath();
    this.ctx.stroke();
    */
  },
  updated() {
    console.log("updated  appId: ", this.appId, ", envId: ", this.envId);
  },
};
</script>
