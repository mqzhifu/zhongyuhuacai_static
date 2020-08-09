const app = getApp()
const Logs = require("../../../../utils/log.js")

Page({

    /**
     * 页面的初始数据
     */

    data: {
        list :null,
        refundConst :[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initRefundList()
    },

    goto_detail:function(e){
        var id =  e.currentTarget.dataset.id
        var data = {id:id}
        console.log("goto_detail",data)

        app.goto(1,23,data)
    },


    initRefundList : function(){
        var parentObj = this


        this.setData({refundConst:app.globalData.refundConst})
        console.log("refundConst",this.data.refundConst)


        var RefundListBack = function(rr,res){
            console.log("RefundListBack",res)
            parentObj.setData({list:res})
        }
        app.httpRequest("getUserRefundList",null,RefundListBack)
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

    }
})