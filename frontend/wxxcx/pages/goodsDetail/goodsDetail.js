const app = getApp()
const Logs = require("../../utils/log.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tapTimes:0,//这里麻烦的是，按钮：立即购买，第一次点击，得弹出选择参数规格，在没有关闭的前提下，再次点击就是跳转到下单页，如果这具时候关闭这个要置成0
        share_uid :0,//分享者的UID，主要是用于佣金统计
        userCartCnt: 0,//用户购物车有多少个产品数
        headerTitle: "",//
        num: 1,//购买数量
        pid: 0,//产品ID
        product: null,
        selGoodsPCAP: 0,//选择购买的产品规格
        userSelGoods: {},//用户选择的商品:规格的组合-最终的商品ID
        userSelGoodsRow:{},//用户选择的商品，上面主要是存ID相关信息，下面是存该商品ID对应的属性值，如：销售价、最低价、库存
        swiperList: [],//轮播图片地址
        detailPicsList: {},//产品的详情图集
        swiperCurrent: 0,
        commentMaxPic : 5,
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

        //推荐-产品列表
        showLoading:0,//获取数据时显示loading....icon

        recommendProductType : 2,//分类
        recommendProductLimit : 3,//每页多少条记录
        recommendProductList:[],//列表数据
        recommendProductCurrentPage :0,//当前页
        recommendProductMaxPage:0,//当前数据总页数
        //推荐-产品列表-end
    },
    // // 点击左上角返回,暂不用
    // onClickLeft() {
    //     wx.switchTab({
    //         url: '/pages/index/index',
    //     })
    //     // wx.showToast({ title: '点击返回', icon: 'none' })
    // },
    // // 点击了右上角收藏图标 - 暂不用
    // onTabCollection() {
    //     var data = {'id':this.data.pid}
    //     var ProductCollectCallback = function(resolve,res){
    //         console.log("ProductCollectCallback callback", res)
    //         if(!res){
    //             console.log("notice:get ProductCollectCallback is null.")
    //             return -1
    //         }
    //     }
    //
    //     app.httpRequest('collect',data,ProductCollectCallback)
    //     wx.showToast({ title: '已收藏', icon: 'none' })
    // },


    // 点击了右上角分享图标，这个是：以图片形式，分享朋友圈
    onTabShare() {
        // wx.showToast({ title: '已分享', icon: 'none' })

        var getShareQrCodeBack  = function(r,data){
            console.log("getShareQrCodeBack",data)
            app.goto(1,15,null)
        }
        var data = {
            pid:this.data.pid,
            share_uid:app.globalData.serverUserInfo.id,
        }

        app.httpRequest("getShareQrCode",data,getShareQrCodeBack)

    },
    // 推荐产品列表中的  图片点击
    onTapItemImg(e) {
        var pid = e.detail.id
        console.log("im recommendProductListClick", e, pid)
        // var pid = e.currentTarget.dataset.id
        app.goto(1, 2, {pid: pid})
        // wx.navigateTo({
        //     url: `/pages/goodsDetail/goodsDetail?id=${e.detail.id}`,
        // })
    },
    // 点赞
    tapPraise(e) {
        // e.currentTarget.dataset.type 0：点击了已点赞图片  1：点击了未点赞图片
        var type = e.currentTarget.dataset.type == 0 ? false : true
        var parentObj = this

        var upCallback = function (resolve, res) {
            console.log("upCallback callback", res)
            if (!res) {
                console.log("notice:get upCallback is null.")
                return -1
            }
            parentObj.setData({praiseFlag: type})
        }

        var upCallback = function (resolve, res) {
            console.log("upCallback callback", res)
            if (!res) {
                console.log("notice:get upCallback is null.")
                return -1
            }
            parentObj.setData({praiseFlag: type})
        }

        var data = {'id': this.data.pid}
        if (!type) {
            app.httpRequest('cancelUp', data, upCallback)
            wx.showToast({title: '已取消', icon: 'none'})
        } else {
            app.httpRequest('up', data, upCallback)
            wx.showToast({title: '谢谢点赞', icon: 'none'})
        }
    },
    // 底部收藏事件
    tapLike(e) {
        // e.currentTarget.dataset.type 0：未收藏  1：已收藏
        var type = e.currentTarget.dataset.type == 0 ? false : true
        var parentObj = this

        var ProductCollectCallback = function (resolve, res) {
            console.log("ProductCollectCallback callback", res)
            if (!res) {
                console.log("notice:get ProductCollectCallback is null.")
                return -1
            }
            parentObj.setData({likeFlag: type})
        }

        var ProductCancelCollectCallback = function (resolve, res) {
            console.log("ProductCancelCollectCallback callback", res)
            if (!res) {
                console.log("notice:get ProductCancelCollectCallback is null.")
                return -1
            }
            parentObj.setData({likeFlag: type})
        }

        var data = {'id': this.data.pid}
        if (type) {
            app.httpRequest('collect', data, ProductCollectCallback)
            wx.showToast({title: '已收藏', icon: 'none'})
        } else {
            app.httpRequest('cancelCollect', data, ProductCancelCollectCallback)
            wx.showToast({title: '已取消', icon: 'none'})

        }
    },
    // 点击规格
    tapSpecs() {
        if (this.data.product.category_attr_null == 1) {
            wx.showToast({title: '该产品没有属性参数', icon: 'none'})
        }
        this.setData({specsShow: true})
    },
    
    // 关闭规格弹出层
    tapSpecsClose() {
        this.setData({tapTimes: 0})
        
        if (this.data.product.category_attr_null == 1) {
            wx.showToast({title: '该产品没有属性参数,可直接购买', icon: 'none'})
        }

        this.setData({specsShow: false})
    },
    //跳转购物车
    gotoCart: function (e) {
        app.goto(2, 4, null)
    },
    // 详情图片的 - 预览图片
    previewImageDetail: function (e) {
        var src = e.target.dataset.src
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: this.data.detailPicsList, // 需要预览的图片http链接列表
        })
    },
    //评论页中的 图片 - 预览
    previewImage: function (e) {
        const {index, src} = e.target.dataset
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: this.data.commentList[index]['thumbs'], // 需要预览的图片http链接列表
        })
    },
    // 点击 加入 购物车 按钮
    onItemCartClick(e) {
        var pid = this.data.pid
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
    //选择规格 - 选择某几个选项 组成 一个商品
    selGoods: function (e) {
        console.log(e)
        var pcapid = e.currentTarget.dataset.pcapid
        var pcaid = e.currentTarget.dataset.pcaid
        this.selGoodsCalc(pcaid,pcapid)
    },
    //因为，默认计算选中的值，也和更新价格，但是，点击的时候，是绑定了当前点击那个element，值是绑定到这个element上的，得拆分一个函数出来
    selGoodsCalc : function(pcaid  , pcapid){

        this.data.userSelGoods[pcaid] = pcapid
        this.setData(
            {
                userSelGoods: this.data.userSelGoods
            }
        )

    
        var i=0
        var j=0
        var z=0
        var goods_list = this.data.product.goods_list

        var sel_goods = this.data.userSelGoods
        console.log("sel_goods",sel_goods)
        var useSelGoodsArr = []
        for(i=0;i<goods_list.length;i++){
            console.log("goods_list.goods_link_category_attr",goods_list[i].goods_link_category_attr)
            var found = 1
            for(j=0;j<goods_list[i].goods_link_category_attr.length;j++){
                var f = 0
                for(let key  in sel_goods){
                    if(key == goods_list[i].goods_link_category_attr[j]['pca_id']  && goods_list[i].goods_link_category_attr[j]['pcap_id'] == sel_goods[key] ){
                        f = 1
                        break;
                    }
                }
                if(!f){//证明有一个值没找到，该商品就不符合条件
                    found = 0
                    break;
                }
            }

            if(found){
                useSelGoodsArr = goods_list[i]
                console.log("found user sel goods ",goods_list[i])
                break;
            }
        }

        this.setData({"userSelGoodsRow":useSelGoodsArr})
        console.log(this.data.userSelGoods)
    },
    //选择规格 - 购买数量
    setNumInputValue: function (e) {
        this.setData({
            'num': e.detail.value
        })
    },
    //商品数量变更
    num_change:function(e){
        var type = e.currentTarget.dataset.type
        // var checkBox = this.data.checkBoxList
        // var num = checkBox[id].num
        var num = this.data.num
        console.log("num_change",type,num)

        if(type == 'add'){
            if(num >= 99){
                console.log(" num >=99 ")
                return -2
            }
            num++
        }else{
            if(num <= 1){
                console.log(" num <= 1 ")
                return -2
            }
            num--
        }

        this.setData({num : num})
        // this.totalPrice()
    },
    //跳转到  <下单确认> 页面
    buyGotoOrder: function () {
        var parentObj = this
        var goods = ""

        var userSelGoodsRow = this.data.userSelGoodsRow
        console.log("this.data.tapTimes : ",this.data.tapTimes)
        if(!this.data.tapTimes){//证明是第一次点击
            this.setData({tapTimes: 1})
            this.tapSpecs()
            return -1
        }
        
        if(!userSelGoodsRow || JSON.stringify(userSelGoodsRow) == "{}"){
            var errMsg = "请先-选择-产品的参数规格"
            console.log(errMsg)
            app.showToast(errMsg)
            this.tapSpecs()
            return 1
        }
        


        if (this.data.userSelGoods) {
            for (let key  in this.data.userSelGoods) {
                goods += key + "-" + this.data.userSelGoods[key] + ","
            }
            goods = goods.substr(0, goods.length - 1)
        }


        console.log("buyGotoOrder", goods)

        var postData = {
            'num': this.data.num,
            'pcap': goods,
            'pid': this.data.pid
        }



        var GetGoodsIdOkCallback = function (r, res) {
            console.log("GetGoodsIdOkCallback", res)
            var gid = res.id

            var v = gid + "-" + parentObj.data.num
            var para = {gidsNums: v,'share_uid':parentObj.data.share_uid}


            app.goto(1, 5, para)

        }

        app.httpRequest("getGoodsIdByPcap", postData, GetGoodsIdOkCallback)

    },


    onLoad: function (data) {
        Logs.onload("goods_detail",data)
        var pageViewData = {"page":"productDetail","entry_type":data.entry_type}
        if(!app.isUndefined(data.share_uid)){
            this.setData({share_uid:data.share_uid})
            pageViewData.share_uid = data.share_uid
        }

        console.log("pageViewData",pageViewData)
        var pageViewDataCallback  = function(r,pageViewDataCallbackData){

        }
        app.httpRequest("pageView",pageViewData,pageViewDataCallback)

        var scene = ""
        var pid = 0
        if(!app.isUndefined(data.scene)){
            scene = decodeURIComponent(data.scene)
            //证明是通过扫码进来的
            scene = decodeURIComponent(data.scene)
            scene = scene.split("&")
            pid = scene[0]
            var share_uid = scene[1]
            this.setData({share_uid:share_uid})
        }else{
            pid = data.pid
        }
        //测试 详情页 的来源
        var sendServerLogBack = function(r,res){
            console.log("sendServerLogBack",res)
        }
        app.httpRequest("sendServerLog",data,sendServerLogBack)
        //测试 详情页 的来源---end

        // var scene = decodeURIComponent(data.scene)

        this.setData({"pid": pid});
        var PromiseObj = new Promise(function (resolve, reject) {
            app.globalData.promiseResolve = resolve
            app.loginInit()

        })
        var parent = this
        PromiseObj.then(
            function () {
                console.log(" init login finish.")
                parent.initProductDetailData();
            }
        )
    },
    //请求 server 加载 数据
    initProductDetailData: function () {
        //先 - -更新下购物车里包含的商品数量
        this.setData({"userCartCnt": app.globalData.userCartCnt})

        var parentObj = this;
        //获取产品详情
        var ProductDetailCallback = function (resolve, res) {
            console.log("ProductDetailCallback callback", res)
            if (!res) {
                console.log("notice:get ProductDetailCallback is null.")
                return -1
            }
            //产品一条记录的总属性
            parentObj.setData({"product": res})

            if (app.isUndefined(res.pic) || !res.pic) {
                console.log("notice:product detail pics is null.")
                return -2
            }
            var picObj = res.pic.split(",")
            //详细信息里的图片集
            parentObj.setData({"detailPicsList": picObj})
            //轮播图集
            parentObj.setData({"swiperList": picObj})
            //默认选中的商品
            // parentObj.setData({"userSelGoodsRow": res.goodsLowPriceRow})


            if (res.has_up) {
                parentObj.setData({praiseFlag: true})
            } else {
                parentObj.setData({praiseFlag: false})
            }

            if (res.has_collect) {
                parentObj.setData({likeFlag: true})
            } else {
                parentObj.setData({likeFlag: false})
            }

            if (res.category_attr_null == 2) {
                //默认是不给选择参数规格的，但是如果参数规格只有一个才，给默认选择一个
                // if (res.pcap,res.pcap.length != 1){
                //     return false;
                // }
                var i = 0
                var j = 0
                console.log("pcap", res.pcap,res.pcap.length)
                //pcap:一级大分类，如：颜色、大小等
                for (i = 0; i < res.pcap.length; i++) {
                    // console.log("pcap for loop",res.pcap[i])
                    //遍历该分类下的，所有子属性参数，找出黑夜最低价的那个参数属性值
                    for(j=0;j< res.pcap[i]['category_attr_para'].length;j++){
                        // console.log("debug userSelGoods",res.pcap[i]['id'], res.pcap[i]['category_attr_para'][j]['default_low_sel'])
                        if(res.pcap[i]['category_attr_para'][j]['default_low_sel'] == 1){
                            //颜色、尺寸ID =》黑色、XL
                            parentObj.data.userSelGoods[res.pcap[i]['id'] ] = res.pcap[i]['category_attr_para'][j]['id']
                            parentObj.setData(
                                {
                                    userSelGoods: parentObj.data.userSelGoods
                                }
                            )
                            break;
                        }
                    }

                    console.log("set ",res.pcap[i]['id'] ," value ", res.pcap[i]['category_attr_para'][0]['id'])
                    //这行代码里多了个 "a"  不知道干什么用的，但是传到PHP` 会报错，先注释了吧
                    // parentObj.data.userSelGoods["a"+res.pcap[i]['id']] = res.pcap[i]['category_attr_para'][0]['id']
                    parentObj.data.userSelGoods[res.pcap[i]['id']] = res.pcap[i]['category_attr_para'][0]['id']
                    console.log("default goods ids:",parentObj.data.userSelGoods)

                    var pca_id = res.pcap[i]['id']
                    var pcap_id = res.pcap[i]['category_attr_para'][0]['id']
                    parentObj.data.userSelGoods[pca_id] = pcap_id
                    parentObj.setData(
                        {

                            

                            userSelGoods: parentObj.data.userSelGoods
                        }
                    )
                    parentObj.selGoodsCalc(pca_id  , pcap_id)
                }
            }else{
                console.log(" notice category_attr_null")
            }

        }
        //最近访问
        // var getUserHistoryPVListCallback = function (resolve, res) {
        //     console.log("getUserHistoryPVListCallback callback", res)
        //     if (!res) {
        //         console.log("notice:get getUserHistoryPVListCallback is null.")
        //         return -3
        //     }
        //     var data = []
        //     for (var i = 0; i < res.length; i++) {
        //         var tmp = {id: i + 1, imgUrl: res[i].avatar, name: res[i].nickname}
        //         data[i] = tmp
        //     }
        //     parentObj.setData({"visitorList": data})
        //
        // }
        //最近购买用户
        // var getNearUserBuyHistoryCallback = function (resolve, res) {
        //     console.log("getNearUserBuyHistoryCallback callback", res)
        //     if (!res) {
        //         console.log("notice:get getNearUserBuyHistoryCallback is null.")
        //         return -5
        //     }
        //
        //
        //     var data = []
        //     for (var i = 0; i < res.length; i++) {
        //         // id: 1,
        //         //     imgUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        //         // name: 'A*范11',
        //         // size: '180x200cm',
        //         // time: '2020-0528  13:50',
        //
        //         var tmp = {id: i + 1, imgUrl: res[i].avatar, name: res[i].nickname, size: '180x200cm', time: res[i].dt}
        //         data[i] = tmp
        //     }
        //     parentObj.setData({"buyList": data})
        // }
        //评论列表
        var getCommentListCallback = function (resolve, res) {
            console.log("getCommentListCallback callback", res)
            if (!res) {
                console.log("notice:get getCommentListCallback is null.")
                return -6
            }
            // return 999;
            var data = []
            for (var i = 0; i < res.length; i++) {
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

                var thumbs = []
                if(res[i].pic){
                    for (var j = 0; j <  res[i].pic.length; j++) {
                        thumbs[j] = res[i].pic[j]
                    }
                }

                var tmp = {id:res[i], imgUrl: res[i].avatar, name: res[i].nickname, 'desc': res[i].content , 'thumbs':thumbs}
                data[i] = tmp
            }

            console.log("thumbs",thumbs)

            console.log(" comment list :", data)
            parentObj.setData({"commentList": data})
        }

        var data = {'id': this.data.pid}
        //产品详情
        app.httpRequest('productDetail', data, ProductDetailCallback)
        //用户浏览记录
        // app.httpRequest('getUserHistoryPVList', data, getUserHistoryPVListCallback);
        // 推荐产品列表
        // app.httpRequest('getRecommendProductList', data, getRecommendProductListCallback);
        //最近购买记录

        var data = {'pid': this.data.pid}
        // app.httpRequest('getNearUserBuyHistory', data, getNearUserBuyHistoryCallback);
        //评论列表
        app.httpRequest('getCommentList', data, getCommentListCallback);

        this.getRecommendProductListPage();

    },

    onShareAppMessage: function () {
        return app.shareMyApp(2, 2, '产品详情~超级便宜的~', this.data.product.title, {pid: this.data.pid})
    },
    onShow: function (data) {
        console.log("im onShow",data)
        this.setData({"userCartCnt": app.globalData.userCartCnt})
    },

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


            var data = []
            for (var i = 0; i < res.list.length; i++) {
                var tmp = {id: res.list[i].id, imgUrl: res.list[i].pic, title: res.list[i].title,price:res.list[i].lowest_price,'payment':res.list[i].user_buy_total ,"has_cart":res.list[i].has_cart}
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
})
