/**
 * name: 0xgen Widget
 * author: tony@0xgen.io
 * date: 2022/5/5
 * desc:
 */
import Vue from "vue";
import App from "./app.vue";
import "../src/assets/iconfont.css";
import "../src/styles/index.scss";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
