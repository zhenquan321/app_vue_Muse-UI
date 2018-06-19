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
    <div class="bgMain">
        <img src="../static/main.png" />
    </div>
    <div class="tabCards">
      <div >
        <mu-flexbox>
            <mu-flexbox-item class="flex-demo">
                <div class="tabCard">
                  <span :class="tabActive==1 ? 'active' : '' ">
                    专利法
                  </span>
                </div>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo">
                <div class="tabCard">
                    <span :class="tabActive==2 ? 'active' : '' ">
                      相关法
                    </span>
                </div>
            </mu-flexbox-item>
          </mu-flexbox>
      </div>
       <mu-divider/>
       <div class="productsCard"> 
          <mu-row gutter>
            <mu-col  class="mt10" width="50" tablet="30" desktop="25">
              <div class="product">
                <div class="imgCard">
                    <img src="../static/jiexiCard.png" alt="">
                    <span>2018</span>
                </div>
                <div class="jiage">
                    价格：<span>￥</span>19.9  
                    <mu-flat-button v-show="false" label="购买" class="demo-flat-button"/>
                    <mu-flat-button v-show="true" label="查看" class="demo-flat-button haveGm"/>
                </div>
              </div>
            </mu-col>
           <mu-col  class="mt10" width="50" tablet="30" desktop="25">
              <div class="product">
                <div class="imgCard">
                    <img src="../static/jiexiCard.png" alt="">
                    <span>2018</span>
                </div>
                <div class="jiage">
                    价格：<span>￥</span>19.9  
                    <mu-flat-button v-show="true" label="购买" class="demo-flat-button"/>
                    <mu-flat-button v-show="false" label="查看" class="demo-flat-button haveGm"/>
                </div>
              </div>
            </mu-col>
            <mu-col  class="mt10" width="50" tablet="30" desktop="25">
              <div class="product">
                <div class="imgCard">
                    <img src="../static/jiexiCard.png" alt="">
                    <span>2018</span>
                </div>
                <div class="jiage">
                    价格：<span>￥</span>19.9  
                    <mu-flat-button v-show="true" label="购买" class="demo-flat-button"/>
                    <mu-flat-button v-show="false" label="查看" class="demo-flat-button haveGm"/>
                </div>
              </div>
            </mu-col>
            <mu-col  class="mt10" width="50" tablet="30" desktop="25">
              <div class="product">
                <div class="imgCard">
                    <img src="../static/jiexiCard.png" alt="">
                    <span>2018</span>
                </div>
                <div class="jiage">
                    价格：<span>￥</span>19.9  
                    <mu-flat-button v-show="true" label="购买" class="demo-flat-button"/>
                    <mu-flat-button v-show="false" label="查看" class="demo-flat-button haveGm"/>
                </div>
              </div>
            </mu-col>
          </mu-row>
          <div class="wzGoma">
              <mu-raised-button label="5折购买专利法全部解析精讲" class="demo-raised-button " primary/>
          </div>
       </div>
    </div>
    <div class="laoshi">
      <img src="../static/janjie.png" alt="">
    </div>
    <!-- 下拉刷新 -->
    <!-- <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="up" :loadingText='""' /> -->
    <template>
      <div>
        <mu-dialog :open="dialog" title="提示" @close="closeAlert">
          {{AlertMag}}
          <mu-flat-button slot="actions" primary @click="closeAlert(1)" label="确定"/>  
        </mu-dialog>
      </div>
    </template>
    <div class="goumaiBut">
      <mu-flexbox>
        <mu-flexbox-item class="flex-demo mr0 ml0">
          <mu-flat-button label="" class="demo-flat-button" primary/>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo mr0 ml0">
          <mu-flat-button label="" class="demo-flat-button" primary/>
        </mu-flexbox-item>
      </mu-flexbox>
    </div>
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
      list: [],
      AlertMag:'非常抱歉~，当前课程为直播课，开发小哥正在紧急开发APP直播系统中，如着急，请转至电脑端查看！',
      userid:"",
      index: -1,
      loading: false,
      tabActive:1,
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
          this.openAlert("抱歉，亲~！当前课程暂不支持APP播放，请前往网站观看~")
          //腾讯云----在不跳转
          // let page = "../../view/video/videoTX.html",
          // ow = plus.webview.create(
          //   page,
          //   page,
          //   {
          //     popGesture: "close"
          //   },
          //   {
          //     videoData: response.data.data,
          //   }
          // );
          // ow.onloading = () => {
          //   plus.nativeUI.showWaiting();
          //   // ow.show("pop-in", 250);
          // };
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
.wzGoma{
  text-align: center;
  button{
    background-color: #ff6900;
    margin: 25px 0;
    font-weight: 600;
    border-radius: 4px;
  }
}
.bgMain{
  img{
    width: 100%;
  }
}
.tabCards{
    background-color: #fff;
    position: relative;
    top: -54px;
    margin: 0 8px;
    border-radius: 4px;
}

.tabCard{
    height: 47px;
    text-align: center;
    line-height: 48px;
    span{
      font-size: 16px;
      color: #777;
    }
    .active{
      color: #5c7ee9;
      display: inline-block;
      border-bottom: 3px solid #5c7ee9;
      height: 100%;
      padding: 0 8px;
    }
}
.productsCard{
  padding: 5px;
  .product{
    .imgCard{
      position: relative;
      img{
        width: 100%;
      }
      span{
        display: inline-block;
        position: absolute;
        z-index: 1;
        top: 0.04rem;
        color: #fff;
        font-size: 0.3rem;
        font-weight: 600;
        left: 0.3rem;
      }
    }
  }
}
.jiage{
  color: #ff6900;
  font-size: 12px;
  margin-top: 5px;
  padding: 5px;
  span{
    font-size: 10px;
  }
  button{
    width: 62px;
    height: 26px;
    border: 1px solid #ff6900;
    color: #ff6900;
    float: right;
    display: inline-block;
    /* line-height: 30px; */
    min-width: auto;
    padding-top: 2px;
    position: relative;
    top: -4px;
  }
  .haveGm{
    color: #9aabb8;
    border: 1px solid #dfe5e9;
  }
}
.laoshi{
  position: relative;
  top: -53px;
  img{
    width: 100%;
  }
}
.goumaiBut{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    background-color: #ccc;
    background: url(../static/dibu.png);
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    height: 78px;
    button{
      width: 100%;
      margin-top: 32px;
      height: 48px;
    }
}
</style>