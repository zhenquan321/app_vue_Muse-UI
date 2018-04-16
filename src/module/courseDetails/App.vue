<template>
  <div>
    <link href="http://vjs.zencdn.net/6.6.3/video-js.css" rel="stylesheet">
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
  </div>
</template>
<script src="http://vjs.zencdn.net/6.6.3/video.js"></script>
<script>
  import {
    domReady,
    plusReady
  } from 'common/js/ning/index.js'

  export default {
    data() {
      return {
        loading: false,
        url: '',
        title: '课程详情',
        bw: null,
        courseData:{
          title:"2018相关法精讲训练班：考点精讲课",
          titleDec:'相关法考试的重要考点讲解',
          Teacher:'学院讲师',
          courseDec:'拥有丰富经验的相关法考试讲师,该课程仅在系列出售',
          img:'http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg'
        },
        activeTab: 'tab1',
        playerOptions: {
          height: '360',
          autoplay: false,
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            // mp4
            src: "http://pic.ibaotu.com/00/60/75/01J888piCPNw.mp4",
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
      plusReady(this.plusReady)
      
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },

    methods: {
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
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
        this.activeTab = val
      },
      handleActive () {
        window.alert('tab active')
      },
      plusReady() {
        this.cw = plus.webview.currentWebview()
        this.url = this.cw.url
        this.title = this.cw.title
        //this.createBowser()
        //this.initBowser()
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
      }
    }
  }
 
</script>

<style lang="css">
  .mu-appbar{

  }
  /*进度条*/
  .mu-linear-progress{
    position: absolute !important;
    left: 0;
    top: 0;
    height: 2px !important;
    background-color: rgba(255,255,255,.35) !important;
  }

</style>