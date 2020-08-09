const app = getApp()
const Logs = require("../../../../utils/log.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        refundConst : null,
        id : 0,
        countDown : 0,
        order: null,
    },

    go_money: function () {
        app.goto(1, 24, null)
    },

    refundCancel: function () {
        // app.goto(1, 25, null)

        var refundCancelBack = function(rr,res){
            console.log("refundCancelBack",res)
            app.showToast("取消成功~")
            app.goto(1, 25, null)
        }

        app.httpRequest("refundCancel",{id:this.data.id},refundCancelBack)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)

        this.setData({id: options.id})
        this.setData({uinfo: app.globalData.serverUserInfo})

        console.log("uinfo", this.uinfo)
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initRefundInfo();
            }
        )
    },

    initRefundInfo: function () {
        var parentObj = this
        this.setData({refundConst:app.globalData.refundConst})
        console.log("refundConst",this.data.refundConst)

        var getUserRefundByIdBack = function(rr,res){
            console.log("getUserRefundByIdBack",res)
            parentObj.setData({info:res})
            parentObj.initCountDown()

            parentObj.getOrder(res.oid)

        }

        app.httpRequest("getUserRefundById",{id:this.data.id},getUserRefundByIdBack)





    },

    copyOrderNo:function(e){

        var orderNo = e.currentTarget.dataset.no
        console.log(orderNo)
        wx.setClipboardData({
            data: orderNo,
            success: function () {
                wx.showToast({
                    title: '复制成功',
                    duration: 3000
                })
                wx.getClipboardData({
                    success: function (res) {
                        console.log("getClipboardData",res)
                    }
                })
            }
        })

    },


    getOrder : function(oid){
        var parentObj = this

        var getOrderInfoBack = function (rr, res) {
            console.log("getOrderInfoBack", res)
            parentObj.setData({order: res})
        }

        app.httpRequest("getOrderById", {id: oid}, getOrderInfoBack)

    },

    initCountDown : function(){
        var countTime = this.data.refundConst.cycle_time
        var now = app.getNowTimestamp()
        var a_time = this.data.info.a_time
        var distance = now - a_time

        console.log("now",now,"a_time",a_time,"distance",distance)

        if( distance <=0 ){
            app.showToast("倒计时错误.. <= 0 ")
            return -1
        }

        if(distance >= countTime){
            app.showToast("倒计时错误.. >= 2天 ")
            return -2
        }

        // var second = 0

        var timeStr = "0天零"
        if(distance > 86400){
            timeStr = "1天零"

            distance -= 86400
        }

        var hour = distance / 3600
        hour = parseInt(hour)


        if(hour > 0 ){
            timeStr += hour + "小时"
            distance -= hour * 3600
        }else{
            timeStr += "0小时"
        }

        var min = distance / 60
        hour = parseInt(min)


        if(hour > 0 ){
            timeStr += hour + "分"
            distance -= min * 60
        }else{
            timeStr += "0分"
        }

        timeStr += distance + "秒"

        console.log("final timeStr",timeStr)
        this.setData({countDown:timeStr})
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