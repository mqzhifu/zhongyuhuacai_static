// miniprogram_npm/custom/cardItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击图片
    onTapItemImg(e) {
      const index = e.currentTarget.dataset.index
      // detail对象，提供给事件监听函数
      var myEventDetail = {
        id: this.properties.list[index].id,
      }
      // 触发事件的选项
      var myEventOption = {}
      this.triggerEvent('imgClick', myEventDetail, myEventOption)
    },
    // 点击购物车图标
    onTapItemCart(e) {
      const index = e.currentTarget.dataset.index
      // detail对象，提供给事件监听函数
      var myEventDetail = {
        id: this.properties.list[index].id,
      }
      // 触发事件的选项
      var myEventOption = {}
      this.triggerEvent('cartClick', myEventDetail, myEventOption)
    },
  },
})
