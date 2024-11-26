Page({
  data: {
    cameraStatus: '相机加载中...', // 初始化状态
    latitude: '',
    longitude: '',
    targetLatitude: 32.117518, // 北大楼纬度
    targetLongitude: 118.946516, // 北大楼经度
    isFacingBuilding: false, // 是否朝向目标
    isNearby: false, // 是否在目标附近
    distance: null // 距离
  },

  onLoad() {
    // 检查用户是否授予权限
    var that = this;

    // 获取用户当前位置
    wx.getLocation({
      type: 'wgs84', // 默认类型
      success: function (res) {
        that.setData({
          latitude: res.latitude, // 设置当前纬度
          longitude: res.longitude // 设置当前经度
        });
       console.log(res.latitude + " " + res.longitude);
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
      console.log("Get Direnction: ")
      console.log(this.data.direction)
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
              that.checkProximityAndDirection(); // 更新距离和方向
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
      this.checkProximityAndDirection(); // 更新距离和方向
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

  checkProximityAndDirection() {
    const { latitude, longitude, targetLatitude, targetLongitude, direction } = this.data;
    
    if (!latitude || !longitude || direction === null) {
      wx.showToast({
        title: '请先获取当前位置和朝向',
        icon: 'none'
      });
      return;
    }

    // 1. 计算距离
    const R = 6371; // 地球半径，单位为千米
    const dLat = (targetLatitude - latitude) * Math.PI / 180;
    const dLon = (targetLongitude - longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latitude * Math.PI / 180) * Math.cos(targetLatitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // 距离单位转换为米

    this.setData({
      distance: (distance / 1000) // 保留两位小数，单位为千米
    });
    console.log("distance: ", distance);

    // 2. 判断是否在附近（距离小于 5000 米）
    const isNearby = distance <= 5000;

    // 3. 计算用户位置到北大楼的方位角（目标方向）
    const y = Math.sin(dLon) * Math.cos(targetLatitude * Math.PI / 180);
    const x = Math.cos(latitude * Math.PI / 180) * Math.sin(targetLatitude * Math.PI / 180) -
              Math.sin(latitude * Math.PI / 180) * Math.cos(targetLatitude * Math.PI / 180) * Math.cos(dLon);
    let targetDirection = Math.atan2(y, x) * 180 / Math.PI; // 方位角，单位为度
    targetDirection = (targetDirection + 360) % 360; // 将角度标准化到 [0, 360)

    // 4. 判断是否面向北大楼（方向差距在 ±15° 内）
    const isFacing = Math.abs(direction - targetDirection) <= 50;
    console.log("angle: ",  Math.abs(direction - targetDirection));
    // 5. 设置结果
    this.setData({
      isFacingBuilding:  isFacing
    });
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
