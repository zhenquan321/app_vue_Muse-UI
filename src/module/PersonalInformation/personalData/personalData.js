import Vue from 'vue'
import fontAwesome from 'font-awesome-webpack'
import App from './App'
import { domReady, plusReady } from "common/js/ning/index.js"
import Broadcast from 'common/js/ning/Broadcast.js'
import SF from "common/js/App/SFArticle.js"

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
