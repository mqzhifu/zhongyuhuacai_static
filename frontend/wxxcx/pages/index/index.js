
const app = getApp()
const Logs = require("../../utils/log.js")

Page({
    data: {
        swiperList:[],//轮播图，给控件用 k:v 形式，只能用于控件
        swiperDataList :[],//server 轮播图的数据，暂存，用于轮播图点击事件
        //推荐-产品列表-start
        showLoading:0,//获取数据时显示loading....icon

        recommendProductType : 1,//分类
        recommendProductLimit : 4,//每页多少条记录
        recommendProductList:[],//列表数据
        recommendProductCurrentPage :0,//当前页
        recommendProductMaxPage:0,//当前数据总页数
        //推荐-产品列表-end

        //产品分类 列表
        categoryList:[]//分类列表数据

        // hotListHasBottom:0,//是否已经到底了
    },


    onLoad: function (para) {
        this.setData({"masterAgentName":app.globalData.masterAgentName ,title:app.globalData.title, navBarRightText:app.globalData.navBarRightText})

        Logs.onload("index",para)
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
    },
    //轮播图 点击跳转
    bannerGoto:function(e){
        console.log("from component bannerGoto:",e.detail)
        var banner = this.data.swiperDataList[e.detail]
        console.log("banner row:",banner)
        if(banner.type == 1){//直接跳转产品详情页
            app.goto(1,2,{pid:banner.pid})
        }else if(banner.type == 2){//跳转到产品分类页
        }else{
            console.log("error:banner click goto type err ")
        }
    },
    //分类ICON跳转
    categoryGoto:function(e){
        console.log("from component categoryGoto:",e.detail)
        app.globalData.searchCategory = e.detail
        app.goto(2,3,null)
        // app.switchGoto(  '/pages/goods/index')

    },
    //搜索跳转
    searchProduct:function(e){
        var value = e.detail
        console.log("searchProduct:",value)
        app.globalData.searchKeyword = value
        //这是switch 跳转，不能直接传参数 .得用全局变量
        app.goto(2,3,null)
    },
    //触碰到底部，推荐产品要做分页处理
    onReachBottom: function () {
        console.log("oh no ~ bottom","max page",this.data.recommendProductMaxPage)
        if(this.data.recommendProductCurrentPage  >= this.data.recommendProductMaxPage ){
            console.log("recommendProductMaxPage >= recommendProductCurrentPage")
            return -3
        }

        this.getRecommendProductListPage()
    },
    //获取推荐产品数据
    getRecommendProductListPage:function(){
        // if(this.data.recommendProductCurrentPage >= this.data.recommendProductMaxPage){
        //     console.log(" RecommendProductList is null don't request server. ")
        //     return -2
        // }
        //获取 推荐产品 列表
        var parentObj = this
        var RecommendProductListCallback = function(resolve,res){
            console.log("RecommendProductListCallback callback", res)
            if(app.weakCheckscalarEmpty(res.list) || app.isEmptyArray(res.list)){
                console.log("notice:getRecommendProductList is null")
                // parentObj.setData({"recommendProductList":[],"recommendProductCurrentPage":-1})
                return -1
            }

            if( app.isEmptyArray(parentObj.data.recommendProductList ) ){
                console.log("recommendProductList is null ,first set data")
                parentObj.setData({"recommendProductList":res.list})
            }else{
                console.log("recommendProductList is exist ,append data",res.list)
                var tmp = parentObj.data.recommendProductList.concat(res.list);
                parentObj.setData({"recommendProductList":tmp})
            }

            parentObj.setData({"recommendProductMaxPage":res.page_cnt})//最大页数
            parentObj.setData({"showLoading":0})//关闭loading...icon
        }

        parentObj.setData({"recommendProductCurrentPage":parentObj.data.recommendProductCurrentPage + 1})
        var data = {
            'page':parentObj.data.recommendProductCurrentPage,
            'limit':this.data.recommendProductLimit,
            'type':this.data.recommendProductType,
        }

        parentObj.setData({"showLoading":1})//显示 loading....icon
        app.httpRequest('getRecommendProductList',data,RecommendProductListCallback);
    },
    //初始化页面数据
    initIndexData: function(){
        console.log("start init <index> page Data:")

        var parentObj = this;
        //获取首页轮播图
        var BannerListCallback = function(resolve,res){
            console.log("getBannerList callback", res)
            if(app.weakCheckscalarEmpty(res) || app.isEmptyArray(res)){
                console.log("notice:getBannerList is null")
                parentObj.setData({"swiperList":data})
                return -1
            }
            //临时变量
            var tmpArr = []
            for(var i=0;i<res.length ;i++){
                tmpArr[i] = res[i]['pic']
                // parentObj.data.swiperList[i] =res[i]['pic']
            }
            //设置-轮播图变量
            parentObj.setData({
                "swiperList":tmpArr,//轮播图控件
                "swiperDataList":res//用于计算的数据
            })
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

        var data = {}

        parentObj.getRecommendProductListPage()
        app.httpRequest('getBannerList',data,BannerListCallback);
        app.httpRequest('getAllCategory',data,AllCategoryListCallback);
    },
    //分享
    onShareAppMessage: function () {
        return app.shareMyApp(1, 1, '首页~','首页的内容',null)
    }

})
