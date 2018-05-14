<template>
  <div >
    <mu-linear-progress v-show='loading' />
    <mu-appbar title="个人信息"  slot="center">
      <mu-icon-button  icon="arrow_back_ios" slot="left" @click='closeWid' />
      <mu-icon-button  slot="right"/>
    </mu-appbar>
    <div>
      <div class="BGcard">
        <div class="wzLeft">
          <h4>{{userInfo.username}}<span class="MaleIcon">
            <i class="fa fa-mars" v-if="userInfo.gender==1"  aria-hidden="true"></i>
            <i class="fa fa-venus" v-if="userInfo.gender==2" aria-hidden="true"></i>
            <i class="fa fa-transgender" v-if="userInfo.gender!=1&&userInfo.gender!=2"  aria-hidden="true"></i>
          </span></h4>
          <p v-if="userInfo.introduce">{{userInfo.introduce}}</p>
          <p v-if="!userInfo.introduce" class="noIntd">无个人简介</p>
        </div>
        <div class="tuRight" @click="openBottomSheet(4)">
            <img v-show="!userInfo.headimg"  src="https://bbs.mysipo.com//uc_server/avatar.php?uid=138880&size=small" alt="">
            <img v-show="userInfo.headimg"  :src="userInfo.headimg" alt="">
            <span  ><img src="../static/img/xiugai.png" alt=""></span>
        </div>
      </div>
      <template>
        <mobile-tear-sheet >
          <div class="useInfoCard">
            <mu-list >
              <mu-list-item disableRipple  title="昵称" class="nackname" > 
                <!-- @click="open" 暂时不修改昵称 -->
                <span slot="right" v-if="userInfo.nickname">{{userInfo.nickname}}</span>
                <span slot="right" v-if="!userInfo.nickname">添加昵称</span>
                <!-- <span slot="right" ><i class="fa fa-chevron-right"></i></span> -->
              </mu-list-item>
              <mu-divider />
              <mu-list-item disableRipple  title="手机号">
                <span slot="right" v-if="userInfo.mobile">{{userInfo.mobile}}</span>
                <span slot="right" v-if="!userInfo.mobile" @click="bindingPhone()">绑定手机号</span>
              </mu-list-item>
              <mu-divider />
              <mu-list-item disableRipple  title="邮箱">
                <span slot="right" v-if="userInfo.email" >{{userInfo.email}}</span>
                <span slot="right" v-if="!userInfo.email" @click="ChangeMailbox()">绑定邮箱</span>
              </mu-list-item>
              <mu-divider />
              <mu-list-item disableRipple  title="用户等级" >
                <span slot="right" v-if="userRole" @click="openBottomSheet(1)">{{userRole}}</span>
                <span slot="right" v-if="!userRole" @click="openBottomSheet(1)">设置等级</span>
                <span slot="right" @click="openBottomSheet(1)"><i class="fa fa-chevron-right"></i></span>
              </mu-list-item>
              <mu-divider />
              <mu-list-item disableRipple  title="性别">
                <span slot="right" v-if="UserGender" >{{UserGender}}</span>
                <span slot="right" v-if="!UserGender">设置性别</span>
                <!-- 性别和昵称一起暂不支持修改 -->
                <!-- <span slot="right" @click="openBottomSheet(2)"><i class="fa fa-chevron-right"></i></span> -->
              </mu-list-item>
            </mu-list>
          </div>
          <div class="useInfoCard mt10">
            <mu-list >
              <mu-list-item disableRipple  title="工作年龄" class="nackname">
                <input slot="right" class="Nage" maxlength="2"  type="nubmer" v-model="userInfo.worktime" placeholder="请输入工作年龄">
              </mu-list-item>
              <mu-divider />
              <mu-list-item disableRipple  title="职业">
                <span slot="right" v-if="Userprofessional" @click="openBottomSheet(3)">{{Userprofessional}}</span>
                <span slot="right" v-if="!Userprofessional" @click="openBottomSheet(3)">设置职业</span>
                <span slot="right" @click="openBottomSheet(3)"><i class="fa fa-chevron-right"></i></span>
              </mu-list-item>
            </mu-list>
          </div>
          <div class="useInfoCard mb10">
            <div class="zwjsCard">
              <h5>个人介绍</h5>
              <textarea  id="" v-model="userInfo.introduce"  rows="4"></textarea>
              <!-- <div></div> -->
            </div>
          </div>
        </mobile-tear-sheet>
      </template>
    </div>
   
  
    <template>
      <mu-bottom-sheet :open="bottomSheet==1" @close="closeBottomSheet">
        <mu-list @itemClick="closeBottomSheet" class="pt0 pb0">
          <mu-list-item v-for="x in user_conf_role" :title="x.value"  @click="selXla(x,1)"/>
          <mu-list-item class="mt5" title="取消"/>
        </mu-list>
      </mu-bottom-sheet>
      <mu-bottom-sheet :open="bottomSheet==2" @close="closeBottomSheet" >
        <mu-list @itemClick="closeBottomSheet" class="pt0 pb0" >
          <mu-list-item v-for="x in user_conf_gender" :title="x.value" @click="selXla(x,2)" />
          <mu-list-item class="mt5" title="取消"/>
        </mu-list>
      </mu-bottom-sheet>
      <mu-bottom-sheet :open="bottomSheet==3" @close="closeBottomSheet" >
        <mu-list @itemClick="closeBottomSheet" class="pt0 pb0" >
          <mu-list-item v-for="x in user_conf_profession" :title="x.value" @click="selXla(x,3)" />
          <mu-list-item class="mt5" title="取消"/>
        </mu-list>
      </mu-bottom-sheet>
      <mu-bottom-sheet :open="bottomSheet==4" @close="closeBottomSheet" >
        <mu-list @itemClick="closeBottomSheet" class="pt0 pb0" >
          <mu-list-item title="从相册中选择头像" @click="galleryImg()" />
          <mu-list-item class="mt5" title="取消"/>
        </mu-list>
      </mu-bottom-sheet>
    </template>
    <template>
      <div id="UIdialog">
        <mu-dialog :open="dialog"  @close="close" dialogClass="mu-dialog">
          <div class="header">
            <span @click="close" class="left">取消</span>
            <span @click="sure()" class="right">确定</span>
          </div>
          <div class="body">
            <h4><span>*</span>只允许修改一次，请谨慎修改</h4>
            <input slot="right" class="Nage"  type="nubmer" v-model="setnickname" placeholder="请输入昵称">
          </div>
        </mu-dialog>
      </div>
    </template>
    <template>
      <div v-show="tomStyle">
        <mu-toast v-if="toast" :message="toastMasege" @close="hideToast"/> 
      </div>
    </template>
 
    <template>
      <div>
        <mu-drawer right :open="openChouti" @close="toggle()" width="100%">
          <div v-show="selpage==1">
            <mu-appbar title="绑定手机号"  slot="center">
              <mu-icon-button  icon="arrow_back_ios" slot="left"  @click="toggle()" />
              <mu-icon-button  slot="right"/>
            </mu-appbar>
            <div id="changeIphone" >
              <div>
                <mu-text-field label="请输入绑定手机号" class="inputC " fullWidth errorText="" labelFloat/><mu-raised-button  label="获取验证码" class="getAZM demo-raised-button"/><br/>
                <mu-text-field label="验证码" class="inputC mt15-" fullWidth errorText="" labelFloat/><br/>
              </div>
              <mu-raised-button class="quere mt10" label="下一步" fullWidth/>
            </div>
          </div>
          <div v-show="selpage==2">
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
      selpage:1,
      title:"个人信息",
      list:[],
      openChouti:false,
      userRole:"",
      toast:false,
      toastMasege:'',
      Userprofessional:"",
      UserGender:'',
      token:'',
      setnickname:'',
      index:-1,
      tomStyle:false,
      dialog: false,
      activeIndex:1,
      bottomSheet: 0,
      userInfo:{
        // "uid": '',
        // "username": "",
        // "nickname": "",
        // "headimg": "",
        // "realname": "",
        // "idcard": "",
        // "mobile": "",
        // "email": "",
        // "worktime": "",
        // "professional":"",
        // "introduce": "",
        // "role": "",
        "uid": 133974,
        "username": "T135xxxx6370Og",
        "nickname": "君心",
        "headimg": "http://qiniucdn.mysipo.com/ed9b61fd339f97449bb9ebf03dd4f51b.jpg",
        "realname": "薛伟",
        "idcard": "",
        "mobile": "13520306370",
        "email": "",
        "worktime": "1",
        "professional": 0,
        "introduce": "",
        "role": 0
      },
      user_conf_role:[
        {
            "id": 1,
            "value": "应届小白"
        },
        {
            "id": 2,
            "value": "应届考生"
        },
        {
            "id": 3,
            "value": "复考考生"
        }
      ],
      user_conf_gender:[
        {
            "id": 1,
            "value": "男"
        },
        {
            "id": 2,
            "value": "女"
        },
        {
            "id": 3,
            "value": "保密"
        }
      ],
      user_conf_profession:[
        {
            "id": 1,
            "value": "专利代理人"
        },
        {
            "id": 2,
            "value": "检索分析师"
        },
        {
            "id": 3,
            "value": "知识产权律师"
        },
        {
            "id": 4,
            "value": "IP运营/管理者"
        },
        {
            "id": 5,
            "value": "专利工程师"
        },
        {
            "id": 6,
            "value": "研发工程师"
        }
      ]
    };
  },
  created() {
    this.ready();
    plusReady(this.plusReady);
    broadcast.listen('changemusic2', (data) => {
        this.setMemberInfo();
    })
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
      setTimeout(() => {  this.tomStyle=true }, 5000)
    },
    plusReady() {
      this.cw = plus.webview.currentWebview();
      setTimeout(function () { 
        plus.webview.currentWebview().show('slide-in-right', 250);
        plus.nativeUI.closeWaiting();
      }, 300);
      this.token = plus.storage.getItem('token') ? plus.storage.getItem('token') : '';
      this.headimg = plus.storage.getItem('headimg') ? plus.storage.getItem('headimg') : '';
      this.getSettingInfo();
     
    },
    //更新抽屉
    toggle (num) {
      this.selpage=num;
      this.openChouti = !this.openChouti;
    },
    //切换页面
    closeWid() {
      plus.webview.currentWebview().close();
    },
    open () {
      this.dialog = true;
    },
    close () {
      this.dialog = false;
    },
    sure(){
      var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]|-){2,24}$");
		  if(!regex.test(this.setnickname)){
        this.showToast("昵称字符长度需在2-24个，且仅支持中文，英文，数字，字符-、_。")
        return false;
      }
      this.userInfo.nickname = this.setnickname;
      this.dialog = false;
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
    //获取设置字典
    getSettingInfo() {
      this.loading = true;
      let parmas={
        token:this.token,
      }
      parmas = sign.signAfterObj(parmas);
      this.$api.get(baseURL.appapi_v2+'Index/getSettingInfo', parmas, response => {
        this.loading = false;
        console.log("sss"+JSON.stringify(response.data));
        this.user_conf_role=response.data.user_conf.role
        this.user_conf_gender=response.data.user_conf.gender
        this.user_conf_profession=response.data.user_conf.profession
        this.getMemberInfo();
      },
      failure => {
        this.loading = false;
        this.noCase=true;
        this.showToast(failure.err_msg);
      })
    },
    // 信息修改
    setMemberInfo() {
      this.loading = true;
      let parmas={
        token:this.token,
        worktime:this.userInfo.worktime,
        professional:this.userInfo.professional,
        introduce:this.userInfo.introduce,
        role:this.userInfo.role,
      }
      parmas = sign.signAfterObj(parmas);
      console.log(JSON.stringify(parmas));
      this.$api.get(baseURL.appapi_v2+'Userinfo/setMemberInfo', parmas, response => {
        this.loading = false;
        this.showToast("用户信息修改成功！")
        //this.getMemberInfo();
      },
      failure => {
        this.loading = false;
        this.showToast(failure.err_msg);
        
      })
    },
    //
    closeBottomSheet () {
      this.bottomSheet = 0
    },
    openBottomSheet (num) {
      this.bottomSheet = num
    },
    //获取用户基本信息
    getMemberInfo() {
      this.loading = true;
      let parmas={
        token:this.token,
      }
      parmas = sign.signAfterObj(parmas);
      this.$api.get(baseURL.appapi_v2+'Userinfo/getMemberInfo', parmas, response => {
        this.loading = false;
        this.userInfo=response.data;
        this.selUserRole();
        this.selUserprofessional();
        this.selgender();
        if( this.headimg!= this.userInfo.headimg){
          this.headimg= this.userInfo.headimg
          plus.storage.setItem('headimg',this.headimg);
        }
        console.log(JSON.stringify(this.userInfo));
      },
      failure => {
        this.loading = false;
        this.noCase=true;
        this.showToast(failure.err_msg);
        
      })
    },
    //下拉框选择
    selXla(data,num){
      if(num==1){
        this.userInfo.role=data.id;
        this.selUserRole();
      }else if(num==2){
        this.userInfo.gender=data.id;
        this.selgender();
      }else if(num==3){
        this.userInfo.professional=data.id;
        this.selUserprofessional();
      }
    },
    //选择用户角色
    selUserRole(){
        for(var i=0;i<this.user_conf_role.length;i++){
          if( this.userInfo.role==this.user_conf_role[i].id){
            this.userRole=this.user_conf_role[i].value
          }
        }
    },
    //选择职业
    selUserprofessional(){
        for(var i=0;i<this.user_conf_profession.length;i++){
          if( this.userInfo.professional==this.user_conf_profession[i].id){
            this.Userprofessional=this.user_conf_profession[i].value
          }
        }
    },
    //选择性别
    selgender(){
        for(var i=0;i<this.user_conf_gender.length;i++){
          if( this.userInfo.gender==this.user_conf_gender[i].id){
            this.UserGender=this.user_conf_gender[i].value
          }
        }
    },
    //绑定手机号
    bindingPhone(){
      let page = "ChangePhoneNum.html";
      let ow = plus.webview.create(
        page,
        page,
        {
          popGesture: "close"
        },
        {
          title:"绑定手机号",
          typeS:1,
        }
      );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
    },
    ChangeMailbox(){
      let page = "ChangeMailbox.html";
      let ow = plus.webview.create(
        page,
        page,
        {
          popGesture: "close"
        },
        {
          title:"绑定邮箱",
          typeS:1,
        }
      );
      ow.onloading = () => {
        plus.nativeUI.showWaiting();
        // ow.show("pop-in", 250);
      };
    },
    //修改头像
    galleryImg() {
      plus.gallery.pick(function(a) {
        plus.io.resolveLocalFileSystemURL(a, function(entry) {
            var imgsrc=a;
            plus.nativeUI.showWaiting();
            var task = null;
            task = plus.uploader.createUpload(baseURL.api_v1 + '/Userinfo/setHeadimg', {
              method: "POST",
              blocksize: 409600,
              priority: 100
            }, function(t, status) {
              plus.nativeUI.closeWaiting();
              var jsonObj = eval('(' + t.responseText + ')');
              console.log(JSON.stringify(jsonObj)) 
              if (jsonObj.err_no == 0) {
                plus.storage.setItem('headimg', jsonObj.data.m_headimg);
                console.log(jsonObj.data.m_headimg)
                // mui.toast("修改成功");
                return false;
              } else {
                // mui.toast(jsonObj.err_msg);
                return false;
              }
                // mui.toast('上传成功' + t.responseText)
            });
            task.addFile(imgsrc, {
              key: 'image'
            });
            var gettoken = plus.storage.getItem('token') ? plus.storage.getItem('token') : '';
            var getuid = plus.storage.getItem('userid') ? plus.storage.getItem('userid') : '';
            task.addData('uid', getuid);
            task.addData('token', gettoken);
            task.start();
        }, function(e) {
          console.log("读取拍照文件错误：" + e.message);
        });
      }, function(a) {}, {
        filter: "image"
      })
      this.ifUpload2();
    },
    //确定是否上传成功
    ifUpload2(){
      this.headimg = plus.storage.getItem('headimg') ? plus.storage.getItem('headimg') : '';
      if(this.headimg== this.userInfo.headimg){
        setTimeout(()=>{
          this.ifUpload2();
        },300)
      }else{
        this.userInfo.headimg=this.headimg;
        // this.showToast("修改成功");
        this.tomStyle=false;
        setTimeout(() => { this.tomStyle=true }, 5000);
      }
    },

    closeBottomSheet () {
      this.bottomSheet = 0
    },
    openBottomSheet (num) {
      this.bottomSheet = num
    }
  },
  watch: {
    userInfo:{//深度监听，可监听到对象、数组的变化
        handler(val, oldVal){
          let _this = this;  
          setTimeout(() => {  
              _this.setMemberInfo();  
          }, 500);  
        },
        deep:true
    }
  }
};
</script>
<style lang="less">
  .mu-appbar-title{
    text-align: center;
  }
  .mu-dialog{
    width: 90%!important;
  }
  
  .mu-bottom-sheet{
    opacity:1;
    background-color: #999999 !important;
    bottom: -1px;
    .mu-item {
      color: rgba(0, 0, 0, 0.87);
      text-align: center;
      background-color: #fff;
    }
    .mu-item-title{
      font-size: 17px;
    }
  }
.mu-dialog{
  .header{
    height: 45px;
    line-height: 45px;
    margin-top: -20px;
    margin-left: -25px;
    border-bottom: 1px dashed #e7e7e7;
    margin-right: -25px;
    padding: 0 25px;
   .left{
      font-size: 17px;
      color: #888;
   }
   .right{
    font-size: 17px;
    color: #15dbb8;
    float: right;
   }
  }
  .body{
    text-align: center;
    h4{
      color: #ff5b5b;
      font-size: 13px;
      margin-top: 30px;
    }
    input{
      width: 99%;
      height: 45px;
      margin-bottom: 20px;
      padding: 15px;
    }
  }
}
.mu-paper {
  background-color: #f0f1f4!important;
  color: rgba(0, 0, 0, 0.87);
}
</style>