<template>
  <div id="Usetting">
    <mu-linear-progress v-show='loading' />
    <mu-appbar title="设置"  slot="center">
      <mu-icon-button  icon="arrow_back_ios" slot="left" @click='close' />
      <mu-icon-button  slot="right"/>
    </mu-appbar>
    <div class="listCard mt20">
      <mu-list>
        <mu-list-item title="修改密码" @click="ModifyPassword()">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="更换手机号" @click="bindingPhone()">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="修改邮箱" @click="ChangeMailbox()">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
      </mu-list>
    </div>
  <div class="listCard mt20">
      <mu-list>
        <mu-list-item title="使用移动流量和WiFi播放视频" @click="onlyWifiFun('0')">
          <span slot="right" class="selrit" v-show="!onlyWifi"><i class="fa fa-check"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="仅WiFi情况下播放视频" @click="onlyWifiFun('1')">
          <span slot="right" class="selrit" v-show="onlyWifi"><i class="fa fa-check"></i></span>
        </mu-list-item>
      </mu-list>
  </div>
  <div class="listCard mt20">
      <mu-list>
        <mu-list-item title="用户协议" @click="gouserXY()">
          <span slot="right"><i class="fa fa-chevron-right"></i></span>
        </mu-list-item>
         <mu-divider />
        <mu-list-item title="关于思博" @click="goaboutsipo()">
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
   <template>
      <div>
        <mu-toast v-if="toast" :message="toastMasege" @close="hideToast"/> 
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
      toast:false,
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
      // this.list.push(...this.sf.getLocalData());
      // console.log("缓存数据哦：" + JSON.stringify(this.sf.getLocalData()));
      //获取网络数据 下拉
      this.onlyWifi =this.sf.getLocalData()
      this.index = 1;
    },
    plusReady() {
      this.cw = plus.webview.currentWebview();
      setTimeout(function () { 
        plus.webview.currentWebview().show('slide-in-right', 250);
        plus.nativeUI.closeWaiting();
      }, 250);
      this.token = plus.storage.getItem('token') ? plus.storage.getItem('token') : '';
      this.onlyWifi2 = plus.storage.getItem('onlyWifi');
      if(this.onlyWifi2=="0"){
        this.onlyWifi=false;
      }else{
        this.onlyWifi=true;
      };
      // plus.key.addEventListener('backbutton', ()=>{
		  //   if(this.openChouti){
      //     this.openChouti=false;
      //     plus.webview.create('Usetting.html',
      //     {
      //       popGesture:"none"
      //     }
      //     );
      //     return
      //   }else{
      //     this.close();
      //   }
      // }, true);
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
        let page = "../../member/member_login.html";
        let ow = plus.webview.create(
            page,
            page,
            {
              popGesture: "close"
            },
            {
            }
          );
          ow.onloading = () => {
            plus.nativeUI.showWaiting();
            // ow.show("pop-in", 250);
          };
    },
    //仅wifi下播放
    onlyWifiFun(type){
      plus.storage.setItem("onlyWifi",type);
      this.onlyWifi2 = plus.storage.getItem('onlyWifi');
      if(this.onlyWifi2=="0"){
        this.onlyWifi=false;
        this.showToast("已设置为使用移动流量和WiFi播放视频")
      }else{
        this.onlyWifi=true;
        this.showToast("已设置为仅WiFi情况下播放视频")
      }
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
    //跳转关于思博
    goaboutsipo(){
      let page = "../../member/aboutsipo.html";
      let ow = plus.webview.create(
          page,
          page,
          {
            popGesture: "close"
          },
          {
          }
        );
        ow.onloading = () => {
          plus.nativeUI.showWaiting();
          // ow.show("pop-in", 250);
        };
    },
    //跳转用户协议
    gouserXY(){
      let page = "../../href_link.html";
      let ow = plus.webview.create(
          page,
          page,
          {
            popGesture: "close"
          },
          {
            title: '思博APP使用协议',
				    httpurl: 'http://app.h5.test.mysipo.com/index/Setting/agreement'
          }
        );
        ow.onloading = () => {
          plus.nativeUI.showWaiting();
          // ow.show("pop-in", 250);
        };
    },
    //修改手机号
    bindingPhone(){
      let page = "ChangePhoneNum.html";
      let ow = plus.webview.create(
        page,
        page,
        {
          popGesture: "close"
        },
        {
          title:"修改手机号",
          typeS:2,
        }
      );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
    },
    //修改邮箱
    ChangeMailbox(){
      let page = "ChangeMailbox.html";
      let ow = plus.webview.create(
        page,
        page,
        {
          popGesture: "close"
        },
        {
          title:"修改邮箱",
          typeS:2,
        }
      );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
    },
    //修改密码
    ModifyPassword(){
      let page = "ModifyPassword.html";
      let ow = plus.webview.create(
        page,
        page,
        {
          popGesture: "close"
        },
        {
        }
      );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
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