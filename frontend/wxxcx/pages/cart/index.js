const app = getApp()
const Logs = require("../../utils/log.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 列表数据
        listData: [
            // {
            //   id: 1,
            //   imgUrl:
            //     'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
            //   title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
            //   price: 11,
            //   payment: 111,
            // },
        ],
        cartList: [],
        cartListCnt: 0,
        checkBoxList: [],
        checkBoxListSelCnt: 0,
        selAll: 0,
        total: "0.00",


        //推荐-产品列表
        showLoading:0,//获取数据时显示loading....icon

        recommendProductType : 1,//分类
        recommendProductLimit : 3,//每页多少条记录
        recommendProductList:[],//列表数据
        recommendProductCurrentPage :0,//当前页
        recommendProductMaxPage:0,//当前数据总页数
        //推荐-产品列表-end

    },

    settotalPrice: function () {
        var checkBox = this.data.checkBoxList
        var total = 0.00;
        var cartList = this.data.cartList
        var selected = 0;

        var selCnt = 0;
        for (var i = 0; i < checkBox.length; i++) {
            if (checkBox[i].check == true) {
                selected = 1
                var itemPrice = parseInt(cartList[i].lowest_price) * parseInt(checkBox[i].num)
                console.log("cart selected:", " i:", i, "num", checkBox[i].num, "price", cartList[i].lowest_price, "itemPrice", itemPrice)

                total += parseInt(itemPrice)
                selCnt++
            }
        }

        console.log(total)

        if (selected) {
            this.setData(
                {'total': total}
            )

            this.setData(
                {'checkBoxListSelCnt': selCnt}
            )
        } else {
            console.log("no selected.")
            this.setData(
                {'total': 0}
            )

            this.setData(
                {'checkBoxListSelCnt': 0}
            )

        }
    },
    clickCheckBox: function (e) {
        // console.log(e)
        var checkBox = this.data.checkBoxList
        var id = e.currentTarget.dataset.id
        if (checkBox[id].check == false) {
            checkBox[id].check = true
        } else {
            checkBox[id].check = false
        }

        this.setCheckBoxList(checkBox)
        this.settotalPrice()
    },


    setCheckBoxList: function ($data) {
        this.setData(
            {
                checkBoxList: $data
            }
        )
    },

    gotoDetail:function(e){
        var pid = e.target.dataset.pid
        app.goto(1,2,{"pid":pid})
    },

    selAll: function (e) {
        var checkBox = this.data.checkBoxList
        if (this.data.selAll == 0) {
            this.setData({"selAll": 1})
            var flag = true
        } else {
            this.setData({"selAll": 0})
            var flag = false
        }

        for (var i = 0; i < checkBox.length; i++) {
            checkBox[i].check = flag
        }

        this.setCheckBoxList(checkBox)
        this.settotalPrice()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Logs.onload("cart", options)
        //初始化 登陆信息
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()
        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initCartData();
            }
        )
    },

    onShow: function () {
        console.log("im onshow")
        this.initCartData();
    },


    num_add: function (e) {
        var id = e.currentTarget.dataset.id
        var checkBox = this.data.checkBoxList
        var num = checkBox[id].num
        console.log("num_add", id, num)

        if (num >= 99) {
            console.log(" num >=99 ")
            return -2
        }
        checkBox[id].num = num + 1
        this.setData(
            {
                checkBoxList: this.data.checkBoxList
            }
        )
        this.settotalPrice()
    },

    orderConfirm: function (e) {
        var checkBoxList = this.data.checkBoxList
        var cartList = this.data.cartList
        var noSelected = 1
        var paraGidsNums = ""
        for (var i = 0; i < checkBoxList.length; i++) {
            if (checkBoxList[i].check == true) {
                noSelected = 0
                paraGidsNums += cartList[i].gid + "-" + checkBoxList[i].num + ","
            }
        }


        if (noSelected) {
            wx.showToast({title: '并没有选择端口', icon: 'none'})
            return -1
        }

        paraGidsNums = paraGidsNums.substr(0, paraGidsNums.length - 1)

        console.log(paraGidsNums)

        var para = {gidsNums: paraGidsNums}
        app.goto(1, 5, para)
    },


    cartDelOne: function (e) {
        var index = e.currentTarget.dataset.id
        console.log(e)
        if (!this.data.cartListCnt || this.data.cartListCnt <= 0) {
            console.log("cartListCnt <=0")
        }

        var parentObj = this
        var DelUserCartCallback = function (r, res) {
            console.log("DelUserCartCallback", res)
            //删除checkbox 里的值
            var checkBoxList = parentObj.data.checkBoxList
            checkBoxList.splice(index, 1)
            //删除购物列表里的元素
            var cartList = parentObj.data.cartList
            cartList.splice(index, 1)



            parentObj.setCheckBoxList(checkBoxList)
            parentObj.setData(
                {cartList: cartList}
            )

            parentObj.setData(
                {cartListCnt: parentObj.data.cartListCnt - 1}
            )

            parentObj.setData(
                {checkBoxListSelCnt: parentObj.data.checkBoxListSelCnt - 1}
            )

            app.checkCartRedDot()

            parentObj.settotalPrice()
        }


        console.log( this.data.checkBoxList)

        var cartId = this.data.checkBoxList[index].cart_id
        console.log("cart id", cartId)
        var data = {ids: cartId}
        app.httpRequest("delUserCart", data, DelUserCartCallback)

        // for (var i=0;i<checkBoxList.length;i++){
        //
        // }

        // console.log(e)
    },

    num_less: function (e) {
        var id = e.currentTarget.dataset.id
        var checkBox = this.data.checkBoxList
        var num = checkBox[id].num
        console.log("num_add", id, num)

        if (num <= 1) {
            console.log(" num <= 1 ")
            return -2
        }
        checkBox[id].num = num - 1
        this.setData(
            {
                checkBoxList: this.data.checkBoxList
            }
        )
        this.settotalPrice()
    },


    initCartData: function () {
        console.log("start init <initCartData> page Data:")

        var data = {}
        var parentObj = this;

        var GetUserCartCallback = function (resolve, res) {
            console.log("GetUserCartCallback callback", res)

            if (!res) {
                console.log("notice:cart list is null")
                return -1
            }
            // var tmpCartList = {}
            var tmpCheckBox = []
            for (var i = 0; i < res.length; i++) {
                tmpCheckBox[i] = {id: res[i].id, check: false, num: 1, cart_id: res[i].cart_id}
            }


            parentObj.setData({"cartList": res})
            parentObj.setData({"cartListCnt": res.length})

            parentObj.setCheckBoxList(tmpCheckBox)
            parentObj.setData({"cartList": res})
            // parentObj.setData({"checkBoxList":tmpCheckBox})


            console.log("cartList", parentObj.data.cartList)
            console.log("checkBoxList", parentObj.data.checkBoxList)

        }

        app.httpRequest('getUserCart', data, GetUserCartCallback);

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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
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
        return app.shareMyApp(1, 4, '首页~','首页的内容',null)
    }
})
