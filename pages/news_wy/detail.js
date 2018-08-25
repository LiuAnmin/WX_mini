const WxParse = require('../../dist/wxParse/wxParse.js');
var data = { body: '<html><div>加载中。。。</div></html>' }
var T_time = 500
// pages/new/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxParseData: [],
    article: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id)
    wx.request({
      url: 'https://c.m.163.com/nc/article/'+options.id+'/full.html',
      header: { 'Content-Type': 'application/json' },
      method: 'GET',
      /*data: { news_id: "1342302", chid: "2", method: "POST" },
      header: {},
      method: 'POST',*/
      success: function (res) {
        data = res.data[options.id]//
      },
      fail: function (res) {
        data.body = '<html><div>加载失败</div></html>';
        //console.log(data)
      }
    });
    setTimeout(this.mytest, T_time)
  },
  mytest: function () {
    this.setData({
      article: data,      
    })
    WxParse.wxParse('content', 'html', data.body, this, 5); 
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '新闻详情'
    })
  },
})