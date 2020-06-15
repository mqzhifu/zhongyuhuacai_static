// components/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      headerTitle:{
          type:String,
          value:"",
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

    observers: {
        headerTitle: function (res) {
            console.log('from index header', res)
        },
    },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
