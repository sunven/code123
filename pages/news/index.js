var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
  data: {
    hotNews:[],
    page: 1,
    size: 10,
    items: [],
    tabs: ["热门", "最新", "推荐"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    this.getHotNews()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //var that = this;
    this.setData({
      page: 1
    });
    this.getIndexData(function () {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function () {
    //var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    this.setData({
      page: this.page + 1
    });
    this.getIndexData(function () {
      // 隐藏加载框
      wx.hideLoading();
    });

  },
  getHotNews: function (callbackfun) {
    var that = this;
    wx.request({
      url: 'https://llweb.top/api/news/hot/20',
      success: function (res) {
        that.setData({
          hotNews: res.data.result
        });
        if (callbackfun) {
          callbackfun();
        }
      }
    })
  },
  tabClick: function (e) {
    if (e.currentTarget.id == "0") {

    } else if (e.currentTarget.id == "1") {

    } else if (e.currentTarget.id == "2") {

    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})