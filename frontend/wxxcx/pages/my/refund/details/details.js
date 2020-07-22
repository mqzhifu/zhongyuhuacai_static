const app = getApp()
const Logs = require("../../../../utils/log.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        oid : 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Logs.onload("my_refund_details", options)

        this.setData({oid:options.oid})
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initRefundDetailsData();
            }
        )
    },

    initRefundDetailsData: function () {

    },

    // 拨打联系电话
    onCallTel(e) {
        wx.makePhoneCall({
            phoneNumber: '03123688777',
        })
    },

    // 提交申请
    onSubmitApply() {
        wx.navigateTo({
            url: '/pages/my/refund/processing/processing',
        })
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