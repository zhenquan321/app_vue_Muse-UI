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
    <mu-linear-progress  v-show='loading' />
    <div class="Secard">
      <mu-tabs :value="activeTab" @change="handleTabChange">
        <mu-tab value="tab1" title="课程"/>
        <mu-tab value="tab2" title="系列课"/>
      </mu-tabs>
    </div>
   <div class="" v-show="activeTab === 'tab1'">
      <mu-list id="KClist" class="pt0">
          <div v-for='(o,i) in list'>
            <mu-list-item :title="o.title" :describeText="o.tname"  @click='onClick(o)'>
              <mu-avatar :src="o.coverpath" slot="leftAvatar" />
            </mu-list-item>
          </div>
      </mu-list>
       <div class="h600p" v-show="noCase">
        <mu-card-media class="h100">
          <img  style="width:3"  src="../static/img/zwkc.png" />
        </mu-card-media>
      </div>
    </div>
    <div  v-show="activeTab === 'tab2'">
      <mu-list id="KClist" class="pt0">
        <div v-for='(o,i) in list2'>
          <mu-list-item :title="o.ser_title" :describeText="o.ser_speaker" @click="open('right',o)">
            <mu-avatar :src="o.coverpath" slot="leftAvatar" />
          </mu-list-item>
        </div>
      </mu-list>
      <div class="h600p" v-show="noCase">
        <mu-card-media class="h100">
          <img  style="width:3"  src="../static/img/zwkc.png" />
        </mu-card-media>
      </div>
    </div>
  
    <!-- 下拉刷新 -->
    <!-- <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="up" :loadingText='""' /> -->
    <mu-popup position="right" popupClass="demo-popup-right" :open="rightPopup" @close="close('right')" >
      <div class="leftGun">
        <mu-list id="KClist2" class="pt0">
          <div v-for='(o,i) in list3'>
            <mu-list-item :title="o.title" :describeText="o.tname"  @click='onClick(o)'>
              <mu-avatar :src="o.coverpath" slot="leftAvatar" />
            </mu-list-item>
          </div>
        </mu-list>
      </div>
    </mu-popup>
    <template>
      <div>
        <mu-dialog :open="dialog" title="提示" @close="closeAlert">
          {{AlertMag}}
          <mu-flat-button slot="actions" primary @click="closeAlert(1)" label="确定"/>  
        </mu-dialog>
      </div>
    </template>
  </div>
</template>

<script>
import { domReady, plusReady } from "common/js/ning/index.js";
import SF from "common/js/App/SFArticle.js";
import Broadcast from 'common/js/ning/Broadcast.js';
import Cache from 'common/js/Base/Cache.js';
import axios from "axios";
import baseURL from '../../../api/IPconfig.js';
import $ from '../../../api/jquery-vendor';


