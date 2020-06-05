//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        var parentThis = this


        // 获取用户信息
        wx.getSetting({
            success: res => {
                console.log("user wx setting",res)
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }

        })

        

    },

    loginInit : function(){
        if(this.globalData.serverToken){
            this.globalData.promiseResolve()
            return -1
        }

        var storageServerToken = wx.getStorageSync('serverToken')
        if(storageServerToken && !this.isUndefined(storageServerToken)){
            this.globalData.serverToken = storageServerToken;
            console.log("serverToken has,no need request "+storageServerToken)
            this.globalData.promiseResolve()
        }else{
            console.log("serverToken is is null");
            return this.loginToken()
        }
    },
    loginToken : function(){
        console.log("in loginToken")
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (!res.code) {
                    console.log('登录失败！' + res.errMsg)
                    return -1
                }

                console.log("wx login is ok")

            
                this.getToken(res.code)
            },
            fail: function (res) {
                //console.log(res.data);
                console.log(' wx.login is failed',res)
            }
        })
    },

    getToken : function(code){
        wx.getUserInfo({
            success: data =>{
                var parentObj = this
                // console.log("server token"+this.globalData.serverToken)
                //发起网络请求
                var back = function(resolve,token){
                    console.log("im back request server login back func. "+token)
                    // console.log("tttt token"+parentObj.globalData.serverToken)
                    parentObj.globalData.serverToken = token
                 
                    wx.setStorageSync('serverToken',token)
                    resolve()
                    parentObj.initLocation()
                }

                var dataRequest = {
                    encryptedData: data.encryptedData,
                    signature: data.signature,
                    rawData: data.rawData,
                    iv: data.iv,
                    code: code
                }
                // var dataRequest = ""

                this.httpRequest('login',dataRequest,back)
               
            },
            fail: function (res) {
                //console.log(res.data);
                console.log(' wx.getUserInfo is failed',res)
            }
        })
    },

    httpRequest : function(urlKey,data,callback){
        var url = this.globalData.serverHost + this.globalData.serverUrl[urlKey]
        if(urlKey != 'login'){
            url += "?token="+ this.globalData.serverToken
        }
        + "?token" + this.globalData.serverToken
        console.log("httpRequest:",url,data)
        var parent = this
        var promiseResolve = this.globalData.promiseResolve
        wx.request({
            dataType:'json',
            url: url,
            data: data,
            header: {
                'HTTP-CLIENT-TYPE': '2' // 默认值
            },
            success:function(callbackData){
                if(callbackData.data.code == 200 || callbackData.code == "200"){
                    console.log("server back "+callbackData.data.msg + " is ok!")
                    callback(promiseResolve,callbackData.data.msg)
                }else{
                    console.log("request server error!!!",callbackData)
                }
                
            },
        })
    },

    isUndefined:function(value){
        console.log(" isUndefined "+value + " typeof :"+typeof(tmp))
        if(value == 'undefined' || value == undefined){
            return 1
        }
        return 0
    },

    initLocation :function(){
        var parentObj = this
        wx.getLocation({
            type: 'wgs84',
            isHighAccuracy:true,
            altitude:true,
            success (res) {
                console.log("wx getLocation",res)
                var back = function(msg){
                    console.log("登陆地点",msg)
                }

                var dataRequest = {
                    latitude: res.latitude,
                    longitude:res.longitude
                }

                parentObj.httpRequest('location',dataRequest,back)
                const latitude = res.latitude
                const longitude = res.longitude
                const speed = res.speed
                const accuracy = res.accuracy
            },
            fail: function (res) {
                //返回fail:invalid data
                console.log('wgs84fail',res);
            }
        })
    },

    globalData: {
        userInfo: null,
        serverToken:"",
        serverHost :"https://api.day900.com/",
        promiseResolve : null,
        serverUrl : {
            "login":"login/wxLittleLoginByCode/",
            "getBannerList":"index/getBannerList/",
            "getRecommendProductList":"product/getRecommendList/",
            "search":"index/search/",
            'getAllCategory':"product/getAllCategory/",
            'location':"index/wxPushLocation/",
            'productDetail':"product/getOneDetail/"
        },
        pageData :{
            'index':{
                "getBannerList":null,
                'getCategoryList':null,
                'getRecommendProductList':null,
                'search':null
            }
        }
    }
})