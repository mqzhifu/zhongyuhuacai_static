const app = getApp()
const Logs = require("../../../utils/log.js")
Page({
    data: {
        process: 140,
        processFull: 570
    },
    //左侧向右侧 ，滑动 进度条
    setLeftProcess: function (num) {
        var difference = this.data.processFull - this.data.process;
        var persent = difference / 100
        persent = parseInt(persent)

        var vv = this.data.process + num * persent
        this.setData({process: vv})
    },


    onLoad: function (options) {
        Logs.onload("loading",options)

        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            this.startPage

        )
    },


    startPage: function () {
        // this.setLeftProcess(100)
        app.goto(2, 1, null)
        // var parentObj = this
        // setTimeout(function() {
        //
        //     console.log("im settimeout")
        //     parentObj.setLeftProcess(100)
        // }, 2000);
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    onShareAppMessage: function () {
        return app.shareMyApp(1, 14, '首页~','首页的内容',null)
    },


})