const app = getApp()
const Logs = require("../../utils/log.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        share_uid :0,//分享者的UID，主要是用于佣金统计
        userCartCnt: 0,//用户购物车有多少个产品数
        headerTitle: "",//
        num: 1,//购买数量
        pid: 0,//产品ID
        product: null,
        selGoodsPCAP: 0,//选择购买的产品规格
        userSelGoods: {},//用户选择的商品 规格的组合-最终的商品ID
        userSelGoodsRow:{},//用户选择的商品
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
        // 产品推荐列表
        recommendProductList: [
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
        // var data = {
        //     pid:this.data.pid,
        //     share_uid:app.globalData.serverUserInfo.id
        // }
        app.goto(1,15,null)
        // app.httpRequest("getShareQrCode",data)

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
        if(!app.isUndefined(data.share_uid)){
            this.setData({share_uid:data.share_uid})
        }

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
            parentObj.setData({"userSelGoodsRow": res.goodsLowPriceRow})


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
                var i = 0
                var j = 0
                console.log("pcap", res.pcap,res.pcap.length)
                for (i = 0; i < res.pcap.length; i++) {
                    // console.log("pcap for loop",res.pcap[i])
                    for(j=0;j< res.pcap[i]['category_attr_para'].length;j++){
                        // console.log("debug userSelGoods",res.pcap[i]['id'], res.pcap[i]['category_attr_para'][j]['default_low_sel'])
                        if(res.pcap[i]['category_attr_para'][j]['default_low_sel'] == 1){
                            parentObj.data.userSelGoods[res.pcap[i]['id'] ] = res.pcap[i]['category_attr_para'][j]['id']
                            parentObj.setData(
                                {
                                    userSelGoods: parentObj.data.userSelGoods
                                }
                            )
                            break;
                        }
                    }

                    // console.log("set ",res.pcap[i]['id'] ," value ", res.pcap[i]['category_attr_para'][0]['id'])
                    // parentObj.data.userSelGoods["a"+res.pcap[i]['id']] = res.pcap[i]['category_attr_para'][0]['id']
                    // console.log("default goods ids:",parentObj.data.userSelGoods)

                    // var pca_id = res.pcap[i]['id']
                    // var pcap_id = res.pcap[i]['category_attr_para'][0]['id']
                    // parentObj.data.userSelGoods[pca_id] = pcap_id
                    // parentObj.setData(
                    //     {
                    //         userSelGoods: parentObj.data.userSelGoods
                    //     }
                    // )
                }
            }else{
                console.log(" notice category_attr_null")
            }

        }
        //最近访问
        var getUserHistoryPVListCallback = function (resolve, res) {
            console.log("getUserHistoryPVListCallback callback", res)
            if (!res) {
                console.log("notice:get getUserHistoryPVListCallback is null.")
                return -3
            }
            var data = []
            for (var i = 0; i < res.length; i++) {
                var tmp = {id: i + 1, imgUrl: res[i].avatar, name: res[i].nickname}
                data[i] = tmp
            }
            parentObj.setData({"visitorList": data})

        }
        //推荐产品
        var getRecommendProductListCallback = function (resolve, res) {
            console.log("getRecommendProductListCallback callback", res)
            if (!res) {
                console.log("notice:get getRecommendProductListCallback is null.")
                return -4
            }
            var data = []
            for (var i = 0; i < res.list.length; i++) {
                var tmp = {
                    id: i + 1,
                    imgUrl: res.list[i].pic,
                    title: res.list[i].title,
                    price: res.list[i].lowest_price
                }
                data[i] = tmp
            }
            console.log("recommend data", data)


            parentObj.setData({"recommendProductList": data})
            console.log("recommend", parentObj.data.recommendProductList)

        }
        //最近购买用户
        var getNearUserBuyHistoryCallback = function (resolve, res) {
            console.log("getNearUserBuyHistoryCallback callback", res)
            if (!res) {
                console.log("notice:get getNearUserBuyHistoryCallback is null.")
                return -5
            }


            var data = []
            for (var i = 0; i < res.length; i++) {
                // id: 1,
                //     imgUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
                // name: 'A*范11',
                // size: '180x200cm',
                // time: '2020-0528  13:50',

                var tmp = {id: i + 1, imgUrl: res[i].avatar, name: res[i].nickname, size: '180x200cm', time: res[i].dt}
                data[i] = tmp
            }
            parentObj.setData({"buyList": data})
        }
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
        app.httpRequest('getUserHistoryPVList', data, getUserHistoryPVListCallback);
        // 推荐产品列表
        app.httpRequest('getRecommendProductList', data, getRecommendProductListCallback);
        //最近购买记录
        var data = {'pid': this.data.pid}
        app.httpRequest('getNearUserBuyHistory', data, getNearUserBuyHistoryCallback);
        //评论列表
        app.httpRequest('getCommentList', data, getCommentListCallback);

    },

    onShareAppMessage: function () {
        return app.shareMyApp(2, 2, '产品详情~超级便宜的~', this.data.product.title, {pid: this.data.pid})
    },
    onShow: function (data) {
        console.log("im onShow",data)
        this.setData({"userCartCnt": app.globalData.userCartCnt})
    }
})
