<template>
  <div id="Usetting">
    <mu-linear-progress v-show='loading' />
    <mu-appbar :title="title"  slot="center">
      <mu-icon-button  icon="arrow_back_ios" slot="left" @click='close' />
      <mu-icon-button  slot="right"/>
    </mu-appbar>
      <div id="changeEmail" v-if="typeS==2">
        <h5>更换绑定的手机号之后可以用新手机号及当前密码登录</h5>
        <div>
          <mu-text-field label="请输入原手机号" type="number" @textOverflow="handleInputOverflow(1)" :maxLength="11" class="inputC" fullWidth  :errorText="errorText1"  v-model="oldPhone" labelFloat/>
          <mu-raised-button :disabled="VCdisabled"  :label="VerificationCode"  @click="sendMobileCodeNew()" class="getAZM demo-raised-button"/><br/>
          <mu-text-field label="验证码" type="number"  @textOverflow="handleInputOverflow(2)" :maxLength="6" class="inputC mt15-" fullWidth :errorText="errorText2" v-model="mobile_code1" labelFloat/><br/>
        </div>
        <mu-raised-button class="quere mt10" @click="toggle()" label="下一步" fullWidth />
      </div>
      <div id="changeEmail" v-if="typeS==1">
          <div>
            <mu-text-field label="请输入手机号" type="number" @textOverflow="handleInputOverflow(3)" :maxLength="11" class="inputC " fullWidth :errorText="errorText3" v-model="oldPhone" labelFloat/>
            <mu-raised-button :disabled="VCdisabled"  :label="VerificationCode" style="top:50px!important"  @click="sendMobileCodeNew()" class="getAZM demo-raised-button"/><br/>
            <mu-text-field label="验证码" type="number"  @textOverflow="handleInputOverflow(4)" :maxLength="6" class="inputC mt15-" fullWidth :errorText="errorText4" v-model="mobile_code1"  labelFloat/><br/>
          </div>
          <mu-raised-button class="quere mt10" @click="bindingMobile()" label="立即绑定" fullWidth />
      </div>
     <template>
      <div>
        <mu-drawer right :open="openChouti" @close="toggle()" width="100%">
          <div id="changeEmail" >
            <h5>更换绑定的手机号之后可以用新手机号及当前密码登录</h5>
            <div>
              <mu-text-field label="请输入新手机号" type="number" @textOverflow="handleInputOverflow(3)" :maxLength="11" class="inputC " fullWidth :errorText="errorText3" v-model="newPhone" labelFloat/>
              <mu-raised-button :disabled="VCdisabled"  :label="VerificationCode" @click="sendMobileCodeNew()" class="getAZM demo-raised-button"/><br/>
              <mu-text-field label="验证码" type="number"  @textOverflow="handleInputOverflow(4)" :maxLength="6" class="inputC mt15-" fullWidth :errorText="errorText4" v-model="mobile_code2"  labelFloat/><br/>
            </div>
            <mu-raised-button class="quere mt10" @click="replaceMobile()" label="立即绑定" fullWidth />
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
import Broadcast from 'common/js/ning/Broadcast.js';
import Cache from 'common/js/Base/Cache.js';
import axios from "axios";
import baseURL from '../../../api/IPconfig.js';
import md5 from '../../../api/md5.js';
import sign from '../../../api/sign.js';

