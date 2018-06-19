import Vue from 'vue'
import App from './App'

import '../../../common/css/tcplayer.css'


new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

// Vue.use(VueVideoPlayer, /* {
//   options: global default options,
//   events: global videojs events
// } */)