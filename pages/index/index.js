import amapFile from '../../libs/amap-wx.130';

// var markersData = [];

Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    targetLatitude: '',
    targetLongitude: '',
    polyline: [], // 保存路线的折线数
    isRouteOneVisible: false, // 初始化线路一为隐藏状态
    direction: '',
    directionName:  '您的朝向：',
    screenHeight: 0, // 屏幕高度
    drawerY: -400, // 抽屉初始位置（相对于 movable-area）
    drawerYTmp: 0, // 抽屉被拉动的位置
    drawer20: 0, // 抽屉 20% 高度位置
    drawer40: 0, // 抽屉 40% 高度位置
    tabs: [
      { title: '推荐路线一' },
      { title: '推荐路线二' },
      { title: '推荐路线三' },
    ],
    routeTwoPoints: [
      { name: '站点D' },
      { name: '站点E' },
      { name: '站点F' },
    ],
    routeThreePoints: [
      { name: '站点G' },
      { name: '站点H' },
      { name: '站点I' },
    ],
    routeOnePoints: [
      { longitude: 118.7805903995204, latitude: 32.05370585683426, name: '汉口路校门' },
      { longitude: 118.78044168304405, latitude: 32.05447979801747, name: '图书馆' },
      { longitude: 118.7803350436501, latitude: 32.05519144452321, name: '教学楼' },
    ],

  },
  // 点击推荐路线按钮时调用
  onShowDrawer() {
    console.log("show");
    this.setData({
      drawerY: 300,  // 通过修改 drawerY 来使 drawer 显示
    });
  },

  onPointClick(e) {
    const { longitude, latitude, name } = e.currentTarget.dataset; // 获取点击点的信息
    console.log(e);
    console.log(name);
    // 更新地图中心点和 markers
    this.setData({
      latitude: latitude,
      longitude: longitude,

    });

    // 使用地图 API 移动到目标点
    const mapCtx = wx.createMapContext('map'); // 确保地图组件的 ID 为 "myMap"
    mapCtx.moveToLocation({
      longitude: longitude,
      latitude: latitude,
    });

    wx.showToast({
      title: `定位到：${name}`,
      icon: 'success',
      duration: 1500,
    });
  },
  onTabChange(e) {
    if(e.detail.index == 0){
      this.toggleRouteOne();
    }
    console.log('Tab changed:', e.detail.index);
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
      drawerY: -400, // 设置初始抽屉位置
      drawerYTmp: drawerHeight20,
      drawer20: drawerHeight20,
      drawer40: drawerHeight40
    });

    this.routeOnePoints = [
      { longitude: 118.7805903995204, latitude: 32.05370585683426 }, // 位置一
      { longitude: 118.78044168304405, latitude: 32.05447979801747 }, // 位置二
      { longitude: 118.7803350436501, latitude: 32.05519144452321 }, // 位置三
      { longitude: 118.77912834702693, latitude: 32.05506659538429 },  // 位置四
      { longitude: 118.77907026619368, latitude: 32.055487177020574 },  // 位置四
      { longitude: 118.7789486352201, latitude: 32.05597337916496 },  // 位置四
      { longitude: 118.77976453956535, latitude: 32.05611529010134},
      { longitude: 118.78107509445545, latitude: 32.056272670607264},
      { longitude:118.78098680544997, latitude: 32.056858390811506 },
    ]
  },
  // 添加标记点到路线
  addMarkersToRoute() {
    const customRoutePoints = [
      { name: '汉口路校门', coords: { latitude: 32.05370585683426, longitude: 118.7805903995204 } },
      { name: '图书馆', coords: { latitude: 32.05447979801747, longitude: 118.78044168304405 } },
      { name: '教学楼', coords: { latitude: 32.05519144452321, longitude: 118.7803350436501 } }
    ];
    const markers = customRoutePoints.map((point, index) => ({
      id: index, // 唯一标识符
      latitude: point.coords.latitude,
      longitude: point.coords.longitude,
      width: 20, // 标记点的宽度
      height: 30, // 标记点的高度
      callout: {
        content: point.name, // 使用自定义名称作为标记点文字内容
        color: '#000', // 文字颜色
        fontSize: 14, // 字体大小
        borderRadius: 5, // 边框圆角
        bgColor: '#FFF', // 背景颜色
        padding: 5, // 内边距
        display: 'ALWAYS' // 始终显示
      }
    }));

    this.setData({
      markers: markers // 更新标记点数据
    });
  },
  // 切换线路一的显示状态
  toggleRouteOne: function () {
    const isVisible = this.data.isRouteOneVisible;

    if (!isVisible) {
      // 显示线路一
      this.setData({
        polyline: [{
          points: this.routeOnePoints,
          color: "#00CD66", // 浅蓝色路径
          width: 8, // 路线宽度
          dottedLine: false, // 实线
          arrowLine: true, // 显示方向箭头
          borderColor: "#FFFFFF", // 白色边框（透明度50%）
          borderWidth: 2 // 边框宽度
        }],
        isRouteOneVisible: true
      });
      this.addMarkersToRoute(); // 调用方法添加标记点
    } else {
      // 隐藏线路一
      this.setData({
        polyline: [],
        markers: [], // 清空标记点数据
        isRouteOneVisible: false
      });
    }
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
    console.log(e.detail.y +" " +  e.detail.x);
    // 更新当前抽屉位置
    this.setData({
      drawerYTmp: e.detail.y
    });
  },
  // 点击地图任意位置事件
  mapTap: function (e) {
    const latitude = e.detail.latitude; // 点击位置的纬度
    const longitude = e.detail.longitude; // 点击位置的经度
    // 打印经纬度到控制台
    console.log(`点击位置的经度: ${longitude}, 纬度: ${latitude}`);
  },
  onDrawerTouchEnd(e) {
  
  }
  
});
