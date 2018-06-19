<template>
  <div id="courseDetails">
    <mu-linear-progress v-show='loading' />
    <mu-appbar :title="title">
      <mu-icon-button icon='close' slot="left" @click='close()' />
    </mu-appbar>
    <template>
    
    </template>
    <template>
      <div>
        <mu-dialog :open="dialog" title="提示" @close="closeAlert">
          当前网络为{{NetStateStr}}，是否继续播放？
          <mu-flat-button slot="actions" primary @click="closeAlert(0)" label="取消"/>
          <mu-flat-button slot="actions" primary @click="closeAlert(1)" label="确定"/>  
        </mu-dialog>
      </div>
    </template>
    <template>
      <div>
        <mu-toast v-if="toast" :message="toastMasege" @close="hideToast"/> 
      </div>
    </template>
  </div>
</template>
<script>
  import {domReady,plusReady} from 'common/js/ning/index.js';
  import Broadcast from 'common/js/ning/Broadcast.js';
  import Cache from 'common/js/Base/Cache.js';
  import axios from "axios";
  import baseURL from '../../../api/IPconfig.js';
  import $ from '../../../api/jquery-vendor';
  
  const broadcast = new Broadcast()
  export default {
    data() {
      return {
        loading: false,
        url: '',
        title: '直播间',
        dialog: false,
        bw: null,
        NetStateStr:"4G蜂窝网络",
        ifJT:true,
        toast: false,
        toastMasege:'',
        onlyWifi:true,
        videoData:{},
        courseData:{},
        curseDatajs:{
            // "id": 129,
            // "title": "新颖性",
            // "synopsis": "1212",
            // "introduce": "454",
            // "classify": 1,
            // "level": 1,
            // "class_hour": 1,
            // "gensee_key": "",
            // "gensee_code": "",
            // "tutor_key": "",
            // "stu_key": "",
            // "tch_key": "",
            // "tutor_id": 112653,
            // "tch_id": 132784,
            // "tch_synopsis": "5454",
            // "start_time": "2016-08-23 00:00:00",
            // "end_time": "2016-08-23 00:00:01",
            // "price": 0,
            // "pre_price": 0,
            // "sign_up_num": 0,
            // "cover": 0,
            // "vip": 0,
            // "hot": 0,
            // "type": 2,
            // "status": 0,
            // "recommend": 0,
            // "homework": 0,
            // "along": 1,
            // "old_live": 0,
            // "is_delete": 0,
            // "old_video": 57,
            // "tname": "学院讲师",
            // "is_show": 1,
            // "tch_introduce": "",
            // "learn_url": "",
            // "right_touch": 0,
            // "left_touch": 0,
            // "create_time": 1488787447,
            // "cc_type": 1,
            // "agreement_id": 0,
            // "formattime": "",
            // "coverpath": "",
            // "teachername": "学院讲师",
            // "agreement_path": ""
        },
        activeTab: 'tab1',
      }
    },
    mounted() {
      // const s = document.createElement('script');
      // s.type = 'text/javascript';
      // s.src = this.courseData.videoUrl;
      // document.getElementById("videoBox").appendChild(s);
    },
    created() {
      this.ready();
      plusReady(this.plusReady);
    },
    computed: {
      timeOut: {  
        set (val) {  
            this.$store.state.timeout.compileTimeout = val;  
        },  
        get() {  
            return this.$store.state.timeout.compileTimeout;  
        }  
      },  
    },
    methods: {
      ready() {
        //读取缓存
      },
      plusReady() {
        this.cw = plus.webview.currentWebview();
        console.log(JSON.stringify(this.cw.videoData))
        this.courseDataList=this.cw.videoData.vlist;
        this.curseDatajs=this.cw.videoData.courseData;
        this.userid = plus.storage.getItem('userid') ? plus.storage.getItem('userid') : '';//'165319'
        this.getLiveData();
        setTimeout(function () { 
          plus.webview.currentWebview().show('slide-in-right', 250);
          plus.nativeUI.closeWaiting();
        }, 900);
        //视屏旋转
        if(plus.os.name=="Android"){
          var self = plus.webview.currentWebview();
          self.setStyle({
              videoFullscreen: 'landscape'
          });
        }else{
          var fullScreenOfIos = function(videoElem) {
              // 监听的事件与Android平台有很大区别
              videoElem.addEventListener('webkitbeginfullscreen', function() {
                  plus.screen.lockOrientation('landscape'); //锁死屏幕方向为横屏
              });
              videoElem.addEventListener('webkitendfullscreen', function() {
                  plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
              });
          };
        }
        //判断是否是仅wifi播放
        this.onlyWifi = plus.storage.getItem('onlyWifi')||"1";
        console.log(" this.onlyWifi:"+this.onlyWifi)
        if(this.onlyWifi=="1"){
          setTimeout(() => {
            this.getListIng();
          }, 2000)
        };
      },
      openAlert () {
        this.dialog = true;
        plus.screen.lockOrientation('portrait-primary');
      },
      closeAlert (num) {
        this.dialog = false;
        if(num==1){
          this.ifJT=false;
          this.player.play();
        }else{
          this.ifJT=true;
        }
        plus.screen.unlockOrientation(); //解除屏幕方向的锁定
      },
      close() {
        this.cw.close()
      },
      //获取播放课程
      getLiveData(){
        this.loading = true;
        const parmas={
          uid:this.userid,
          pk:this.cw.videoData.courseData.id,
        }
        this.$api.get(baseURL.sapi+'Course/live', parmas, response => {
          this.loading = false;
          // console.log("sss"+JSON.stringify(response.data));
          this.openCClive(response.data);
        },
        failure => {
          this.loading = false;
          this.noCase=true;
          // console.log(JSON.stringify(failure))
        })
      },
      //打开直播间
      openCClive(data) {
        let ad_httpurl="https://s.test.mysipo.com/course/live/course_id/"+this.cw.videoData.courseData.id+".html?type=app&userid="+data.userId+"&roomid="+data.roomid+"&viewername="+data.viewername+"&viewertoken="+data.viewertoken;
        this.bw = plus.webview.create(ad_httpurl, '直播间', {
          top: '45px',
          bottom: '0px',
          bounce: 'vertical'
        })
        this.cw.append(this.bw)
        this.bw.show()
      },
      initBowser() {
        this.bw.addEventListener('loading', (e) => {
          this.loading = true
        })
        this.bw.addEventListener('loaded', (e) => {
          this.loading = false
        })
      },
      //提示
      showToast (mag) {
        this.toastMasege=mag;
        this.toast = true;
        if (this.toastTimer) clearTimeout(this.toastTimer)
        this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
      },
      hideToast () {
        this.toast = false
        if (this.toastTimer) clearTimeout(this.toastTimer)
      },
      //监测网络状态
      getListIng() {  
        var types = [];
        var num = plus.networkinfo.getCurrentType();
        types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
        types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
        types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
        types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
        types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
        types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
        types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
        this.NetStateStr = types[num];
        // console.log( this.num);
        // console.log(this.NetStateStr);
        if(this.NetStateStr=="3G蜂窝网络" || this.NetStateStr=="4G蜂窝网络"|| this.NetStateStr=="2G蜂窝网络"){
         console.log(this.player.paused)
         if(this.ifJT){
           if(!this.player.paused){
            this.player.pause();
            this.player.webkitExitFullScreen();;
            //退出全屏
            plus.screen.lockOrientation('portrait-primary'); 
            plus.screen.lockOrientation('portrait');
            this.openAlert();
           }
          }
        }else{
          if(this.NetStateStr=="WiFi网络"){
            if(!this.ifJT){
              this.showToast('网络已切换为WiFi网络')
            }
            this.ifJT=true;
          }
        }
        let _this = this;  
        setTimeout(() => {  
            _this.getListIng();  
        }, 2000);  
      },  
    },
    watch: {

    }
  }
</script>

<style lang="css">
  /*进度条*/
  .mu-linear-progress{
    position: absolute !important;
    left: 0;
    top: 0;
    height: 2px !important;
    background-color: rgba(255,255,255,.35) !important;
  }
  .videoBox{
    min-height: 250px;
  }
  .VideoList{
    margin: -16px;
  }
  .mu-item.show-right{
    height: 68px;
  }
  .videoBoxD{
    width: 100%;
    height: 250px;
    background-color: #555!important;
    position: relative;
  }
  
</style>