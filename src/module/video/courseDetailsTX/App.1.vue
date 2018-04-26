<template>
  <div>
    <mu-linear-progress v-show='loading' />
    <mu-appbar :title="title">
      <mu-icon-button icon='close' slot="left" @click='close()' />
    </mu-appbar>
    <template>
      <mu-card>
        <md-card-media>
          <div class="item">
            <div class="player">
              <video-player  class="vjs-custom-skin"
                            ref="videoPlayer"
                            :options="playerOptions"
                            :playsinline="true"
                            @play="onPlayerPlay($event)"
                            @pause="onPlayerPause($event)"
                            @ended="onPlayerEnded($event)"
                            @loadeddata="onPlayerLoadeddata($event)"
                            @waiting="onPlayerWaiting($event)"
                            @playing="onPlayerPlaying($event)"
                            @timeupdate="onPlayerTimeupdate($event)"
                            @canplay="onPlayerCanplay($event)"
                            @canplaythrough="onPlayerCanplaythrough($event)"
                            @ready="playerReadied"
                            @statechanged="playerStateChanged($event)">
              </video-player>
            </div>
          </div>
        </md-card-media>
        <mu-card-title :title="courseData.title" :subTitle="courseData.titleDec"/>
        <mu-card-text>
          {{courseData.courseDec}}
        </mu-card-text>
      </mu-card>
    </template>
    <template>
    <div>
      <mu-tabs :value="activeTab" @change="handleTabChange">
        <mu-tab value="tab1" title="课程简介"/>
        <mu-tab value="tab2" title="讲师介绍"/>
      </mu-tabs>
      <div v-if="activeTab === 'tab1'">
        <h2>课程简介</h2>
        <p>
          这是第一个 tab
        </p>
      </div>
      <div v-if="activeTab === 'tab2'">
        <h2>讲师介绍</h2>
        <p>
          这是第二个 tab
        </p>
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
  </div>
</template>
<script>
  import {domReady,plusReady} from 'common/js/ning/index.js';
  import Broadcast from 'common/js/ning/Broadcast.js';
  import Cache from 'common/js/Base/Cache.js';
  
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
        courseData:{
          title:"2018相关法精讲训练班：考点精讲课",
          titleDec:'相关法考试的重要考点讲解',
          Teacher:'学院讲师',
          courseDec:'拥有丰富经验的相关法考试讲师,该课程仅在系列出售',
          img:'http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg'
        },
        activeTab: 'tab1',
        playerOptions: {
          height: '320',
          autoplay: false,
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            //1251979435.vod2.myqcloud.com/541c52b5vodtransgzp1251979435/ace27ecb7447398154712592233/v.f20.mp4?t=5ae2e423&super_sign=79f03a06797a0f2253fd97e30bf99654
            //1251979435.vod2.myqcloud.com/541c52b5vodtransgzp1251979435/dc4cc2347447398154679527115/v.f20.mp4?t=5ae2e704&super_sign=0183e43f815a989d9a53366c06a0304b
            //1251979435.vod2.myqcloud.com/541c52b5vodtransgzp1251979435/dc4cc2347447398154679527115/v.f30.mp4
            //1251979435.vod2.myqcloud.com/541c52b5vodtransgzp1251979435/d45773204564972819276469972/v.f20.mp4
            //1251979435.vod2.myqcloud.com/541c52b5vodtransgzp1251979435/d4577320  4564972819276469972 4564972819276469972/v.f30.mp4
            //200007162.vod.myqcloud.com/200007162_5727b7e603ed11e6a8c3976cadb1b427.f30.mp4
            // mp4
            src: "http://1251979435.vod2.myqcloud.com/541c52b5vodtransgzp1251979435/dc4cc2347447398154679527115/v.f20.mp4",
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }],
          poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
        }
      }
    },
    mounted() {
      // console.log('this is current player instance object', this.player)
      setTimeout(() => {
        console.log('dynamic change options', this.player)
        // change src
        // this.playerOptions.sources[0].src = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm';
        // change item
        // this.$set(this.playerOptions.sources, 0, {
        //   type: "video/mp4",
        //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
        // })
        // change array
        // this.playerOptions.sources = [{
        //   type: "video/mp4",
        //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
        // }]
        this.player.muted(false)
      }, 5000)
    },
    created() {
      plusReady(this.plusReady);
     
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
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
        plusReady() {
        this.cw = plus.webview.currentWebview()
        this.url = this.cw.url
        this.title = this.cw.title
        setTimeout(function () { 
          plus.webview.currentWebview().show('slide-in-right', 250);
          plus.nativeUI.closeWaiting();
        }, 300);
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
        if(this.timeOut){  
          clearTimeout(this.timeOut);  
        };
      },
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player);
          this.getListIng();
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      onPlayerEnded(player) {
        // console.log('player ended!', player)
      },
      onPlayerLoadeddata(player) {
        // console.log('player Loadeddata!', player)
      },
      onPlayerWaiting(player) {
        // console.log('player Waiting!', player)
      },
      onPlayerPlaying(player) {
        // console.log('player Playing!', player)
      },
      onPlayerTimeupdate(player) {
        // console.log('player Timeupdate!', player.currentTime())
      },
      onPlayerCanplay(player) {
        // console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough(player) {
        // console.log('player Canplaythrough!', player)
      },
      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },
      // player is ready
      playerReadied(player) {
        // seek to 10s
        console.log('example player 1 readied', player)
        player.currentTime(10)
        // console.log('example 01: the player is readied', player)
      },

      handleTabChange (val) {
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
          this.ifJT=false;
          this.player.play();
        }
      },
    
      close() {
        this.cw.close()
      },
      createBowser() {
        this.bw = plus.webview.create(this.url, 'bowser', {
          top: '56px',
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
        console.log( this.NetStateStr);
        if(this.NetStateStr=="3G蜂窝网络" || this.NetStateStr=="4G蜂窝网络"|| this.NetStateStr=="2G蜂窝网络"){
          if(this.ifJT){
            this.player.pause();
            this.openAlert();
          }
          this.ifJT
        }else{
          if(this.NetStateStr=="WiFi网络"){
            this.ifJT=true;
          }
          let _this = this;  
          this.timeOut = setTimeout(() => {  
              _this.getListIng();  
          }, 2000);  
        }
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

</style>