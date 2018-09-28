var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
Page({
  data: {
    popularityData: [],
    recommendData: [],
    recommendDataIsLoaded: false,
    allData: [],
    allDataIsLoaded: false,
    page: 1,
    size: 10,
    items: [],
    tabs: ["人气", "推荐", "全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scrollTop: 5,
    srollHeight: 300
  },
  onShow: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var height = res.windowHeight - 0; //footerpannelheight为底部组件的高度
        that.setData({
          srollHeight: height
        });
      }
    })
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

  // 上拉加载更多
  loadMore: function () {
    console.log(1);
    var self = this;
    // 当前页是最后一页
    if (self.data.currentPage == self.data.allPages) {
      self.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = self.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      self.setData({
        currentPage: tempCurrentPage,
        hideBottom: false
      })
      self.getData();
    }, 300);
  },
  scrollFn(e) {
    // 防抖，优化性能
    // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
    // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
    //clearTimeout(this.timer)
    console.loeg(e.detail.scrollTop + "," + this.data.scrollTop);
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
  getPopularity: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: 'https://llweb.top/api/Blog/FortyeightHoursTopViewPosts/20',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          popularityData: res.data.result
        });
      }
    })
  },
  getRecommendData: function() {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    wx.request({
      url: 'https://llweb.top/api/Blog/TenDaysTopDiggPosts/20',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          recommendData: res.data.result,
          recommendDataIsLoaded: true
        });
      }
    })
  },
  getAllData: function(callbackfun) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    wx.request({
      url: 'https://llweb.top/api/Blog/Paged/' + that.data.page + '/' + that.data.size,
      success: function(res) {
        wx.hideLoading();
        that.setData({
          allData: res.data.result,
          allDataIsLoaded:true
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
      if (!this.data.recommendDataIsLoaded) {
        this.getRecommendData();
      }

    } else if (e.currentTarget.id == "2") {
      if (!this.data.allDataIsLoaded) {
        this.getAllData();
      }
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})