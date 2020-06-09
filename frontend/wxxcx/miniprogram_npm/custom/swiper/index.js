Component({
  // 接收父组件传递过来的数据
  properties: {
    listData: {
      type: Array,
      value: [],
    },
    dots: {
      type: Boolean,
    },
  },
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
  },


  methods:{
      bannerGoto:function(e){
          var bannerIndexKey = e.currentTarget.dataset.id;
          console.log("component method : banner goto:",bannerIndexKey)
          this.triggerEvent("bannerGoto",bannerIndexKey)
      },
  },

  observers: {
    listData: function (res) {
      // console.log('res', res)
    },
  },
  onShow: function () {
    // console.log(this.listData)
  },
})
