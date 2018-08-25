// pages/new2/index.js
var data = { titles:'加载中。。。'}
var T_time = 500

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://c.m.163.com/nc/article/headline/T1348647853363/0-20.html',
      header: { 'Content-Type': 'application/json' },
      method: 'GET',
      success: function (res) {
        data = res.data.T1348647853363
        data.shift()
      },
      fail: function (res) {
        data = { titles: '加载失败！' }
      }
    })
    setTimeout(this.mytest, T_time)
  },

  mytest: function () {
    this.setData({
      articles: data
    })
    //console.log(this.data.articles)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '网易新闻'
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
      title: '网易新闻',
      desc: '好新闻值得分享',
      path: '/pages/news_wy/index'
    }
  },
})