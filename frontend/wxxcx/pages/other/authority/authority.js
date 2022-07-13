const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bindWxPhone:"",
    },



    userInfoHandler: function (e) {
        console.log(e.detail.userInfo)
        if (e.detail.userInfo) {
            console.log("用户已经授权")
            app.initUserInfo()
            app.goto(2, 1, null)

        } else {
            console.log("用户按了拒绝按钮")
        }
    },

    getPhoneNumber(e) {
        var parentObj = this
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)

        var data = {
            'iv': e.detail.iv,
            'encryptedData': e.detail.encryptedData,
            'sessionKey': app.globalData.sessionKey


        }

        var decodeCallback = function (j,res) {
            console.log("decodeCallback", res)
            console.log(res.mobile)
            parentObj.setData({"bindWxPhone":res.mobile})
        }

        app.httpRequest("decodeWxEncryptedData", data, decodeCallback)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(app.globalData.sessionKey)
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

    }
})