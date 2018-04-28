# vue-cli 多页面 + HBuilder 打包 + HTML5PLUS 特性

> A Vue + H5Plus project

使用UI : [Muse-UI](https://museui.github.io/) 基于 Vue 2.0 和 Material Desigin 的 UI 组件库
真机调试 : [HBuilder](http://www.dcloud.io/) HBuilder-飞速编码的极客工具

关键字：

1）换肤（支持webview多页面换肤）
2）简易机器人聊天
3）技术性文章浏览
4）支持流应用版本


## 开始

``` bash
# 安装依赖
npm install

# 在服务器上调试 localhost:8080/module/index.html 
npm run dev
## 然后在HBuilder中起始页设置为 本地服务器:端口号/module/index.html
### 如 192.168.11.102:8080/module/index.html
## 手机连接电脑, 在统一局域网下, 开启真机调试

# 你也可以先 打包
npm run build
## 然后把 dist 文件下的目录放入 HBuilder 项目中
## 设置起始页为 module/index.html 真机调试
```

集成vue-video-player

15.打包图片背景地址不对
16. axios  http地址  config配置   