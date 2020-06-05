//index.js
//获取应用实例
const app = getApp()







Page({
  data: {
    // 轮播图数据
    swiperList:[
      // 'https://img13.360buyimg.com/babel/s590x470_jfs/t1/129085/17/2638/58120/5ec76890E61a57640/3f73269e4905df0f.jpg',
      // 'https://img11.360buyimg.com/pop/s590x470_jfs/t1/131910/15/71/76936/5ec88be9E345e1257/cf62d4bc7fbc8eb7.jpg'
    ],
    //人气推荐数据
    hotList:[
      // {
      //   id: 1,
      //   imgUrl: 'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
      //   title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
      //   price: 55,
      //   payment: 555
      // }
    ],

    categoryList:[

    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var PromiseObj =  new Promise(function(resolve, reject) {
      app.globalData.promiseResolve = resolve
      app.loginInit()

  })
  var parent = this
  PromiseObj.then(
      function(){
          console.log(" init login finish.")
          parent.initData();
      }
  )

    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }






  },

  click:function(e){
    var pid = e.target.dataset.pid
    var url = '/pages/index/detail?pid='+pid
    console.log("im click ready goto:",url)
    // console.log("pid:",e.target.dataset.pid)
    wx.navigateTo({
      url: url
    })

    // wx.switchTab({
    //   url: '/pages/goods/index?key="123"&name="ptt"',
    // })
  },

    initData: function(){
      

        //获取首页轮播图
        var data = {}
        var parentObj = this;
        var BannerListCallback = function(resolve,res){
            console.log("getBannerList callback", res)
            if(!res){
              console.log("notice:getBannerList is null")
              parentObj.setData({"swiperList":data})
              return -1
            }
            var data = []
            for(var i=0;i<res.length ;i++){
                data[i] = res[i]['pic']
              // parentObj.data.swiperList[i] =res[i]['pic']
            }

            parentObj.setData({"swiperList":data})

        }

        var RecommendProductListCallback = function(resolve,res){
            console.log("getRecommendProductList callback", res)
            if(!res){
              console.log("notice:getRecommendProductList is null")
              parentObj.setData({"hotList":data})
              return -1
            }
            var data = []
            for(var i=0;i<res.length ;i++){
                data[i] = res[i]
                // parentObj.data.swiperList[i] =res[i]['pic']
            }

            parentObj.setData({"hotList":data})

        }

        var AllCategoryListCallback = function(resolve,res){
            console.log("getAllCategoryList callback")

            console.log( res)
            var data = []
            for(var i=0;i<res.length ;i++){
                data[i] = res[i]
            }

            parentObj.setData({"categoryList":data})

        }

        app.httpRequest('getBannerList',data,BannerListCallback);
        app.httpRequest('getRecommendProductList',data,RecommendProductListCallback);
        app.httpRequest('getAllCategory',data,AllCategoryListCallback);

    },


  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }


})
