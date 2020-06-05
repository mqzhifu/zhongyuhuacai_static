//获取应用实例
const app = getApp()

Page({
  data: {
    pid : 0,
    product:[

    ],
    //
    hotList:[

    ],
    categoryList:[
    ]
  },

  onLoad: function (data) {
    console.log("page detail ,receive data",data)
    this.setData({"pid":data.pid});
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
  },

  // click:function(e){
  //     console.log("im click",e)
  //     wx.switchTab({
  //       url: '/pages/goods/index?key="123"&name="ptt"',
  //     })
  // },

    initData: function(){
      

      //获取产品详情
     
      var parentObj = this;
      var ProductDetailCallback = function(resolve,res){
          console.log("ProductDetailCallback callback", res)
          // parentObj.setData({"product":res})

      }

        // var RecommendProductListCallback = function(resolve,res){
        //     console.log("getRecommendProductList callback", res)
        //     var data = []
        //     for(var i=0;i<res.length ;i++){
        //         data[i] = res[i]
        //         // parentObj.data.swiperList[i] =res[i]['pic']
        //     }

        //     parentObj.setData({"hotList":data})

        // }

        // var AllCategoryListCallback = function(resolve,res){
        //     console.log("getAllCategoryList callback")

        //     console.log( res)
        //     var data = []
        //     for(var i=0;i<res.length ;i++){
        //         data[i] = res[i]
        //     }

        //     parentObj.setData({"categoryList":data})

        // }
        var data = {'id':this.data.pid}
        app.httpRequest('productDetail',data,ProductDetailCallback)
        // app.httpRequest('getRecommendProductList',data,RecommendProductListCallback);
        // app.httpRequest('getAllCategory',data,AllCategoryListCallback);

  },

})
