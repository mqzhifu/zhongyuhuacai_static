// pages/goods/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    category:{},
    orderType:{},

    searchOrderType:0,
    searchKeyword:"",
    searchCategory:0,

    value: '',
    active: 0,
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
  onTabChild(event) {
    const id = event.target.dataset.id
    if (id == 3) {
      this.data.priceSort++
      if (this.data.priceSort == 2) {
        this.setData({ priceSort: 0 })
      }
      this.setData({ priceSort: this.data.priceSort++ })
    }
    this.setData({ tabChildIndex: id })
  },
  // 点击产品图片
  onItemImgClick(e) {
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?id=${e.detail.id}`,
    })
  },
  // 点击产品上的购物车
  onItemCartClick(e) {
    wx.showToast({
      title: `点击产品购物车id为d：${e.detail.id}`, //提示的内容,
      icon: 'none', //图标,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("im <goods> page ,start:")
    // console.log(data)data
    // if(data && !app.isUndefined(data)){
    //     if(data.searchCategory  && !app.isUndefined(data.searchCategory)){
    //       this.searchCategory = data.searchCategory
    //     }
    //
    //     if(app.globalapp.globalData.searchKeyword  && !app.isUndefined(app.globalData.searchKeyword)){
    //       app.setData("searchKeyword")
    //       this. = app.globalData.searchKeyword
    //     }
    //
    //     if(data.searchOrderType  && !app.isUndefined(data.searchOrderType)){
    //       this.searchOrderType = data.searchOrderType
    //     }
    // }

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

  // 点击tab标签
  onTabsClick(event) {
    var id = event.detail.index
      this.data.searchCategory = id
    // this.setData({searchCategory:id})
    console.log("set searchCategory",id)
    this.searchProduct()
  },

  orderClieck:function(e){
    // var id = e.target.dataset.id
    // this.setData({searchOrderType:id})
    // console.log("set searchCategory",id)
    // this.searchProduct()
  },

  clickSearch:function(e) {
    console.log("in on search clicks",e)
    // Toast('搜索' + this.data.value)
  },

  blurSearch:function(e){
    var keyword = e.detail.value
    console.log("in on search blur",keyword)
    if(!keyword){
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




  initData: function(){
    console.log("start init  <goods> page data.")
    var parentObj = this
    console.log("im in initData ,global:","searchKeyword", app.globalData.searchKeyword,"searchCategory",app.globalData.searchCategory )

    this.setData({"searchKeyword" :  app.globalData.searchKeyword})
    this.setData({"searchCategory" :  app.globalData.searchCategory})

    //获取分类信息 和 排序信息
    var AllCategoryListCallback = function(resolve,res){
          console.log("AllCategoryListCallback")

          console.log( res)
          parentObj.setData({"category":res.category})
          parentObj.setData({"orderType":res.order_type})
          console.log("orderType",parentObj.data.orderType)
    }

    var data = {}
    app.httpRequest('getSearchAttr',data,AllCategoryListCallback)
    this.searchProduct()
  },


  searchProduct:function(){
    console.log("ready searchProduct")
    var parentObj = this
    var SearchListCallback = function(resolve,res){
      console.log("SearchListCallback")
      console.log( res)

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
    }
    app.httpRequest('search',data,SearchListCallback)
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
  onShareAppMessage: function () {},
})
