<template>
  <div>
    <mu-appbar title="真题解析精讲"  slot="right">
      <mu-icon-button  icon="arrow_back_ios" slot="left" @click='close' />
      <mu-icon-button  icon='' slot="right"  />
    </mu-appbar>
    <div class="demo-infinite-container bgf0f1f4" id="courseList">
      <mu-linear-progress  v-show='loading' />
      <div class="bgMain">
          <img src="../static/img/main.png" />
      </div>
      <div class="tabCards">
        <div >
          <mu-flexbox>
              <mu-flexbox-item class="flex-demo">
                  <div class="tabCard" @click="tabActiveFun(1)">
                    <span :class="tabActive==1 ? 'active' : '' ">
                      专利法
                    </span>
                  </div>
              </mu-flexbox-item>
              <mu-flexbox-item class="flex-demo">
                  <div class="tabCard" @click="tabActiveFun(2)">
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
              <mu-col  class="mt10" width="50" tablet="30" desktop="25" v-for="(item,key) in DataList"> 
                <div class="product">
                  <div class="imgCard">
                      <img src="../static/img/jiexiCard.png" alt="">
                      <span>{{item.years}}</span>
                  </div>
                  <div class="jiage">
                      价格：<span>￥</span><span class="jgNum">19.9</span> 
                      <mu-flat-button @click="goumai(item.years,0,tabActive)" v-show="item.buy_analysis_status==2" label="购买" class="demo-flat-button"/>
                      <mu-flat-button @click="chakan(item)" v-show="item.buy_analysis_status==1" label="查看" class="demo-flat-button haveGm"/>
                  </div>
                </div>
              </mu-col>
            </mu-row>
            <div class="wzGoma">
              <mu-raised-button  @click="goumai('',tabActive,tabActive)" :label="Btnlab1e" class="demo-raised-button " primary/>
            </div>
        </div>
      </div>
      <div class="laoshi">
        <img src="../static/img/janjie.png" alt="">
        
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
      <div  class="goumaiBut">
        <img src="../static/img/dibu.png" alt="">
        <div class="bang">
            <mu-flat-button @click="ljzxBd()" label="" class="demo-flat-button" primary/>
            
        </div>
        <div class="bang">
            <mu-flat-button @click="goumai('',3,tabActive)" label="" class="demo-flat-button" primary/>
        </div>
      </div>
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
      backList:false,
      Btnlab1e:'5折购买专利法全部解析精讲',
      num:3,
      dialog:false,
      DataList:[
            {
                "id": 20,
                "zid": 0,
                "title": "2009年专利法律知识考试",
                "type": 3,
                "style": 1,
                "mark": 150,
                "num": 100,
                "times": 150,
                "is_pay": 1,
                "years": "2009",
                "attend_number": 0,
                "testpaper_score_u": 0,
                "testpaper_score_des": "您还未做过本试卷",
                "testpaper_score": 0,
                "buy_analysis_status": 1
            },
            {
                "id": 19,
                "zid": 0,
                "title": "2008年专利法律知识考试",
                "type": 3,
                "style": 1,
                "mark": 150,
                "num": 100,
                "times": 150,
                "is_pay": 1,
                "years": "2008",
                "attend_number": 0,
                "testpaper_score_u": 0,
                "testpaper_score_des": "您还未做过本试卷",
                "testpaper_score": 0,
                "buy_analysis_status": 1
            },
            {
                "id": 18,
                "zid": 0,
                "title": "2007年专利法律知识考试",
                "type": 3,
                "style": 1,
                "mark": 150,
                "num": 100,
                "times": 150,
                "is_pay": 1,
                "years": "2007",
                "attend_number": 0,
                "testpaper_score_u": 0,
                "testpaper_score_des": "您还未做过本试卷",
                "testpaper_score": 0,
                "buy_analysis_status": 2
            },
            {
                "id": 17,
                "zid": 0,
                "title": "2006年专利法律知识考试",
                "type": 3,
                "style": 1,
                "mark": 150,
                "num": 100,
                "times": 150,
                "is_pay": 1,
                "years": "2006",
                "attend_number": 0,
                "testpaper_score_u": 0,
                "testpaper_score_des": "您还未做过本试卷",
                "testpaper_score": 0,
                "buy_analysis_status": 2
            },
             {
                "id": 17,
                "zid": 0,
                "title": "2006年专利法律知识考试",
                "type": 3,
                "style": 1,
                "mark": 150,
                "num": 100,
                "times": 150,
                "is_pay": 1,
                "years": "2006",
                "attend_number": 0,
                "testpaper_score_u": 0,
                "testpaper_score_des": "您还未做过本试卷",
                "testpaper_score": 0,
                "buy_analysis_status": 2
            },
             {
                "id": 17,
                "zid": 0,
                "title": "2006年专利法律知识考试",
                "type": 3,
                "style": 1,
                "mark": 150,
                "num": 100,
                "times": 150,
                "is_pay": 1,
                "years": "2006",
                "attend_number": 0,
                "testpaper_score_u": 0,
                "testpaper_score_des": "您还未做过本试卷",
                "testpaper_score": 0,
                "buy_analysis_status": 2
            }
        ]
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
      this.backList = this.cw.backList;
      this.userid = plus.storage.getItem('userid') ? plus.storage.getItem('userid') : '';//'165319'
      this.token = plus.storage.getItem('token') ? plus.storage.getItem('token') : '';//'165319'
      // this.userid ='189837';
      this.getTestpaperList();
      setTimeout(function () { 
        plus.webview.currentWebview().show('slide-in-right', 250);
        plus.nativeUI.closeWaiting();
      }, 450);
      setInterval(()=>{
        this.getTestpaperList();
      },2000);
      // if(this.backList){
      //   plus.key.addEventListener('backbutton', function() {
      //     let page = "../../view/questionBank/Test.html";
      //     let ow = plus.webview.create(
      //       page,
      //       page,
      //       {
      //         popGesture: "close"
      //       },
      //       {
      //         CStype:2,
      //         reload:true,
      //       }
      //     );
      //   }, false);
      // }
    },
    ready() {
    //读取缓存
      // this.sf = new SF();
      // this.list.push(...this.sf.getLocalData());
      // console.log("缓存数据哦：" + JSON.stringify(this.sf.getLocalData()));
      //获取网络数据 下拉
      this.index = 1;
    },
    openAlert (AlertMag) {
      this.AlertMag=AlertMag;
      this.dialog = true;
    },
    //关闭窗口
    close() {
      // if(this.backList){
      //   let page = "../../view/questionBank/Test.html";
      //   let ow = plus.webview.create(
      //     page,
      //     page,
      //     {
      //       popGesture: "close"
      //     },
      //     {
      //        CStype:2,
      //        reload:true,
      //     }
      //   );
      // ow.onloading = () => {
      //   plus.nativeUI.showWaiting();
      //   // ow.show("pop-in", 250);
      // };
      //   setTimeout(()=>{
      //     this.cw.close()
      //   },2000)
      // }else{
          this.cw.close()
      // }
    },
    closeAlert () {
      this.dialog = false;
    },
    tabActiveFun(num){
      this.tabActive=num;
      if(num==1){
        this.Btnlab1e="5折购买专利法全部解析精讲"
      }else{
        this.Btnlab1e="5折购买相关法全部解析精讲"
      }
      this.getTestpaperList();
    },
    //获取试卷列表
    getTestpaperList() {
      this.loading = true;
      const parmas={
        token:this.token,
        type:this.tabActive,
        module_id:3,
        is_pay:1,
        page:0,
        limit:50,
      }
      this.$api.get(baseURL.appapi_v2+'Testpaper/getTestpaperList', parmas, response => {
        this.loading = false;
        console.log(JSON.stringify(response.data));
        this.DataList=response.data.testpaper_list;
      },
      failure => {
        this.loading = false;
        this.noCase=true;
      })
    },
    //购买课程
    goumai(num,num1,num2){
      let page = "../../view/pay/payPage.html";
      let ow = plus.webview.create(
        page,
        page,
        {
          popGesture: "close"
        },
        {
          order_years: num,
          order_type:num1,
          order_analysis_type:num2,
        }
      );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
    },
    //立即咨询  百度商桥
    ljzxBd(){
      let page = "../../view/advertisement/AdWindow.html";
        let ow = plus.webview.create(
          page,
          page,
          {
            popGesture: "close"
          },
          {
           	title:"客服服务",
            httpurl: "http://p.qiao.baidu.com/cps/chat?siteId=10032863&userId=7073241",
            ad_name:"客服服务",
            ad_details:"客服服务",
            noshare:true,
          }
        );
        ow.onloading = () => {
          plus.nativeUI.showWaiting();
          // ow.show("pop-in", 250);
        };
    },
    //查看已购买
    chakan(data){
      let page = "../../view/questionBank/startTesting.html";
      let ow = plus.webview.create(
        page,
        page,
        {
          popGesture: "close"
        },
        {
          testpaper: data,
          CStype: 3,
        }
      );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
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
    // close (position) {
    //   this[position + 'Popup'] = false
    // }
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
    margin: 0.50rem 0;
    font-weight: 600;
    border-radius: 4px;
    height: 0.66rem;
    width: 4.60rem;
    font-size: 0.28rem;
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
    margin: 0 0.16rem;
    border-radius: 0.08rem;
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
        top: 0.085rem;
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
  font-size: 0.24rem;
  margin-top: 0.10rem;
  padding: 0.10rem;
  .jgNum{
    font-size: 0.30rem;
  }
  span{
    font-size: 0.2rem;
  }
  button{
    width: 1.24rem;
    height: 0.52rem;
    border: 1px solid #ff6900;
    color: #ff6900;
    float: right;
    display: inline-block;
    /* line-height: 30px; */
    min-width: auto;
    padding-top: 0.04rem;
    position: relative;
    top: -0.06rem;
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
.goumaiButBar{
  position: absolute;
  bottom: 0px;
}
#courseList .goumaiBut{
    .bang{
      display: inline-block;
      width: 49.5%;
    }
    img{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    width: 100%;
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    text-align: center;
    background-color: rgba(204, 204, 204, 0)!important;
    height: 1.65rem!important;
    box-shadow: 0 0 0 #fff!important;
    padding: 0;
    .mu-appbar-title{
      position: relative;
      top: 30px;
      padding: 0;
    }
    button{
      width: 100%;
      margin-top: 0.66rem;
      height: 1rem;
    }
}
.mu-appbar-title{
  text-align: center;
}
.mu-appbar{
   position: fixed;
}
#courseList{
  padding-top: 44px;
}
</style>