import Vue from 'vue'
import MuseUI from 'muse-ui' 
import axios from 'axios'
import 'common/css/font-css.css'
import 'muse-ui/dist/muse-ui.css'
// 引用API文件
import api from '../../../api/index.js'
// 将API方法绑定到全局
Vue.prototype.$api = api
//默认domReady事件
import domReady from './ready.js'
//默认plusReady事件
import plusReady from './plusReady.js'
import style from '../../css/style.less'
import fontAwesome from 'font-awesome-webpack'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(MuseUI)

module.exports = {
    domReady,
    plusReady
}