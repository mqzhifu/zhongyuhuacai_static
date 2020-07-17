const app = getApp()
const Logs = require("../../../utils/log.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        maxPicUploadCnt :5,
        value: 0,
        // 上传图片列表,只能传5张，开5个占位符
        picList: ["","","","",""],
        uploadVideo : "",
        thumbTempFilePath:"",
        oid: 0,
        product: {},
        content: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (requestData) {
        Logs.onload("order", requestData)
        if (requestData && !app.isUndefined(requestData.oid)) {
            this.setData({oid: requestData.oid})
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
                parent.initOrderDetailData();
            }
        )
    },

    getPicListBalance : function(){
        var i = 0
        var cnt = 0;
        for(i =0;i<this.data.picList.length;i++){
            if(!this.data.picList[i]){
                cnt++
            }
        }

        console.log("getPicListBalance cnt",cnt)
        return cnt
        // if(cnt >= this.data.maxPicUploadCnt){
        //     return 0
        // }
        //
        // return this.data.maxPicUploadCnt - cnt
    },

    uploadVideo:function(){
        if(this.data.uploadVideo){
            wx.showToast({
                title: "抱歉，最多只能上传" +"1" + "个视频" ,
                icon: 'success', //图标,
            })

            return -1
        }
        var parentObj = this
        wx.chooseVideo({
            // count: 1,
            // sizeType: ['original', 'compressed'],
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            compressed: true,
            success(res) {
                console.log("upload video images is ok .", res);
                // tempFilePath可以作为img标签的src属性显示图片
                // var tempFilePaths = res.tempFilePaths
                console.log("tempFilePaths:",res.tempFilePath , "thumbTempFilePath",res.thumbTempFilePath)

                parentObj.setData({"uploadVideo":res.tempFilePath})
                parentObj.setData({"thumbTempFilePath":res.thumbTempFilePath})

            },
            fail(res) {
                console.log("upload video image is fail.", res)
            }
        })
    },

    uploadPic: function () {
        var PicListBalance = this.getPicListBalance()
        console.log("PicListBalance",PicListBalance)
        var parentObj = this
        if(PicListBalance <=0){
            wx.showToast({
                title: "抱歉，最多只能上传" + parentObj.data.maxPicUploadCnt + "张图片" ,
                icon: 'success', //图标,
            })

            return -1
        }

        var parentObj = this
        wx.chooseImage({
            count: PicListBalance,
            // sizeType: ['original', 'compressed'],
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success(res) {
                console.log("upload pic images is ok .", res);
                // tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                console.log("tempFilePaths:",tempFilePaths)

                var picList = parentObj.data.picList


                var i = 0
                var indexLocation = parentObj.data.maxPicUploadCnt - PicListBalance ;
                console.log("indexLocation",indexLocation)
                for(i =0;i<tempFilePaths.length;i++){
                    picList[indexLocation] = tempFilePaths[i]
                    indexLocation++
                }

                console.log("picList",picList)

                parentObj.setData({"picList":picList})

            },
            fail(res) {
                console.log("upload uploadPic image is fail.", res)
            }
        })
    },

    initOrderDetailData: function () {
        var parentObj = this
        var getOrderOneDetailCallback = function (r, res) {

            console.log("getOrderOneDetailCallback", res)
            parentObj.setData({"product": res[0]})

        }
        app.httpRequest("getOrderOneDetail", {"id": this.data.oid}, getOrderOneDetailCallback)
    },

    //评分
    onChange(e) {
        console.log('当前分值', e.detail);

    },

    contentBlur: function (e) {
        var content = e.detail.value
        // console.log("content:",content)
        this.setData({"content": content})
    },

    subCommon: function () {
        var content = this.data.content
        console.log(content)

        var parentObj = this
        if(!content){
            wx.showToast({
                title: "客官，好歹还是写几个汉字吧。当练手了~" ,
                icon: 'success', //图标,
            })

            return -1
        }

        var addCommentCallback = function(r,res){
            console.log("addCommentCallback",res)
            parentObj.checkAndUploadPicServer(res)
            parentObj.checkAndUploadVideoServer(res)
            wx.showToast({
                title: "感谢您的评价~" ,
                icon: 'success', //图标,
            })
            app.goto(1,7,null);
        }

        app.httpRequest("addComment",{"oid":this.data.oid,'title':"aa_test","content":content,'star':1} ,addCommentCallback )

    },

    checkAndUploadPicServer : function(comment_id){
        var PicListBalance =  this.getPicListBalance();
        if(PicListBalance == this.data.maxPicUploadCnt){//剩余等于最大上传图片数，就证明 一张图片没有
            console.log("no need upload pic")
        }else{
            var url = app.getServerUrlAction("uploadCommentPic") + "&token=" + app.globalData.serverToken + "&oid="+this.data.oid +"&cid="+comment_id
            // console.log(" wx request ",url, this.data.picList)

            var i = 0
            for(i =0;i<this.data.picList.length;i++){
                if(!this.data.picList[i]){
                    continue
                }

                wx.uploadFile({
                    url: url,
                    filePath: this.data.picList[i],
                    name: 'comment',
                    header: {"Content-Type": "multipart/form-data"},
                    formData: {"fromWX": "commentFile"},
                    success: function (res) {
                        console.log("wx request back ", res)
                    },
                    fail: function (res) {
                        console.log('fail', res);
                    },
                })
            }


        }
    },
    checkAndUploadVideoServer : function(comment_id){

        if(this.data.uploadVideo){
            var url = app.getServerUrlAction("uploadCommentVideo") + "&token=" + app.globalData.serverToken + "&oid="+this.data.oid +"&cid="+comment_id
            console.log(" wx request ",url, this.data.uploadVideo)
            wx.uploadFile({
                url: url,
                filePath:this.data.uploadVideo,
                name: 'comment',
                header: {"Content-Type": "multipart/form-data"},
                formData: {"fromWX": "commentFile"},
                success: function (res) {
                    console.log("wx back ", res)
                },
                fail: function (res) {
                    console.log('fail', res);
                },
            })
        }else{
            console.log(" no need upload video.")
        }

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
        return app.shareMyApp(1, 19, '首页~','首页的内容',null)
    }
})