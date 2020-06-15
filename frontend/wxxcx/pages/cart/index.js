const app = getApp()
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
      cartList:[],
      cartListCnt :0,
      checkBoxList :[],
      checkBoxListSelCnt : 0,
      selAll:0,
      total:"0.00",
  },

    settotalPrice:function(){
        var checkBox = this.data.checkBoxList
        var total = 0.00;
        var cartList = this.data.cartList
        var selected = 0;

        var selCnt = 0;
        for (var i=0;i<checkBox.length;i++) {
            if(checkBox[i].check == true){
                selected = 1
                var itemPrice = parseInt(cartList[i].lowest_price) * parseInt( checkBox[i].num)
                console.log("cart selected:"," i:",i,"num",checkBox[i].num,"price",cartList[i].lowest_price,"itemPrice",itemPrice)

                total += parseInt( itemPrice )
                selCnt++
            }
        }

        console.log(total)

        if(selected){
            this.setData(
                {'total':total}
            )

            this.setData(
                {'checkBoxListSelCnt':selCnt}
            )
        }else{
            console.log("no selected.")
            this.setData(
                {'total':0}
            )

            this.setData(
                {'checkBoxListSelCnt':0}
            )

        }
    },
    clickCheckBox:function(e){
      // console.log(e)
        var checkBox = this.data.checkBoxList
        var id = e.currentTarget.dataset.id
        if( checkBox[id].check == false){
            checkBox[id].check = true
        }else{
            checkBox[id].check = false
        }

        this.setCheckBoxList(checkBox)
        this.settotalPrice()
    },


    setCheckBoxList :function($data){
        this.setData(
            {
                checkBoxList : $data
            }
        )
    },

    selAll:function(e){
      var checkBox = this.data.checkBoxList
        if(this.data.selAll == 0){
            this.setData({"selAll":1})
            var flag = true
        }else{
            this.setData({"selAll":0})
            var flag = false
        }

        for(var i = 0 ; i <checkBox.length;i++ ){
            checkBox[i].check = flag
        }

        this.setCheckBoxList(checkBox)
        this.settotalPrice()
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("im in <cart> page Onload...",options);

      //初始化 登陆信息
      var PromiseObj =  new Promise(function(resolve, reject) {
          app.globalData.promiseResolve = resolve
          app.loginInit()
      })
      var parent = this
      PromiseObj.then(
          function(){
              console.log(" init login finish.")
              parent.initCartData();
          }
      )
  },


    num_add:function(e){
        var id = e.currentTarget.dataset.id
        var checkBox = this.data.checkBoxList
        var num = checkBox[id].num
        console.log("num_add",id,num)

        if(num >= 99){
            console.log(" num >=99 ")
            return -2
        }
        checkBox[id].num = num + 1
        this.setData(
            {
                checkBoxList : this.data.checkBoxList
            }
        )
        this.settotalPrice()
    },

    orderConfirm:function(e){
      var checkBoxList = this.data.checkBoxList
        var cartList = this.data.cartList
        var noSelected = 1
        var paraGidsNums = ""
        for(var i=0;i<checkBoxList.length ;i++){
            if(checkBoxList[i].check == true){
                noSelected = 0
                paraGidsNums += cartList[i].gid + "-" + checkBoxList[i].num + ","
            }
        }




        if(noSelected){
            wx.showToast({ title: '并没有选择端口', icon: 'none' })
            return -1
        }

        paraGidsNums = paraGidsNums.substr(0,paraGidsNums.length - 1)

        console.log(paraGidsNums)

        var para = {gidsNums:paraGidsNums}
        app.goto(1,5,para)
    },


    cartDelOne:function(e){
      var index = e.currentTarget.dataset.id

        if(!this.data.cartListCnt || this.data.cartListCnt <= 0  ){
            console.log("cartListCnt <=0")
        }



        var parentObj = this
        var DelUserCartCallback = function(r,res){
            console.log("DelUserCartCallback",res)

            var checkBoxList = parentObj.data.checkBoxList
            checkBoxList.splice(index,1)
            var cartList = parentObj.data.cartList
            cartList.splice(index,1)


            parentObj.setCheckBoxList(checkBoxList)

            parentObj.setData(
                {cartList:cartList}
            )

            parentObj.setData(
                {cartListCnt:parentObj.data.cartListCnt - 1}
            )

            parentObj.setData(
                {checkBoxListSelCnt:parentObj.data.checkBoxListSelCnt - 1}
            )

            parentObj.settotalPrice()
        }

        var cartId = this.data.checkBoxList[index].cart_id
        console.log("cart id",cartId)
        var data = {ids:cartId}
        app.httpRequest("delUserCart",data,DelUserCartCallback)

        // for (var i=0;i<checkBoxList.length;i++){
        //
        // }

        // console.log(e)
    },

    num_less:function(e){
        var id = e.currentTarget.dataset.id
        var checkBox = this.data.checkBoxList
        var num = checkBox[id].num
        console.log("num_add",id,num)

        if(num <= 1){
            console.log(" num <= 1 ")
            return -2
        }
        checkBox[id].num = num - 1
        this.setData(
            {
                checkBoxList : this.data.checkBoxList
            }
        )
        this.settotalPrice()
    },


    initCartData: function(){
        console.log("start init <initCartData> page Data:")

        var data = {}
        var parentObj = this;

        var GetUserCartCallback = function(resolve,res){
            console.log("GetUserCartCallback callback",res)

            if(!res){
                console.log("notice:cart list is null")
                return -1
            }
            // var tmpCartList = {}
            var tmpCheckBox = []
            for(var i=0;i<res.length ;i++){
                tmpCheckBox[i] =  {id:res[i].id , check:false,num:1,cart_id:res[i].cart_id}
            }


            parentObj.setData({"cartList":res})
            parentObj.setData({"cartListCnt":res.length})

            parentObj.setCheckBoxList(tmpCheckBox)
            parentObj.setData({"cartList":res})
            // parentObj.setData({"checkBoxList":tmpCheckBox})


            console.log("cartList",parentObj.data.cartList)
            console.log("checkBoxList",parentObj.data.checkBoxList)

        }

        app.httpRequest('getUserCart',data,GetUserCartCallback);

    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return app.shareMyApp(1, '购物车~'+'产品+内容如下',null)
  }
})
