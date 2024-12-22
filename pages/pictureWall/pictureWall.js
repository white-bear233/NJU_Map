// pages/RouteDetail/RouteDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
		var app = getApp();
		const openId = app.globalData.openid;
		this.getPhotosByOpenId(openId);
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

  getPhotosByOpenId(openId) {
		wx.request({
			url: 'http://172.29.4.191:8080/api/photos/getPhotosByOpenId', // 替换为你的后端接口地址
			method: 'GET',
			data: {
				openId: openId // 传递 openId 参数
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
  saveImage: function (e) {
	var imageUrl = e.target.dataset.url;
	console.log("IMAGE: ", imageUrl)
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '图片已保存',
              icon: 'success',
              duration: 2000
            })
          },
          fail(res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '下载失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

previewImage: function (e) {
  var current = e.target.dataset.url;
  wx.previewImage({
    current: current, // 当前显示图片的链接，不填则默认为 urls 的第一张
    urls: this.data.photoList.map(function (item) {
      return item.image;
    }) // 需要预览的图片链接列表
  })
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