export default {
  data() {
    return {
      list: [
        // {
        //   title:"2018名师讲解训练班：相关法",
        //   tname:'李老虎是',
        //   coverpath:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
        //   id:794,
        // },
      ],
      list2: [
        // {
        //   ser_title:"2018名师讲解训练班：相关法",
        //   ser_id:'666',
        //   coverpath:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
        //   ser_speaker:'学院讲师',
        // },
      ],
      list3: [
        // {
        //   title:"2018名师讲解训练班：相关法",
        //   tname:'李老虎是',
        //   coverpath:"http://s.mysipo.com/manage/Uploads/Picture/2016-11-04/581bf1bbec660.jpg",
        //   id:794,
        // },
      ],
      AlertMag:'非常抱歉~，当前课程为直播课，开发小哥正在紧急开发APP直播系统中，如着急，请转至电脑端查看！',
      userid:"",
      index: -1,
      loading: false,
      scroller: null,
      activeTab:'tab1',
      noCase:false,
      rightPopup: false,
      num:3,
      dialog:false,
    };
  },
  // created() {
  //   // broadcast.listen('changemusic2', (data) => {
  //   //     this.index = data.id
  //   //     alert(JSON.stringify(data));
  //   // })
  //   this.ready();
  //   plusReady(this.plusReady);
  // },
  created() {
    this.ready();
    plusReady(this.plusReady);
  },
  mounted() {
    this.scroller = this.$el;
  },
  methods: {
    plusReady() {
      this.cw = plus.webview.currentWebview();
      this.userid = plus.storage.getItem('userid') ? plus.storage.getItem('userid') : '';//'165319'
      // this.userid ='189837';
      this.getNetData(1,this.num);
    },
    ready() {
    //读取缓存
      // this.sf = new SF();
      // this.list.push(...this.sf.getLocalData());
      // console.log("缓存数据哦：" + JSON.stringify(this.sf.getLocalData()));
      //获取网络数据 下拉
      this.index = 1;
    },
    //网络切换
    handleTabChange (val) {
        this.activeTab = val;
        // console.log(val)
        if(val=="tab1"){
          this.getNetData(1,3)
        }else if(val=="tab2"){
          this.getNetData(1,2)
        }
    },
    onClick(item) {
      var parmas={
        uid:this.userid,
        pk:item.id,
      }
      this.$api.get(baseURL.sapi+'Course/details', parmas, response => {
        // console.log(JSON.stringify(response.data));
        if(item.type==1){
         //CC视屏
          let page = "courseDetailsZb.html";
          let ow = plus.webview.create(
            page,
            page,
            {
              popGesture: "close"
            },
            {
              videoData: response.data,
            }
          );
          ow.onloading = () => {
            plus.nativeUI.showWaiting();
            // ow.show("pop-in", 250);
          };
          // this.openAlert('抱歉,亲~！当前课程为直播课，开发小哥正在紧急开发APP直播系统中，请前往网站观看~')
          return
        }
        if(response.data.vData.video_type==0){
          // this.openAlert("抱歉，亲~！当前课程暂不支持APP播放，请前往网站观看~")
          //腾讯云----在不跳转
          let page = "courseDetailsTX.html",
          ow = plus.webview.create(
            page,
            page,
            {
              popGesture: "close"
            },
            {
              videoData: response.data,
            }
          );
          ow.onloading = () => {
            plus.nativeUI.showWaiting();
            // ow.show("pop-in", 250);
          };
        }else if(response.data.vData.video_type==1){
          //CC视屏
          let page = "courseDetails.html";
          let ow = plus.webview.create(
            page,
            page,
            {
              popGesture: "close"
            },
            {
              videoData: response.data,
            }
          );
          ow.onloading = () => {
            plus.nativeUI.showWaiting();
            // ow.show("pop-in", 250);
          };
         };
        },
        failure => {
          this.loading = false;
          // console.log(JSON.stringify(failure))
        })
    },
    //alert
    openAlert (AlertMag) {
      this.AlertMag=AlertMag;
      this.dialog = true;
    },
    closeAlert () {
      this.dialog = false;
    },
    getNetData(isDwon,num) {
      this.loading = true;
      const parmas={
        uid:this.userid,
        type:num,
        is_cache:false,
      }
      this.$api.get(baseURL.sapi+'MyCenter/courseList', parmas, response => {
        this.loading = false;
        // console.log(JSON.stringify(response.data));
        this.noCase=false;
        if(num==2){
          this.list2=response.data.seriesData||response.data.datainfo;
          // console.log(this.list)
        }else if(num==3){
          this.list=response.data.datainfo;
          // console.log(this.list)
        }
      },
      failure => {
        this.loading = false;
        this.noCase=true;
        // console.log(JSON.stringify(failure))
      })
      // console.log("列表参数值："+JSON.stringify(parmas));
      // let url = "http://sapi.test.mysipo.com/api_v1/";
      // this.$api.get("MyCenter/courseList",{
      //   params: parmas
      // }).then(response => {
      //   this.loading = false;
      //   console.log(JSON.stringify(response.data));
      //   if(response.data.code==200||response.data.code==0){
      //     this.noCase=false;
      //     if(num==2){
      //       this.list2=response.data.data.datainfo;
      //       console.log(this.list)
      //     }else if(num==3){
      //       this.list=response.data.data.datainfo;
      //       console.log(this.list)
      //     }
      //   }else if(response.code==1006){
      //     //用户未登录相关操作
      //   }else if(response.code==1105){
      //     this.noCase=true;
      //   }
      // })
      // .catch(error => {
      //   console.log(error);
      // });
      // this.$http.get(url,{params:params})
      //   .then(
      //     res => {
      //       let data = res.body;
      //       data = data.result.data;
      //       this.loading = false;
      //       if (isDwon) {
      //         //去重 新数据在前
      //         this.list = Array.from(new Set(data, this.list));
      //         //保存缓存数据 只保存最新的data
      //         this.sf.setLocalData(data);
      //       } else {
      //         this.list.push(...data);
      //       }
      //     },
      //     e => {
      //       this.loading = false;
      //       console.log(JSON.stringify(e));
      //     }
      //   );
    },

    //下拉
    down() {
      this.index = 1;
    },
    up() {
      this.index++;
    },
    open (position,data) {
      if(data){
        // console.log(data);
        this.list3=data.courseData;
      }
      this[position + 'Popup'] = true
    },
    close (position) {
      this[position + 'Popup'] = false
    }
  },
  watch: {
    // index(n, o) {
    //   this.getNetData(n === 1 || n < o,this.num);
    // }
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
.leftGun{
  height: 100%;
  overflow: auto;
}
.Secard{
  padding: 10px;
  padding-bottom: 0px;
}
.mu-ripple-wrapper{
  color:#1fdec2;
}
.mu-card-media>img {
    width: auto!important;
    min-width: auto!important;
    height: 30%;
    margin-top: 45%;
    display: inline-block!important;
}
.h600p .mu-card-media {
  text-align: center;
}
.mu-circle-ripple, .mu-ripple-wrapper{
  height: 50px!important;
}
.mu-tab-text{
  position: relative;
  top: 1px;
}
</style>