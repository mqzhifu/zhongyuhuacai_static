// components/citySearch/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      search_blur:function(e){
          var v = e.detail.value
          console.log(v.length)
          this.triggerEvent("searchProduct",v)
      },
  }
})
