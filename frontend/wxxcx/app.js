//app.js
App({
    // onLaunch: function () {
    //
    // },

    isEnvRelease : function(){
        if(this.globalData.env && this.globalData.env == 'release'){
            return 1
        }
        return 0
    },

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


        // var env =  __wxConfig.envVersion
        var accountInfo = wx.getAccountInfoSync();
        console.log('版本：', accountInfo);
        var env = accountInfo.miniProgram.envVersion
        if(!env || this.isUndefined(env)){
            this.globalData.env = "unknow"
        }else{
            this.globalData.env = env
        }


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
                console.log(parentObj.globalData.moduleName,"wx.login ok",res)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (!res.code) {
                    console.log(parentObj.globalData.moduleName,'wx.login 登录失败！' + res.errMsg)
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
        console.log("code",code)
        var parentObj = this
        // 先获取用户已经授权的列表，判断之前有没有授权过 - 用户信息
        wx.getSetting({
            success: res => {
                console.log(parentObj.globalData.moduleName,"user wx setting ok",res)
                parentObj.globalData.userAuthSetting = res

                var wxCode = code
                //获取用户信息，必须得有，要拿code到server 换 sessionKey ，获取手机号数据解密的时候要用
                if (res.authSetting['scope.userInfo']) {
                    // 之前，已经授过了，可以直接调用 getUserInfo 获取头像昵称，不会弹框
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
                            if(!parentObj.isEnvRelease()){
                                console.log(" env is release ,can goto authority Win")
                                parentObj.showUnAuthorityWin("wx.getUserInfo")
                            }
                        }
                    })
                }else{//之前没有授权过的，1 大概率是新用户 2 老用户就不想授权
                    console.log(parentObj.globalData.moduleName,' wx.getUserInfo is failed 2',res)
                    //操蛋的微信，不让卡死，必须支持游客模式
                    // parentObj.showUnAuthorityWin('scope.userInfo')
                    parentObj.initGuestServerToken(wxCode)
                }
            },
            fail:res =>{
                wx.showToast({ title: 'err:'+"抱歉用户已取授权列表-失败，请手动授权...", icon: 'none' })
                // parentObj.showUnAuthorityWin("wx.setting")
                console.log(parentObj.globalData.moduleName,"get wx user setting fail",res)
            }

        })

    },


    wxUserInfoBind : function(){
        console.log( "wxUserInfoBind")
        // 可以将 res 发送给后台解码出 unionId
        // parentObj.globalData.userInfo = res.userInfo

        var initUserInfoBack = function(rs){
            console.log("initUserInfoBack ",rs)
        }


        var dataRequest = {
            encryptedData: res.encryptedData,
            signature: res.signature,

            rawData: res.rawData,
            iv: res.iv,
        }

        this.httpRequest('wxUserInfoBind',dataRequest,initUserInfoBack)
    },

    initUserInfo : function(){
        var parentObj = this
        wx.getUserInfo({

            success: res => {
                console.log(parentObj.globalData.moduleName,"get wx userinfo ok",res)
                // 可以将 res 发送给后台解码出 unionId
                parentObj.globalData.userInfo = res.userInfo

                var initUserInfoBack = function(rr,rs){
                    console.log("initUserInfoBack ",rs)
                    parentObj.globalData.isGuest = 0
                }


                var dataRequest = {
                    encryptedData: res.encryptedData,
                    signature: res.signature,
                    rawData: res.rawData,
                    iv: res.iv,
                }

                this.httpRequest('wxUserInfoBind',dataRequest,initUserInfoBack)


            },
            fail: function (res) {
                wx.showToast({ title: 'err:'+"抱歉,获取用户信息失败，因为下单会需要基础信息...", icon: 'none' })
                console.log(parentObj.globalData.moduleName,' wx.getUserInfo is failed 1',res)
                parentObj.showUnAuthorityWin("wx.getUserInfo")

            }
        })
    },

    cleanToken:function(){
        wx.setStorageSync('serverToken','')
        wx.setStorageSync('sessionKey','')

        this.globalData.serverToken = ''
        this.globalData.sessionKey = ''
    },


    initGuestServerToken:function(wxLoginCode){
        console.log(this.globalData.moduleName,"initGuestServerToken","wxLoginCode",wxLoginCode)

        var parentObj = this
        // console.log("server token"+this.globalData.serverToken)
        //发起网络请求
        var back = function(resolve,data){
            console.log(parentObj.globalData.moduleName,"server login ok " , data)
            parentObj.globalData.serverToken = data.token
            // parentObj.globalData.sessionKey = data.session_key

            wx.setStorageSync('serverToken',data.token)
            // wx.setStorageSync('sessionKey',data.session_key)

            console.log(parentObj.globalData.moduleName,"set <serverToken>  : globalData && local storage!")
            resolve()
            parentObj.initLoginAfter()
        }

        var dataRequest = {
            code: wxLoginCode
        }

        this.httpRequest('login',dataRequest,back)
    },


    initServerToken:function(wxBackInfo,wxCode){
        console.log(this.globalData.moduleName,wxBackInfo,"wxCode",wxCode)
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
            // encryptedData: wxBackInfo.encryptedData,
            // signature: wxBackInfo.signature,
            rawData: wxBackInfo.rawData,
            // iv: wxBackInfo.iv,
            code: wxCode
        }

        this.httpRequest('login',dataRequest,back)
    },

    initLoginAfter:function(){
        this.initLocation()
        this.checkCartRedDot()
        this.initServerUserInfo()
        this.initClientInfo()
        this.initConst();
    },

    initConst : function(){
        var parentObj = this
        var refundConstBack = function(rr,res){
            parentObj.globalData.refundConst = res
        }

        this.httpRequest("getRefundConst",null,refundConstBack)
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
            var subNickname = res.nickname.substr(0,2)
            console.log(" substr nickname",subNickname)
            if(subNickname != '游客'){
                parentObj.globalData.isGuest = 0
            }

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

    strToJson:function(jsonStr){
        jsonStr = jsonStr.replace(" ", "");
        if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, "");
            return JSON.parse(jsonStr);
        }
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

    //pageChannel:分享后，用户点击跳转的页面地址
    //source:来源页面
    shareMyApp:function(pageChannel,source,title,content,data){
        console.log(this.globalData.moduleName,"shareMyApp ",pageChannel,source,title,content,data)
        var url = this.globalData.map[pageChannel].url
        console.log(url)
        if(data && !this.isUndefined(data)){
            url = this.replaceStr( url ,data)
        }

        var requestServerShareLogData = {
            'goto_page_path':url,
            'source': this.globalData.map[source].title,
            'pid':-1,
        }

        if(pageChannel == 2 ){//产品详情页做个特殊处理
            url += "&share_uid="+this.globalData.serverUserInfo.id;
            requestServerShareLogData.pid = data.pid
            requestServerShareLogData.goto_page_path = url
        }



        var requestServerShareLogDataCallback = function(a,b){

        }

        console.log(requestServerShareLogData);
        this.httpRequest("share",requestServerShareLogData,requestServerShareLogDataCallback)

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
                    var data = {"tabId":1}
                    parentObj.goto(1,7,data)
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
    getNowTimestamp : function(){
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        console.log("当前时间戳为：" + timestamp);
        return timestamp;
    },

    globalData: {
        env : "",//develop trial release
        isGuest:1,//游客模式，操蛋的微信，让登陆，但不让强制获取用户信息，而实际上微信登陆没有用户信息毛用没有
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

        //订单确认页，填写地址时，跳页面，得返回
        orderConfirmGotoAddressSavePara : [],

        //退款常量
        refundConst : [],


        //所有 server http 请求地址
        serverUrl : {
            //推送用户GPS位置信息
            'location':"index/wxPushLocation/",
            //检查token是否有效
            "checkToken":"index/checkToken/",
            //获取产品详情页的，分享二维码的图片
            "getShareQrCode":"/wxLittleCallback/getShareQrCode/",
            //将客户端日志发推送到服务端
            "sendServerLog":"/wxLittleCallback/log/",
            //登陆
            "login":"login/wxLittleLoginByCode/",
            //解析从微信获取的用户数据，目前没用
            "decodeWxEncryptedData":"login/decodeWxEncryptedData/",
            //========================================================
            //首页
            "getBannerList":"index/getBannerList/",//首页轮播
            "getRecommendProductList":"product/getRecommendList/",//首页推荐产品
            //产品列表-搜索
            "search":"product/search/",
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
            'addUserCart':"cart/addUserCart/",//添加一个产品到购物车
            "getUserCart":"cart/getUserCart/",//获取用户购买车里的产品
            "getUserCartCnt":"cart/getUserCartCnt/",//获取用户购物车里的产品数量
            'delUserCart':"cart/delUserCart/",//删除用户购物车里的一个记录
            //订单相关
            'getUserOrderList':"order/getUserList/",//获取用户订单列表
            'confirmOrder':"order/confirmOrder/",//订单确定 页面
            "orderDoing":"order/doing/",//下单执行
            'orderPay':"order/pay/",//唤起微信支付
            "orderCancel":"order/cancel/",//取消一个订单
            "confirmReceive":"order/confirmReceive/",//订单确认收货

            'getGoodsIdByPcap':"order/getGoodsIdByPcap/",
            //用户 订单总数
            'orderTotalCnt':'order/getUserCnt/',
            'getOrderById':'order/getById/',


            //用户相关
            "upInfo":"user/upInfo/",//改变用户信息
            "wxUserInfoBind":"user/wxUserInfoBind/",//微信不允许强制登陆，需要先让用户登陆，再绑定

            'getUserAddressList':"user/getAddressList/",//获取用户收货地址列表
            'getUserAddressDefault':"user/getUserAddressDefault/",//获取用户默认-收货地址列表
            'getUserInfo':"user/getOneDetail/",//获取用户基础信息
            'upAvatar':"user/upAvatar/",//更新头像
            //用户收藏的产品列表
            'getCollectList':"user/getCollectList/",
            //用户查看的产品历史记录列表
            'viewProductHistory':"user/viewProductHistory/",
            //智能识别 地址
            'parserAddressByStr':"index/parserAddressByStr/",
            //添加一个地址
            "addAddress":"user/addAddress/",

            //用户收藏的产品列表
            "getCollectListCnt":"user/getCollectListCnt/",
            //用户查看产品历史记录总数
            "viewProductHistoryCnt":"user/viewProductHistoryCnt/",



            "getAddressById":"user/getAddressById/",

            "addComment":"product/comment/",//添加一条评论
            "uploadCommentPic":"product/uploadCommentPic/",//添加一条评论,上传的图片
            "uploadCommentVideo":"product/uploadCommentVideo/",//添加一条评论,上传的视频
            "uploadCommentVideoTopPic":"product/uploadCommentVideoTopPic/",

            "getRefundConst" :"order/getRefundConst/",//退款 - 常量值
            "applyRefundUploadPic" :"order/applyRefundUploadPic/",//添加退款时，上传的图片


            //用户退款列表
            "getUserRefundList":"order/getUserRefundList/",
            //获取一条退款记录的详细信息
            "getUserRefundById":"order/getUserRefundById/",
            //收集数据，提交申请退款
            "applyRefund":"order/applyRefund/",
            // "applyRefund":"order/applyRefund/",//申请退款


            "refundCancel":"order/refundCancel/",//取消申请

            "getAreaProvinceCity":"system/getAreaProvinceCity/",//选择框里的，所有 省  市
            "getAreaAllCounty":"system/getAreaAllCounty/",//选择框里的，所有 省  县


            "share":"index/share/",
            // "getProvince":"",
            // "getCityByProvinceCode":"",
            // "getCountyByCityCode":"",
            // "getTownByCountyCode":"",
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
            9:{title:"挑选地址列表",url:"/pages/address/address?source=#source#"},
            10:{title:"授权页面",url:"/pages/other/authority/authority"},
            11:{title:"个人中心编辑",url:"/pages/my/edit/edit"},
            12:{title:"授权页面",url:"/pages/other/authority/authority"},
            13:{title:"清理缓存",url:"/pages/other/clear/cache"},
            14:{title:"loadding页",url:"/pages/other/loading/loading"},
            15:{title:"渲染分享朋友圈图片",url:"/pages/other/canvasShareImg/canvasShareImg"},
            16:{title:"用户收藏列表",url:"/pages/collect/collect"},
            17:{title:"用户浏览记录",url:"/pages/history/history"},
            18:{title:"添加新收货地址",url:"/pages/address/createAddress?source=#source#"},
            19:{title:"添加评论",url:"/pages/my/comment/comment?oid=#oid#"},
            20:{title:"个人中心-地址管理",      url:"/pages/my/address/address?source=#source#"},
            21:{title:"个人中心-添加新收货地址",url:"/pages/my/address/createAddress?source=#source#&editId=#editId#"},
            22:{title:"个人中心-申请退款-添加",url:"/pages/my/refund/details/details?oid=#oid#"},
            23:{title:"个人中心-申请退款-退款进度",url:"/pages/my/refund/processing/processing?id=#id#"},
            24:{title:"个人中心-申请退款-详情",url:"/pages/my/refund/money/money?id=#id#"},
            25:{title:"个人中心-申请退款-列表",url:"/pages/my/refund/consult/consult"},
        },
    }
})