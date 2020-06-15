// pages/my/orderConfirm/orderConfirm.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      productList :[],
      totalPrice:0,
      goodsTotalPrice:0,
      totalHaulage:0,
      userAddress:[],
      gidsNums:"",
      memo:"",
    // payType: 0,
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
  // 点击地址跳转修改地址页面
  onRouteAddress() {
    wx.navigateTo({ url: '/pages/my/address/address' })
  },

    changeAddress(){

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

    inputNum:function(e){
      this.setData({"num":e.detail.value})
    },

    inputMemo:function(e){
        this.setData({"memo":e.detail.value})
    },

    orderDoing:function(){
        //$agentUid = 0,$couponId = 0
        var obj = this
        var orderDoingCallback = function(resolve,res){
            console.log("orderDoingCallback",res,app.globalData.httpRequestCode)
            if(app.globalData.httpRequestCode == 200 || app.globalData.httpRequestCode == '200'){
                var oid = res
                this.pay(oid)
                // obj.delUserCartAndPay(oid)
            }else{
                wx.showToast({ title: '发生错误:'+res.msg, icon: 'none' })
            }
        }

        // console.log(this.data.goods)
        // return 1

        //agent_uid  coupon_id

        var data = {'memo':this.data.memo,'gidsNums':this.data.gidsNums}
        console.log(data)
        app.httpRequest('orderDoing',data,orderDoingCallback)

    },

    delUserCartAndPay :function(oid){
        var parentObj = this
        var oid = oid
        var DelUserCartCallback = function(r,res){
            console.log('DelUserCartCallback',res)
            // parentObj.pay(oid)
        }

        var delUserCartIds = ""
        for(var i=0;i<this.data.cartList.length;i++){
            delUserCartIds += this.data.cartLis[i].id + ","
        }

        var data = delUserCartIds.substr(0,delUserCartIds.length - 1)
        console.log("del cart ids:",data)

        // app.httpRequest('delUserCart',data,DelUserCartCallback)
    },
    pay :function(oid){

      var orderPayCallback = function(resov,res) {
            console.log("orderPayCallback",res)
          var data = {
              'timeStamp': res.timeStamp,
              'nonceStr': res.nonceStr,
              'package': res.package,
              'signType':  res.signType,
              'paySign':  res.paySign,
              'success':function(res){
                  console.log("ok",res)
              },
              'fail':function(res){
                  console.log("fail",res)
              }
          }

          wx.requestPayment(data)
          // app.goto(1,7,null)
      }

        var data = {'type':this.data.payType,"oid":oid}
        app.httpRequest('orderPay',data,orderPayCallback)
    },


    setTotalPrice:function(){
        var productList = this.data.productList
        var total = 0
        var haulage = 0;
        for(var i=0;i<productList.length;i++){
            console.log(productList[i].price, productList[i].num ,productList[i].haulage)
            total += parseInt( productList[i].price) * parseInt( productList[i].num)
            haulage += parseInt( productList[i].haulage )

        }

        console.log("totalHaulage",haulage,'goodsTotalPrice',total,"total",total + haulage)

      this.setData({
          "totalHaulage": haulage,
          "goodsTotalPrice":total,
          'totalPrice':total + haulage,
      })

    },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (data) {
      console.log("im order <confirm> page:",data)
      // this.setData({
          // 'num':data.num,
          // 'pid':data.pid,
          // 'pcap':data.goods,
          // 'uinfo':app.globalData.userInfo,
      // })

      console.log("userinfo:",this.data.uinfo)

      this.setData({gidsNums:data.gidsNums})

      var parentObj = this
      var ProductGoodsCallback = function(resolve,res){
          console.log("ProductGoodsCallback callback", res)
          if(!res){
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


          parentObj.setData({productList:res})
          parentObj.setTotalPrice()

      }

        var UserAddrListCallback = function(r,res){
            console.log("UserAddrListCallback",res)
            if(!res){
                console.log("notice: user address is null")
            }
        }

      // var data = {'gidsNums':this.data.pid,'pcap':this.data.pcap,'num':this.data.num}
      var data = {gidsNums:data.gidsNums}
      app.httpRequest('confirmOrder',data,ProductGoodsCallback)

      app.httpRequest('getUserAddressList',[],UserAddrListCallback)


  },
    onShareAppMessage: function () {
        return app.shareMyApp(2, '订单确认~超级便宜的~', '不买你就亏死',{pid:this.data.pid})
    }

})
