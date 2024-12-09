Page({
  data: {
    cameraStatus: '相机加载中...', // 初始化状态
    latitude: '',
    longitude: '',
    targetLatitude: '', // 目标纬度
    targetLongitude: '', // 目标经度
    isFacingBuilding: false, // 是否朝向目标
    isNearby: false, // 是否在目标附近
    distance: '', // 距离
    locationNum: 11, // 景点数量
	locationData: [], // 用于存储每个景点的距离和角度
	polyline: [], // 推荐的路线
	markers: [],
	isRouteVisible: false,
	tempImagePath: '',
	isFlashing: false, // 控制闪烁层的显示与隐藏
	indexOfShowingBuilding: -1,
	showPopup: false, // 控制弹窗显示与否
    buildingInfo: {
      name: "南京大学鼓楼校区",
      description: "诚朴雄伟，励学敦行",
	},
	newBuilding: false // 周围是否有新建筑
  },

  Rad: function(d) { //根据经纬度判断距离
    return d * Math.PI / 180.0;
},
getDistance: function(lat1, lng1, lat2, lng2) {
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
	const eventChannel = this.getOpenerEventChannel();
  	eventChannel.once('polylineEvent', (sendPolyline) => {
		// console.log('接收到的 polylineData:', sendPolyline.data);
		let polylineArray = JSON.parse(sendPolyline.data);
		// console.log(polylineArray);
		this.setData({
			polyline: polylineArray // 更新 polyline 数据
		});
		if (this.data.polyline != []) {
			this.setData({isRouteVisible: true});
		}
		// console.log('接收 polylineData:', this.data.polyline);
  	});
    // 检查用户是否授予权限
    var that = this;
    const locationArray = getApp().globalData.locationArray;
    // console.log(locationArray);
    const locationDataTmp = [];
    for (let index = 0; index <   this.data.locationNum; index++) {
	  const name = locationArray[index].name;
	  const description = locationArray[index].description;
      var distance = 0.0;
      var angle = 0.0;
      var isNearBy = false;
	  var isFacing = false;
      locationDataTmp.push({name, description, distance, isNearBy, angle, isFacing});
      this.setData({
        locationData: locationDataTmp
      });
    }    
    // 获取用户当前位置
    wx.getLocation({
      type: 'wgs84', // 默认类型
      success: function (res) {
        that.setData({
          latitude: res.latitude, // 设置当前纬度
          longitude: res.longitude // 设置当前经度
        });
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
  },

  

  // 开始位置监听
  startLocationMonitoring() {
    const that = this;

    // 检查权限
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        // 启动实时位置监听
        wx.startLocationUpdate({
          success() {
            wx.onLocationChange((res) => {
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude
			  });
			  var nearbyBuilding = false;
			  var nearestBuildingIndex = -1;
			  var nearestBuildingDistance = 10000;
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
								description: that.data.locationData[index].description,
								// name: "老八总部",
								// description: "老八老八"
							}
						})
					}
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
						// name: "老八总部",
						// description: "老八老八"
					}
				  })
			  }
            });
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
						description: this.data.locationData[index].description,
						// name: "老八总部",
						// description: "老八老八"
					}
				})
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
    this.setData({ cameraStatus: '相机已准备好' });
  },

  // 处理相机错误
  onCameraError(e) {
    console.error('相机加载错误:', e.detail);
    this.setData({ cameraStatus: '相机加载失败，请检查权限或真机调试' });
  },

  // 拍照
  takePhoto() {
	const ctx = wx.createCameraContext()
	// 启动闪烁效果
    this.setData({
		isFlashing: true
	  });

	  setTimeout(() => {
		this.setData({
		  isFlashing: false
		});
  
		
	  }, 100);
  

    ctx.takePhoto({
	  quality: 'high',
	  flash: 'off',
      success: (res) => {
        this.setData({
          tempImagePath: res.tempImagePath
		});
		console.log("拍照成功", res.tempImagePath);
		// 保存图片到本地相册
		wx.saveImageToPhotosAlbum({
			filePath: res.tempImagePath, // 使用拍摄后返回的图片路径
			success: (saveRes) => {
			  wx.showToast({
				title: '保存成功',
				icon: 'success',
				duration: 2000
			  });
			},
			fail: (saveErr) => {
			  wx.showToast({
				title: '保存失败',
				icon: 'none',
				duration: 2000
			  });
			  console.log('保存失败:', saveErr);
			}
		  });
	  },
	  error(e) {
		wx.showToast({
		title: '拍照失败',
		icon: 'none',
		duration: 2000
		});
		console.log(e.detail)
	  },
    })
  },
  
  

  checkProximityAndDirection(targetIndex) {
    const app = getApp();
    const locations = app.globalData.locationArray;
    const { latitude, longitude, direction } = this.data;
    const targetLatitude = locations[targetIndex].latitude;
    const targetLongitude = locations[targetIndex].longitude;
    const name = locations[targetIndex].name;
    if (!latitude || !longitude || direction === null) {
      wx.showToast({
        title: '请先获取当前位置和朝向',
        icon: 'none'
      });
      return;
    }
    const locationDataTmp = this.data.locationData;
    const distance = this.getDistance(latitude, longitude, targetLatitude, targetLongitude);
    
    this.setData({
      distance: distance
    });
    locationDataTmp[targetIndex].distance = distance;
    // console.log("name: ", name, " distance: ", locationDataTmp[targetIndex]);

    // 2. 判断是否在附近（距离小于 25 米）
    const isNearby = distance <= 25;
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
      isFacingBuilding:  isFacing
    });
    this.setData({
      locationData: locationDataTmp
    });
  },

  // 点击按钮时显示建筑信息
  showBuildingInfo: function() {
    this.setData({
	  showPopup: true, // 显示浮动弹窗
	  newBuilding: false
    });
  },

  // 关闭浮动弹窗
  closePopup: function() {
    this.setData({
      showPopup: false, // 隐藏浮动弹窗
    });
  },

  toggleNewBuilding() {
    this.setData({
      newBuilding: true  // 开始闪烁
    });

    // 设置闪烁结束后恢复按钮状态
    setTimeout(() => {
      this.setData({
        newBuilding: false  // 结束闪烁
      });
    }, 10000);  // 假设10秒后结束闪烁
  },

  // 停止罗盘监听
  stopCompass() {
    wx.offCompassChange();
  },
  stopMonitoring() {
    wx.offCompassChange();
    wx.stopLocationUpdate();
  },

  onUnload(){
    this.stopCompass();
    this.stopMonitoring();
  }
});
