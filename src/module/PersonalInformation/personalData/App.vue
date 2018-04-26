<template>
  <div>
    <mu-linear-progress v-show='loading' />
    <mu-appbar title="个人信息"  slot="center">
      <mu-icon-button  icon="arrow_back_ios" slot="left" @click='closeWid' />
      <mu-icon-button  slot="right"/>
    </mu-appbar>
    <div class="BGcard">
       <div class="wzLeft">
         <h4><span></span><i class="fa fa-american-sign-language-interpreting" aria-hidden="true"></i></h4>
       </div>
       <div class="tuRight"></div>
    </div>
    <template>
      <mobile-tear-sheet>
        <mu-list>
          <mu-list-item disableRipple  title="昵称">
             <mu-icon slot="right" value="info"/>
          </mu-list-item>
          <mu-divider />
          <mu-list-item disableRipple  title="手机号">
             <mu-icon slot="right" value="info"/>
          </mu-list-item>
           <mu-divider />
          <mu-list-item disableRipple  title="邮箱">
         
          </mu-list-item>
          <mu-divider />
           <mu-list-item disableRipple  title="用户等级">
         
          </mu-list-item>
          <mu-divider />
           <mu-list-item disableRipple  title="性别">
         
          </mu-list-item>
        </mu-list>
      </mobile-tear-sheet>
    </template>
    <template>
    <div>
      <mu-raised-button @click="openBottomSheet" label="Open Bottom Sheet" />
      <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
        <mu-list @itemClick="closeBottomSheet">
          <mu-sub-header>
            请选择一个
          </mu-sub-header>
          <mu-list-item title="阴阳师"/>
          <mu-list-item title="贪吃蛇大作战"/>
          <mu-list-item title="一划到底"/>
          <mu-list-item title="全民斗地主"/>
        </mu-list>
      </mu-bottom-sheet>
    </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title:"个人信息",
      list:[],
      index:-1,
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

    },
    closeWid() {
     plus.webview.currentWebview().close();
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
            console.log(JSON.stringify(e));
          }
        );
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
</style>