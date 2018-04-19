<template>
  <div>
    <mu-appbar :title="tabs[activeIndex].title"  slot="center">
      <mu-icon-button v-if="activeIndex==0" icon="arrow_back_ios" slot="left" @click='close' />
      <mu-icon-button v-if="activeIndex==0" icon='menu' slot="right" @click='handleTabChange(1)' />
      <mu-icon-button v-if="activeIndex==1" icon="arrow_back_ios" slot="left" @click='handleTabChange(0)' />
      <mu-icon-button v-if="activeIndex==1" icon='' slot="right"  />
    </mu-appbar>
    <!-- <mu-paper>
      <mu-bottom-nav :value="activeIndex" shift @change="handleTabChange">
        <mu-bottom-nav-item v-for='t,i of tabs' :value='i' :icon="t.icon" :title='t.title' />
      </mu-bottom-nav>
    </mu-paper> -->
  </div>
</template>

<script>
  import {
    domReady,
    plusReady
  } from 'common/js/ning/index.js'
  import Broadcast from 'common/js/ning/Broadcast.js'
  import webviewGroup from 'common/js/ning/WebviewGroup.js'
  export default {
    data() {
      return {
        activeIndex: 0,
        tabs: [
          {
            title: '我的课程',
            icon: 'home',
            src: 'home.html'
          },
          // {
          //   title: '音乐',
          //   icon: 'touch_app',
          //   src: 'music.html'
          // },
          {
            title: '课程设置',
            icon: 'account_box',
            src: 'menu.html'
          }
        ],
        style: {
          top: '56px',
          bottom: '0px',
          popGesture: 'none'
        },
        isShow: false,
        menuPage: null,
        mask: null
      }
    },
    created() {
      plusReady(this.plusReady)
      new Broadcast().listen('_hideMenu', (e) => {
        this.isShow = false
      })
    },
    methods: {
      plusReady() {
        setTimeout(function () { 
          plus.webview.currentWebview().show('slide-in-right', 250);
          plus.nativeUI.closeWaiting();
        }, 600);
        this.cw = plus.webview.currentWebview()
        let that = this
        let items = []
        for(let i in this.tabs){
          items.push({
            id: this.tabs[i].src,
            url: this.tabs[i].src,
            extras: {bounce: 'vertical'},
            styles: this.style
          })
        }
        this.group = new webviewGroup(this.cw.id, {
          items,
          onChange(obj) {
            that.activeIndex = obj.index
          }
        })
        //默认载入
        // this.showSubPage(this.activeIndex)
        // 侧滑初始化
        // this.menuInit()
      },
      //关闭窗口
      close() {
        this.cw.close()
      },
      //打开setting
      onClick() {
        let page = "courseDetails.html",
          ow = plus.webview.create(
            page,
            page,
            {
              popGesture: "close"
            },
          );
        ow.onloading = () => {
          ow.show("pop-in", 250);
        };
      },
      //左上角菜单
      menu() {
        this.isShow = true
      },

      menuInit() {
        //设置遮罩点击事件
        this.cw.addEventListener("maskClick", () => {
          this.isShow = false
        })
        //预加载侧滑菜单
        let url = 'menu.html'
        this.menuPage = plus.webview.create(url, url, {
          left: '-70%',
          width: '70%',
          zindex: 9997,
          popGesture: 'none'
        })
      },
      _showMenu() {
        this.menuPage.show('none', 0, () => {
          this.cw.setStyle({
            left: '70%',
            transition: {
              duration: 150
            },
            mask: 'rgba(0,0,0,0.35)'
          })
          this.menuPage.setStyle({
            left: '0%',
            transition: {
              duration: 150
            }
          })
        })
      },
      _hideMeun() {
        this.cw.setStyle({
          left: '0',
          transition: {
            duration: 150
          }
        })
        this.menuPage.setStyle({
          left: '-70%',
          transition: {
            duration: 150
          }
        })
        this.cw.setStyle({ mask: "none" })
        setTimeout(() => {
          this.menuPage.hide()
        }, 200);
      },
      handleTabChange(index) {
        //header展示效果
        this.activeIndex = index
        return this.group.switchTab(this.tabs[index].src)
        this.showSubPage(index)
        this.hideSubPage()
      },
      showSubPage(index = 0) {
        let id = this.tabs[index].src,
        want = plus.webview.getWebviewById(id)
        if (!want) {
          want = plus.webview.create(id, id, this.style)
          want.hide()
          this.cw.append(want)
          want.show("fade-in", plus.os.ios ? 300 : 700)
          return want
        }
        if (!want.isVisible()) {
          want.show('none')
        }
        return want
      },
      hideSubPage(index) {
        plus.webview.hide(this.tabs[this.activeIndex].src)
      }
    },
    watch: {
      isShow(n) {
        if (this.isShow) {
          this._showMenu()
        } else {
          this._hideMeun()
        }
      }
    }
  }

</script>
<style scoped>
  .mu-tabs,
  .mu-paper {
    width: 100%;
    position: fixed;
    bottom: 0;
  }
  .mu-appbar{
    text-align:center;
  }
</style>