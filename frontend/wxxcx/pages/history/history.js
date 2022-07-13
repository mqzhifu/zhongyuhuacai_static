const app = getApp()
const Logs = require("../../utils/log.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList:[
      // {
      //   id: 1,
      //   imgUrl: 'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
      //   title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
      //   price: 11,
      //   payment: 111
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      Logs.onload("collect", options)
      //初始化 登陆信息
      var PromiseObj = new Promise(function (resolve, reject) {
          app.globalData.promiseResolve = resolve
          app.loginInit()
      })
      var parent = this
      PromiseObj.then(
          function () {
              console.log(" init login finish.")
              parent.initHistoryData();
          }
      )
  },

    initHistoryData:function(){
        var parentObj = this
        var GetHistoryListCallback = function (resolve, res) {
            console.log("GetHistoryListCallback callback", res)

            var data = []
            for (var i = 0; i < res.length; i++) {
                var tmp = {
                    id: res[i].id,
                    imgUrl: res[i].pic,
                    title: res[i].title,
                    price: res[i].lowest_price,
                    payment:res[i].user_buy_total
                }
                data[i] = tmp
            }

            // parentObj.setData({productList: res})
            parentObj.setData({hotList: data})
            console.log(data)
        }
        var data = {}
        app.httpRequest('viewProductHistory', data, GetHistoryListCallback);
    },

    gotoDetail:function(e){
      var pid = e.target.dataset.pid
      app.goto(1,2,{"pid":pid})
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
      return app.shareMyApp(1, 17, '首页~','首页的内容',null)
  }
})