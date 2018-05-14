<template>
  <div id="Usetting">
    <mu-linear-progress v-show='loading' />
    <mu-appbar :title="title"  slot="center">
      <mu-icon-button  icon="arrow_back_ios" slot="left" @click='close' />
      <mu-icon-button  slot="right"/>
    </mu-appbar>
    <div id="changeEmail" >
      <div>
        <mu-text-field label="原密码" class="inputC" fullWidth  :errorText="errorText1"  v-model="password_old" labelFloat/>
        <mu-text-field label="新密码"  class="inputC mt15-" fullWidth :errorText="errorText3" v-model="password_new" labelFloat/><br/>
        <mu-text-field label="确认新密码"  class="inputC mt15-" fullWidth :errorText="errorText4" v-model="password_newq" labelFloat/><br/>
      </div>
      <mu-raised-button class="quere mt10" @click="editPass()" label="立即修改" fullWidth />
    </div>
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
import Broadcast from 'common/js/ning/Broadcast.js';
import Cache from 'common/js/Base/Cache.js';
import axios from "axios";
import baseURL from '../../../api/IPconfig.js';
import md5 from '../../../api/md5.js';
import sign from '../../../api/sign.js';

const broadcast = new Broadcast()
export default {
  data() {
    return {
      title:"修改密码",
      toast:false,
      loading:false,
      password_old:'',
      password_new:'',
      password_newq:'',
      userid:'',
      szReg:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
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
    },
    plusReady() {
      this.cw = plus.webview.currentWebview();
      plus.webview.currentWebview().show('slide-in-right', 250);
      plus.nativeUI.closeWaiting();
      this.token = plus.storage.getItem('token') ? plus.storage.getItem('token') : '';
      this.userid = plus.storage.getItem('userid') ? plus.storage.getItem('userid') : '';//'165319'
    },
  //验证邮箱动态码
    editPass() {
      this.clearInfo();
      if(!this.password_old){
        this.showToast("请输入原密码");
        return
      }
      if(!this.password_new){
        this.showToast("请输入新密码");
         return
      }
      if(!this.szReg.test(this.password_new)){
        this.showToast("密码由6-21字母和数字组成，不能是纯数字或纯英文");
        return
      }
      if(!this.password_newq){
        this.showToast("请输入确认密码");
        return
      }
      if(this.password_new!=this.password_newq){
        this.showToast("两次输入的密码不相同，请检查");
        return
      }
      this.loading = true;
      let parmas={
        uid:this.userid,// string	Y	邮箱
        password_old:this.password_old,//	string	Y	动态码
        token:this.token,//	string	N	用户token
        password_new:this.password_new,//:this.oldEmail,//	int	Y	5	类型[1]邮箱动态登录[2]注册绑定邮箱[3]找回密码[4]个人中心绑定手机[5]更改认证手机
      }
      parmas = sign.signAfterObj(parmas);
      console.log(JSON.stringify(parmas))
      this.$api.get(baseURL.api_v1+'Userinfo/editPass', parmas, response => {
        this.loading = false;
        this.showToast("密码修改成功！");
        setTimeout(() => {  this.close() }, 500)
      },
      failure => {
        this.loading = false;
        this.showToast(failure.err_msg);
      })
    },
  
    //提示
    showToast (mag) {
      this.toastMasege=mag;
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
    },
    clearInfo(){
      this.errorText1 ="";
      this.errorText2 ="";
      this.errorText3 ="";
      this.errorText4 ="";
    },
    hideToast () {
        this.toast = false
        if (this.toastTimer) clearTimeout(this.toastTimer)
    },
    close() {
      this.cw.close()
    },
  },
  watch: {
   
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
.mu-drawer{
    width: 100%;
    margin-top: 48px;
    box-shadow: 0 0 0 #ccc!important;
}
.mu-text-field.has-label .mu-text-field-content{
  padding-top: 20px!important;
  padding-bottom: 12px!important;
}
.mu-text-field-help div:last-child{
  opacity: 0.00;
}
.mu-text-field.has-label .mu-text-field-label{
   top: 0px!important;
}
#Usetting .no-empty-state .mu-text-field-label {
    top: 10px!important;
    position: absolute;
}

#Usetting .focus-state .mu-text-field-label {
    top: 10px!important;
    position: absolute;
}
#changeEmail div .t50{
  top:50!important;
}
</style>