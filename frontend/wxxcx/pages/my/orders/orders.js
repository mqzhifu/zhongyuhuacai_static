const app = getApp()
const Logs = require("../../../utils/log.js")
Page({
    data: {
        selectedTab: 1,//默认选中的TAB
        orderList: [],//所有订单列表数据
        payOrderList:[],//待支付列表
        shipOrderList:[],//待发货
        signinOrderList:[],//待签收
        waitComment:[],//待评价
        payType: 12,//微信支付
        tabPanel:{1:1,2:2,3:3,4:4,5:5},
    },
    // 切换到标签
    onChangeTabs(e) {
        this.setData({
            selectedTab: e.currentTarget.dataset.index,
        })
    },

    goto_common:function(e){
        console.log(e)
        var oid = e.target.dataset.id
        app.goto(1,19,{"oid":oid})
    },

    onLoad: function (requestData) {
        Logs.onload("order",requestData)
        if(requestData && !app.isUndefined(requestData.tabId)){
            this.setData({selectedTab:requestData.tabId})
        }
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initOrderData();
            }
        )
    },
    //待支付订单跳转到支付页面
    gotoPay: function (e) {
        var oid = e.currentTarget.dataset.oid
        console.log("oid", oid)
        app.pay(oid, this.data.payType)
    },
    //取消一个订单
    cancel: function (e) {
        var oid = e.currentTarget.dataset.oid
        console.log("oid", oid)

        var cancelBack = function (e) {
            console.log("im cancel back", e)
        }

        var data = {id: oid}
        app.httpRequest("orderCancel", data, cancelBack)
    },
    //用户点击 ：确认收货
    confirmReceive: function (e) {
        var oid = e.currentTarget.dataset.oid
        console.log("oid", oid)

        var parentObj = this
        var confirmReceive = function (e) {
            console.log("im confirmReceive back", e)
            parentObj.initOrderData()
        }

        var data = {id: oid}
        app.httpRequest("confirmReceive", data, confirmReceive)
    },
    //用户申请退款
    refund: function (e) {
        var oid = e.currentTarget.dataset.oid
        console.log("oid", oid)


        var applyRefund = function (e) {
            console.log("im applyRefund back", e)
            parentObj.initOrderData()
        }

        var data = {id: oid}
        app.httpRequest("applyRefund", data, applyRefund)
    },
    //初始化页面数据
    initOrderData: function () {
        var parentObj = this
        var UserOrderListCallback = function (resolve, res) {
            console.log("UserOrderListCallback callback", res)

            if(!res){
                console.log("notice: order list is null")
                return -1
            }

            var i =0;
            var waitPay = []
            var waitShip = []
            var waitSingin = []
            var waitComment = []
            for (i = 0; i < res.length; i++) {

                if(res[i].status == 1){
                    console.log()
                    var length = waitPay.length
                    if(!length){
                        waitPay[length] = res[i]
                    }else{
                        waitPay[++length] = res[i]
                    }

                }

                if(res[i].status == 2){
                    var length = waitShip.length
                    if(!length){
                        waitShip[length] = res[i]
                    }else{
                        waitShip[++length] = res[i]
                    }

                }

                if(res[i].status == 5){
                    var length = waitSingin.length
                    if(!length){
                        waitSingin[length] = res[i]
                    }else{
                        waitSingin[++length] = res[i]
                    }
                }

                if(res[i].status == 6 || res[i].status == 8){
                    var length = waitComment.length
                    if(!length){
                        waitComment[length] = res[i]
                    }else{
                        waitComment[++length] = res[i]
                    }

                }

            }
            parentObj.setData({"orderList": res})
            //待支付列表
            parentObj.setData({"payOrderList": waitPay})
            //待发货
            parentObj.setData({"shipOrderList": waitShip})
            //待签收
            parentObj.setData({"signinOrderList": waitSingin})
            //待评价
            parentObj.setData({"waitComment": waitComment})

            var tabPanel = {
                1:res,
                2:waitPay,
                3:waitShip,
                4:waitSingin,
                5:waitComment,
            }
            parentObj.setData({
                tabPanel:tabPanel
            })

        }
        var data = []
        app.httpRequest('getUserOrderList', data, UserOrderListCallback);
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
        return app.shareMyApp(1, 7, '首页~','首页的内容',null)
    },
})
