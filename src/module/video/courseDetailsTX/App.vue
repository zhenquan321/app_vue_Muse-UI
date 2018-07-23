<template>
  <div id="courseDetails">
    <mu-linear-progress v-show='loading' />
    <mu-appbar :title="title">
      <mu-icon-button icon='close' slot="left" @click='close()' />
    </mu-appbar>
    <template>
    <div>
      <div class="p8">
        <mu-card class="videoBoxD">
           <mu-card-media style="position: absolute;">
            <img src="../static/img/loading.gif" />
           </mu-card-media>
            <div id="videoBox" ref="myVideoBox">
              <video ref="playerContainerId"  id="player-container-id" width="375" height="270" preload="auto" playsinline webkit-playinline x5-playinline></video>
            </div>
        </mu-card>
        <mu-tabs :value="activeTab" @change="handleTabChange">
          <mu-tab value="tab1" title="课程简介"/>
          <mu-tab value="tab2" title="课程列表"/>
        </mu-tabs>
      </div>
      <div class="p8 pt0" v-if="activeTab === 'tab1'">
        <mu-card >
          <!-- <div id="videoBox" ref="myVideoBox"></div> -->
          <mu-card-title :title="curseDatajs.title" :subTitle="curseDatajs.synopsis"/>
          <mu-card-text>
            课时：{{curseDatajs.class_hour}}
          </mu-card-text>
        </mu-card>
      </div>
      <div class="p8 pt0">
        <div class="INcard">
          <div v-if="activeTab === 'tab1'">
            <div>
            </div>
              <h4>课程简介</h4>
              <div class="pt15">
                <div v-html="curseDatajs.introduce">

                </div>
                <!-- <h5>针对人群</h5>
                <p>
                  这是第一个 tab
                </p> -->
              </div>
          </div>
          <div v-if="activeTab === 'tab2'" class="VideoList">
            <mu-list class="pt0 pb0">
              <div :index="index" v-for="(o,index) in courseDataList">
                <mu-list-item :title="o.title" v-on:click="changVideo(o,index,'',true)">
                  <mu-avatar v-show="o.videoStart" src="../static/img/kaishi.png" slot="rightAvatar"/>
                  <mu-avatar v-show="!o.videoStart" src="../static/img/nokaishi.png" slot="rightAvatar"/>
                </mu-list-item>
                <mu-divider/>
              </div>
            </mu-list>
          </div>
        </div>
      </div>
    </div>
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
  import Vue from 'vue';
  import Broadcast from 'common/js/ning/Broadcast.js';
  import Cache from 'common/js/Base/Cache.js';
  const broadcast = new Broadcast()
  export default {
    data() {
      return {
        loading: false,
        url: '',
        title: '课程详情',
        dialog: false,
        bw: null,
        NetStateStr:"4G蜂窝网络",
        ifJT:true,
        tcplayer:'',
        toast: false,
        toastMasege:'',
        onlyWifi:true,
        player:'',
        videoData:{},
        courseDataList:[{
          title:"2018相关法精讲训练班：考点精讲课",
          titleDec:'相关法考试的重要考点讲解',
          Teacher:'学院讲师',
          courseDec:'拥有丰富经验的相关法考试讲师,该课程仅在系列出售',
          img:'http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg',
          videoUrl:"https://p.bokecc.com/player?vid=18F92307053FB84E9C33DC5901307461&siteid=6A19AAD6EABF585C&autoStart=false&width=100%&height=230&playerid=08143C56E1D83AE6&playertype=1",
          videoStart:true,
       },{
          title:"2018相关法精讲训练班：考点精讲课",
          titleDec:'相关法考试的重要考点讲解',
          Teacher:'学院讲师',
          courseDec:'拥有丰富经验的相关法考试讲师,该课程仅在系列出售',
          img:'http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg',
          videoUrl:"https://p.bokecc.com/player?vid=9E672D7BC713BA499C33DC5901307461&siteid=6A19AAD6EABF585C&autoStart=false&width=100%&height=250&playerid=08143C56E1D83AE6&playertype=1",
          videoStart:false,
       }],
        courseData:{
          title:"2018相关法精讲训练班：考点精讲课",
          titleDec:'相关法考试的重要考点讲解',
          Teacher:'学院讲师',
          courseDec:'拥有丰富经验的相关法考试讲师,该课程仅在系列出售',
          img:'http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg',
          videoUrl:"https://p.bokecc.com/player?vid=18F92307053FB84E9C33DC5901307461&siteid=6A19AAD6EABF585C&autoStart=false&width=100%&height=250&playerid=08143C56E1D83AE6&playertype=1",
          videoStart:false,
       },
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
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = "https://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.min.js";
      document.getElementById("videoBox").appendChild(s);
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
        for(var i=0;i< this.courseDataList.length;i++){
          this.courseDataList[i].videoUrl = 'https://p.bokecc.com/player?vid='+ this.courseDataList[i].qcloud_id+'DC5901307461&siteid=D7C8C99121633982&autoStart=false&width=100%&height=250&playerid=08143C56E1D83AE6&playertype=1';
          this.courseDataList[i].title = this.courseDataList[i].node_title
          this.courseDataList[i].videoStart = false;
        }
        // this.courseDataList[0].videoStart=true;
        // this.courseData = this.courseDataList[0];
        setTimeout(function () { 
          plus.webview.currentWebview().show('slide-in-right', 250);
          plus.nativeUI.closeWaiting();
        }, 700);
        setTimeout(()=>{
          this.changVideo(this.courseDataList[0],0,true);
        },200)
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
        //获取play
        this.player=this.$refs.playerContainerId;
      },
   
      createVideo() {
          this.tcplayer = TCPlayer('player-container-id', { // player-container-id 为播放器容器ID，必须与html中一致
            fileID: this.courseData.qcloud_id, // 请传入需要播放的视频filID 必须
            appID: this.courseData.qcloud_app,// 请传入点播账号的appID 必须
            coverpath:this.courseData.coverpath,
            plugins:{
              ContinuePlay: { // 开启续播功能
                auto: true, //[可选] 是否在视频播放后自动续播
                text:'上次播放至 ', //[可选] 提示文案
                btnText: '恢复播放' //[可选] 按钮文案
              },
            }
          });
      },
      //切换视频源
      changVideo(data,index,type,ifReload){
        this.activeTab="tab1";
        for(var i=0;i<this.courseDataList.length;i++){
          if(i==index){
            this.courseDataList[i].videoStart=true;
          }else{
            this.courseDataList[i].videoStart=false;
          }
        };
        if(!type){
          this.activeTab="tab2";
        }
        this.courseData=this.courseDataList[index];
        if(ifReload){
          this.tcplayer.loadVideoByID({fileID: this.courseData.qcloud_id, appID: this.courseData.qcloud_app})
        }else{
          this.createVideo();
        }
      },
    
    
     
      //网络切换
      handleTabChange (val) {
        this.activeTab = val;
        // broadcast.send('changemusic2', {
        //   data: this.courseData
        // }, { ids: ['home.html'] })
      },
      handleActive () {
        window.alert('tab active')
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
      createBowser() {
        this.bw = plus.webview.create(this.url, 'bowser', {
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
        //  console.log(this.player.paused)
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
  #player-container-id{
    width: 100%;
    height: 250px;
  }
</style>