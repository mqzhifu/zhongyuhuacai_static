
const app = getApp()


Page({
    //事件处理函数
    // bindViewTap: function() {
    //     wx.navigateTo({
    //         url: '../logs/logs'
    //     })
    // },

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

    // getUserInfo: function(e) {
    //     console.log(e)
    //     app.globalData.userInfo = e.detail.userInfo
    //     this.setData({
    //         userInfo: e.detail.userInfo,
    //         hasUserInfo: true
    //     })
    // }

  //==========以上是微信自带==========
  data: {
    // 轮播图 - 图片列表
    swiperList:[],
      swiperDataList :[],
    //人气推荐数据

      // {
      //   id: 1,
      //   imgUrl: 'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
      //   title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
      //   price: 55,
      //   payment: 555
      // }

    hotList:null,
    hotListPage :0,
      hotListMaxPage:0,
      hotListHasBottom:0,
    //产品分类 列表
    categoryList:[]
  },

  onLoad: function () {
    console.log("im in <index> page Onload...");
    //初始化 登陆信息
    var PromiseObj =  new Promise(function(resolve, reject) {
      app.globalData.promiseResolve = resolve
      app.loginInit()  
    })
    var parent = this
    PromiseObj.then(
        function(){
            console.log(" init login finish.")
            parent.initIndexData();
        }
    )
  },
    //产品点击跳转详情
  productGoto:function(e){
    var pid = e.target.dataset.pid
    console.log("navigateTo:goodsDetail","pid:",e.target.dataset.pid)
      app.navigateGoto('/pages/goodsDetail/goodsDetail?pid='+pid)
  },

    bannerGoto:function(e){
      console.log("from component bannerGoto:",e.detail)
        var banner = this.data.swiperDataList[e.detail]
        console.log("banner row:",banner)
        if(banner.type == 1){//直接跳转产品详情页
            app.navigateGoto('/pages/goodsDetail/goodsDetail?pid='+banner.pid)
        }else if(banner.type == 2){//跳转到产品分类页
            app.switchGoto( '/pages/goods/index?category='+banner.category)
        }else{
            console.log("error:banner click goto ")
        }
    },

    categoryGoto:function(e){
        console.log("from component categoryGoto:",e.detail)
        app.globalData.searchCategory = e.detail
        app.switchGoto(  '/pages/goods/index')
    },


    searchProduct:function(e){
      var value = e.detail
      console.log("searchProduct:",value)
        app.globalData.searchKeyword = value
        // app.setSelfGlobal("searchKeyword",value)
        app.switchGoto(  '/pages/goods/index')
    },


    onReachBottom: function () {
        console.log("oh no ~ bottom","max page",this.data.hotListMaxPage)

        if(this.data.hotListPage  >= this.data.hotListMaxPage ){

            this.setData({"hotListHasBottom":1})

            console.log("hotListMaxPage >= hotListPage")
            return -3
        }

        this.getRecommendProductListPage()
    },


    getRecommendProductListPage:function(){
          if(this.hotListPage == -1){
              console.log(" RecommendProductList is null don't request server. ")
                return -2
          }
        //获取 推荐产品 列表
        var parentObj = this
        var RecommendProductListCallback = function(resolve,res){
            console.log("getRecommendProductList callback", res)
            if(!res){
                console.log("notice:getRecommendProductList is null")
                parentObj.setData({"hotList":[],"hotListPage":-1})
                return -1
            }
            var data = []
            for(var i=0;i<res.list.length ;i++){
                data[i] = res.list[i]
                // parentObj.data.swiperList[i] =res[i]['pic']
            }

            // console.log("hotList：",parentObj.data.hotList,parentObj.data.hotList.keys())
            if( ! parentObj.data.hotList ){
                console.log("hotList is null ,first set data")
                parentObj.setData({"hotList":data})
            }else{
                console.log("hotList is exist ,append data")
                var tmp = parentObj.data.hotList.concat(data);
                parentObj.setData({"hotList":tmp})
            }

            parentObj.setData({"hotListMaxPage":res.page_cnt})

            if(parentObj.data.hotListPage  >= parentObj.data.hotListMaxPage ){
                parentObj.setData({"hotListHasBottom":1})
            }

        }

        parentObj.setData({"hotListPage":parentObj.data.hotListPage + 1})
        var data = {
            'page':parentObj.data.hotListPage,
            'limit':4
        }
        app.httpRequest('getRecommendProductList',data,RecommendProductListCallback);
    },

    initIndexData: function(){
        console.log("start init <index> page Data:")

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
            parentObj.setData({"swiperDataList":res})


        }
        //获取 - 分类列表
        var AllCategoryListCallback = function(resolve,res){
            console.log("getAllCategoryList callback")

            console.log( res)
            var data = []
            for(var i=0;i<res.length ;i++){
                data[i] = res[i]
            }

            parentObj.setData({"categoryList":data})

        }


        parentObj.getRecommendProductListPage()
        app.httpRequest('getBannerList',data,BannerListCallback);
        app.httpRequest('getAllCategory',data,AllCategoryListCallback);

    },

})
