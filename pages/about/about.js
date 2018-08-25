// pages/about/about.js
//var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    value: 3.7,
    average: 0,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },



  bindGetUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    //console.log(e.detail.userInfo);
    //接下来写业务代码
    this.setData({
      userInfo: e.detail.userInfo
    })
    //最后，记得返回刚才的页面
    wx.navigateBack({
      delta: 1
    })
  },

  onChange(e) {
    this.setData({
      value: e.detail.value,
    })
    this.setData({
      average: e.detail.value,
    })
    //console.log(e)
  },
  onShareAppMessage: function () {
    return {
      title: '联系反馈',
      desc: '让更多朋友来提意见吧',
      path: '/pages/about/about'
    }
  },


})