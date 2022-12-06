import Vue from "vue";
import App from "./App";
Vue.config.productionTip = false;
import VueTrackPlush from "vue-track-plush";

Vue.use(VueTrackPlush, {
  // baseURL: "<接口域名>",
  // url: "<接口地址>",
  // projectName: "项目名称"
  baseURL: "host",
  url: "/api/action/record",
  projectName: "项目名称",
});

new Vue({
  el: "#app",
  components: {
    App,
  },
  template: "<App/>",
});
