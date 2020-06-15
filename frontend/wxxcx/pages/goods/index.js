// pages/goods/index.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {

        value: '',
        active: 0,

        category:{},
        orderType:{},

        searchOrderType:1,
        searchKeyword:"",
        searchCategory:0,
        searchOrderUpDown: 0,

        // 列表数据
        listData: [
            // var tmp = { id: i+1, imgUrl:res[i].avatar, name:res[i].nickname }
            // {
            //   id: 1,
            //   imgUrl:
            //     'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
            //   title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
            //   price: 11,
            //   payment: 111,
            // },

        ],

        tabChildIndex: 0,
        // 价格排序标识
        priceSort: 0,
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

    // 点击产品图片
    onItemImgClick(e) {
        var pid = e.detail.id;
        console.log("img click",pid)
        app.goto(1,2,{"pid":pid})
        // app.navigateGoto ( '/pages/goodsDetail/goodsDetail?pid='+pid )
    },
    // 点击产品上的购物车
    onItemCartClick(e) {

        var pid = e.detail.id;
        console.log("cart click",pid)


        var AddCartCallback = function(resolve,res){
            console.log("AddCartCallback",res)
            wx.showToast({
                title: "添加购物车返回"+res,
                icon: 'success', //图标,
            })
        }

        var data = {
            'pid':pid,
        }
        app.httpRequest('addUserCart',data,AddCartCallback)


        // wx.showToast({
        //     title: `点击产品购物车id为d：${e.detail.id}`, //提示的内容,
        //     icon: 'none', //图标,
        // })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        console.log("im <goods> page ,start:")


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

    // 点击 分类
    onTabsClick(event) {
        var id = event.detail.index
        this.data.searchCategory = id
        // this.setData({searchCategory:id})
        console.log("set searchCategory",id)
        this.searchProduct()
    },

    //排序
    orderClick:function(e){
        var id = e.target.dataset.id
        if(id == 4){
            // console.log("")
          if(this.data.searchOrderUpDown){
              console.log(" down ")
              this.setData({"searchOrderUpDown":0})
          }else{
              console.log(" up ")
              this.setData({"searchOrderUpDown":1})
          }
        }
        this.setData({searchOrderType:id})
        console.log("set searchOrderType",id)
        this.searchProduct()
    },
    //点击搜索框，目前没用到
    clickSearch:function(e) {
        console.log("in on search clicks",e)
        // Toast('搜索' + this.data.value)
    },
    //搜索框失败焦点，进入搜索模式
    blurSearch:function(e){
        var keyword = e.detail.value
        console.log("in on search blur",keyword)
        if(!keyword){
            this.setData({searchKeyword:""})
            return -1
        }

        if(keyword.length < 2){
            return -2
        }

        // app.globalData.searchKeyword = keyword
        // app.setData({'searchKeyword':keyword})
        this.setData({searchKeyword:keyword})
        console.log("set searchKeyword",keyword)
        this.searchProduct()
    },


    onShow:function(){
        this.everyTimeInitData()
    },

    everyTimeInitData :function(){
        //搜索关键字
        this.setData({"searchKeyword" :  app.globalData.searchKeyword})
        //产品类型
        this.setData({"searchCategory" :  app.globalData.searchCategory})
    },

    initData: function(){
        console.log("start init  <goods> page data.")
        var parentObj = this
        console.log("im in initData ,global:","searchKeyword", app.globalData.searchKeyword,"searchCategory",app.globalData.searchCategory )
        //如果是从首页过来，因为switchTabs 不支付传参数
        //所以，只能用全局变量，获取上一个页面过来的参数

        this.everyTimeInitData()

        //获取分类信息 和 排序信息
        var AllCategoryListCallback = function(resolve,res){
            console.log("AllCategoryListCallback",res)
            //set 所有产品分类
            parentObj.setData({"category":res.category})
            //所有产品分类的排序项
            parentObj.setData({"orderType":res.order_type})
        }

        var data = {}
        app.httpRequest('getSearchAttr',data,AllCategoryListCallback)
        this.searchProduct()
    },


    searchProduct:function(){
        var parentObj = this
        var SearchListCallback = function(resolve,res){
            console.log("SearchListCallback",res)

            if(!res){
                parentObj.setData({"listData":null})
                return 2
            }

            var tmpData = []
            for(var i=0;i<res.length ;i++){
                var tmp = { id: i+1, imgUrl:res[i].pic, title:res[i].title, price:res[i].lowest_price,payment:res[i].user_buy_total }
                tmpData[i] = tmp
            }
            parentObj.setData({"listData":tmpData})

        }
        var data = {
            'order_type':parentObj.data.searchOrderType,
            'keyword':parentObj.data.searchKeyword,
            'category':parentObj.data.searchCategory,
            'orderUpDown':parentObj.data.searchOrderUpDown
        }
        app.httpRequest('search',data,SearchListCallback)
    },

    onShareAppMessage: function () {
        return app.shareMyApp(3, '产品列表~'+'列表内容如下',null)
    }

})
