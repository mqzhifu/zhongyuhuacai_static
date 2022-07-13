const app = getApp()
const Logs = require("../../../utils/log.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        uinfo: [],
        // orderTotalCnt:[],
        // callMobileNumber:"4000000000",
        // collect_cnt:0,
        // view_product_history_cnt:0,
        // isGuest:0,
    },
    // onRouteEdit() {
    //     wx.navigateTo({url: '/pages/my/edit/edit'})
    // },

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


    getPhoneNumber(e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)

        var data = {
            'iv': e.detail.iv,
            'encryptedData': e.detail.encryptedData,
            'sessionKey': app.globalData.sessionKey
        }
        console.log("sess",app.globalData.sessionKey)

        var decodeCallback = function (res) {
            console.log("decodeCallback", res)
        }

        // app.httpRequest("decodeWxEncryptedData", data, decodeCallback)
    },

    goto_refund_list:function(){
        // var data = {oid:32}
        app.goto(1,25,null)
    },

    initUserData: function () {
        var parentObj = this
        var GetUserInfoCallback = function (resolve, res) {
            console.log("GetUserInfoCallback callback", res)
            parentObj.setData({uinfo: res})
        }

        var data = {}
        app.httpRequest('getUserInfo', data, GetUserInfoCallback);

        // this.setData({isGuest:app.globalData.isGuest})
    },

    login : function(){
        app.initUserInfo()
    },


    onReady: function () {
    },

    /*
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.shareMyApp(1, 8, '首页~','首页的内容',null)
    },
})
