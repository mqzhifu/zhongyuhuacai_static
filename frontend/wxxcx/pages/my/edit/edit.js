const app = getApp()


Page({
  /**
   * 页面的初始数据
   */
  data: {
    sexDesc :['未知',"男","女"],
      showNickNameInput:0,
      showSexInput : 0,
    // form: {
    //   nameIpt: '糖糖',
    // },
    uinfo :[],
  },

  // 编辑昵称
  onEditName() {
    this.setData({
        showNickNameInput: 1,
    })
  },

    changeAvatar:function(){
      var parentObj = this
        wx.chooseImage({
            count: 1,
            // sizeType: ['original', 'compressed'],
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success (res) {
              console.log("upload avatar images is ok .",res);
                // tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                var uinfo = parentObj.data.uinfo
                uinfo.avatar = tempFilePaths


                parentObj.setData({uinfo:uinfo})

                var url = app.getServerUrlAction("upAvatar") + "&token="+app.globalData.serverToken

                console.log(url,tempFilePaths)
                wx.uploadFile({
                    url:url,
                    filePath:tempFilePaths[0],
                    name: 'avatar',
                    header: {"Content-Type": "multipart/form-data"},
                    formData:{"fromWX":"upupup"},
                    success: function (res){
                      console.log("wx back ",res)
                    },
                    fail: function (res) {
                        console.log('fail',res);
                    },
                })

            },
            fail (res){
                console.log("upload avatar image is fail.",res)
            }
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (data) {
    wx.setNavigationBarTitle({
      title: '修改个人资料',
    })

      console.log("im in page <edit userInfo>",data)
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
  onShareAppMessage: function () {
      return app.shareMyApp(1, 11, '首页~','首页的内容',null)
  },

})
