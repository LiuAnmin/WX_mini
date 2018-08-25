// pages/new2/index.js
var data = { title: '加载中。。。' }
var T_time = 700
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/latest',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        data=res.data.stories
        //console.log(data)
      },
      fail: function (res) {
        data = { title: '加载失败' }
      }
    })
    setTimeout(this.mytest, T_time)
  },

  mytest: function () {
    //console.log(data)
    this.setData({
      list: [{ header: '今日热闻' }].concat(data)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '知乎新闻'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  onShareAppMessage: function () {
    return {
      title: '知乎新闻',
      desc: '好新闻值得分享',
      path: '/pages/news_zh/index'
    }
  },
})