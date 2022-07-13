const Logs = require("../../../utils/log.js")
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        source : "",
    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Logs.onload("user_address_list", options)
        this.setData({source:options.source})
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initAddress();
            }
        )
    },

    editOne:function(e){
        var id = e.currentTarget.dataset.id
        console.log("edit",id)
        var data = {source:this.data.source,"editId":id}
        app.goto(1,21,data)
    },

    // selAddress:function(e){
    //     var id = e.currentTarget.dataset.id
    //     console.log("selAddress",id)
    //     // var data = app.globalData.orderConfirmGotoAddressSavePara
    //     // data.selAddress = id
    //     // app.goto(1,5,data)
    // },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (options) {

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

    addAddress : function(){
        var data = {source:this.data.source,"editId":0}
        app.goto(1,21,data)
    },

    initAddress: function () {
        var parentObj = this
        var addressListCalback = function (r, res) {
            console.log("UserAddrListCallback", res)
            if (!res) {
                console.log("notice: user address is null")
            }
            parentObj.setData({

                "addressList": res
            })
        }

        app.httpRequest('getUserAddressList', [], addressListCalback)
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
        return app.shareMyApp(1, 9, '首页~','首页的内容',null)
    }
})