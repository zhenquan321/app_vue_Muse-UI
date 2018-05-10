<template>
  <div id="Usetting">
    <mu-linear-progress v-show='loading' />
    <mu-appbar title="设置"  slot="center">
      <mu-icon-button  icon="arrow_back_ios" slot="left" @click='closeWid' />
      <mu-icon-button  slot="right"/>
    </mu-appbar>
    <div class="listCard mt20">
      <mu-list>
        <mu-list-item title="修改密码" @click="toggle(1)">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="更换手机号" @click="toggle(2)">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="修改邮箱" @click="toggle(3)">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
      </mu-list>
    </div>
  <div class="listCard mt20">
      <mu-list>
        <mu-list-item title="使用移动流量和WiFi播放视频">
          <span slot="right" class="selrit" v-show="!onlyWifi"><i class="fa fa-check"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="仅WiFi情况下播放视频">
          <span slot="right" class="selrit" v-show="onlyWifi"><i class="fa fa-check"></i></span>
        </mu-list-item>
      </mu-list>
  </div>
  <div class="listCard mt20">
      <mu-list>
        <mu-list-item title="用户协议">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="关于思博">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
      </mu-list>
  </div>
  <div class="buttonCard">
     <mu-raised-button class="quere" @click="loginout()" label="退出登录" fullWidth/>
  </div>
  <template>
      <div>
        <mu-drawer right :open="openChouti" @close="toggle()" width="100%">
          <div v-show="selpage==1">
            <mu-appbar title="修改密码"  slot="center">
              <mu-icon-button  icon="arrow_back_ios" slot="left" @click="toggle()" />
              <mu-icon-button  slot="right"/>
            </mu-appbar>
            <div id="changeIphone" >
              <div>
                <mu-text-field label="请输入绑定邮箱" class="inputC " fullWidth errorText="sss" labelFloat/><mu-raised-button  label="获取验证码" class="getAZM demo-raised-button"/><br/>
                <mu-text-field label="验证码" class="inputC mt15-" fullWidth errorText="" labelFloat/><br/>
              </div>
              <mu-raised-button class="quere mt10" label="下一步" fullWidth/>
            </div>
          </div>
          <div v-show="selpage==2">
            <mu-appbar title="绑定手机号"  slot="center">
              <mu-icon-button  icon="arrow_back_ios" slot="left"  @click="toggle()" />
              <mu-icon-button  slot="right"/>
            </mu-appbar>
            <div id="changeEmail" >
              <h5>更换绑定的手机号之后可以用新手机号及当前密码登录</h5>
              <div>
                <mu-text-field label="请输入绑定手机号" class="inputC " fullWidth errorText="" labelFloat/><mu-raised-button  label="获取验证码" class="getAZM demo-raised-button"/><br/>
                <mu-text-field label="验证码" class="inputC mt15-" fullWidth errorText="" labelFloat/><br/>
              </div>
              <mu-raised-button class="quere mt10" label="下一步" fullWidth/>
            </div>
          </div>
          <div v-show="selpage==3">
            <mu-appbar title="绑定邮箱"  slot="center">
              <mu-icon-button  icon="arrow_back_ios" slot="left" @click="toggle()" />
              <mu-icon-button  slot="right"/>
            </mu-appbar>
            <div id="changeIphone" >
              <div>
                <mu-text-field label="请输入绑定邮箱" class="inputC " fullWidth errorText="sss" labelFloat/><mu-raised-button  label="获取验证码" class="getAZM demo-raised-button"/><br/>
                <mu-text-field label="验证码" class="inputC mt15-" fullWidth errorText="" labelFloat/><br/>
              </div>
              <mu-raised-button class="quere mt10" label="下一步" fullWidth/>
            </div>
          </div>
        </mu-drawer>
      </div>
    </template>

  </div>
</template>


<script>
import { domReady, plusReady } from "common/js/ning/index.js";
import SF from "common/js/App/SFArticle.js";
export default {
  data() {
    return {
      title:"个人主页",
      list:[],
      index:-1,
      selpage:1,
      onlyWifi:true,
      openChouti:false,
      activeIndex:1,
      bottomSheet: false,
    };
  },
  created() {
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
    plusReady() {
      this.cw = plus.webview.currentWebview();
      setTimeout(function () { 
        plus.webview.currentWebview().show('slide-in-right', 250);
        plus.nativeUI.closeWaiting();
      }, 300);
      this.token = plus.storage.getItem('token') ? plus.storage.getItem('token') : '';
      this.token ="85dec5a7719e79a192e0210c1b6a14ae";
    },
    //更新抽屉
    toggle (num) {
      this.selpage=num;
      this.openChouti = !this.openChouti;
    },
    getNetData(isDwon) {
      let url = "暂时";
      this.loading = true;
      this.$http
        .get(url, {
          // parmas,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
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
            //console.log(JSON.stringify(e));
          }
        );
    },
    //退出登录
    loginout(){
        plus.webview.hide('member_login.html');
        plus.webview.close('member_login.html');
        plus.webview.hide('view/advertisementAdvertisement.html');
        plus.webview.close('view/advertisementAdvertisement.html');
        plus.storage.removeItem('headimg');
        plus.storage.setItem("ifclose","1");
        plus.storage.removeItem('nickname');
        plus.storage.removeItem('userid');
        plus.storage.removeItem('token');
        plus.storage.setItem('xgfMRYLanswerstr','');
        plus.storage.setItem('zlfMRYLanswerstr','');
        var ifclose= plus.storage.getItem("ifclose");
        //可改为增加缓冲页
        mui.openWindow({
          id:'../../member/member_login.html',
          url:'../../member/member_login.html',
          createNew: true,
          show:{
            autoShow:false
          },
          waiting:{
            autoShow:true
          },
        });
    },


    close() {
      this.cw.close()
    },
    closeBottomSheet () {
      this.bottomSheet = false
    },
    openBottomSheet () {
      this.bottomSheet = true
    }
  },
  watch: {
    // index(n, o) {
    //   this.getNetData(n === 1 || n < o);
    // }
  }
};
</script>
<style lang="css">
.mu-appbar-title{
  text-align: center;
}
.mu-list{
  padding: 0px 0;
}
.mu-paper {
  background-color: #f0f1f4!important;
  color: rgba(0, 0, 0, 0.87);
}
.selrit{
  color: #15dbb8;
}
</style>