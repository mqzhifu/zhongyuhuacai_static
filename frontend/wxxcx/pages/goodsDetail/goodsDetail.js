// pages/goodsDetail/goodsDetail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
      pid : 0,
      product :null,
    swiperList: [
      // 'https://img13.360buyimg.com/babel/s590x470_jfs/t1/129085/17/2638/58120/5ec76890E61a57640/3f73269e4905df0f.jpg',
    ],
    detailPicsList:{},
    swiperCurrent: 0,
    // 最近访客
    visitorList: [
      // { id: 1, imgUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', name: 'A*范1' },
    ],
    // 最近购买记录
    buyList: [
      // {
      //   id: 1,
      //   imgUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
      //   name: 'A*范11',
      //   size: '180x200cm',
      //   time: '2020-0528  13:50',
      // }
    ],
    // 商品评价
    commentList: [
      // {
      //   id: 3,
      //   imgUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
      //   name: '尚***秀33',
      //   desc:
      //     '质量好性价比高质量好性价比高质量好性价比高质量好性价比高 质量好性价比高质量好性价比高质量好性价比高质量好性价比',
      //   thumbs: [
      //     'https://img10.360buyimg.com/n7/jfs/t1/109699/1/11744/378551/5e8bf623E527474e5/44786351c0dd0214.jpg',
      //     'https://img12.360buyimg.com/n7/jfs/t1/108395/25/18797/429425/5ec4fdc3E9e278bad/70a1e816a87847bc.jpg',
      //     'https://img11.360buyimg.com/n7/jfs/t1/124853/26/2346/680505/5ec4fe2fE5d635ca2/39fefe92fd99515e.jpg',
      //     'https://img13.360buyimg.com/n7/jfs/t1/121574/4/3478/461372/5ed1d004Ef234a97b/9742ed5f889be5c6.jpg',
      //   ],
      // },
    ],
    // 更多推荐数据
    // 列表数据
    listData: [
      // {
      //   id: 1,
      //   imgUrl:
      //     'https://img14.360buyimg.com/n1/jfs/t3682/362/1363475238/559844/ab37eb62/58229915N5796455e.jpg',
      //   title: '春夏亲肤棉四件套床单款全棉芦荟棉11',
      //   price: 11,
      //   payment: 111,
      // }
    ],
  },
  // 点击左上角返回
  onClickLeft() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    // wx.showToast({ title: '点击返回', icon: 'none' })
  },
  // 点击了右上角收藏图标
  onTabCollection() {
      var data = {'id':this.data.pid}
      var ProductCollectCallback = function(resolve,res){
          console.log("ProductCollectCallback callback", res)
          if(!res){
              console.log("notice:get ProductCollectCallback is null.")
              return -1
          }
      }

      app.httpRequest('collect',data,ProductCollectCallback)
      wx.showToast({ title: '已收藏', icon: 'none' })
  },
  // 点击了右上角分享图标
  onTabShare() {
    wx.showToast({ title: '已分享', icon: 'none' })
  },

    setUpClick(){
        var data = {'id':this.data.pid}
        var upCallback = function(resolve,res){
            console.log("upCallback callback", res)
            if(!res){
                console.log("notice:get upCallback is null.")
                return -1
            }
        }


        app.httpRequest('up',data,upCallback)
        wx.showToast({ title: '谢谢点赞', icon: 'none' })

    },


  // 预览图片
  previewImage: function (e) {
    const { index, src } = e.target.dataset
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: this.data.commentList[index]['thumbs'], // 需要预览的图片http链接列表
    })
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
  onLoad: function (data) {
      console.log("page detail ,receive data",data)
      this.setData({"pid":data.pid});
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

    initData: function(){

        var parentObj = this

        //获取产品详情
        var parentObj = this;
        var ProductDetailCallback = function(resolve,res){
            console.log("ProductDetailCallback callback", res)
            if(!res){
              console.log("notice:get ProductDetailCallback is null.")
              return -1
            }
            //产品一条记录的总属性
            parentObj.setData({"product":res})

            if(app.isUndefined( res.pic) || !res.pic){
                console.log("notice:product detail pics is null.")
                return -2
            }
            var picObj = res.pic.split(",")
            //详细信息里的图片集
            parentObj.setData({"detailPicsList":picObj})
            //轮播图集
            parentObj.setData({"swiperList":picObj})

        }
        //最近访问
        var getUserHistoryPVListCallback = function(resolve,res){
            console.log("getUserHistoryPVListCallback callback", res)
            if(!res){
                console.log("notice:get getUserHistoryPVListCallback is null.")
                return -3
            }
            var data = []
            for(var i=0;i<res.length ;i++){
              var tmp = { id: i+1, imgUrl:res[i].avatar, name:res[i].nickname }
             
                data[i] = tmp
            }
            parentObj.setData({"visitorList":data})

        }
        //推荐产品
        var getRecommendProductListCallback = function(resolve,res){
            console.log("getRecommendProductListCallback callback",res)
            if(!res){
                console.log("notice:get getRecommendProductListCallback is null.")
                return -4
            }
            var data = []
            for(var i=0;i<res.length ;i++){
                var tmp =  { id: i+1, imgUrl:res[i].pic , title:res[i].title ,price:res[i].lowest_price }
                data[i] =tmp
            }

            parentObj.setData({"listData":data})

        }
        //最近购买用户
        var getNearUserBuyHistoryCallback = function(resolve,res){
            console.log("getNearUserBuyHistoryCallback callback",res)
            if(!res){
                console.log("notice:get getNearUserBuyHistoryCallback is null.")
                return -5
            }

            var data = []
            for(var i=0;i<res.length ;i++){
                // id: 1,
                //     imgUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
                // name: 'A*范11',
                // size: '180x200cm',
                // time: '2020-0528  13:50',

                var tmp = { id: i+1, imgUrl:res[i].avatar, name:res[i].nickname , size: '180x200cm',time: res[i].dt}
                data[i] = tmp
            }
            parentObj.setData({"buyList":data})
        }

        var getCommentListCallback = function(resolve,res){
            console.log("getCommentListCallback callback",res)
            if(!res){
                console.log("notice:get getCommentListCallback is null.")
                return -6
            }
            // return 999;
            var data = []
            for(var i=0;i<res.length ;i++){
                // {
                //     id: 3,
                //         imgUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
                //     name: '尚***秀33',
                //     desc:
                //     '质量好性价比高质量好性价比高质量好性价比高质量好性价比高 质量好性价比高质量好性价比高质量好性价比高质量好性价比',
                //         thumbs: [
                //     'https://img10.360buyimg.com/n7/jfs/t1/109699/1/11744/378551/5e8bf623E527474e5/44786351c0dd0214.jpg',
                //     'https://img12.360buyimg.com/n7/jfs/t1/108395/25/18797/429425/5ec4fdc3E9e278bad/70a1e816a87847bc.jpg',
                //     'https://img11.360buyimg.com/n7/jfs/t1/124853/26/2346/680505/5ec4fe2fE5d635ca2/39fefe92fd99515e.jpg',
                //     'https://img13.360buyimg.com/n7/jfs/t1/121574/4/3478/461372/5ed1d004Ef234a97b/9742ed5f889be5c6.jpg',
                // ],
                // },

                var tmp = { id: i+1, imgUrl:res[i].avatar, name:res[i].nickname , 'desc':res[i].title}


                data[i] = tmp
            }
            console.log(" comment list :",data)
            parentObj.setData({"commentList":data})
        }


        var data = {'id':this.data.pid}
        app.httpRequest('productDetail',data,ProductDetailCallback)
        app.httpRequest('getUserHistoryPVList',data,getUserHistoryPVListCallback);
        // var data = {'type':2}
        app.httpRequest('getRecommendProductList',data,getRecommendProductListCallback);

        var data = {'pid':this.data.pid}
        app.httpRequest('getNearUserBuyHistory',data,getNearUserBuyHistoryCallback);
        app.httpRequest('getCommentList',data,getCommentListCallback);


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
