import amapFile from '../../libs/amap-wx.130';

var markersData = [];

Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    targetLatitude: '',
    targetLongitude: '',
    textData: {
      name: '欢迎使用校园导览',
      desc: '请选择一个标记以查看详细信息'
    },
    direction: '',
    directionName:  '您的朝向：',
    screenHeight: 0, // 屏幕高度
    drawerY: 0, // 抽屉初始位置（相对于 movable-area）
    drawerYTmp: 0, // 抽屉被拉动的位置
    drawer20: 0, // 抽屉 20% 高度位置
    drawer40: 0, // 抽屉 40% 高度位置
    
  },
  
  // 点击标记事件
  makertap: function (e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },

  // 判断人是否在地区范围内
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
    const isFacing = Math.abs(direction - targetDirection) <= 15;
    console.log("angle: ",  Math.abs(direction - targetDirection));
    // 5. 设置结果
    this.setData({
      isFacingBuilding: isNearby && isFacing
    });
  },

  // 停止罗盘监听
  stopCompass() {
    wx.offCompassChange();
  },

  // 页面加载时获取位置
  onLoad: function () {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: 'ace2794f81f01e47f26de3d9f88aa9cd'
    });

    // 获取用户当前位置
    wx.getLocation({
      type: 'wgs84', // 默认类型
      success: function (res) {
        that.setData({
          latitude: res.latitude, // 设置当前纬度
          longitude: res.longitude // 设置当前经度
        });
       console.log(res.latitude + " " + res.longitude);

        // 获取周围的兴趣点（POI）
        myAmapFun.getPoiAround({
          iconPathSelected: '../../img/1.jpg',
          iconPath: '../../img/2.jpg',
          success: function (data) {
            markersData = data.markers;

            // 将用户当前位置添加为一个标记
            // markersData.push({
            //   id: 0,
            //   latitude: res.latitude,
            //   longitude: res.longitude,
            //   iconPath: "../../img/5.jpg", // 自定义图标
            //   title: '我的位置'
            // });

            // 更新数据
            that.setData({
              markers: markersData
            });

            // 显示第一个标记的信息
            that.showMarkerInfo(markersData, 0);
          },
          fail: function (info) {
            wx.showModal({
              title: info.errMsg
            });
          }
        });
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
    const windowInfo = wx.getWindowInfo();
    const screenHeight = windowInfo.windowHeight;
    const drawerHeight40 = screenHeight * 0.4; 
    const drawerHeight20 = screenHeight * 0.2; 
    this.setData({
      screenHeight: screenHeight,
      drawerY: drawerHeight20, // 设置初始抽屉位置
      drawerYTmp: drawerHeight20,
      drawer20: drawerHeight20,
      drawer40: drawerHeight40
    });
  },

  // 显示标记信息
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },

  // 更改标记颜色
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = "../../img/3.jpg";
      } else {
        data[j].iconPath = "../../img/4.jpg";
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.stopCompass();
  },
  onReady() {
    const screenHeight = wx.getWindowInfo().windowHeight;
    const drawerHeight = screenHeight * 0.2; // 抽屉初始高度为屏幕的30%
    this.setData({
      drawerY: screenHeight - drawerHeight
    });
  },

  onReady() {
    // 动态设置屏幕高度比例（可选）
    const screenHeight = wx.getWindowInfo().windowHeight;
    this.setData({
      screenHeight: screenHeight
    });
  },

  onDrawerChange(e) {
    // 更新当前抽屉位置
    this.setData({
      drawerYTmp: e.detail.y
    });
  },

  onDrawerTouchEnd(e) {
  
  }
  
});
