const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    uinfo:[]
  },
  onRouteEdit() {
    wx.navigateTo({ url: '/pages/my/edit/edit' })
  },


    gotoOrderList:function(){
        wx.navigateTo({ url: '/pages/my/orders/orders' })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("im in <user center> page Onload...");

      //初始化 登陆信息
      var PromiseObj =  new Promise(function(resolve, reject) {
          app.globalData.promiseResolve = resolve
          app.loginInit()
      })
      var parent = this
      PromiseObj.then(
          function(){
              console.log(" init login finish.")
              parent.initUserData();
          }
      )
  },

    initUserData:function(){
        var parentObj = this
        var GetUserInfoCallback = function(resolve,res) {
            console.log("GetUserInfoCallback callback", res)

            parentObj.setData({uinfo: res})
        }
        // parentObj.setData({"hotListPage":parentObj.data.hotListPage + 1})
        var data = {
        }
        app.httpRequest('getUserInfo',data,GetUserInfoCallback);
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
