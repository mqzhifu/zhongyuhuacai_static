
const app = getApp()


Page({
    data: {
        swiperList:[],//轮播图
        swiperDataList :[],//server 轮播图的数据，暂存，因为上面的数据只是有k:v

        //人气推荐- 产品列表
        hotList:null,//列表数据
        hotListPage :0,//当前页
        hotListMaxPage:0,//当前数据总页数
        hotListHasBottom:0,//是否已经到底了
        //产品分类 列表
        categoryList:[]//分类列表数据
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
        var pid = e.currentTarget.dataset.pid
        app.goto(1,2,{pid:pid})
        // console.log("navigateTo:goodsDetail","pid:",pid)
        // app.navigateGoto('/pages/goodsDetail/goodsDetail?pid='+pid)
    },

    bannerGoto:function(e){
        console.log("from component bannerGoto:",e.detail)
        var banner = this.data.swiperDataList[e.detail]
        console.log("banner row:",banner)
        if(banner.type == 1){//直接跳转产品详情页
            app.goto(1,2,{pid:banner.pid})
            // app.navigateGoto('/pages/goodsDetail/goodsDetail?pid='+banner.pid)
        }else if(banner.type == 2){//跳转到产品分类页
            // app.globalData.searchCategory = e.detail
            // app.switchGoto(  '/pages/goods/index')
            // app.switchGoto( '/pages/goods/index?category='+banner.category)
        }else{
            console.log("error:banner click goto ")
        }
    },

    categoryGoto:function(e){
        console.log("from component categoryGoto:",e.detail)
        app.globalData.searchCategory = e.detail
        app.goto(2,3,null)
        // app.switchGoto(  '/pages/goods/index')

    },


    searchProduct:function(e){
        var value = e.detail
        console.log("searchProduct:",value)
        app.globalData.searchKeyword = value
        app.goto(2,3,null)
        // app.switchGoto(  '/pages/goods/index')
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


    onShareAppMessage: function () {
        return app.shareMyApp(1, '首页~','首页的内容',null)
    }

})
