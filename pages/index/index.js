//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onLoad: function () {
    setTimeout(function(){
      wx.switchTab({
        url: '../blog/index',
      })
    },2000)
  }
})