const broadcast = new Broadcast();
export default {
  data() {
    return {
      title:"更换手机号",
      toast:false,
      typeS:1,
      openChouti:false,
      loading:false,
      errorText1:'',
      errorText2:'',
      errorText3:'',
      errorText4:'',
      oldPhone:'',
      newPhone:'',
      mobile_code1:'',
      mobile_code2:'',
      VCdisabled:false,
      VerificationCode:"发送验证码",
      VCtime:60,
      Stime:'',
      regex:/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
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
      this.title = this.cw.title;
      this.typeS = this.cw.typeS;
      plus.webview.currentWebview().show('slide-in-right', 250);
      plus.nativeUI.closeWaiting();
      this.token = plus.storage.getItem('token') ? plus.storage.getItem('token') : '';
      this.getMemberInfo();
    },
    //获取用户基本信息
    getMemberInfo() {
      let parmas={
        token:this.token,
      }
      parmas = sign.signAfterObj(parmas);
      this.loading = true;
      this.$api.get(baseURL.appapi_v2+'Userinfo/getMemberInfo', parmas, response => {
        this.loading = false;
        this.userInfo=response.data;
        this.oldPhone=this.userInfo.mobile;
        if(this.oldPhone==""||this.oldPhone==undefined){
            this.title = "绑定手机号";
            this.typeS = 1;
        }
      },
      failure => {
        this.loading = false;
        this.showToast(failure.err_msg);
      })
    },
    //验证码倒计时
    VerificationCodeFun(){
        if(this.VCtime>0){
          this.VCdisabled=true;
          this.VerificationCode=this.VCtime+"s";
          this.VCtime--
          this.Stime =setTimeout(()=>{
            this.VerificationCodeFun()
          },1000)
        }else{
           this.VCtime=60;
           this.VCdisabled=false;
           this.VerificationCode="发送验证码";
        }
    },
    //获取验证码
    sendMobileCodeNew() {
      this.clearInfo();
      if(this.typeS==1){
        if(!this.oldPhone){
          console.log(this.oldPhone)
          this.showToast("请输入手机号");
          return
        }
        if(!this.regex.test(this.oldPhone)){
          this.showToast("请输入正确手机号");
          return
        }
        var parmas={
          mobile:this.oldPhone,// string	Y	手机号
          // mobile_code:this.oldPhone,//	string	Y	手机动态码
          mobile_sign: md5(md5(this.oldPhone)+'M123456'),//	string	Y	手机号加密后字符串 md5(md5('手机号').M123456)
          token:this.token,//	string	N	用户token
          // mobile_code_type:5,//	string	Y	动态码类型：5
          type:4,//:this.oldPhone,//	int	Y	5	类型[1]手机号动态登录[2]注册绑定手机号[3]找回密码[4]个人中心绑定手机[5]更改认证手机
          access_sign:"mysipo",//	string	Y	密匙为: mysipo
      }
      }else{
        if(this.openChouti){
          if(!this.newPhone){
            console.log(this.newPhone)
            this.showToast("请输入新手机号");
            return
          }
         if(!this.regex.test(this.newPhone)){
          this.showToast("请输入正确手机号");
          return
         }
          var parmas={
            mobile:this.newPhone,// string	Y	手机号
            // mobile_code:this.oldPhone,//	string	Y	手机动态码
            mobile_sign: md5(md5(this.newPhone)+'M123456'),//	string	Y	手机号加密后字符串 md5(md5('手机号').M123456)
            token:this.token,//	string	N	用户token
            // mobile_code_type:5,//	string	Y	动态码类型：5
            type:6,//:this.oldPhone,//	int	Y	5	类型[1]手机号动态登录[2]注册绑定手机号[3]找回密码[4]个人中心绑定手机[5]更改认证手机
            access_sign:"mysipo",//	string	Y	密匙为: mysipo
          }
        }else{
          if(!this.oldPhone){
            this.showToast("请输入手机号");
            return
          }
          if(!this.regex.test(this.oldPhone)){
          this.showToast("请输入正确手机号");
          return
         }
          var parmas={
            mobile:this.oldPhone,// string	Y	手机号
            // mobile_code:this.oldPhone,//	string	Y	手机动态码
            mobile_sign: md5(md5(this.oldPhone)+'M123456'),//	string	Y	手机号加密后字符串 md5(md5('手机号').M123456)
            token:this.token,//	string	N	用户token
            // mobile_code_type:5,//	string	Y	动态码类型：5
            type:5,//:this.oldPhone,//	int	Y	5	类型[1]手机号动态登录[2]注册绑定手机号[3]找回密码[4]个人中心绑定手机[5]更改认证手机
            access_sign:"mysipo",//	string	Y	密匙为: mysipo
          }
        }
      }
      this.loading = true;
      console.log(JSON.stringify(parmas));
      this.$api.get(baseURL.api_v1+'Service/sendMobileCode', parmas, response => {
        this.loading = false;
        this.showToast("验证码已发送，请稍等");
        this.VerificationCodeFun()
      },
      failure => {
        this.loading = false;
        this.showToast(failure.err_msg);
      })
    },
    //验证手机动态码
    verifyMobileCode() {
      this.clearInfo();
      if(!this.oldPhone){
        this.showToast("请输入原手机号");
         return
      }
       if(!this.regex.test(this.oldPhone)){
          this.showToast("请输入正确手机号");
          return
      }
      if(!this.mobile_code1){
        this.showToast("请输入验证码");
         return
      }
      this.loading = true;
      let parmas={
        mobile:this.oldPhone,// string	Y	手机号
        code:this.mobile_code1,//	string	Y	动态码
        // mobile_code:this.oldPhone,//	string	Y	手机动态码
        // mobile_sign: md5(md5(this.oldPhone)+'M123456'),//	string	Y	手机号加密后字符串 md5(md5('手机号').M123456)
        token:this.token,//	string	N	用户token
        // mobile_code_type:5,//	string	Y	动态码类型：5
        type:5,//:this.oldPhone,//	int	Y	5	类型[1]手机号动态登录[2]注册绑定手机号[3]找回密码[4]个人中心绑定手机[5]更改认证手机
        // access_sign:"mysipo",//	string	Y	密匙为: mysipo
      }
      parmas = sign.signAfterObj(parmas);
      this.$api.get(baseURL.api_v1+'Userregister/verifyMobileCode', parmas, response => {
        clearTimeout(this.Stime)
        this.VCdisabled=false;
        this.VerificationCode="发送验证码";
        this.VCtime=60;
        this.openChouti = true;
        this.loading = false;
        
      },
      failure => {
        this.loading = false;
        this.showToast(failure.err_msg);
      })
    },
    //绑定手机号
    bindingMobile() {
      this.clearInfo();
      if(!this.oldPhone){
        this.showToast("请输入新手机号");
        return
      }
      if(!this.regex.test(this.oldPhone)){
          this.showToast("请输入正确手机号");
          return
      }
      if(!this.mobile_code1){
        this.showToast("请输入验证码");
        return
      }
      let parmas={
        mobile:this.oldPhone,// string	Y	手机号
        code:this.mobile_code1,//	string	Y	动态码
        mobile_sign: md5(md5(this.oldPhone)+'M123456'),//	string	Y	手机号加密后字符串 md5(md5('手机号').M123456)
        token:this.token,//	string	N	用户token
      }
      parmas = sign.signAfterObj(parmas);
      this.loading = true;
      console.log(parmas);
      this.$api.get(baseURL.api_v1+'Userinfo/bindingMobile', parmas, response => {
         this.showToast("手机号绑定成功");
         broadcast.send('changemusic2', {
            data: this.courseData
         }, { ids: ['UInformation.html'] })
         setTimeout(() => {  this.close() }, 1000)
      },
      failure => {
        this.loading = false;
        this.showToast(failure.err_msg);
      })
    },
    //修改绑定手机号
    replaceMobile() {
      this.clearInfo();
      if(!this.newPhone){
        this.showToast("请输入新手机号");
        return
      }
      if(!this.regex.test(this.newPhone)){
          this.showToast("请输入正确手机号");
          return
      }
      if(!this.mobile_code2){
        this.showToast("请输入验证码");
        return
      }
      let parmas={
        mobile:this.newPhone,// string	Y	手机号
        mobile_code:this.mobile_code2,//	string	Y	动态码
        mobile_sign: md5(md5(this.newPhone)+'M123456'),//	string	Y	手机号加密后字符串 md5(md5('手机号').M123456)
        token:this.token,//	string	N	用户token
      }
      parmas = sign.signAfterObj(parmas);
      this.loading = true;
      console.log(JSON.stringify(parmas));
      this.$api.get(baseURL.api_v1+'Userinfo/replaceMobile', parmas, response => {
         this.showToast("手机号修改绑定成功");
         setTimeout(() => {  this.close() }, 1000)
      },
      failure => {
        this.loading = false;
        this.showToast(failure.err_msg);
      })
    },
    //更新抽屉
    toggle (num) {
 
      this.verifyMobileCode();
    },
    //提示
    showToast (mag) {
        this.toastMasege=mag;
        this.toast = true;
        if (this.toastTimer) clearTimeout(this.toastTimer)
        this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
    },
    //input校验
    handleInputOverflow (isOverflow) {
      if(isOverflow==1){
        this.errorText1 = isOverflow ? '手机号为11位哦' : ''
      }else if(isOverflow==2){
        this.errorText2 = isOverflow ? '验证码为6位哦' : ''
      }else if (isOverflow==3){
        this.errorText3 = isOverflow ? '手机号为11位哦' : ''
      }else if (isOverflow==4){
        this.errorText4 = isOverflow ? '验证码为6位哦' : ''
      }
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
</style>