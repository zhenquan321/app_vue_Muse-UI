<template>
  <div>


    <mu-list>
      <template v-for='o,i in list'>
        <mu-list-item :title="(i+1) + ' : ' +o.n" @click='onTap(o, i)'>
          <!--<mu-circular-progress v-show='index === i' slot="left" :size="20" />-->
        </mu-list-item>
      </template>
    </mu-list>



  </div>
</template>

<script>
  import {
    domReady,
    plusReady
  } from 'common/js/ning/index.js'
  import Cache from 'common/js/Base/Cache.js'
  import Broadcast from 'common/js/ning/Broadcast.js'
  import DJYE from 'common/js/App/DJYE.js'
  const dj = new DJYE(),
    cache = new Cache('ingmusic'),
    broadcast = new Broadcast()
  export default {
    data() {
      return {
        index: 0,
        list: [
          {
            title:"2018名师讲解训练班：相关法",
            n:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
          },
          {
            title:"2018名师讲解训练班：相关法",
            n:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
          },
        ]
      }
    },
    computed: {
      indexMusic() {
        return this.list[this.index] || {
          t: '2',
          s: -1,
          n: '',
          u: ''
        }
      }
    },
    created() {
      //监听播放歌曲变化
      broadcast.listen('changemusic33', (data) => {
        alert(JSON.stringify(data))
      })
      plusReady(this.plusReady)
    },
    methods: {
      plusReady() {
        //获取歌曲列表
        dj.getList().then(list => {
          this.list = list
        }).catch(err => {
          alert(err.message)
        })
      },
      onTap(o, i) {
        this.index = i
        let url = 'music_play.html',
          w = plus.webview.getWebviewById(url)
        if (!w) {
          cache.data = this.indexMusic
          w = plus.webview.create(url, url)
          w.addEventListener('titleUpdate', () => {
            w.show('pop-in', 250)
          })
        } else if (o.s === this.indexMusic.s) {
          w.show('pop-in', 250)
        } else {
          this.send()
        }
      },
      send() {
        broadcast.send('changemusic', {
          id: "sssssawawda"
        }, { ids: ['music_play.html'] })
      }
    },
    watch: {
      indexMusic() {
        this.send()
      }
    }

  }

</script>