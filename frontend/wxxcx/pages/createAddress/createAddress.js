import areaData from './data/area'

const app = getApp()
const Logs = require("../../utils/log.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile:"",
        name :"",
        address  :"",
        province_code  :"",
        city_code :"",
        county_code :"",
        town_code:"",
        aiTextValue: "",
        isDefault:0,

        show: false,
        areaList: {
            province_list : areaData.province_list,
            city_list : areaData.city_list,
            county_list : areaData.county_list,

            // province_list: {
            //     110000: '北京市',
            //     120000: '天津市'
            // },
            // city_list: {
            //     110100: '北京市',
            //     110200: '县',
            //     120100: '天津市',
            //     120200: '县'
            // },
            // county_list: {
            //     110101: '东城区',
            //     110102: '西城区',
            //     110105: '朝阳区',
            //     110106: '丰台区',
            //     120101: '和平区',
            //     120102: '河东区',
            //     120103: '河西区',
            //     120104: '南开区',
            //     120105: '河北区',
            // }
        }
    },


    inputAddress:function(e){
        var address = e.detail.value
        console.log(address)
        this.setData({"address":address})
    },

    inputName:function(e){
        var name = e.detail.value
        console.log(name)
        this.setData({"name":name})
    },

    inputMobile:function(e){
        var mobile = e.detail.value
        console.log(mobile)
        this.setData({"mobile":mobile})
    },

    parserAddressByStr:function(){

        var parserAddressByStrCallback = function(data){
            console.log("parserAddressByStrCallback")
        }

        var data = {
            "address_str":this.data.aiTextValue,
        }
        app.httpRequest("parserAddressByStr",data,parserAddressByStrCallback)
    },

    clearAIAddress: function () {
        console.log("clearAIAddress ")
        this.setData({"aiTextValue": ""})
    },

    //显示城市选择框
    onShowCity(){
        this.setData({show: true });
    },
    // 关闭城市选择框
    onCloseCity() {
        this.setData({ show: false });
    },
    // 城市选择框
    onSelectedCity(e) {
        console.log("选择的城市",e.detail);
        // console.log(e.detail.index[0],e.detail.index[1],e.detail.index[2])
        console.log(e.detail.values[0].code,e.detail.values[0].code,e.detail.values[0].code)
        // province_code  :"",
        //     city_code :"",
        //     county_code :"",

        this.setData({
            "province_code":e.detail.values[0].code,
            "city_code":e.detail.values[1].code,
            "county_code":e.detail.values[2].code,
            "town_code":"",

        })
        this.onCloseCity()
    },


    submitData :function(){

        var submitDataCallback = function(rs){
            console.log("submitDataCallback",rs)
        }

        var data = {
            "mobile":this.data.mobile,
            "name":this.data.name,
            "address":this.data.address,
            "province_code":this.data.province_code,
            "city_code":this.data.city_code,
            "county_code":this.data.county_code,
            "town_code":this.data.town_code,
            "is_default":this.data.isDefault,
        }

        app.httpRequest("addAddress", data , submitDataCallback)
    },

    clickIsDefault : function(){
        var isDefault = this.data.isDefault
        console.log("is default ",isDefault)
        if(isDefault <= 0 || !isDefault ){
            this.setData({"isDefault":1})
        }else{
            this.setData({"isDefault":0})
        }
    },

    blurAiText: function (e) {
        console.log("blurAiText ", e.detail.value)
    },
    onLoad: function (options) {
        Logs.onload("create address", options)

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

    initData: function () {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.shareMyApp(1, 18, '首页~','首页的内容',null)
    }
})