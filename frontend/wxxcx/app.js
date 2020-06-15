//app.js
App({
    onLaunch: function () {
    },
    //初始化 - 登陆 
    loginInit : function(){
        //先查看  全局变量中 是否已经存在token,如果存在，之前就已经初始化过一次
        if(this.globalData.serverToken){
            console.log(this.globalData.moduleName," globalData has serverToken")
            this.globalData.promiseResolve()
            return -1
        }
        // this.showUnAuthorityWin()

        //全局变量中没有token信息，从客户端中的DB，获取一下TOKEN，如果存在 的话，放置 全局变量中
        var storageServerToken = wx.getStorageSync('serverToken')
        var storageSessionKey  = wx.getStorageSync('sessionKey')

        if(storageServerToken && !this.isUndefined(storageServerToken)){
            console.log(this.globalData.moduleName,"user local Storage has serverToken ",storageServerToken , " has sessionKey",storageSessionKey)

            console.log(this.globalData.moduleName,"load to set globalData : ")
            this.globalData.serverToken = storageServerToken
            this.globalData.sessionKey  = storageSessionKey


            this.checkToken(storageServerToken)

            this.initLocation()
            this.globalData.promiseResolve()
        }else{
            console.log(this.globalData.moduleName,"local Storage|globalData no has , serverToken is null .");
            return this.loginUserInfoToken()
        }
    },
    loginUserInfoToken : function(){
        console.log(this.globalData.moduleName,"start loginUserInfoToken:")
        // 太费钱登录
        wx.login({
            success: res => {
                console.log(this.globalData.moduleName,"wx.login ok")
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (!res.code) {
                    console.log(this.globalData.moduleName,'wx 登录失败！' + res.errMsg)
                    return -1
                }

                console.log(this.globalData.moduleName,"wx login is ok")
                this.userInfoToken(res.code)
            },
            fail: function (res) {
                //console.log(res.data);
                console.log(this.globalData.moduleName,' wx.login is failed',res)
            }
        })
    },


    userInfoToken : function(code){
        var parentObj = this
        // 获取用户信息
        wx.getSetting({
            success: res => {
                console.log(parentObj.globalData.moduleName,"user wx setting ok",res)
                parentObj.globalData.userAuthSetting = res

                var wxCode = code
                //获取用户信息，必须得有，要拿code到server 换 sessionKey ，获取手机号数据解密的时候要用
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(parentObj.globalData.moduleName,"get wx userinfo ok",res)
                            // 可以将 res 发送给后台解码出 unionId
                            parentObj.globalData.userInfo = res.userInfo
                            parentObj.initServerToken(res,wxCode)
                        },
                        fail: function (res) {
                            //console.log(res.data);
                            console.log(parentObj.globalData.moduleName,' wx.getUserInfo is failed 1',res)
                            parentObj.showUnAuthorityWin("wx.getUserInfo")

                        }
                    })
                }else{

                    console.log(this.globalData.moduleName,' wx.getUserInfo is failed 2',res)
                    parentObj.showUnAuthorityWin('scope.userInfo')
                }
            },
            fail:res =>{
                parentObj.showUnAuthorityWin("wx.setting")
                console.log(this.globalData.moduleName,"get wx user setting fail",res)
            }

        })

    },


    initServerToken:function(wxBackInfo,wxCode){
        console.log(this.globalData.moduleName,wxBackInfo,wxCode)
        var parentObj = this
        // console.log("server token"+this.globalData.serverToken)
        //发起网络请求
        var back = function(resolve,data){
            console.log(parentObj.globalData.moduleName,"server login ok " , data)
            parentObj.globalData.serverToken = data.token
            parentObj.globalData.sessionKey = data.session_key

            wx.setStorageSync('serverToken',data.token)
            wx.setStorageSync('sessionKey',data.session_key)

            console.log(parentObj.globalData.moduleName,"set <serverToken> <sessionKey> : globalData && local storage!")
            resolve()
            parentObj.initLocation()
        }



        var dataRequest = {
            encryptedData: wxBackInfo.encryptedData,
            signature: wxBackInfo.signature,
            rawData: wxBackInfo.rawData,
            iv: wxBackInfo.iv,
            code: wxCode
        }

        this.httpRequest('login',dataRequest,back)
    },

    showUnAuthorityWin : function(str){
        var parentObj2 = this
        wx.showModal({
            title: '提示',
            content: '尚未进行授权'+str+'，请点击确定跳转到授权页面进行授权。',
            success: function (res) {
                if (res.confirm) {
                    console.log(this.globalData.moduleName,'用户点击确定')
                    parentObj2.goto(1,10,null)
                }else{
                    console.log(this.globalData.moduleName,"用户并未点击确定")

                }
            }
        })
    },

    httpRequest : function(urlKey,data,callback){
        var url = this.globalData.serverHost + this.globalData.serverUrl[urlKey]
        if(urlKey != 'login'){
            url += "?token="+ this.globalData.serverToken
        }
        console.log(this.globalData.moduleName,"httpRequest:",url,data,urlKey)
        var parentObj = this
        var promiseResolve = this.globalData.promiseResolve
        wx.request({
            dataType:'json',
            url: url,
            data: data,
            header: {
                'HTTP-CLIENT-TYPE': '2' // 默认值
            },

            success:function(callbackData){
                console.log(parentObj.globalData.moduleName,"first callback data",callbackData)
                // parentObj.globalData.httpRequestCode = callbackData.data.code
                if( (callbackData instanceof Array) || ( callbackData instanceof Object ) ){
                    if(callbackData.data.code == 200 || callbackData.code == "200"){
                        console.log(parentObj.globalData.moduleName,"server back "+callbackData.data.msg + " is ok!")
                        callback(promiseResolve,callbackData.data.msg)
                    }else{
                        console.log(parentObj.globalData.moduleName,"request ok,but app back err !!!",callbackData.data.code)
                        wx.showToast({ title: 'err:'+callbackData.data.msg, icon: 'none' })
                        // callbackData(promiseResolve,callbackData.data.msg,)
                    }
                }else{
                    console.log(parentObj.globalData.moduleName,"fatal err server error!!!",callbackData)
                }

            },
        })
    },

    isUndefined:function(value){
        console.log(this.globalData.moduleName," check isUndefined "+value + " typeof :"+typeof(tmp))
        if(value == 'undefined' || value == undefined){
            return 1
        }
        return 0
    },


    initLocation :function(){
        // console.log("initLocation")
        var parentObj = this
        wx.getLocation({
            type: 'wgs84',
            isHighAccuracy:true,
            altitude:true,
            success (res) {
                console.log(parentObj.globalData.moduleName,"wx getLocation sucess:",res)
                var back = function(msg){
                    console.log(parentObj.globalData.moduleName,"登陆地点",msg)
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
                console.log(parentObj.globalData.moduleName,' initLocation wgs84fail',res);
            }
        })
    },


    shareMyApp:function(channel,title,content,data){
        console.log(this.globalData.moduleName,"shareMyApp ",channel,title,content,data)
        var url = this.globalData.map[channel].url
        console.log(url)
        if(data && !this.isUndefined(data)){
            url = this.replaceStr( url ,data)
        }
        return {
            title: title,
            desc: content,
            path: url

        }
    },

    goto:function(type,channel,data){
        console.log(this.globalData.moduleName,"goto",type,channel,data)

        var url =this.globalData.map[channel].url
        console.log(url)
        if(data && !this.isUndefined(data)){
            url = this.replaceStr( url ,data)
        }

        if(type == 1){
            this.navigateGoto(url)
        }else if(type == 2){
            this.switchGoto(url)
        }else{
            console.log(this.globalData.moduleName,"goto type err.",type)
        }
    },


    checkToken:function(token){
        var parentObj = this
        var checkCallback = function(res){
            console.log(parentObj.globalData.moduleName,"check token callback",res)
        }

        var data = {'token':token}
        this.httpRequest('checkToken',data,checkCallback)
    },

    replaceStr:function(str,data){
        for(let key  in data){
            str = str.replace( "#"+key+"#" ,data[key])
        }
        return str
    },

    navigateGoto:function(url){
        console.log(this.globalData.moduleName,"navigateGoto：",url)
        wx.navigateTo({
            url: url
        })
    },


    switchGoto:function(url){
        console.log(this.globalData.moduleName,"switchGoto：",url)
        wx.switchTab({
            url: url
        })
    },
    getObjCount:function(obj){
        var cnt = 0
        for (var key in obj) {
            cnt++
        }
        return cnt;
    },

    logger:function(msg,module = ""){
        console.log(module,msg)
    },
    // setSelfGlobal:function(key,value){
    //     // this.globalData.serverToken = storageServerToken;
    //     this.globalData.key = value
    //     console.log("setSelfGlobal",key,this.globalData.key)
    // },

    getServerUrlAction:function(urlKey){
        var url = this.globalData.serverHost + this.globalData.serverUrl[urlKey]
        return url
    },

    globalData: {
        moduleName :"app",
        // headerTitle:"新零售 云分享2",
        noImgUrl : "https://api.day900.com/noimg.png",
        userInfo: null,
        serverToken:"",
        serverHost :"https://api.day900.com/",
        promiseResolve : null,
        sessionKey : "",

        userAuthSetting : null,

        // httpRequestCode :0,

        //操蛋的微信，不让跑tab传参数
        searchKeyword:"",
        searchCategory:0,
        // searchOrderType :0,

        serverUrl : {
            "login":"login/wxLittleLoginByCode/",
            "getBannerList":"index/getBannerList/",
            "getRecommendProductList":"product/getRecommendList/",
            "search":"product/search/",
            'getAllCategory':"product/getAllCategory/",
            'location':"index/wxPushLocation/",
            'productDetail':"product/getOneDetail/",
            'getUserHistoryPVList':"product/getUserHistoryPVList/",
            'getNearUserBuyHistory':"order/getNearUserBuyHistory/",
            'getCommentList':'product/getCommentList/',

            'collect':'product/collect/',
            'cancelCollect':'product/cancelCollect/',
            'up':'product/up/',
            'cancelUp':'product/cancelUp/',

            'getSearchAttr':'product/getSearchAttr/',
            'addUserCart':"order/addUserCart/",
            'confirmOrder':"order/confirmOrder/",
            "getUserCart":"order/getUserCart/",
            "orderDoing":"order/doing/",
            "checkToken":"index/checkToken/",
            "decodeWxEncryptedData":"login/decodeWxEncryptedData/",
            'orderPay':"order/pay/",
            'getGoodsIdByPcap':"order/getGoodsIdByPcap/",
            'getUserAddressList':"user/getAddress/",
            'delUserCart':"order/delUserCart/",
            'getUserInfo':"user/getOneDetail/",
            'getUserOrderList':"order/getUserList/",
            "delUserCart":"order/delUserCart/",
            'upAvatar':"user/upAvatar/",
        },

        map :{
            1:{title:"首页",url:"/pages/index/index"},
            2:{title:"产品详情页",url:"/pages/goodsDetail/goodsDetail?pid=#pid#"},
            3:{title:"产品列表页",url:"/pages/goods/index"},
            4:{title:"购物车列表",url:"/pages/cart/index"},
            5:{title:"订单确认",url:"/pages/my/orderConfirm/orderConfirm?gidsNums=#gidsNums#"},
            // 6:{title:"订单编辑",url:"/pages/index/index"},
            7:{title:"订单列表",url:"/pages/my/orders/orders"},
            // 8:{title:"个人中心",url:"/pages/index/index"},
            // 9:{title:"挑选地址",url:"/pages/index/index"},
            10:{title:"授权页面",url:"/pages/other/authority/authority"},
            // 11:{title:"根据属性参数获取商品ID",url:"/pages/my/orderConfirm/orderConfirm?pid=#pid#&goods=#goods#&num=#num#"},

        },


    }
})