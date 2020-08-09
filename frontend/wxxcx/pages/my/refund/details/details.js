const app = getApp()
const Logs = require("../../../../utils/log.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        oid: 0,
        refundConst: [],
        order: [],
        type: 1,
        reason: 1,
        inputWordCnt: 170,//最多可输入多少个字
        content: "",
        mobile: "",
        uploadPicUrl:"",
        uploadPicBaseUrl : "",
    },

    listenContentInput: function (e) {
        var inputValue = e.detail.value
        this.setData({content: inputValue})

        var cnt = this.data.inputWordCnt
        cnt--

        console.log("cnt", cnt)
        this.setData({inputWordCnt: cnt})
    },

    listenMobileInput: function (e) {
        var inputValue = e.detail.value
        this.setData({mobile: inputValue})
    },


    /**
     * 生命周期函数--监听页面加载zeeee
     */
    onLoad: function (options) {
        Logs.onload("my_refund_details", options)

        this.setData({oid: options.oid})
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initRefundDetailsData()
            }
        )
    },

    initRefundDetailsData: function () {
        var parentObj = this
        this.setData({refundConst: app.globalData.refundConst})
        console.log("refundConst", this.data.refundConst)

        var getOrderInfoBack = function (rr, res) {
            console.log("getOrderInfoBack", res)
            parentObj.setData({order: res})
        }

        app.httpRequest("getOrderById", {id: this.data.oid}, getOrderInfoBack)
    },


    // 拨打联系电话
    // onCallTel(e) {
    //     wx.makePhoneCall({
    //         phoneNumber: '03123688777',
    //     })
    // },

    // 提交申请
    onSubmitApply() {

        var data = {
            id: this.data.oid,
            type: this.data.type,
            reason: this.data.reason,
            content:this.data.content,
            mobile:this.data.mobile,
            pic:this.data.uploadPicBaseUrl
        }


        var parentObj = this

        var applyRefundBack = function (rr, res) {
            console.log('applyRefundBack', res)
            var data = {id:res}
            app.goto(1,23,data)
        }


        app.httpRequest("applyRefund", data, applyRefundBack)

        // wx.navigateTo({
        //     url: '/pages/my/refund/processing/processing',
        // })
    },

    uploadPic: function () {
        // var PicListBalance = this.getPicListBalance()
        // console.log("PicListBalance",PicListBalance)
        var parentObj = this
        // if(PicListBalance <=0){
        //     wx.showToast({
        //         title: "抱歉，最多只能上传" + parentObj.data.maxPicUploadCnt + "张图片" ,
        //         icon: 'success', //图标,
        //     })
        //
        //     return -1
        // }
        wx.chooseImage({
            count: 1,
            // sizeType: ['original', 'compressed'],
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success(res) {
                console.log("upload avatar images is ok .", res);
                // tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths

                parentObj.setData({uploadPicUrl:tempFilePaths})

                console.log("tempFilePaths",tempFilePaths)

                var url = app.getServerUrlAction("applyRefundUploadPic") + "&token=" + app.globalData.serverToken

                console.log(url, tempFilePaths)
                var pparentObj = parentObj
                wx.uploadFile({
                    url: url,
                    filePath: tempFilePaths[0],
                    name: 'pic',
                    header: {"Content-Type": "multipart/form-data"},
                    formData: {"fromWX": "upupup"},
                    success: function (res) {
                        console.log("wx back ", res)
                        console.log("to json",res.data)
                        // var finalRes =eval('(' +  res.data + ')')
                        var finalRes  =  app.strToJson(res.data)
                        pparentObj.setData({uploadPicBaseUrl:finalRes.msg.tmpUrl})
                    },
                    fail: function (res) {
                        console.log('fail', res);
                    },
                })

            },
            fail(res) {
                console.log("upload uploadPic image is fail.", res)
            }
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