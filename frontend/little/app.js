//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    

 
    // 获取用户信息
    wx.getSetting({
      success: res => {
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
        return -1
    }
    var dbToken = wx.getStorageSync('serverToken');
    if(dbToken){
      this.globalData.serverToken = dbToken;
      console.log("serverToken has "+dbToken)
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
        
        this.getToken(res.code)
      }
    })
  },

  getToken : function(code){
    wx.getUserInfo({
      success: data =>{
        //发起网络请求
        var back = function(resolve){
          console.log("im back request server login back func. ")
          resolve()
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
      }
    })
  },

  httpRequest : function(urlKey,data,callback){
    var url = this.globalData.serverHost + this.globalData.serverUrl[urlKey]
    if(urlKey != 'login'){
      url += "?token="+ this.globalData.serverToken
    }
     + "?token" + this.globalData.serverToken
    console.log(url)
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
        console.log("server back token"+callbackData.data.msg + " is ok!")
        parent.globalData.serverToken = callbackData.data.msg
        callback(promiseResolve)
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

  globalData: {
    userInfo: null,
    serverToken:"",
    serverHost :"https://api.day900.com/",
    promiseResolve : null,
    serverUrl : {
      "login":"login/wxLittleLoginByCode/",
      "getBannerList":"index/getBannerList/",
      "search":"index/search"
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