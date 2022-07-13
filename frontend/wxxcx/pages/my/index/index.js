const app = getApp()
const Logs = require("../../../utils/log.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        uinfo: [],
        orderTotalCnt:[],
        callMobileNumber:"4000000000",
        collect_cnt:0,
        view_product_history_cnt:0,
        isGuest:0,
    },
    onRouteEdit() {
        wx.navigateTo({url: '/pages/my/edit/edit'})
    },


    callMobile:function (){
        wx.makePhoneCall({
            phoneNumber:this.data.callMobileNumber,
            success:function(res){

            },
            fail:function(){

            },
            complete:function(){

            }
        })
    },

    gotoOrderList: function (e) {
        var tabId = e.currentTarget.dataset.tabid
        // console.log(tabId,e)
        app.goto(1,7,{"tabId":tabId})
        // wx.navigateTo({url: '/pages/my/orders/orders'})
    },
    bindPhone:function (e) {
        // var tabId = e.currentTarget.dataset.tabid
        // console.log(tabId,e)
        // app.goto(1,26 )
        // wx.navigateTo({url: '/pages/my/orders/orders'})
        app.goto(1,10,null);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Logs.onload("my_index",options)
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initUserData();
            }
        )


    },

    go_collect:function(){
        app.goto(1,16,null)
    },

    go_history:function(){
        app.goto(1,17,null)
    },

    goClearCache:function(){
        app.goto(1,13,null)
    },

    goto_refund_list:function(){
        // var data = {oid:32}
        app.goto(1,25,null)
    },

    initUserData: function () {

    },

    login : function(){
        app.initUserInfo()
    },


    gotoAddressList:function(){
        var data = {source:"my_index_2"}
        app.goto(1,20,data)
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
        var parentObj = this
        var viewProductHistoryCntCallback = function(p,cnt){
            console.log("viewProductHistoryCntCallback",cnt)
            parentObj.setData({"view_product_history_cnt":cnt})
        }
        var getCollectListCntCallback = function(p,cnt){
            console.log("getCollectListCntCallback",cnt)
            parentObj.setData({"collect_cnt":cnt})
        }


        this.setData({isGuest:app.globalData.isGuest})

        app.httpRequest("getCollectListCnt",null,getCollectListCntCallback)
        app.httpRequest("viewProductHistoryCnt",null,viewProductHistoryCntCallback)


        var parentObj = this
        var GetUserInfoCallback = function (resolve, res) {
            console.log("GetUserInfoCallback callback", res)

            parentObj.setData({"collect_cnt":res.collect_cnt,"view_product_history_cnt":res.view_product_history_cnt})
            parentObj.setData({uinfo: res})
        }

        var OrderTotalCntCallback = function (resolve, res) {
            console.log("OrderTotalCntCallback", res)
            parentObj.setData({orderTotalCnt: res})
        }
        // parentObj.setData({"hotListPage":parentObj.data.hotListPage + 1})
        var data = {}
        app.httpRequest('getUserInfo', data, GetUserInfoCallback);
        app.httpRequest('orderTotalCnt', data, OrderTotalCntCallback);
        this.setData({isGuest:app.globalData.isGuest})
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
        return app.shareMyApp(1, 8, '首页~','首页的内容',null)
    },
})
