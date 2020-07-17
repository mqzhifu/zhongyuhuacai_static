// pages/goods/index.js
const app = getApp()
const Logs = require("../../utils/log.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // isClickOrder :0,//
        // value: '',
        // active: 0,

        hasBottom:0,//是否，已经到底了
        searchRsIsEmpty : 0,//搜索结果为空

        category: {},//产品，所有的分类列表(后台动态配置，前台调取)
        orderType: {},//产品，所有的可排序列表(后台动态配置，前台调取)

        searchOrderType: 1,//搜索 排序字段
        searchKeyword: "",//搜索  关键字
        searchCategory: 0,//搜索  分类
        searchOrderUpDown: 0,//搜索 排序字段 升/降

        // 列表数据
        listData: [],
        listMaxPage: 0,//基于当前搜索，一共有多少条数据，共多少页
        listCurrentPage : 0,//基于当前搜索，一共有多少条数据，当前页
        tabChildIndex: 0,
        // 价格排序标识
        // priceSort: 0,
    },


    // 点击筛选
    // onTabChild(event) {
    //   const id = event.target.dataset.id
    //   if (id == 3) {
    //     this.data.priceSort++
    //     if (this.data.priceSort == 2) {
    //       this.setData({ priceSort: 0 })
    //     }
    //     this.setData({ priceSort: this.data.priceSort++ })
    //   }
    //   this.setData({ tabChildIndex: id })
    // },

    //点击搜索框，目前没用到
    clickSearch: function (e) {
        console.log("in on search clicks", e)
        // Toast('搜索' + this.data.value)
    },

    onLoad: function (op) {
        Logs.onload("goods", op)

        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initData();
            }
        )
    },
    // 点击产品图片，跳转到产品详情页
    onItemImgClick(e) {
        var pid = e.detail.id;
        console.log("img click", pid)
        app.goto(1, 2, {"pid": pid})
    },
    // 点击产品上的购物车,将产品加入购物车
    onItemCartClick(e) {
        var pid = e.detail.id;
        console.log("cart click", pid)

        var AddCartCallback = function (resolve, res) {
            console.log("AddCartCallback", res)
            wx.showToast({
                title: "添加购物车返回" + res,
                icon: 'success', //图标,
            })

            app.checkCartRedDot()
        }

        var data = {
            'pid': pid,
        }
        app.httpRequest('addUserCart', data, AddCartCallback)
    },
    // 点击 分类 ,重新搜索
    onTabsClick(event) {
        var id = event.detail.index
        this.data.searchCategory = id
        // this.setData({searchCategory:id})
        console.log("set searchCategory", id)
        this.searchProduct(1)
    },
    //搜索完成后，可以根据条件进行 排序
    orderClick: function (e) {
        var id = e.target.dataset.id
        if (id == 4) {//目前只有价格字段，支持 升/降 排序
            // console.log("")
            if (this.data.searchOrderUpDown) {
                console.log(" down ")
                this.setData({"searchOrderUpDown": 0})
            } else {
                console.log(" up ")
                this.setData({"searchOrderUpDown": 1})
            }
        }
        //获取当前 排序字段
        this.setData({searchOrderType: id})
        // this.setData({isClickOrder: 1})

        console.log("set searchOrderType", id)
        this.searchProduct(1)
    },
    //搜索框失败焦点，进入搜索模式
    blurSearch: function (e) {
        var keyword = e.detail.value
        console.log("in on search blur", keyword)
        if (!keyword) {
            this.setData({searchKeyword: ""})
            return -1
        }

        if (keyword.length < 2) {
            return -2
        }

        // app.globalData.searchKeyword = keyword
        // app.setData({'searchKeyword':keyword})
        this.setData({searchKeyword: keyword})
        console.log("set searchKeyword", keyword)
        this.searchProduct()
    },


    onShow: function () {
        this.globalDataSetThisPageData()
    },

    globalDataSetThisPageData: function () {
        //搜索关键字
        this.setData({"searchKeyword": app.globalData.searchKeyword})
        //产品类型
        this.setData({"searchCategory": app.globalData.searchCategory})
    },

    initData: function () {
        console.log("start init  <goods> page data.")
        var parentObj = this
        console.log("im in initData ,global:", "searchKeyword", app.globalData.searchKeyword, "searchCategory", app.globalData.searchCategory)
        //如果是从首页过来，因为switchTabs 不支付传参数
        //所以，只能用全局变量，获取上一个页面过来的参数

        this.globalDataSetThisPageData()

        //获取分类信息 和 排序信息
        var AllCategoryListCallback = function (resolve, res) {
            console.log("AllCategoryListCallback", res)
            //set 所有产品分类
            parentObj.setData({"category": res.category})
            //所有产品分类的排序项
            parentObj.setData({"orderType": res.order_type})
        }

        var data = {}
        app.httpRequest('getSearchAttr', data, AllCategoryListCallback)
        this.searchProduct()
    },


    searchProduct: function (newSearch) {
        console.log("searchProduct",newSearch,this.data.searchKeyword,this.data.searchCategory,this.data.searchOrderType,this.data.searchOrderUpDown,this.data.listCurrentPage)
        var parentObj = this

        //如果是全新搜索，得把之前变量的值都清空
        if(newSearch){
            parentObj.setData({"listData": []})
            parentObj.setData({"listCurrentPage":0})
            parentObj.setData({"listMaxPage":0})
            parentObj.setData({"hasBottom":0})
        }
        //搜索结果
        var SearchListCallback = function (resolve, res) {
            console.log("SearchListCallback", res)

            parentObj.setData({"hasBottom":0})

            if(!res || app.isUndefined(res.list) || !res.list ||  app.isNull(res.list) || app.isEmptyObject(res.list)){
                console.log("notice SearchListCallback is null")

                parentObj.setData({"listData": []})
                parentObj.setData({"listCurrentPage":0})
                parentObj.setData({"listMaxPage":0})
                parentObj.setData({"hasBottom":0})

                parentObj.setData({"searchRsIsEmpty":1})
                // parentObj.setData({"isClickOrder": 0})

                return 2
            }

            var tmpData = []
            var list = res.list
            for (var i = 0; i <list.length; i++) {
                var tmp = {
                    // id: i + 1,
                    id:  list[i].id,
                    imgUrl: list[i].pic,
                    title: list[i].title,
                    price: list[i].lowest_price,
                    payment: list[i].user_buy_total,
                    has_cart: list[i].has_cart
                }
                tmpData[i] = tmp
            }
            var tmp ;
            if(newSearch){
                // parentObj.setData({isClickOrder: 0})
                tmp = tmpData
            }else{
                //把数据累加进去
                tmp = parentObj.data.listData.concat(tmpData);
            }
            // console.log("set tmpData list",tmpData)
            parentObj.setData({"listData": tmp})
            parentObj.setData({"listMaxPage":res.page_cnt})


            if(parentObj.data.listCurrentPage  >= parentObj.data.listMaxPage ){
                parentObj.setData({"hasBottom":1})
            }

        }


        var page = this.data.listCurrentPage
        // if(!this.data.isClickOrder){
            ++page
        // }
        parentObj.setData({"listCurrentPage":page})

        var data = {
            'order_type': parentObj.data.searchOrderType,
            'keyword': parentObj.data.searchKeyword,
            'category': parentObj.data.searchCategory,
            'orderUpDown': parentObj.data.searchOrderUpDown,
            'page':page,
        }
        app.httpRequest('search', data, SearchListCallback)
    },


    onReachBottom: function () {
        console.log("oh no ~ bottom", "max page", this.data.listMaxPage)

        if (this.data.listCurrentPage >= this.data.listMaxPage) {
            this.setData({"hasBottom": 1})
            console.log("hotListMaxPage >= hotListPage")
            return -3
        }

        this.searchProduct(0)
    },

    onShareAppMessage: function () {
        return app.shareMyApp(1, 3, '首页~','首页的内容',null)
    }

})
