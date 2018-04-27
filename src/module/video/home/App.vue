<template  >
  <!--<div>
    <mu-list>
      <mu-list-item v-for='o,i of list' :title="o.title" :describeText="o.excerpt" @click='onClick(o)'>
        <mu-avatar :src="o.thumb" slot="leftAvatar" />
      </mu-list-item>
    </mu-list>
    <mu-divider/>
  </div>-->
  <div class="demo-infinite-container bgf0f1f4" id="courseList">
    <div class="Secard">
      <mu-tabs :value="activeTab" @change="handleTabChange">
        <mu-tab value="tab1" title="课程"/>
        <mu-tab value="tab2" title="系列课"/>
      </mu-tabs>
    </div>
   <div class="" v-if="activeTab === 'tab1'">
      <mu-list id="KClist" class="pt0">
          <div v-for='(o,i) in list'>
            <mu-list-item :title="o.title" :describeText="o.tname"  @click='onClick(o)'>
              <mu-avatar :src="o.coverpath" slot="leftAvatar" />
            </mu-list-item>
          </div>
      </mu-list>
    </div>
    <div  v-if="activeTab === 'tab2'">
      <mu-list id="KClist" class="pt0">
        <div v-for='(o,i) in list'>
          <mu-list-item :title="o.title" :describeText="o.ser_speaker" @click="open('right')">
            <mu-avatar :src="o.coverpath" slot="leftAvatar" />
          </mu-list-item>
        </div>
      </mu-list>
    </div>
    <!-- 下拉刷新 -->
    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="up" :loadingText='""' />
    <mu-popup position="right" popupClass="demo-popup-right" :open="rightPopup" @close="close('right')" >
        <mu-list id="KClist2" class="pt0">
          <div v-for='(o,i) in list3'>
            <mu-list-item :title="o.title" :describeText="o.tname" @click="open('right')">
              <mu-avatar :src="o.coverpath" slot="leftAvatar" />
            </mu-list-item>
          </div>
        </mu-list>
    </mu-popup>
  </div>
</template>

<script>
import { domReady, plusReady } from "common/js/ning/index.js";
import SF from "common/js/App/SFArticle.js";
import Broadcast from 'common/js/ning/Broadcast.js';
import Cache from 'common/js/Base/Cache.js'
const broadcast = new Broadcast()
export default {
  data() {
    return {
      list: [
        {
          title:"2018名师讲解训练班：相关法",
          tname:'李老虎是',
          coverpath:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
          id:794,
        },
      ],
      list2: [
        {
          ser_title:"2018名师讲解训练班：相关法",
          ser_id:'666',
          coverpath:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
          ser_speaker:'学院讲师',
        },
      ],
      list3: [
        {
          title:"2018名师讲解训练班：相关法",
          tname:'李老虎是',
          coverpath:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
          id:794,
        },
      ],
      index: -1,
      loading: false,
      scroller: null,
      activeTab:'tab1',
      rightPopup: false,
      num:2,
    };
  },
  created() {
    broadcast.listen('changemusic2', (data) => {
        this.index = data.id
        alert(JSON.stringify(data));
     })
    this.ready();
    plusReady(this.plusReady);
  },
  mounted() {
    this.scroller = this.$el;
  },
  methods: {
    ready() {
      //读取缓存
      this.sf = new SF();
      this.list.push(...this.sf.getLocalData());
      console.log("缓存数据哦：" + JSON.stringify(this.sf.getLocalData()));
      //获取网络数据 下拉
      this.index = 1;
    },
       //网络切换
    handleTabChange (val) {
        this.activeTab = val;
    },
    plusReady() {
      this.cw = plus.webview.currentWebview();
    },
    onClick(item) {
      let page = "courseDetails.html",
        ow = plus.webview.create(
          page,
          page,
          {
            popGesture: "close"
          },
          {
            url: item.url,
            title: item.title
          }
        );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
    },
    getNetData(isDwon,num) {
      const parmas={
        uid:'165319',
        type:num,
        is_cache:false,
      }
      let url = "http://sapi.test.mysipo.com/api_v1/MyCenter/courseList";
      this.loading = true;
      this.$http.get(url,{params:params})
        .then(
          res => {
            let data = res.body;
            data = data.result.data;
            this.loading = false;
            if (isDwon) {
              //去重 新数据在前
              this.list = Array.from(new Set(data, this.list));
              //保存缓存数据 只保存最新的data
              this.sf.setLocalData(data);
            } else {
              this.list.push(...data);
            }
          },
          e => {
            this.loading = false;
            console.log(JSON.stringify(e));
          }
        );
    },
    //下拉
    down() {
      this.index = 1;
    },
    up() {
      this.index++;
    },
    open (position) {
      this[position + 'Popup'] = true
    },
    close (position) {
      this[position + 'Popup'] = false
    }
  },
  watch: {
    index(n, o) {
      this.getNetData(n === 1 || n < o,this.num);
    }
  }
};
</script>
<style lang="less">
.mu-item-text {
  max-height: 18px !important;
}
.demo-infinite-container {
  width: 100%;
  position: fixed;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.mu-popup{
  width: 80%;
  height: 100%;
  background-color:#f0f1f4!important;
  border-left: 2px solid #1fdec2; 
}
</style>