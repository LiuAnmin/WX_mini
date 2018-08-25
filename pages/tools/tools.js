// pages/tools/tools.js
var weather_now = {};
var weather_day = {};
var weather_tip = {};
var OK_url=[0,0,0]
//var util = require('../../dist/weather/util.js')
//import * as Rest from '../../dist/weather/restUtil';

var QR = require("../../dist/utils/qrcode.js");

var ccFile = require('../../dist/utils/calendar-converter.js')
var calendarConverter = new ccFile.CalendarConverter();

//月份天数表
var DAY_OF_MONTH = [
  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

//判断当前年是否闰年
var isLeapYear = function (year) {
  if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
    return 1
  else
    return 0
};

//获取当月有多少天
var getDayCount = function (year, month) {
  return DAY_OF_MONTH[isLeapYear(year)][month];
};

//获取当前索引下是几号
var getDay = function (index) {
  return index - curDayOffset;
};

//获取两个时间戳之间间隔的天数
var getOffDays = function (startDate, endDate) {
  //得到时间戳相减 得到以毫秒为单位的差  
  var mmSec = (endDate.getTime() - startDate.getTime());
  //单位转换为天并返回 
  return (mmSec / 3600000 / 24);
};

var pageData = {
  dateData: {
    date: "",                //当前日期字符串
    arrIsShow: [],           //是否显示此日期
    arrDays: [],             //关于几号的信息
    arrInfoEx: [],           //农历节假日等扩展信息
    arrInfoExShow: [],       //处理后用于显示的扩展信息
  },

  //选择一天时显示的信息
  detailData: {
    curDay: "",         //detail中显示的日信息
    curInfo1: "",
    curInfo2: "",
    curInfo3: "",
  },
}

//获取此月第一天相对视图显示的偏移
var getOffset = function () {
  var offset = new Date(curYear, curMonth, 1).getDay();
  offset = offset == 0 ? 6 : offset - 1; //注意这个转换，Date对象的getDay函数返回返回值是 0（周日） 到 6（周六） 
  return offset;
}

//设置当前详细信息的索引，前台的详细信息会被更新
var lastRefreshDetailDataIndex = 0;
var refreshDetailData = function (index) {
  if (index == null) {
    index = lastRefreshDetailDataIndex
  }
  else {
    lastRefreshDetailDataIndex = index;
  }
  var curEx = pageData.dateData.arrInfoEx[index];
  if (!curEx)
    return;
  curDay = curEx.sDay;
  pageData.detailData.curDay = curEx.sDay;
  pageData.detailData.curInfo1 = "农历" + curEx.lunarMonth + "月" + curEx.lunarDay + " " + curEx.lunarFestival;
  pageData.detailData.curInfo2 = curEx.cYear + curEx.lunarYear + "年 " + curEx.cMonth + "月 " + curEx.cDay + "日";
  pageData.detailData.curInfo3 = '';
}

//刷新全部数据
var refreshPageData = function (year, month, day) {
  curMonth = month;
  curYear = year;
  curDay = day;

  pageData.dateData.date = curYear + '年' + (curMonth + 1) + '月';

  var offset = getOffset();
  var offset2 = getDayCount(curYear, curMonth) + offset;
  for (var i = 0; i < 42; ++i) {
    pageData.dateData.arrIsShow[i] = i < offset || i >= offset2 ? false : true;
    if (!pageData.dateData.arrIsShow[i])
      continue;
    pageData.dateData.arrDays[i] = i - offset + 1;
    var d = new Date(year, month, i - offset + 1);
    var dEx = calendarConverter.solar2lunar(d);
    pageData.dateData.arrInfoEx[i] = dEx;
    if ("" != dEx.lunarFestival) {
      pageData.dateData.arrInfoExShow[i] = dEx.lunarFestival;
    }
    else if ("初一" === dEx.lunarDay) {
      pageData.dateData.arrInfoExShow[i] = dEx.lunarMonth + "月";
    }
    else {
      pageData.dateData.arrInfoExShow[i] = dEx.lunarDay;
    }
  }
  refreshDetailData(offset + day - 1);
};

var curDate = new Date();
var curMonth = curDate.getMonth();
var curYear = curDate.getFullYear();
var curDay = curDate.getDate();
refreshPageData(curYear, curMonth, curDay);


Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputCode: 'Hello MINA!',
    trueCode: 'Hello MINA!',
  
    value: '二维码测试文字内容',
    fgColor: 'black',

    pgdata: pageData,

    weather: {},
    loading: false,
    myloading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    QR.qrApi.draw(this.data.value, this.data.fgColor, 'mycanvas', 300, 300)

    wx.getLocation({
      type: 'wgs84',//'gcj02'
      success: function (res) {
        const { latitude, longitude, speed, accuracy } = res;
        //console.log(latitude, longitude, speed, accuracy)
      }
    });
    
    this.getweather();
  },

  getweather: function () {
    this.setData({ myloading: true });
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/now?location=113.26436,23.12908&key=b40fdf4a44134a4cb0eb45811a446448',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        OK_url[0] = 1
        //console.log(res.data.HeWeather6[0])
        weather_now={
          "hot": res.data.HeWeather6[0].now.tmp,
          "weather": res.data.HeWeather6[0].now.cond_txt,
          "wind_type": res.data.HeWeather6[0].now.wind_dir,
          "wind_degree": res.data.HeWeather6[0].now.wind_sc
        }
      }
    });
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast?location=113.26436,23.12908&key=b40fdf4a44134a4cb0eb45811a446448',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        OK_url[1] = 1
        //console.log(res.data.HeWeather6[0])//
        weather_day = {
          "day": res.data.HeWeather6[0].daily_forecast[0].cond_txt_d,
          "night": res.data.HeWeather6[0].daily_forecast[0].cond_txt_n,
          "min": res.data.HeWeather6[0].daily_forecast[0].tmp_min,
          "max": res.data.HeWeather6[0].daily_forecast[0].tmp_max
        }
      }
    });
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/lifestyle?location=113.26436,23.12908&key=b40fdf4a44134a4cb0eb45811a446448',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        OK_url[2] = 1
        //console.log(res.data.HeWeather6[0])//
        weather_tip = {
          "dress": res.data.HeWeather6[0].lifestyle[1].txt,
          "air": res.data.HeWeather6[0].lifestyle[7].txt
        }
      }
    });
    setTimeout(this.myset, 600);
    //this.myset()
  },

  myset: function () {
    this.setData({myloading: false})
    if (OK_url[0] && OK_url[1] && OK_url[2]) {
      this.setData({
        weather_now: weather_now,
        weather_day: weather_day,
        weather_tip: weather_tip
      })
    }
    else{
      wx.showToast({
        title: '网络连接超时，1S无返回信息',
        icon: 'nonw',
        duration: 3000
      }) 
    }
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
    refreshDetailData();
    this.setData({
      dateData: pageData.dateData,
      detailData: pageData.detailData,
    })
  
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
    return {
      title: '常用工具',
      desc: '你的朋友可能会用到喔',
      path: '/pages/tools/tools'
    }
  },


  onChange(e) {
    console.log(`验证码：${e.detail.value}`)
    this.setData({
      trueCode: e.detail.value
    })
  },
  userNameInput: function (e) {
    this.setData({
      inputCode: e.detail.value
    })
    if (this.data.inputCode == this.data.trueCode){
      console.log(`success`)
      wx.showToast({
        title: '验证成功',
        //icon: 'loading',
        duration: 1000
      });
    }
    else{
      console.log(`fail`)
      wx.showToast({
        title: '输入错误请重试',
        icon: 'loading',
        duration: 1000
      });
    }
  },



  bindinput(e) {
    const value = e.detail.value
    const fgColor = this.randomColor()

    this.setData({
      value,
      fgColor,
    })

    QR.qrApi.draw(e.detail.value, fgColor, 'mycanvas', 300, 300)
  },

  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    wx.showActionSheet({
      itemList: ['保存二维码'],
      success: function (res) {
        //console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          console.log('保存二维码')
          wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
              var tempFilePath = encodeURI(res.tempFilePath)
              //console.log(res)
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function success(res) {
                  console.log('saved::' + res.savedFilePath);
                  wx.showToast({
                    title: '保存成功',
                  })
                }
              })
            },
            fail: function (res) {
              //console.log(res);
              wx.showToast({
                title: '保存失败',
                icon: 'loading'
              }),
                setTimeout(function () {
                  wx.hideLoading()
                }, 2000)
            }
          });
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  randomColor() {
    const colorStr = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()
    const length = colorStr.length
    const prefixStr = `000000`.substring(0, 6 - colorStr.length)
    return `#${prefixStr}${colorStr}`
  },




  goToday: function (e) {
    curDate = new Date();
    curMonth = curDate.getMonth();
    curYear = curDate.getFullYear();
    curDay = curDate.getDate();
    refreshPageData(curYear, curMonth, curDay);
    this.setData({
      dateData: pageData.dateData,
      detailData: pageData.detailData,
    })
  },

  goLastMonth: function (e) {
    if (0 == curMonth) {
      curMonth = 11;
      --curYear
    }
    else {
      --curMonth;
    }
    refreshPageData(curYear, curMonth, 1);
    this.setData({
      dateData: pageData.dateData,
      detailData: pageData.detailData,
    })
  },

  goNextMonth: function (e) {
    if (11 == curMonth) {
      curMonth = 0;
      ++curYear
    }
    else {
      ++curMonth;
    }
    refreshPageData(curYear, curMonth, 1);
    this.setData({
      dateData: pageData.dateData,
      detailData: pageData.detailData,
    })
  },

  selectDay: function (e) {
    refreshDetailData(e.currentTarget.dataset.dayIndex);
    this.setData({
      detailData: pageData.detailData,
    })
  },

  bindDateChange: function (e) {
    var arr = e.detail.value.split("-");
    refreshPageData(+arr[0], arr[1] - 1, +arr[2]);
    this.setData({
      dateData: pageData.dateData,
      detailData: pageData.detailData,
    })
  },

})