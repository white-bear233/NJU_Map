// pages/RouteDetail/RouteDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    routeDetail: {
      type: Array,
      value: [] // 默认值为空数组
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 生命周期 - 组件加载时
     */
    // 调试：查看属性
    logRouteDetail() {
      console.log('Route Detail:', this.properties.routeDetail);
    },

    // 生命周期：组件加载时
    onLoad() {
      this.logRouteDetail();
    },

    /**
     * 生命周期 - 组件渲染完成时
     */
    onReady() {
      console.log('onReady', this.properties.routeDetail);
    },

    /**
     * 生命周期函数 - 组件显示时
     */
    onShow() {
      console.log('onShow', this.properties.routeDetail);
    },

    /**
     * 生命周期函数 - 组件隐藏时
     */
    onHide() {
      console.log('onHide', this.properties.routeDetail);
    },

    /**
     * 生命周期函数 - 组件卸载时
     */
    onUnload() {
      console.log('onUnload', this.properties.routeDetail);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      console.log('onPullDownRefresh', this.properties.routeDetail);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
      console.log('onReachBottom', this.properties.routeDetail);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
      console.log('onShareAppMessage', this.properties.routeDetail);
    }
  }
});
