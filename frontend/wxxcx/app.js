//app.js
App({
    // onLaunch: function () {
    //
    // },
    //初始化 - 登陆
    loginInit : function(){
        //登陆/注册流行
        //1检查变量是否有TOKEN
        //2检查用户手机本地数据库，是否有TOKEN
        //3正常，走一遍，正常登陆流程
        //  (1)先走微信的登陆，再走微信的获取用户基础信息
        //  (2)微信的没有问题后，拿到数据再请求后端
        //  (3)后端先判断当前用户是否存在，如果不存在就注册一个
        //  (4)生成TOKEN返回给C端
        //4拿到C端返回的token存到用户本地DB中


        //先查看  全局变量中 是否已经存在token,如果存在，之前就已经初始化过一次
        if(this.globalData.serverToken){
            console.log(this.globalData.moduleName," globalData has serverToken , no need init ")
            this.globalData.promiseResolve()
            return -1
        }
        //全局变量中没有token信息，那就从客户端中的DB，获取一下TOKEN，如果存在 的话，放置 全局变量中
        var storageServerToken = wx.getStorageSync('serverToken')
        var storageSessionKey  = wx.getStorageSync('sessionKey')

        if(storageServerToken && !this.isUndefined(storageServerToken)){
            console.log(this.globalData.moduleName,"user local Storage has serverToken ",storageServerToken , " has sessionKey",storageSessionKey)

            this.checkToken(storageServerToken)


            console.log(this.globalData.moduleName,"load Storage data and  set globalData : ")
            this.globalData.serverToken = storageServerToken
            this.globalData.sessionKey  = storageSessionKey


        }else{
            console.log(this.globalData.moduleName,"local Storage|globalData no has , serverToken is null .");
            return this.loginUserInfoToken()
        }
    },
    loginUserInfoToken : function(){
        console.log(this.globalData.moduleName,"start loginUserInfoToken:")
        var parentObj = this
        // 先执行微信 - 登录
        wx.login({
            success: res => {
                console.log(parentObj.globalData.moduleName,"wx.login ok")
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (!res.code) {
                    console.log(parentObj.globalData.moduleName,'wx 登录失败！' + res.errMsg)
                    return -1
                }

                // console.log(parentObj.globalData.moduleName,"wx login is ok")
                this.userInfoToken(res.code)

            },
            fail: function (res) {
                wx.showToast({ title: 'err:'+"微信登陆失败，可能是您的手机微信版本太低，请重启下APP，再试一下", icon: 'none' })
                //console.log(res.data);
                console.log(parentObj.globalData.moduleName,' wx.login is failed',res)
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
                            wx.showToast({ title: 'err:'+"抱歉获取信息失败，因为下单会需要基础信息...", icon: 'none' })
                            console.log(parentObj.globalData.moduleName,' wx.getUserInfo is failed 1',res)
                            parentObj.showUnAuthorityWin("wx.getUserInfo")

                        }
                    })
                }else{

                    console.log(parentObj.globalData.moduleName,' wx.getUserInfo is failed 2',res)
                    parentObj.showUnAuthorityWin('scope.userInfo')
                }
            },
            fail:res =>{
                wx.showToast({ title: 'err:'+"抱歉获取授权信息失败，请手动授权...", icon: 'none' })
                parentObj.showUnAuthorityWin("wx.setting")
                console.log(parentObj.globalData.moduleName,"get wx user setting fail",res)
            }

        })

    },

    cleanToken:function(){
        wx.setStorageSync('serverToken','')
        wx.setStorageSync('sessionKey','')

        this.globalData.serverToken = ''
        this.globalData.sessionKey = ''
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
            parentObj.initLoginAfter()
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

    initLoginAfter:function(){
        this.initLocation()
        this.checkCartRedDot()
        this.initServerUserInfo()
        this.initClientInfo()

    },

    initClientInfo:function(){
        var parentObj = this
        wx.getSystemInfo({
            success (res) {
                console.log("initClientInfo",res)
                parentObj.globalData.systemInfo = res
            }
        })
    },

    initServerUserInfo : function(){
        var parentObj = this
        var userinfoback = function(r,res){
            console.log("initServerUserInfo back ",res)
            parentObj.globalData.serverUserInfo = res ;
        }
        this.httpRequest("getUserInfo",null,userinfoback)
    },

    showUnAuthorityWin : function(str){
        var parentObj2 = this
        wx.showModal({
            title: '提示',
            content: '尚未进行授权'+str+'，请点击确定跳转到授权页面进行授权。',
            success: function (res) {
                if (res.confirm) {
                    console.log(parentObj2.globalData.moduleName,'用户点击确定')
                    parentObj2.goto(1,10,null)
                }else{
                    console.log(parentObj2.globalData.moduleName,"用户并未点击确定")

                }
            }
        })
    },

    objToStr : function(obj,limit){
        // console.log("im objToStr",obj)
        if(this.isUndefined(obj)){
            return ""
        }


        if(this.isEmptyObject(obj)){
            return "";
        }
        var str = "";
        for(let key  in obj){
            str += key+":"+ obj[key] + limit
        }
        // console.log("im objToStr",str)
        str = str.substr(0,str.length-1)
        return str
    },

    httpRequest : function(urlKey,data,callback){
        var url = this.globalData.serverHost + this.globalData.serverUrl[urlKey]
        console.log("url",url,urlKey)
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
                'X-CLIENT-TYPE': '2', // 默认值
                'X-CLIENT-DATA': this.objToStr(this.globalData.systemInfo,","),
                // 'X-CLIENT-DATA':this.globalData.systemInfo,
            },

            success:function(callbackData){
                console.log(parentObj.globalData.moduleName,"first callback data",callbackData,urlKey)
                // parentObj.globalData.httpRequestCode = callbackData.data.code
                if( (callbackData instanceof Array) || ( callbackData instanceof Object ) ){
                    //这里有个特殊的处理，要把SERVER端的返回数据原封不动的给到调用者，其它情况，都只返回data
                    if(urlKey == 'checkToken'){
                        callback(promiseResolve,callbackData.data)
                    }else{
                        if(callbackData.data.code == 200 || callbackData.code == "200"){
                            // console.log(parentObj.globalData.moduleName,"server back "+callbackData.data.msg + " is ok!")
                            callback(promiseResolve,callbackData.data.msg)
                        }else{
                            console.log(parentObj.globalData.moduleName,"err : request ok,but app back err !!!",callbackData)
                            wx.showToast({ title: 'err:'+callbackData.data.msg, icon: 'none' })
                        }
                    }




                }else{
                    console.log(parentObj.globalData.moduleName,"fatal err server error!!!",callbackData)
                }

            },
            fail:function(res){
                console.log("err httpRequest:",res)
            }
        })
    },

    // isEmptyArray : function(value){
    //     if( !  value instanceof Array ){
    //         return 0;
    //     }
    //     if(value.length == 0  ){
    //         return 1
    //     }
    //
    //     return 0
    // },

    isEmptyArray : function(value){
        if(!this.isArray(value)){
            return 0
        }

        if(value.length == 0){
            return 1
        }

        return 0
    },

    isEmptyObject : function(value){
        console.log("isEmptyObject",typeof value)
        if( typeof (value) != 'object' ){
            return 0
        }

        var cnt = this.getObjCount(value)
        if(!cnt || cnt<=0){
            return 1
        }

        return 0
    },

    isArray : function(value){
        if(value instanceof Array){
            return 1
        }
        return 0
    },

    isNull:function(value){
        if(value == 'null' || typeof (value) == 'null' || value === null  ){
            return 1
        }

        return 0
    },

    isUndefined:function(value){
        console.log(this.globalData.moduleName," <check isUndefined> "+value + " typeof :"+typeof(tmp))
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
                // const latitude = res.latitude
                // const longitude = res.longitude
                // const speed = res.speed
                // const accuracy = res.accuracy
            },
            fail: function (res) {
                //返回fail:invalid data
                console.log(parentObj.globalData.moduleName,' initLocation wgs84fail',res);
            }
        })
    },

    showToast:function(msg){
        wx.showToast({
            title: msg,
            icon: 'success', //图标,
        })
    },


    shareMyApp:function(channel,source,title,content,data){
        console.log(this.globalData.moduleName,"shareMyApp ",channel,source,title,content,data)
        var url = this.globalData.map[channel].url
        console.log(url)
        if(data && !this.isUndefined(data)){
            url = this.replaceStr( url ,data)
        }
        

        if(channel == 2 ){//产品详情页做个特殊处理
            url += "&share_uid="+this.globalData.serverUserInfo.id;
        }
        console.log(" share final url",url)
        return {
            title: title + source,
            desc: content,
            path: url
        }
    },

    goto:function(type,channel,data){
        console.log(this.globalData.moduleName,"goto",type,channel,data)

        var url =this.globalData.map[channel].url
        // console.log(url)
        if(data && !this.isUndefined(data)){
            url = this.replaceStr( url ,data)
        }

        if(channel == 5){
            if(!this.isUndefined(data.share_uid)){
                url += "&share_uid="+data.share_uid
            }

            if(!this.isUndefined(data.selAddress)){
                url += "&selAddress="+data.selAddress
            }
        }

        console.log(url)

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
        var checkCallback = function(r,res){
            console.log(parentObj.globalData.moduleName,"checkToken callback",res)
            if(res.code != 200 || res.code != '200'){
                wx.showToast({ title: 'err:'+"抱歉~登陆信息异常，请重新登陆", icon: 'none' })
                parentObj.goto(1,13,null)
            }else{
                parentObj.initLoginAfter()
                parentObj.globalData.promiseResolve()
            }
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

    //很多页面，底部，都会有推荐产品列表的功能
    RecommendProductPage : function(source){

    },
    //以弱类型方式，检查一个变量是否为空
    weakCheckscalarEmpty : function(value){
        if(!value || this.isUndefined(value) || this.isNull(value) ){
            return 1
        }

        return 0
    },
    //以弱类型方式，检查一个变量是否为 空对象 或者 空数据
    // weakCheckArrObjEmpty : function(value){
    //     if(!value || this.isEmptyObject(value) || this.isArray(value) ){
    //         return 1
    //     }
    //
    //     return 0
    // },

    getServerUrlAction:function(urlKey){
        var url = this.globalData.serverHost + this.globalData.serverUrl[urlKey]
        return url
    },
    //初始化，底部导航的，购买车的，小红点
    checkCartRedDot :function(){
        // console.log("getUserCartCntCallback")
        var parentObj = this
        var getUserCartCntCallback = function(r,res){
            console.log(parentObj.globalData.moduleName,"getUserCartCntCallback",res)
            parentObj.globalData.userCartCnt = res

            if(res && res > 0){
                //显示小红点
                wx.showTabBarRedDot({
                    index:2,
                    success:function(res){
                        console.log(parentObj.globalData.moduleName,"showTabBarRedDot ok",res)
                    },
                    fail:function(res){
                        console.log(parentObj.globalData.moduleName,"showTabBarRedDot err",res)
                    },
                })
            }else{
                //隐藏小红点
                wx.hideTabBarRedDot({
                    index:2,
                    success:function(res){
                        console.log(parentObj.globalData.moduleName,"hideTabBarRedDot ok",res)
                    },
                    fail:function(res){
                        console.log(parentObj.globalData.moduleName,"hideTabBarRedDot err",res)
                    },
                })
            }

        }

        this.httpRequest("getUserCartCnt",{},getUserCartCntCallback)
    },

    pay :function(oid,payType){

        var parentObj = this
        var orderPayCallback = function(resov,res) {
            console.log("orderPayCallback",res)
            var data = {
                'timeStamp': res.timeStamp,
                'nonceStr': res.nonceStr,
                'package': res.package,
                'signType':  res.signType,
                'paySign':  res.paySign,
                'success':function(res){
                    console.log("ok",res)
                    parentObj.goto(1,7,null)
                },
                'fail':function(res){
                    console.log("fail",res)
                }
            }

            wx.requestPayment(data)
            // app.goto(1,7,null)
        }

        var data = {'type':payType,"oid":oid}
        this.httpRequest('orderPay',data,orderPayCallback)
    },

    globalData: {
        //用户基础信息
        serverUserInfo : {},
        //用户购物车里有多少件商品
        userCartCnt:0,
        moduleName :"app",
        // headerTitle:"新零售 云分享2",
        noImgUrl : "https://api.day900.com/noimg.png",
        userInfo: null,
        serverToken:"",
        serverHost :"https://api.day900.com/",
        promiseResolve : null,
        //用户登陆成功后，把CODE给SERVER，SERVER获取用户信息，所得到的值
        //此值，主要给前端用于获取手机号
        sessionKey : "",
        //用户已授权信息
        userAuthSetting : null,
        //用户手机信息收集
        systemInfo :{},
        //操蛋的微信，不让跑tab传参数
        searchKeyword:"",
        searchCategory:0,
        // searchOrderType :0,


        orderConfirmGotoAddressSavePara :null,

        //所有 server http 请求地址
        serverUrl : {
            'location':"index/wxPushLocation/",//推送用户GPS位置信息
            "checkToken":"index/checkToken/",//检查token是否有效
            "getShareQrCode":"/wxLittleCallback/getShareQrCode/",//获取产品详情页的，分享二维码的图片
            "sendServerLog":"/wxLittleCallback/log/",//将客户端日志发推送到服务端
            "login":"login/wxLittleLoginByCode/",//登陆
            "decodeWxEncryptedData":"login/decodeWxEncryptedData/",//解析从微信获取的用户数据，目前没用
            //========================================================
            //首页
            "getBannerList":"index/getBannerList/",//首页轮播
            "getRecommendProductList":"product/getRecommendList/",//首页推荐产品
            //产品列表-搜索
            "search":"product/search/",//搜索产品
            'getAllCategory':"product/getAllCategory/",//获取所有产品分类
            'getSearchAttr':'product/getSearchAttr/',//获取搜索产品的筛选条件
            //详情页


            'getOrderOneDetail':"order/getOneDetail/",//订单详情
            'productDetail':"product/getOneDetail/",//产品详情
            'getUserHistoryPVList':"product/getUserHistoryPVList/",//一个产品的，最近访客
            'getNearUserBuyHistory':"order/getNearUserBuyHistory/",//一个产品的，最近购买的用户，记录
            'getCommentList':'product/getCommentList/',//一个产品的，评论记录列表
            'collect':'product/collect/',//收藏一个产品
            'cancelCollect':'product/cancelCollect/',//取消收藏一个产品
            'up':'product/up/',//点赞一个产品
            'cancelUp':'product/cancelUp/',//取消 点赞一个产品
            //购物车相关
            'addUserCart':"order/addUserCart/",//添加一个产品到购物车
            "getUserCart":"order/getUserCart/",//获取用户购买车里的产品
            "getUserCartCnt":"order/getUserCartCnt/",//获取用户购物车里的产品数量
            'delUserCart':"order/delUserCart/",//删除用户购物车里的一个记录
            //订单相关
            'getUserOrderList':"order/getUserList/",//获取用户订单列表
            'confirmOrder':"order/confirmOrder/",//订单确定 页面
            "orderDoing":"order/doing/",//下单执行
            'orderPay':"order/pay/",//唤起微信支付
            "orderCancel":"order/cancel/",//取消一个订单
            "confirmReceive":"order/confirmReceive/",//订单确认收货
            "applyRefund":"order/applyRefund/",//申请退款
            'getGoodsIdByPcap':"order/getGoodsIdByPcap/",
            'orderTotalCnt':'order/getUserCnt/',
            //用户相关
            'getUserAddressList':"user/getAddressList/",//获取用户收货地址列表
            'getUserAddressDefault':"user/getUserAddressDefault/",//获取用户默认-收货地址列表
            'getUserInfo':"user/getOneDetail/",//获取用户基础信息
            'upAvatar':"user/upAvatar/",//更新头像
            'getCollectList':"user/getCollectList/",
            'viewProductHistory':"user/viewProductHistory/",
            'parserAddressByStr':"index/parserAddressByStr/",
            "addAddress":"user/addAddress/",
            // "getProvince":"",
            // "getCityByProvinceCode":"",
            // "getCountyByCityCode":"",
            // "getTownByCountyCode":"",
            "getCollectListCnt":"user/getCollectListCnt/",
            "viewProductHistoryCnt":"user/viewProductHistoryCnt/",
            "getAddressById":"user/getAddressById/",

            "addComment":"product/comment/",
            "uploadCommentPic":"product/uploadCommentPic/",
            "uploadCommentVideo":"product/uploadCommentVideo/",
        },

        map :{
            //所有 页面的，mapping 跳转
            1:{title:"首页",url:"/pages/index/index"},
            2:{title:"产品详情页",url:"/pages/goodsDetail/goodsDetail?pid=#pid#"},
            3:{title:"产品列表页",url:"/pages/goods/index"},
            4:{title:"购物车列表",url:"/pages/cart/index"},
            5:{title:"订单确认",url:"/pages/my/orderConfirm/orderConfirm?gidsNums=#gidsNums#"},
            // 6:{title:"订单编辑",url:"/pages/index/index"},
            7:{title:"订单列表",url:"/pages/my/orders/orders?tabId=#tabId#"},
            8:{title:"个人中心",url:"/pages/my/index/index"},
            9:{title:"挑选地址列表",url:"/pages/my/address/address?source=#source#"},
            10:{title:"授权页面",url:"/pages/other/authority/authority"},
            11:{title:"个人中心编辑",url:"/pages/my/edit/edit"},
            12:{title:"授权页面",url:"/pages/other/authority/authority"},
            13:{title:"清理缓存",url:"/pages/other/clear/cache"},
            14:{title:"loadding页",url:"/pages/other/loading/loading"},
            15:{title:"渲染分享朋友圈图片",url:"/pages/other/canvasShareImg/canvasShareImg"},
            16:{title:"用户收藏列表",url:"/pages/collect/collect"},
            17:{title:"用户浏览记录",url:"/pages/history/history"},
            18:{title:"添加新收货地址",url:"/pages/createAddress/createAddress"},
            19:{title:"添加评论",url:"/pages/my/comment/comment?oid=#oid#"},

        },
    }
})