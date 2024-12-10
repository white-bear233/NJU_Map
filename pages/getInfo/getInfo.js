// pages/getInfo/getInfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buildingName: '', // 存储用户输入的楼宇名称
    buildingInfo: null, // 存储查询到的楼宇信息
    errorMsg: '', // 错误信息，显示查询失败时的提示
  },

  /**
   * 用户输入文本框内容时触发的事件
   */
  onInputChange(e) {
    this.setData({
      buildingName: e.detail.value, // 更新输入框的值
      errorMsg: '', // 清空错误信息
    });
  },

  /**
   * 查询楼宇信息
   */
  onQueryBuilding() {
    const buildingName = this.data.buildingName; // 获取用户输入的楼宇名称

    if (!buildingName) {
      wx.showToast({
        title: '请输入楼宇名称',
        icon: 'none',
      });
      return;
    }

    // 发起网络请求，传递查询参数
    wx.request({
      url: `http://172.29.4.191:8080/api/buildings/getBuilding`, // 后端接口地址
      method: 'GET',
      data: {
        name: buildingName, // 将用户输入的楼宇名称作为查询参数传递
      },
      success: (res) => {
        console.log(res); // 打印整个响应结果
        if (res.statusCode === 200) {
          if (res.data.code === "000") {
            // 请求成功，更新页面的数据
            this.setData({
              buildingInfo: res.data.result, // 将返回的结果存储到 buildingInfo 中
              errorMsg: '', // 清空错误信息
            });
          } else {
            // 如果返回的 code 不是 "000"，说明查询失败
            this.setData({
              buildingInfo: null, // 清空建筑信息
              errorMsg: res.data.msg || '查询失败，请重试', // 设置错误信息
            });
            wx.showToast({
              title: res.data.msg || '查询失败',
              icon: 'none',
            });
          }
        } else {
          console.error('请求失败:', res.data.msg);
          wx.showToast({
            title: '查询失败',
            icon: 'none',
          });
        }
      },
      fail: (error) => {
        console.error('请求失败:', error);
        wx.showToast({
          title: '请求失败',
          icon: 'none',
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时可以执行一些初始化操作
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
});
