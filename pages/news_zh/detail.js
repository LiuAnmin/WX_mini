const WxParse = require('../../dist/wxParse/wxParse.js');
var data = { body: '<html><div>加载中。。。</div></html>' }
//不能识别 HTML， 所以内容无法显示 / (ㄒoㄒ) / ~~
var T_time = 700
// pages/new/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxParseData: [],
    article: {},
    art: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id)
    WxParse.wxParse('content', 'html', data.body, this, 5);
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/' + options.id,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        data = res.data
        //console.log(data)
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
      art: data,      
    })
    WxParse.wxParse('content', 'html', data.body, this, 5); 
  },


  onReady: function () {
    wx.setNavigationBarTitle({
      title: '新闻详情'
    })
  },
})