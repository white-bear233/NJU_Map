Page({
	data: {
		cameraStatus: '相机加载中...', // 初始化状态
		latitude: '',
		longitude: '',
		center: {
			latitude: '',
			longitude: '',
		},
		firstCalculate: false,
		startLatitude: '', // 上一次位置记录
		startLongitude: '', // 上一次位置记录
		targetLatitude: '', // 目标纬度
		targetLongitude: '', // 目标经度
		isFacingBuilding: false, // 是否朝向目标
		isNearby: false, // 是否在目标附近
		distance: '', // 距离
		locationNum: 0, // 景点数量
		locationData: [], // 用于存储每个景点的距离和角度
		polyline: [], // 推荐的路线
		isGetAwayDotline: false,
		showPolylineMode: 0,
		markers: [],
		isRouteVisible: false,
		tempImagePath: '',
		isFlashing: false, // 控制闪烁层的显示与隐藏
		indexOfShowingBuilding: -1,
		showPopup: false, // 控制弹窗显示与否
		buildingInfo: {
			name: "南京大学鼓楼校区",
			description: "诚朴雄伟，励学敦行",
			image: [],
		},
		errorMsg: '', // 错误信息，显示查询失败时的提示
		newBuilding: false, // 周围是否有新建筑
		showOverlay: false, // 控制遮罩层显示
		isLandscape: false, // 横屏标记
		leftLandScape: true, // 向哪边横屏
		// 竖屏地图样式
		photoList: [],
		current: 0,
		autoplay: false,
		duration: 500,
		interval: 5000,
		navigation: {
			isActive: false,
			time: 0,
			timerInstance: null,
			formattedTime: '00:00:00',
			distance: 0,
			speed: 0.0,
		},
		showSpotDetail: false,
		SpotImages: "https://box.nju.edu.cn/f/9701fc9c6a274813adba/?dl=1",
		SpotDescription: '测试',
		dialogKey: '',
		showWithInput: false,
		showTextAndTitleWithInput: false,
		passedPoint: [],
		polyline_name: ""
	},

	Rad: function (d) { //根据经纬度判断距离
		return d * Math.PI / 180.0;
	},

	onChange(e) {
		const {
			detail: {
				current,
				source
			},
		} = e;
		console.log(current, source);
	},




	startListeningDeviceOrientation() {



		wx.startDeviceMotionListening({
			interval: 'normal',
			success: () => {
				console.log('设备方向监听已启动');
				wx.onDeviceMotionChange((res) => {
					// 判断方向: alpha 是设备旋转角度，gamma 用来判断横屏
					const {
						gamma
					} = res;
					const isLandscape = Math.abs(gamma) > 45; // 横屏的角度通常大于 45 度
					if (this.data.isLandscape !== isLandscape) {
						this.setData({
							isLandscape
						});
						if (gamma > 0) {
							this.setData({
								leftLandScape: true
							});
						} else if (gamma < 0) {
							this.setData({
								leftLandScape: false
							});
						}
					}
					console.log(isLandscape);
				});
			},
			fail: (err) => {
				console.error('设备方向监听失败:', err);
			},
		});
	},



	 onQueryBuilding () {
		// const buildingName = this.data.buildingInfo.name;
		const buildingName = '北大楼';
		// 发起网络请求，传递查询参数
		wx.request({
			url: `http://172.29.4.191:8080/api/buildings/getBuildingDetail`, // 后端接口地址
			method: 'GET',
			data: {
				name: buildingName, // 将用户输入的楼宇名称作为查询参数传递
			},
			success: (res) => {
				console.log("RES", res); // 打印整个响应结果
				if (res.statusCode === 200) {
					if (res.data.code === "000") {
						// 请求成功，更新页面的数据
						this.setData({
							buildingInfo: {
								name: buildingName,
								description: res.data.result.description,
								image: res.data.result.image,
							},
							errorMsg: '', // 清空错误信息
						});
						console.log("buildingInfoIN: ", this.data.buildingInfo);
					} else {
						// 如果返回的 code 不是 "000"，说明查询失败
						console.log("EEEEEE");
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
				console.log("Enter4", buildingName);
				console.log("EEEEEE");
				console.log("building Name: ", buildingName);
				console.error('请求失败:', error);
				wx.showToast({
					title: '请求失败',
					icon: 'none',
				});
			},
		});
	},

	startNavigation() {
		if (!this.data.navigation.isActive) {
			const timer = setInterval(() => {
				const currentTime = this.data.navigation.time + 1;
				const hours = Math.floor(currentTime / 3600);
				const minutes = Math.floor((currentTime % 3600) / 60);
				const seconds = currentTime % 60;

				this.setData({
					'navigation.time': currentTime,
					'navigation.formattedTime': `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
					'navigation.isActive': true,
					'navigation.timerInstance': timer
				});
			}, 1000);
		}
	},

	stopNavigation() {
		if (this.data.navigation.timerInstance) {
			clearInterval(this.data.navigation.timerInstance);
			this.setData({
				'navigation.isActive': false,
				'navigation.timerInstance': null
			});
		}
	},


	getDistance: function (lat1, lng1, lat2, lng2) {
		// console.log(lat1, lng1, lat2, lng2);
		var radLat1 = this.Rad(lat1);
		var radLat2 = this.Rad(lat2);
		var a = radLat1 - radLat2;
		var b = this.Rad(lng1) - this.Rad(lng2);
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378.137;
		s = Math.round(s * 10000) / 10;
		s = s.toFixed(2)
		// console.log('经纬度计算的距离:' + s)
		return s
	},

	onLoad(options) {
		// 获得路线
		// 获取 polyline 参数并进行解析
		// this.getPhotosByOpenId("斗鸡闸");
		// console.log("PHOTO: ", this.data.photoList);
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.once('polylineEvent', (sendPolyline) => {
			// console.log('接收到的 polylineData:', sendPolyline.data);
			let polylineArray = JSON.parse(sendPolyline.data);
			let markersArray = JSON.parse(sendPolyline.mark);
			let tabValue = JSON.parse(sendPolyline.polylineValue);
			var polylineName = "";
			if (tabValue == 0) {
				polylineName = "历史寻根之旅"
			}
			else if (tabValue == 1) {
				polylineName = "体验生活之旅"
			}
			else if (tabValue == 2) {
				polylineName = "一路向南之旅"
			}
			console.log(polylineName);
			this.setData({
				'polyline[0]': polylineArray, // 更新 polyline 数据
				'markers': markersArray,
				'polyline_name': polylineName
			});
			if (this.data.polyline != []) {
				this.setData({
					isRouteVisible: true
				});
			}
			// console.log('接收 polylineData:', this.data.polyline);
		});
		// 检查用户是否授予权限
		var that = this;
		const locationArray = getApp().globalData.locationArray;
		// console.log(locationArray);
		var locationDataTmp = [];
		for (let index = 0; index < 20; index++) {
			var name = '';
			var distance = 0.0;
			var angle = 0.0;
			var isNearBy = false;
			var isFacing = false;
			locationDataTmp.push({
				name,
				distance,
				isNearBy,
				angle,
				isFacing
			});
			this.setData({
				locationData: locationDataTmp
			});
			// console.log("locationData: ", locationDataTmp);
		}
		// 获取用户当前位置
		wx.getLocation({
			type: 'wgs84', // 默认类型
			success: function (res) {
				// if (res.latitude != that.data.latitude && res.longitude != that.data.longitude) {
				that.setData({
					latitude: res.latitude, // 设置当前纬度
					longitude: res.longitude, // 设置当前经度
					startLatitude: res.latitude,
					startLongitude: res.longitude
				});

				// 获取地图上下文对象
				const mapCtx = wx.createMapContext('map');
				// 将地图移动到当前位置
				mapCtx.moveToLocation();
				// }
				//    console.log(res.latitude + " " + res.longitude);
			},
			fail: function (err) {
				wx.showModal({
					title: '定位失败',
					content: err.errMsg
				});
			}
		});
		wx.onCompassChange((res) => {
			this.setData({
				direction: res.direction
			});
			//   console.log("Get Direnction: ")
			//   console.log(this.data.direction)
		});

		this.startLocationMonitoring();
		this.startCompassMonitoring();
		this.startListeningDeviceOrientation();
		this.startNavigation();
		this.setData({
			'navigation.distance': 0
		});
	},




	addDashedLine(nearestLatitude, nearestLongtitude) {
		if (nearestLongtitude == 0) {
			this.setData({
				isGetAwayDotline: true
			})
			return;
		}
		// 添加新的虚线路径
		const newLine = {
			points: [{
				latitude: this.data.latitude,
				longitude: this.data.longitude
			}, {
				latitude: nearestLatitude,
				longitude: nearestLongtitude
			}],
			color: '#00CD66',
			width: 4,
			dottedLine: true,
			// borderColor: "#FFFFFF",
			// borderWidth: 2
		};

		// 将新路径添加到现有polyline数组
		this.setData({
			'polyline[1]': [newLine]
		});
	},


	// 开始位置监听
	startLocationMonitoring() {
		const that = this;
		this.setData({
			buildingInfo: {
				name: "北大楼"
			}
		})
		this.onQueryBuilding(); // 用于测试
		// 检查权限
		console.log("BBBBBBBBBB: ", this.data.buildingInfo);
		wx.authorize({
			scope: 'scope.userLocation',
			success() {
				// 启动实时位置监听
				wx.startLocationUpdate({
					success() {
						wx.onLocationChange((res) => {

							// if (res.latitude != that.data.latitude && res.longitude != that.data.longitude) {

							if (that.data.firstCalculate == true) {
								const moveDistance = that.getDistance(that.data.startLatitude, that.data.startLongitude, res.latitude, res.longitude);
								that.setData({
									latitude: res.latitude,
									longitude: res.longitude,
									'navigation.distance': Number(that.data.navigation.distance) + Number(moveDistance),
									startLongitude: res.longitude,
									startLatitude: res.latitude
								});
								// console.log("moveDistance: ", moveDistance);
								// console.log("distance: ", that.data.navigation.distance);
							} else {
								that.setData({
									firstCalculate: true
								});
								const moveDistance = that.getDistance(that.data.startLatitude, that.data.startLongitude, res.latitude, res.longitude);
								if (Number(moveDistance) > 5) {
									that.setData({
										latitude: res.latitude,
										longitude: res.longitude,
										'navigation.distance': Math.round(Number(that.data.navigation.distance) + Number(moveDistance)),
										startLongitude: res.longitude,
										startLatitude: res.latitude
									});
									console.log("moveDistance: ", moveDistance);
									console.log("distance: ", that.data.navigation.distance);
								} else {
									that.setData({
										latitude: res.latitude,
										longitude: res.longitude,
										startLongitude: res.longitude,
										startLatitude: res.latitude,
									});
								}
							}
							// }
							var nearbyBuilding = false;
							var nearestBuildingIndex = -1;
							var nearestBuildingDistance = 10000;
							// console.log("markers: ", that.data.markers);
							that.setData({
								locationNum: that.data.markers.length
							});
							// console.log("markersLen: ", that.data.locationNum);
							for (let index = 0; index < that.data.locationNum; index++) {
								that.checkProximityAndDirection(index); // 更新距离和方向
								if (that.data.locationData[index].isNearBy && that.data.locationData[index].isFacing) {
									nearbyBuilding = true;
									console.log("IN ", that.data.indexOfShowingBuilding, index);
									if (that.data.indexOfShowingBuilding != index) {
										that.toggleNewBuilding();
										that.setData({
											indexOfShowingBuilding: index,
											buildingInfo: {
												name: that.data.locationData[index].name,
												description: "",
												image: ""
											}
										})
										var app = getApp();
										app.globalData.takePhotoPosition = that.data.buildingInfo.name;
										that.onQueryBuilding();



										var passed = that.data.passedPoint;
										passedBool = false;
										for (let index1 = 0; index1 < passed.length; index1++) {
											if (passed[index1] == index) {
												passedBool = true;
											}
										}
										if (passedBool == false) {
											passed.push(index);
										}
										that.setData({
											passedPoint: passed
										})
									}
									console.log("PassedPoint: ", that.data.passedPoint);
								}
								if (that.data.locationData[index].distance < nearestBuildingDistance) {
									nearestBuildingDistance = that.data.locationData[index].distance;
									nearestBuildingIndex = index;
								}
							}
							if (nearbyBuilding == false) {
								that.setData({
									indexOfShowingBuilding: -1,
									buildingInfo: {
										name: "南京大学鼓楼校区",
										description: `距您最近的景点为： ${that.data.locationData[nearestBuildingIndex].name}`,
									}
								})
								const app = getApp();
								const locationsA = app.globalData.locationArray;
								that.addDashedLine(locationsA[nearestBuildingIndex].latitude, locationsA[nearestBuildingIndex].longitude);
							} else {
								that.addDashedLine(0, 0);
							}
						});
						// const mapCtx = wx.createMapContext('map');
						// mapCtx.moveToLocation();
					},
					fail(err) {
						console.error('位置更新失败', err);
					}
				});
			},
			fail(err) {
				wx.showModal({
					title: '定位权限未开启',
					content: '请在设置中开启定位权限',
				});
			}
		});
	},

	// 开始方向监听
	startCompassMonitoring() {
		wx.onCompassChange((res) => {
			this.setData({
				direction: res.direction
			});
			for (let index = 0; index < this.data.locationNum; index++) {
				this.checkProximityAndDirection(index); // 更新距离和方向 


				if (this.data.locationData[index].isNearBy && this.data.locationData[index].isFacing) {
					if (this.data.indexOfShowingBuilding != index) {


						this.setData({
							indexOfShowingBuilding: index,
							buildingInfo: {
								name: this.data.locationData[index].name,
							}
						})
						this.onQueryBuilding();
						this.toggleNewBuilding();
						break;
					}
				}
			}
		});
	},


	// 相机初始化完成
	onCameraInitDone(e) {
		console.log('相机初始化完成:', e);
		this.setData({
			cameraStatus: '相机已准备好'
		});
	},

	// 处理相机错误
	onCameraError(e) {
		console.error('相机加载错误:', e.detail);
		this.setData({
			cameraStatus: '相机加载失败，请检查权限或真机调试'
		});
	},

	navigateToPhotoTaking() {
		console.log("1111");
		wx.navigateTo({
			url: "/pages/takePhoto/takePhoto",
			success() {
				console.log("页面跳转成功");
			},
			fail(err) {
				console.error("页面跳转失败", err);
			},
		});
	},

	// 拍照
	//   takePhoto() {
	// 	const ctx = wx.createCameraContext()
	// 	// 启动闪烁效果
	//     this.setData({
	// 		isFlashing: true
	// 	  });

	// 	  setTimeout(() => {
	// 		this.setData({
	// 		  isFlashing: false
	// 		});


	// 	  }, 100);


	//     ctx.takePhoto({
	// 	  quality: 'high',
	// 	  flash: 'off',
	// 	  resolution: 'high',
	//       success: (res) => {
	//         this.setData({
	//           tempImagePath: res.tempImagePath
	// 		});
	// 		console.log("拍照成功", res.tempImagePath);
	// 		// 上传图片到服务器
	// 		const openId = getApp().globalData.openId;
	// 		console.log("OpenId: ", openId);
	// 		this.uploadImageToServer(res.tempImagePath, openId); // 登录上传
	// 		// this.uploadImageToServer(res.tempImagePath, this.data.buildingInfo.name); // 不登录上传
	// 		// 保存图片到本地相册
	// 		wx.saveImageToPhotosAlbum({
	// 			filePath: res.tempImagePath, // 使用拍摄后返回的图片路径
	// 			success: (saveRes) => {
	// 			  wx.showToast({
	// 				title: '保存成功',
	// 				icon: 'success',
	// 				duration: 2000
	// 			  });
	// 			},
	// 			fail: (saveErr) => {
	// 			  wx.showToast({
	// 				title: '保存失败',
	// 				icon: 'none',
	// 				duration: 2000
	// 			  });
	// 			  console.log('保存失败:', saveErr);
	// 			}
	// 		  });
	// 	  },
	// 	  error(e) {
	// 		wx.showToast({
	// 		title: '拍照失败',
	// 		icon: 'none',
	// 		duration: 2000
	// 		});
	// 		console.log(e.detail)
	// 	  },
	//     })
	//   },


	//   // 上传图片到后端服务器
	// uploadImageToServer(imagePath, fileName) {
	// 	console.log("ImagePath: ", imagePath);
	// 	console.log("fileName: ", fileName);
	// 	wx.uploadFile({
	// 	  url: 'http://172.29.4.191:8080/api/photos/upload', // 替换成你的服务器接口地址
	// 	  filePath: imagePath,  // 拍照后得到的图片路径
	//       name: 'file',         // 后端接收文件的字段名
	// 	  formData: {
	// 		openId: fileName,     // 传递 openId 给后端
	// 	  },
	// 	  success: (res) => {
	// 		console.log('上传成功', res);
	// 		const data = JSON.parse(res.data);  // 假设后端返回的是 JSON 格式
	// 		if (data.code === '000') {
	// 		  wx.showToast({
	// 			title: '上传成功',
	// 			icon: 'success',
	// 			duration: 2000
	// 		  });
	// 		} else {
	// 		  wx.showToast({
	// 			title: '上传失败',
	// 			icon: 'none',
	// 			duration: 2000
	// 		  });
	// 		}
	// 	  },
	// 	  fail: (err) => {
	// 		console.log('上传失败', err);
	// 		wx.showToast({
	// 		  title: '上传失败',
	// 		  icon: 'none',
	// 		  duration: 2000
	// 		});
	// 	  }
	// 	});
	//   },


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




	checkProximityAndDirection(targetIndex) {
		const {
			latitude,
			longitude,
			direction
		} = this.data;
		const targetLatitude = this.data.markers[targetIndex].latitude;
		const targetLongitude = this.data.markers[targetIndex].longitude;
		const name = this.data.markers[targetIndex].callout.content;
		if (!latitude || !longitude || direction === null) {
			wx.showToast({
				title: '请先获取当前位置和朝向',
				icon: 'none'
			});
			return;
		}
		const locationDataTmp = this.data.locationData;
		locationDataTmp[targetIndex].name = name;
		const distance = this.getDistance(latitude, longitude, targetLatitude, targetLongitude);

		this.setData({
			distance: distance
		});
		locationDataTmp[targetIndex].distance = distance;
		// console.log("name: ", name, " distance: ", locationDataTmp[targetIndex]);

		// 2. 判断是否在附近（距离小于 30 米）
		const isNearby = distance <= 30;
		locationDataTmp[targetIndex].isNearBy = isNearby;
		const dLat = (targetLatitude - latitude) * Math.PI / 180;
		const dLon = (targetLongitude - longitude) * Math.PI / 180;
		// 3. 计算用户位置到北大楼的方位角（目标方向）
		const y = Math.sin(dLon) * Math.cos(targetLatitude * Math.PI / 180);
		const x = Math.cos(latitude * Math.PI / 180) * Math.sin(targetLatitude * Math.PI / 180) -
			Math.sin(latitude * Math.PI / 180) * Math.cos(targetLatitude * Math.PI / 180) * Math.cos(dLon);
		let targetDirection = Math.atan2(y, x) * 180 / Math.PI; // 方位角，单位为度
		targetDirection = (targetDirection + 360) % 360; // 将角度标准化到 [0, 360)
		locationDataTmp[targetIndex].angle = targetDirection;
		// 4. 判断是否面向目标（方向差距在 ±45° 内）
		const isFacing = Math.abs(direction - targetDirection) <= 90;
		locationDataTmp[targetIndex].isFacing = isFacing;
		// console.log("angle: ",  Math.abs(direction - targetDirection));
		// 5. 设置结果
		this.setData({
			isFacingBuilding: isFacing
		});
		this.setData({
			locationData: locationDataTmp
		});
	},

	// 点击按钮时显示建筑信息
	showBuildingInfo: function () {
		this.setData({
			showPopup: true, // 显示浮动弹窗
			newBuilding: false,
			showOverlay: true
		});
	},

	// 关闭遮罩层
	closeOverlay() {
		this.setData({
			showOverlay: false
		});
	},

	// 关闭浮动弹窗
	closePopup: function () {
		this.setData({
			showPopup: false, // 隐藏浮动弹窗
		});
	},

	toggleNewBuilding() {
		this.setData({
			newBuilding: true // 开始闪烁
		});

		wx.vibrateLong({
			success: () => {
				console.log('手机短振动成功');
			},
			fail: (err) => {
				console.error('振动失败:', err);
			},
		});
	},

	//点击打开照片墙
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

	// markertap: function (e) {
	// 	console.log(e)
	// 	this.setData({
	// 		showSpotDetail: true
	// 	})
	// },

	markertap:function(e){
		const markerId = e.markerId; // 获取点击的标记点的 ID
		const markers = this.data.markers; // 获取当前页面的所有标记点
		const clickedMarker = markers.find(marker => marker.id === markerId); // 查找对应的标记点
		
		if (clickedMarker) {
		  const name = clickedMarker.callout.content; // 获取标记点的名称
		  console.log('点击的标记点名称是:', name); // 打印景点名称
		  wx.request({
			url: `http://172.29.4.191:8080/api/buildings/getBuildingBrief`, // 后端接口地址
			method: 'GET',
			data: {
			  name: name, // 将用户输入的楼宇名称作为查询参数传递
			},
			success: (res) => {
			  
			  if (res.statusCode === 200) {
				if (res.data.code === "000") {
				  // 请求成功，更新页面的数据
				  console.log(res); // 打印整个响应结果
				  this.setData({
					SpotDescription: res.data.result.description, // 将返回的结果存储到 buildingInfo 中
					SpotImages: res.data.result.image, // 清空错误信息
					SpotName:name,
				  });
				  console.log(this.data.SpotDescription);
				  console.log(this.data.SpotImages);
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
		  this.setData({
			showSpotDetail: true // 控制景点详情的显示
		  });
		}
	  },

	closeDialog1() {
		console.log("CL");
		this.setData({
			showOverlay: false,
			showSpotDetail: false,
		})
	},

	// 停止罗盘监听
	stopCompass() {
		wx.offCompassChange();
	},
	stopMonitoring() {
		wx.offCompassChange();
		wx.stopLocationUpdate();
	},

	showDialog(e) {
		const { key } = e.currentTarget.dataset;
		this.setData({ [key]: true, dialogKey: key });
	  },
  
	  closeDialog() {
		const { dialogKey } = this.data;
		this.setData({ [dialogKey]: false });
	  },

	  exitRouteTravel() {
		const { dialogKey } = this.data;
		this.setData({ [dialogKey]: false });
		wx.switchTab({
		  url: '/pages/index/index',
		})
	  },



	  uploadPolylineToServer(routeName, openid, dateStr, timeStr, completePercentage) {
		wx.request({
			url: 'http://172.29.4.191:8080/api/polyline/upload', // 替换为你的后端接口地址
			method: 'POST',
			data: {
				openId: openid, // 传递 openId 参数
				date: dateStr,
				time: timeStr,
				percentage: completePercentage,
				name: routeName
			},
			success: (res) => {
				if (res.data.code === '000') {
					wx.showToast({
						title: '上传路线成功',
						icon: 'none'
					});
				} else {
					wx.showToast({
						title: '上传路线失败',
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

	onUnload() {
		this.stopCompass();
		this.stopMonitoring();
		this.stopNavigation();
		var app = getApp();

		let persentageTmp = this.data.passedPoint.length / this.data.locationNum;
		let percentage = persentageTmp.toPrecision(3);
		var data = new Date();
		const dataStr = data.toLocaleDateString();
		console.log("polylineData: ", dataStr, this.data.navigation.formattedTime,percentage);
		this.uploadPolylineToServer (this.data.polyline_name, app.globalData.openid, dataStr, this.data.navigation.formattedTime, percentage); // 上传路线

	// 	completePolylineName: '游览路线',
	// completePolylineTime: '',
	// completePolyline: false,
	// exitPolyline: false
	
		app.globalData.exitPolyline = true;
		app.globalData.completePolylineName = this.data.polyline_name;
		app.globalData.completePolylineTime = this.data.navigation.formattedTime;
		console.log("NAMS: ", app.globalData.completePolylineName)
	}
});