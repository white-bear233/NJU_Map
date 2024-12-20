// pages/userCenter/userCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    nickname: '微信用户'
  },

  onChooseAvatar(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl
    });
  },

  navigateToPictureWall() {
    wx.navigateTo({
      url: '/pages/pictureWall/pictureWall'
    });
  },

  navigateToFootprints() {
    wx.navigateTo({
      url: '/pages/footprint/footprint'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
	if (typeof this.getTabBar === 'function' && this.getTabBar()) {
		const page = getCurrentPages().pop();
		this.getTabBar().setData({
		  value: '/' + page.route
		})
	  }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})