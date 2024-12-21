// pages/RouteDetail/RouteDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  getPhotosByLocation(location) {
    wx.request({
        url: 'http://172.29.4.191:8080/api/photos/getPhotosByLocation', // 替换为你的后端接口地址
        method: 'GET',
        data: {
            location: location // 传递 location 参数
        },
        success: (res) => {
            console.log('照片列表:', res.data);
            if (res.data.code === '000') {
                // 请求成功，处理返回的数据
                const photos = res.data.result;
                // 假设你将这些照片显示在页面上
                this.setData({
                    photoList: photos
                });
            } else {
                wx.showToast({
                    title: '获取图片失败',
                    icon: 'none'
                });
            }
        },
        fail: (error) => {
            console.error('请求失败:', error);
            wx.showToast({
                title: '网络请求失败',
                icon: 'none'
            });
        }
    })
},
saveImageToAlbum(imageUrl) {
  wx.downloadFile({
      url: imageUrl,
      success: (res) => {
          if (res.statusCode === 200) {
              const filePath = res.tempFilePath;
              wx.saveImageToPhotosAlbum({
                  filePath: filePath,
                  success: (saveRes) => {
                      wx.showToast({
                          title: '图片保存成功',
                          icon: 'success'
                      });
                  },
                  fail: (saveErr) => {
                      console.error('保存图片失败:', saveErr);
                      wx.showToast({
                          title: '图片保存失败',
                          icon: 'none'
                      });
                  }
              });
          } else {
              console.error('下载图片失败:', res.statusCode);
              wx.showToast({
                  title: '下载图片失败',
                  icon: 'none'
              });
          }
      },
      fail: (error) => {
          console.error('下载图片失败:', error);
          wx.showToast({
              title: '下载图片失败',
              icon: 'none'
          });
      }
  });
},

saveButtonClick: function (e) {
  const imageUrl = e.currentTarget.dataset.imageUrl;
  if (imageUrl) {
      this.saveImageToAlbum(imageUrl);
  } else {
      console.error('未找到有效的图片URL');
      wx.showToast({
          title: '未找到有效的图片URL',
          icon: 'none'
      });
  }
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

