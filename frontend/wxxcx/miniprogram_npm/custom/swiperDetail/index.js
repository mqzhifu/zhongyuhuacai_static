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
    currentSwiper: 0,
  },
  onShow: function () {},
  methods: {
    // 轮播自动滑动时，获取当前的轮播id
    swiperChange(e) {
      this.setData({
        currentSwiper: e.detail.current,
      })
    },
  },
})
