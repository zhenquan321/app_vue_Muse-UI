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
          <div id="myVideoBox" ref="myVideoBox"></div>
        </mu-card>
        <mu-tabs :value="activeTab" @change="handleTabChange">
          <mu-tab value="tab1" title="课程简介"/>
          <mu-tab value="tab2" title="课程列表"/>
        </mu-tabs>
      </div>
      <div class="p8 pt0" v-if="activeTab === 'tab1'">
        <mu-card >
          <mu-card-title :title="courseData.title" :subTitle="courseData.titleDec"/>
          <mu-card-text>
            课时：{{70}}
          </mu-card-text>
        </mu-card>
      </div>
      <div class="p8 pt0">
        <div class="INcard">
          <div v-if="activeTab === 'tab1'">
            <div>
            </div>
              <h4>课程简介</h4>
              <div>
                <h5>针对人群</h5>
                <p>
                  这是第一个 tab
                </p>
              </div>
          </div>
          <div v-if="activeTab === 'tab2'" class="VideoList">
            <mu-list class="pt0 pb0">
              <div :index="index" v-for="(o,index) in courseDataList">
                <mu-list-item :title="o.title" v-on:click="changVideo(index,o)">
                  <mu-avatar v-if="o.videoStart" src="../static/img/kaishi.png" slot="rightAvatar"/>
                  <mu-avatar v-if="!o.videoStart" src="../static/img/nokaishi.png" slot="rightAvatar"/>
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
  import Broadcast from 'common/js/ning/Broadcast.js';
  import Cache from 'common/js/Base/Cache.js';
  import TcPlayer from 'Tcplayer';

  const broadcast = new Broadcast()
  export default {
    data() {
      return {
        loading: true,
        url: '',
        title: '课程详情',
        dialog: false,
        bw: null,
        NetStateStr:"4G蜂窝网络",
        ifJT:true,
        toast: false,
        toastMasege:'',
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
          videoUrl:"https://p.bokecc.com/player?vid=9E672D7BC713BA499C33DC5901307461&siteid=6A19AAD6EABF585C&autoStart=false&width=100%&height=230&playerid=08143C56E1D83AE6&playertype=1",
          videoStart:false,
       }],
        courseData:{
          title:"2018相关法精讲训练班：考点精讲课",
          titleDec:'相关法考试的重要考点讲解',
          Teacher:'学院讲师',
          courseDec:'拥有丰富经验的相关法考试讲师,该课程仅在系列出售',
          img:'http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg',
          videoUrl:"https://p.bokecc.com/player?vid=18F92307053FB84E9C33DC5901307461&siteid=6A19AAD6EABF585C&autoStart=false&width=100%&height=230&playerid=08143C56E1D83AE6&playertype=1",
          videoStart:false,
       },
        activeTab: 'tab1',
      }
    },
    props:{
      movMsg:{
        type:Object
      }
    },
    mounted() {
        this.setPlayer();
    },
    created() {
      plusReady(this.plusReady);
    },
    computed: {
      player() {
         return this.$refs.myVideoBox.firstChild.firstChild.childNodes[11];
      },
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
        this.getListIng();
        this.setPlayer();
      },
      plusReady() {
        this.cw = plus.webview.currentWebview()
        this.url = this.cw.url
        this.title = this.cw.title
        this.setPlayer();
        setTimeout(function () { 
          plus.webview.currentWebview().show('slide-in-right', 250);
          plus.nativeUI.closeWaiting();
        }, 550);
        //视屏旋转
        if(plus.os.name=="Android"){
          var self = plus.webview.currentWebview();
          self.setStyle({
              videoFullscreen: 'landscape'
          });
        }else{
          // IOS监听的事件
          videoElem.addEventListener('webkitbeginfullscreen', function() {
              plus.screen.lockOrientation('landscape'); //锁死屏幕方向为横屏
          });
          videoElem.addEventListener('webkitendfullscreen', function() {
          //  plus.screen.unlockOrientation(); //解除屏幕方向的锁定，但是不一定是竖屏；
              plus.screen.lockOrientation('portrait'); //锁死屏幕方向为竖屏
          });
        }
        this.getListIng();
      },
      //设置播放器
      setPlayer(){
         const player = new TcPlayer("myVideoBox", {
            fileID: '4564972818956091133', // 请传入需要播放的视频filID 必须
            appID: '1253668508' // 请传入点播账号的appID 必须
        })
      },
      createVideo() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = this.courseData.videoUrl;
        var div = document.getElementById("videoBox");  
        while(div.hasChildNodes()) //当div下还存在子节点时 循环继续  
        {  
            div.removeChild(div.firstChild);  
        }  
        div.appendChild(s);
      },
      //切换视频源
      changVideo(index,data){
        for(var i=0;i<this.courseDataList.length;i++){
           this.courseDataList[i].videoStart=false;
        };
        this.courseDataList[index].videoStart=true;
        this.courseData=data;
        this.createVideo();
      },
      //网络切换
      handleTabChange (val) {
        this.showToast('网络已切换为WiFi网络')
        this.activeTab = val;
        broadcast.send('changemusic2', {
          data: this.courseData
        }, { ids: ['home.html'] })
      },
      handleActive () {
        window.alert('tab active')
      },
      openAlert () {
        this.dialog = true
      },
      closeAlert (num) {
        this.dialog = false;
        if(num==1){
          this.player.play();
        }
        this.ifJT=false;
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
        this.bw.addEventListener('titleUpdate', (e) => {
          this.title = e.title
        })
        this.bw.addEventListener('loading', (e) => {
          this.loading = true
        })
        this.bw.addEventListener('loaded', (e) => {
          this.loading = false
        })
      },
      //提示
      showToast (mag) {
        this.toastMasege=mag
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
        // console.log( this.NetStateStr);
        if(this.NetStateStr=="3G蜂窝网络" || this.NetStateStr=="4G蜂窝网络"|| this.NetStateStr=="2G蜂窝网络"){
          if(this.ifJT){
            this.player.pause();
            //退出全屏
            plus.screen.lockOrientation('portrait');
            this.openAlert();
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
      movMsg:{
        handler(newValue,oldValue){
          this.$refs.myVideoBox.innerHTML="";
          this.setPlayer();
        }
      }
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
    min-height: 230px;
  }
  .VideoList{
    margin: -16px;
  }
  .mu-item.show-right{
    height: 68px;
  }
  .videoBoxD{
    width: 100%;
    height: 230px;
    background-color: #555!important;
    position: relative;
  }
  
</style>