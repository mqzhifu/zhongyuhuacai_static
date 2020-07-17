const app = getApp()
const Logs = require("../../utils/log.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        productList: null,
        editType: false,
        // 列表数据
        // listData: [
        //     {
        //         id: 1,
        //         imgUrl:
        //             'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
        //         title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
        //         price: 11,
        //         payment: 111,
        //     },
        //     {
        //         id: 2,
        //         imgUrl:
        //             'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
        //         title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
        //         price: 11,
        //         payment: 111,
        //     },
        //     {
        //         id: 3,
        //         imgUrl:
        //             'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
        //         title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
        //         price: 11,
        //         payment: 111,
        //     },
        //     {
        //         id: 4,
        //         imgUrl:
        //             'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
        //         title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
        //         price: 11,
        //         payment: 111,
        //     },
        //     {
        //         id: 5,
        //         imgUrl:
        //             'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
        //         title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
        //         price: 22,
        //         payment: 222,
        //     },
        //     {
        //         id: 6,
        //         imgUrl:
        //             'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
        //         title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
        //         price: 33,
        //         payment: 333,
        //     },
        //     {
        //         id: 7,
        //         imgUrl:
        //             'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
        //         title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
        //         price: 44,
        //         payment: 444,
        //     },
        // ],

        //推荐-产品列表
        showLoading:0,//获取数据时显示loading....icon

        recommendProductType : 1,//分类
        recommendProductLimit : 3,//每页多少条记录
        recommendProductList:[],//列表数据
        recommendProductCurrentPage :0,//当前页
        recommendProductMaxPage:0,//当前数据总页数
        //推荐-产品列表-end
    },
    // 点击编辑
    tapEdit() {
        this.setData({
            editType: !this.data.editType,
        })
    },
    // 删除商品
    onDelGoods(e) {
        console.log("删除了id为：", e.target.dataset.id, "的商品");
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Logs.onload("collect", options)
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initCollectData();
            }
        )
    },

    initCollectData: function () {
        var parentObj = this
        var GetUserCollectListCallback = function (resolve, res) {
            console.log("GetUserCollectListCallback callback", res)

            if (!res || app.isUndefined(res) || app.isNull(res) || app.isEmptyObject(res)) {
                console.log("err , null")
                return -1
            }

            parentObj.setData({productList: res})
        }
        var data = {}
        app.httpRequest('getCollectList', data, GetUserCollectListCallback);

        this.getRecommendProductListPage();
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


            var data = []
            for (var i = 0; i < res.list.length; i++) {
                var tmp = {id: res.list[i].id, imgUrl: res.list[i].pic, title: res.list[i].title,price:res.list[i].lowest_price,'payment':res.list[i].user_buy_total}
                data[i] = tmp
            }

            if( app.isEmptyArray(parentObj.data.recommendProductList ) ){
                console.log("recommendProductList is null ,first set data")
                parentObj.setData({"recommendProductList":data})
            }else{
                console.log("recommendProductList is exist ,append data",data)
                var tmp = parentObj.data.recommendProductList.concat(data);
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


    cancelCollect: function (e) {
        var pid = e.target.dataset.pid
        var parentObj = this
        var id = e.target.dataset.id
        var index = e.target.dataset.index

        var cancelCollectCallback = function (res) {
            console.log("cancelCollect", res)

            var list = parentObj.data.productList
            list.splice(index, 1)

            parentObj.setData({productList: list})


            wx.showToast({
                title: "已取消收藏",
                icon: 'success', //图标,
            })
        }

        var data = {
            'id': pid
        }

        app.httpRequest('cancelCollect', data, cancelCollectCallback)
    },

    add_cart: function (e) {
        // console.log(e)
        var pid = e.target.dataset.pid
        var parentObj = this
        var id = e.target.dataset.id
        var index = e.target.dataset.index

        console.log(pid, id)
        var AddCartCallback = function (resolve, res) {
            console.log("AddCartCallback", res)
            wx.showToast({
                title: "添加购物车返回" + res,
                icon: 'success', //图标,
            })

            var list = parentObj.data.productList
            console.log(index, list[index])
            list[index].has_cart = 1
            parentObj.setData({"productList": list})

            app.checkCartRedDot()
        }

        var data = {
            'pid': pid,
        }
        app.httpRequest('addUserCart', data, AddCartCallback)

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("oh no ~ bottom","max page",this.data.recommendProductMaxPage)
        if(this.data.recommendProductCurrentPage  >= this.data.recommendProductMaxPage ){
            console.log("recommendProductMaxPage >= recommendProductCurrentPage")
            return -3
        }

        this.getRecommendProductListPage()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.shareMyApp(1, 16, '首页~','首页的内容',null)
    },
})
