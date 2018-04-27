import Vue from 'vue'
import App from './App'

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
 
Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)