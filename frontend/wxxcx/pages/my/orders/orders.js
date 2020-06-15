const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectedTab: 1,
      orderList :[],
  },
  // 切换到标签
  onChangeTabs(e) {
    this.setData({
      selectedTab: e.currentTarget.dataset.index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("im in <user order list> page Onload...");


      //初始化 登陆信息
      var PromiseObj =  new Promise(function(resolve, reject) {
          app.globalData.promiseResolve = resolve
          app.loginInit()
      })
      var parent = this
      PromiseObj.then(
          function(){
              console.log(" init login finish.")
              parent.initOrderData();
          }
      )

  },

    initOrderData:function(){
        var parentObj = this
        var UserOrderListCallback = function(resolve,res){
                console.log("UserOrderListCallback callback", res)
            parentObj.setData({"orderList":res})
        }
        var data = []
        app.httpRequest('getUserOrderList',data,UserOrderListCallback);
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
