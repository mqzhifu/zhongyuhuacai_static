const Logs = require("../../../utils/log.js")
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        productList: [],
        totalPrice: 0,
        goodsTotalPrice: 0,
        totalHaulage: 0,
        userAddress: [],
        userSelAddressId: 0,
        gidsNums: "",
        share_uid: 0,
        memo: "",
        payType: 12,//默认是微信 支付
        // pid : 0,
        // pcap : "",
        // product:null,
        // goods:null,
        // pcap_desc :null,
        // totalPrice:0,
        // payType:12,
        // pcap_desc_str :"",
        // uinfo :null,
        // num:0,

    },

    // onRouteAddress() {
    //   wx.navigateTo({ url: '/pages/my/address/address' })
    // },

    addAddress() {
        var data = {"source": "order_confirm"}
        app.globalData.orderConfirmGotoAddressSavePara = {"share_uid":this.data.share_uid ,'gidsNums':this.data.gidsNums}
        app.goto(1, 18, data)
    },


    // 选择支付方式
    onPayType(e) {
        this.setData({
            payType: e.currentTarget.dataset.type,
        })
    },

    // num_add:function(e){
    //     console.log("num_add")
    //     if(this.data.num >= 99){
    //         console.log(" num >= 99")
    //         return -1
    //     }
    //
    //     this.setData({"num":parseInt(this.data.num) + 1})
    //     this.setTotalPrice()
    // },
    //
    // num_less:function(e){
    //     console.log("num_less")
    //     if(this.data.num <= 1){
    //         console.log(" num <=1 ")
    //         return -2
    //     }
    //
    //     this.setData({"num":parseInt(this.data.num) - 1})
    //     this.setTotalPrice()
    // },

    inputNum: function (e) {
        this.setData({"num": e.detail.value})
    },

    inputMemo: function (e) {
        this.setData({"memo": e.detail.value})
    },


    orderDoing: function () {
        //$agentUid = 0,$couponId = 0
        var obj = this
        var orderDoingCallback = function (resolve, res) {
            console.log("orderDoingCallback", res)


            // if(app.globalData.httpRequestCode == 200 || app.globalData.httpRequestCode == '200'){
            var oid = res
            app.pay(oid, obj.data.payType)
            // obj.delUserCartAndPay(oid)
            // }else{
            //     wx.showToast({ title: '发生错误:'+res.msg, icon: 'none' })
            // }
        }

        // console.log(this.data.goods)
        // return 1

        //agent_uid  coupon_id
        console.log("this.data.userSelAddressId",this.data.userSelAddressId)
        if(!this.data.userSelAddressId || app.isUndefined(this.data.userSelAddressId) ){
            wx.showToast({
                title: "请选择收货地址",
                icon: 'success', //图标,
            })

            return -1
        }

        var data = {
            'memo': this.data.memo,
            'gidsNums': this.data.gidsNums,
            "share_uid": this.data.share_uid,
            "userSelAddressId": this.data.userSelAddressId
        }
        console.log(data)
        app.httpRequest('orderDoing', data, orderDoingCallback)

    },

    delUserCartAndPay: function (oid) {
        var parentObj = this
        var oid = oid
        var DelUserCartCallback = function (r, res) {
            console.log('DelUserCartCallback', res)
            // parentObj.pay(oid)
        }

        var delUserCartIds = ""
        for (var i = 0; i < this.data.cartList.length; i++) {
            delUserCartIds += this.data.cartLis[i].id + ","
        }

        var data = delUserCartIds.substr(0, delUserCartIds.length - 1)
        console.log("del cart ids:", data)

        // app.httpRequest('delUserCart',data,DelUserCartCallback)
    },

    changeAddress: function () {
        // 点击地址跳转<选择收货地址>页面
        var data = {"source": "order_confirm"}
        app.globalData.orderConfirmGotoAddressSavePara = {"share_uid":this.data.share_uid ,'gidsNums':this.data.gidsNums}
        app.goto(1, 9, data)
    },

    setTotalPrice: function () {
        var productList = this.data.productList
        var total = 0
        var haulage = 0;
        for (var i = 0; i < productList.length; i++) {
            console.log(productList[i].price, productList[i].num, productList[i].haulage)
            total += parseFloat(productList[i].price) * parseFloat(productList[i].num)
            haulage += parseFloat(productList[i].haulage)
        }

        console.log("totalHaulage", haulage, 'goodsTotalPrice', total, "total", total + haulage)

        this.setData({
            "totalHaulage": haulage,
            "goodsTotalPrice": total,
            'totalPrice': total + haulage,
        })

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (data) {
        Logs.onload("order_confirm", data)
        if (!app.isUndefined(data.share_uid)) {
            this.setData({share_uid: data.share_uid})
        }

        if (!app.isUndefined(data.selAddress)) {
            this.setData({userSelAddressId: data.selAddress})
        }
        // this.setData({
        // 'num':data.num,
        // 'pid':data.pid,
        // 'pcap':data.goods,
        // 'uinfo':app.globalData.userInfo,
        // })

        console.log("userinfo:", this.data.uinfo)

        this.setData({gidsNums: data.gidsNums})

        var parentObj = this
        var ProductGoodsCallback = function (resolve, res) {
            console.log("ProductGoodsCallback callback", res)
            if (!res) {
                console.log("notice:get ProductGoodsCallback is null.")
                return -1
            }
            //产品一条记录的总属性
            // parentObj.setData({
            //     "product":res.product,
            //     "goods":res.goods,
            //     "pcap_desc":res.goodsAttrParaDesc,
            //     "pcap_desc_str":res.pcap_desc_str,
            // })
            // if(app.isUndefined( res.pic) || !res.pic){
            //     console.log("notice:product detail pics is null.")
            //     return -2
            // }


            parentObj.setData({productList: res})
            parentObj.setTotalPrice()

        }

        // var data = {'gidsNums':this.data.pid,'pcap':this.data.pcap,'num':this.data.num}
        var data = {gidsNums: data.gidsNums}
        app.httpRequest('confirmOrder', data, ProductGoodsCallback)

        if(this.data.userSelAddressId){
            var getAddressByIdCallback = function (r, res) {
                console.log("getAddressByIdCallback", res)
                if (!res) {
                    console.log("notice: user address is null")
                }
                parentObj.setData({"userAddress": res})
            }

            var data =  {"id":this.data.userSelAddressId}
            app.httpRequest('getAddressById', data , getAddressByIdCallback)

        }else{
            var UserAddressDefaultCallback = function (r, res) {
                console.log("UserAddrListCallback", res,res['id'])
                if (!res) {
                    console.log("notice: user address is null")
                }
                parentObj.setData({"userAddress": res})
                parentObj.setData({"userSelAddressId": res['id']})
            }

            app.httpRequest('getUserAddressDefault', [], UserAddressDefaultCallback)
        }



    },
    onShareAppMessage: function () {
        return app.shareMyApp(1, 5, '首页~','首页的内容',null)
    }

})
