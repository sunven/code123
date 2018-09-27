var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
  data: {
    popularityData:[],
    indexData: [],
    page: 1,
    size: 10,
    items: [],
    tabs: ["人气", "推荐","全部" ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scrollTop:5
  },
  onLoad: function() {
    var that = this;
    this.getPopularity()
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //var that = this;
    this.setData({
      page: 1
    });
    this.getIndexData(function() {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    });
  },
  scrollFn(e) {
    // 防抖，优化性能
    // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
    // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
    //clearTimeout(this.timer)
    if (e.detail.scrollTop < this.data.scrollTop) {
      this.refresh()
      // this.timer = setTimeout(() => {
      //   this.refresh()
      // }, 350)
    }
  },
  refresh() { // 函数式触发开始下拉刷新。如可以绑定按钮点击事件来触发下拉刷新
    wx.startPullDownRefresh({
      success(errMsg) {
        console.log('开始下拉刷新', errMsg)
      },
      complete() {
        console.log('下拉刷新完毕')
      }
    })
  },
  onReachBottom: function() {
    //var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    this.setData({
      page: this.page + 1
    });
    this.getIndexData(function() {
      // 隐藏加载框
      wx.hideLoading();
    });

  },
  getPopularity:function(){
    var that = this;
    wx.request({
      url: 'https://llweb.top/api/Blog/FortyeightHoursTopViewPosts/20',
      success: function (res) {
        that.setData({
          popularityData: res.data.result
        });
      }
    })
  },
  getIndexData: function(callbackfun) {
    var that = this;
    wx.request({
      url: 'https://llweb.top/api/Blog/Paged/' + that.data.page + '/' + that.data.size,
      success: function(res) {
        that.setData({
          indexData: res.data.result
        });
        if (callbackfun) {
          callbackfun();
        }
      }
    })
  },
  tabClick: function(e) {
    if (e.currentTarget.id == "0") {

    } else if (e.currentTarget.id == "1") {
      this.getIndexData();
    } else if (e.currentTarget.id == "2") {

    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})