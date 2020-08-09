const app = getApp()
const Logs = require("../../../../utils/log.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        refundConst: [],
        info: null,
        uinfo : null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)

        this.setData({id:options.id})
        this.setData({uinfo:app.globalData.serverUserInfo})

        console.log("uinfo",this.uinfo)
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initRefundListDetail();
            }
        )

    },

    initRefundListDetail : function(){
        var parentObj = this
        this.setData({refundConst:app.globalData.refundConst})
        console.log("refundConst",this.data.refundConst)

        var getUserRefundByIdBack = function(rr,res){
            console.log("getUserRefundByIdBack",res)
            parentObj.setData({info:res})
        }

        app.httpRequest("getUserRefundById",{id:this.data.id},getUserRefundByIdBack)
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