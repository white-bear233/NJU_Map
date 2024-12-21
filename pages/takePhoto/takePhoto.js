<<<<<<< HEAD
// pages/takePhoto/takePhoto.js
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
=======
Page({
	data: {
		position: 'back', // 相机朝向
		flash: 'off', // 闪光灯状态
		torch: 'off',
		lastImageUrl: '', // 最后拍摄的照片
		isNightMode: false, // 夜间模式
		gridVisible: true, // 网格线显示
		cameraContext: null, // 相机上下文
		isFlashing: false,
		isTorchOn: false,
		photoSettings: {
			quality: 'high',
			success: false
		},
		currentMode: 'photo',
		isRecordingGif: false,
		cameraReady: false,
		timerMode: {
			isActive: false,
			interval: 1000, // 拍摄间隔(ms)
			duration: 1000, // 总持续时间(ms)
			countdown: 2, // 开始前倒计时(s)
			photosCount: 0 // 已拍摄照片数
		},
		countdownOptions: [1, 2, 3, 4, 5, 6],
		countdownIndex: 1
	},

	onCountdownChange(e) {
		const index = e.detail.value;
		this.setData({
			countdownIndex: index,
			'timerMode.countdown': this.data.countdownOptions[index]
		});
	},

	onLoad() {
		this.initCamera();
		// 检查相机权限
		this.checkCameraAuth();
		const app = getApp();
		console.log("OPENID: ", app.globalData.openid);
	},

	initCamera() {
		const ctx = wx.createCameraContext();
		this.setData({
			cameraContext: ctx
		});
		this.onCameraReady();
	},

	// 检查相机权限
	checkCameraAuth() {
		wx.authorize({
			scope: 'scope.camera',
			success: () => {
				console.log('相机权限已获取');
			},
			fail: () => {
				wx.showModal({
					title: '提示',
					content: '需要相机权限才能使用此功能',
					success: (res) => {
						if (res.confirm) {
							wx.openSetting();
						}
					}
				});
			}
		});
	},

	// 切换前后摄像头
	switchCamera() {
		this.setData({
			position: this.data.position === 'back' ? 'front' : 'back'
		});
	},

	// 切换闪光灯
	switchFlash() {
		if (this.data.flash == 'torch') {
			return;
		}
		this.setData({
			flash: this.data.flash === 'on' ? 'off' : 'on'
		});
	},


	startTimeLapse() {
		if (!this.data.cameraReady) {
			wx.showToast({
				title: '相机未就绪',
				icon: 'none'
			});
			return;
		}

		// 开始倒计时
		this.setData({
			'timerMode.isActive': true,
			'timerMode.photosCount': 0
		});

		let countdown = this.data.timerMode.countdown;
		const countdownInterval = setInterval(() => {
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				this.startTimelapseCapture();
				return;
			}
			countdown--;
			wx.showToast({
				title: `${countdown}`,
				icon: 'none'
			});
		}, 1000);
	},

	startTimelapseCapture() {
		const totalPhotos = Math.floor(this.data.timerMode.duration / this.data.timerMode.interval);
		let capturedPhotos = 0;

		const captureInterval = setInterval(() => {
			if (capturedPhotos >= totalPhotos || !this.data.timerMode.isActive) {
				clearInterval(captureInterval);
				this.stopTimeLapse();
				return;
			}
			this.setData({
				isFlashing: true
			});
			this.data.cameraContext.takePhoto({
				quality: 'high',
				success: (res) => {
					capturedPhotos++;
					this.setData({
						'timerMode.photosCount': capturedPhotos,
						lastImageUrl: res.tempImagePath
					});
					this.setData({
						isFlashing: false
					});

					const openid = getApp().globalData.openid;
					console.log("OpenId: ", openid);

					const position = getApp().globalData.takePhotoPosition;
					console.log("Position: ", position);

					const currentTimeString = this.getCurrentTimeString();
					console.log("当前时间字符串: ", currentTimeString);

					this.uploadImageToServer(res.tempImagePath, openid, position, currentTimeString); // 登录上传
					// this.uploadImageToServer(res.tempImagePath, this.data.buildingInfo.name); // 不登录上传


					this.saveToAlbum(res.tempImagePath);
				},
				fail: (error) => {
					console.error('延时摄影拍摄失败:', error);
					clearInterval(captureInterval);
					this.stopTimeLapse();
					this.setData({
						isFlashing: false
					});
					wx.showToast({
						title: '拍摄失败',
						icon: 'error'
					});
				}
			});
		}, this.data.timerMode.interval);
	},

	stopTimeLapse() {
		this.setData({
			'timerMode.isActive': false
		});
	},

	getCurrentTimeString() {
		const now = new Date();
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const day = now.getDate().toString().padStart(2, '0');
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	},


	// 拍照
	takePhoto() {
		const camera = this.data.cameraContext;
		this.setData({
			isFlashing: true
		});
		camera.takePhoto({
			quality: 'high',
			success: (res) => {
				this.setData({
					lastImageUrl: res.tempImagePath
				});
				// 震动反馈
				wx.vibrateShort();
				// 保存到相册
				this.setData({
					isFlashing: false
				});
				this.saveToAlbum(res.tempImagePath);
				const openid = getApp().globalData.openid;
				console.log("OpenId: ", openid);

				const position = getApp().globalData.takePhotoPosition;
				console.log("Position: ", position);

				const currentTimeString = this.getCurrentTimeString();
				console.log("当前时间字符串: ", currentTimeString);

				this.uploadImageToServer(res.tempImagePath, openid, position, currentTimeString); // 登录上传
			},
			fail: (error) => {
				console.error('拍照失败:', error);
				this.setData({
					isFlashing: false
				});
				wx.showToast({
					title: '拍照失败',
					icon: 'none'
				});
			}
		});
	},

	// 保存到相册
	saveToAlbum(tempFilePath) {
		wx.saveImageToPhotosAlbum({
			filePath: tempFilePath,
			success: () => {
				wx.showToast({
					title: '已保存到相册',
					icon: 'success'
				});
			},
			fail: (error) => {
				console.error('保存失败:', error);
				wx.showToast({
					title: '保存失败',
					icon: 'none'
				});
			}
		});
	},



	uploadImageToServer(imagePath, fileName, position, time) {
		console.log("ImagePath: ", imagePath);
		console.log("openid: ", fileName);
		wx.uploadFile({
			url: 'http://172.29.4.191:8080/api/photos/upload', // 替换成你的服务器接口地址
			filePath: imagePath, // 拍照后得到的图片路径
			name: 'file', // 后端接收文件的字段名
			formData: {
				openId: fileName, // 传递 openId 给后端
				position: position,
				time: time
			},
			success: (res) => {
				console.log('上传成功', res);
				const data = JSON.parse(res.data); // 假设后端返回的是 JSON 格式
				if (data.code === '000') {
					wx.showToast({
						title: '上传成功',
						icon: 'success',
						duration: 2000
					});
				} else {
					wx.showToast({
						title: '上传失败',
						icon: 'none',
						duration: 2000
					});
				}
			},
			fail: (err) => {
				console.log('上传失败', err);
				wx.showToast({
					title: '上传失败',
					icon: 'none',
					duration: 2000
				});
			}
		});
	},


	// 切换夜间模式
	toggleNightMode() {
		this.setData({
			flash: 'torch'
		})
	},

	// 错误处理
	onCameraError(e) {
		console.error('相机错误:', e.detail);
		wx.showToast({
			title: '相机出现错误',
			icon: 'none'
		});
	},




	switchMode(e) {
		const mode = e.currentTarget.dataset.mode;
		this.setData({
			currentMode: mode
		});
		switch (mode) {
			case 'photo':
				this.setupPhotoMode();
				break;
			case 'portrait':
				this.setupPortraitMode();
				break;
			case 'night':
				this.setupNightMode();
				break;
			case 'wait':
				this.setupSlowWaitMode();
				break;
		}
	},

	getPicture() {
		console.log("1111");
		wx.navigateTo({
			url: "/pages/pictureWall/pictureWall",
			success() {
				console.log("页面跳转成功");
			},
			fail(err) {
				console.error("页面跳转失败", err);
			},
		});
	},

	setupPhotoMode() {

		this.setData({
			flash: 'off'
		})
		// 设置照片模式
	},

	setupPortraitMode() {

		this.setData({
			flash: 'off'
		})
		// 设置人像模式
	},

	setupNightMode() {
		// 设置夜间模式
		this.toggleNightMode();
	},

	setupSlowWaitMode() {
		this.setData({
			flash: 'off'
		})
		// 设置延时摄影模式

	},



	onCameraReady() {
		this.setData({
			cameraReady: true
		});
	},

	onCameraError(e) {
		console.error('相机错误:', e);
		wx.showToast({
			title: '相机初始化失败',
			icon: 'error'
		});
	},



	createGif() {
		wx.showLoading({
			title: '正在生成GIF...'
		});

		try {
			// 保存帧数据到本地
			const saveFrames = this.data.frames.map((frame, index) => {
				return new Promise((resolve, reject) => {
					wx.saveFile({
						tempFilePath: frame,
						success: (res) => {
							resolve(res.savedFilePath);
						},
						fail: reject
					});
				});
			});

			Promise.all(saveFrames).then(savedFrames => {
				this.setData({
					lastImageUrl: savedFrames[0], // 使用第一帧作为预览
					isRecordingGif: false
				});

				wx.hideLoading();
				wx.showToast({
					title: 'GIF已保存',
					icon: 'success'
				});
				console.log("SAVE: ", saveFrames);
			}).catch(error => {
				console.error('GIF保存失败:', error);
				wx.hideLoading();
				wx.showToast({
					title: '保存失败',
					icon: 'error'
				});
			});
		} catch (error) {
			console.error('GIF生成失败:', error);
			wx.hideLoading();
			wx.showToast({
				title: '生成失败',
				icon: 'error'
			});
		}
	},

	// 页面卸载
	onUnload() {
		if (this.data.cameraContext) {
			this.data.cameraContext = null;
		}
	}
});
>>>>>>> d65f101479c82d30a6873ff4c0bf04b32e05e808
