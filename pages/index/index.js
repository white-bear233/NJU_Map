import amapFile from '../../libs/amap-wx.130';


// var markersData = [];
Page({
  data: {
    showOverlay: false,
    showSpotDetail:false,
    markers: [],
    latitude: '',
    longitude: '',
    targetLatitude: '',
    targetLongitude: '',
    polyline: [], // 保存路线的折线数
    isRouteOneVisible: false, // 初始化线路一为隐藏状态
    direction: '',
    directionName: '您的朝向：',
    screenHeight: 0, // 屏幕高度
    drawerY: 0, // 抽屉初始位置（相对于 movable-area）
    tab_value :0,
    selectedRoute: null, // 记录当前选中的路线
    currentPointIndex: null, // 当前选中的站点索引
    isMovableViewDisabled: true, // 控制是否禁用拖动
    map_height: 100,
    SpotImages:"https://box.nju.edu.cn/f/9701fc9c6a274813adba/?dl=1",
    SpotDescription: '测试',
    isButtonActive: false, // 用于控制按钮的点击状态
    routeOneStations: [{name: '汉口路校门',latitude: 32.05370585683426,longitude: 118.7805903995204},
      {name: '图书馆',latitude: 32.054494939563895,longitude: 118.78064529920516},
      {name: '二源碑',latitude: 32.054875573149495,longitude: 118.7811862728513},
      {name: '校史馆',latitude: 32.054700517528914,longitude: 118.78128997375563},
      {name: '小礼堂',latitude: 32.05519481339915,longitude: 118.78073202691496},
      {name: '大礼堂',latitude: 32.056071941285616,longitude: 118.78071847288084},
      {name: '北大楼',latitude: 32.05689357932788,longitude: 118.78097916355443},
      {name: '革命烈士纪念碑',latitude: 32.05621368784742,longitude: 118.78019601293454},
      {name: '大纛坪',latitude: 32.05584764537453,longitude: 118.77886909273411},
      {name: '赛珍珠故居',latitude: 32.05518987690895,longitude: 118.77834734590897},
      {name: '斗鸡闸',latitude: 32.05486493188022,longitude: 118.78002502178742},
    ],
    routeOnePoints : [
      { longitude: 118.7805903995204, latitude: 32.05370585683426 }, // 位置一
      { longitude: 118.78044168304405, latitude: 32.05447979801747 }, // 位置二
      { longitude: 118.78038722936117, latitude: 32.05483697058257 }, // 位置三
      { longitude: 118.78096008552666, latitude: 32.054867509969604 },  // 位置四
      { longitude: 118.78128750656776, latitude: 32.05484175580724 },
      { longitude: 118.78123304003009, latitude: 32.05529609505237 },//点击位置的经度: 118.7807935549688, 纬度: 32.05524645029985
      { longitude: 118.78123304003009, latitude: 32.05529609505237 },
      { longitude: 118.7807935549688, latitude: 32.05524645029985 },
      { longitude: 118.7807502615176, latitude: 32.05565767833783 }, 
      { longitude: 118.7809659149907, latitude: 32.05568229293923 }, 
      { longitude: 118.78087695813178, latitude: 32.056248706217346 }, 
      { longitude: 118.78107484142242, latitude: 32.05627330134156 }, 
      { longitude: 118.78098702715329, latitude: 32.05685726868522 }, 
      { longitude: 118.78019902253232, latitude: 32.0567827478176 }, 
      { longitude: 118.77991524023957, latitude: 32.05672736704578 },
      { longitude: 118.78001653672027, latitude: 32.05614076191823 },
      { longitude: 118.78001653672027, latitude: 32.05614076191823 },
      { longitude: 118.77976032946708, latitude: 32.056114432443856 },
      { longitude: 118.77895031810488, latitude: 32.05597157777683 },
      { longitude: 118.77836609121846, latitude: 32.0559273244912 },
      { longitude: 118.77839060771976, latitude: 32.055721283259885 },
      { longitude: 118.77835117235463, latitude: 32.05538646203006 },
      { longitude: 118.77847164113041, latitude: 32.054786321212035 },
      { longitude: 118.77912952964914, latitude: 32.054856271268676 },
      { longitude: 118.7791407982719, latitude: 32.05467054654759 },
      { longitude: 118.78003442255124, latitude: 32.054698904318094 },
    ],
    routeTwoPoints : [
      { longitude: 118.7805903995204, latitude: 32.05370585683426 }, // 位置一
      { longitude: 118.78044168304405, latitude: 32.05447979801747 }, // 位置二
      { longitude: 118.78038722936117, latitude: 32.05483697058257 }, // 位置三
      { longitude: 118.77912834702693, latitude: 32.05506659538429 },  // 位置四
      { longitude: 118.77907026619368, latitude: 32.055487177020574 },  // 位置四
      { longitude: 118.7789486352201, latitude: 32.05597337916496 },  // 位置四
      { longitude: 118.77976453956535, latitude: 32.05611529010134},
      { longitude: 118.78107509445545, latitude: 32.056272670607264},
      { longitude:118.78098680544997, latitude: 32.056858390811506 },
    ],
    routeThreePoints : [
      { longitude: 118.7805903995204, latitude: 32.05370585683426 }, // 位置一
      { longitude: 118.78044168304405, latitude: 32.05447979801747 }, // 位置二
      { longitude: 118.7803350436501, latitude: 32.05519144452321 }, // 位置三
      { longitude: 118.77912834702693, latitude: 32.05506659538429 },  // 位置四
      { longitude: 118.77907026619368, latitude: 32.055487177020574 },  // 位置四
      { longitude: 118.7789486352201, latitude: 32.05597337916496 },  // 位置四
      { longitude: 118.77976453956535, latitude: 32.05611529010134},
      { longitude: 118.78107509445545, latitude: 32.056272670607264},
      { longitude:118.78098680544997, latitude: 32.056858390811506 },
	],
	showCompleteDialog: false,
    completedRouteName: '',
    completedRouteTime: ''
  },
  // 点击推荐路线按钮时调用
  // onShowDrawer() {
  //   // const animation = wx.createAnimation({
  //   //   duration: 300, // 动画持续时间
  //   //   timingFunction: 'ease', // 动画过渡效果
  //   // });

  //   const newHeight = this.data.map_height === 100 ? 50 : 100;
  //   if(this.data.isButtonActive){
  //     this.setData({
  //       isButtonActive : false
  //     })
  //   }
  //   else{
  //     this.setData({
  //       isButtonActive : true
  //     })
  //   }
  //   console.log(this.data.isButtonActive)
  //   //设置动画效果
  //   //animation.height(newHeight).step();
  //   const {tab_value} = this.data;
  //     // 否则选择新的路线
  //   if(this.data.drawerY == 0){
  //     this.setData({
  //       polyline: this.getRoutePolyline(tab_value), // 获取对应路线的坐标
  //       isButtonActive: !this.data.isButtonActive, // 切换按钮的活跃状态
  //     });
  //     this.addMarkersToRoute();
  //   }else{
  //     this.setData({
  //       polyline: [], // 获取对应路线的坐标
  //       markers:[]
  //     });
  //   }

  //   this.setData({
  //     //animationData: animation.export(), // 更新动画数据
  //     drawerY: (this.data.drawerY >= -200) ? -0.5 * this.data.screenHeight : 0,
  //     // map_height: newHeight, // 更新地图高度
  //   });
    
  // },
  onShowDrawer() {
    const newHeight = this.data.map_height === 100 ? 50 : 100;
    const newButtonState = !this.data.isButtonActive
    // 更新 isButtonActive 的状态并且在回调中执行其他操作
    this.setData({
      isButtonActive: newButtonState,
    }, () => {

    });
    const { tab_value } = this.data;
    if (this.data.drawerY == 0) {
      this.setData({
        polyline: this.getRoutePolyline(tab_value),
      });
      this.addMarkersToRoute();
    } else {
      this.setData({
        polyline: [],
        markers: [],
      });
    }
    this.setData({
      // 这里是用来更新地图高度等其他UI状态
      drawerY: (this.data.drawerY >= -200) ? -0.5 * this.data.screenHeight : 0,
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

  // 点击定位按钮时调用此方法
  mapAiming() {
    // 获取当前位置
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const {
          latitude,
          longitude
        } = res;
        this.setData({
          latitude: latitude,
          longitude: longitude, // 更新当前位置
        });

        // 获取地图上下文对象
        const mapCtx = wx.createMapContext('map');
        // 将地图移动到当前位置
        mapCtx.moveToLocation();
      },
      fail: (err) => {
        console.error('获取位置失败', err);
        wx.showToast({
          title: '无法获取当前位置',
          icon: 'none',
        });
      }
    });
  },
  // 停止罗盘监听
  stopCompass() {
    wx.offCompassChange();
  },
  // 计算地理坐标间的距离（单位：米）

  // 页面加载时获取位置
  onLoad: function () {
	const app = getApp();
	console.log("OPENID: ", app.globalData.openid);
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: 'ace2794f81f01e47f26de3d9f88aa9cd'
    });

    // 获取用户当前位置
    wx.getLocation({
      type: 'wgs84', // 默认类型
      success:  (res) =>{
        that.setData({
          latitude: res.latitude, // 设置当前纬度
          longitude: res.longitude // 设置当前经度
        });
        console.log(res.latitude + " " + res.longitude);
        // this.recommendNearestRoute();
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
    const systemInfo = wx.getSystemInfoSync();
    console.log(systemInfo.windowHeight); // 输出基础库版本
    const screenHeight = systemInfo.windowHeight;
    this.setData({
      screenHeight: screenHeight,
      areaHeight: 1.2 * screenHeight,
      areaTop: 0.4 * screenHeight
    });
    this.startLocationMonitoring();

  },

  // 添加标记点到路线
  addMarkersToRoute() {
    const customRoutePoints = [{
        name: '汉口路校门',
        coords: {
          latitude: 32.05370585683426,
          longitude: 118.7805903995204
        }
      },
      {
        name: '图书馆',
        coords: {
          latitude: 32.054494939563895,
          longitude: 118.78064529920516
        }
      },
      {
        name: '二源碑',
        coords: {
          latitude: 32.054875573149495,
          longitude: 118.7811862728513
        }
      },
      {
        name: '校史馆',
        coords: {
          latitude: 32.054700517528914,
          longitude: 118.78128997375563
        }
      },
      {
        name: '小礼堂',
        coords: {
          latitude: 32.05519481339915,
          longitude: 118.78073202691496
        }
      },
      {
        name: '大礼堂',
        coords: {
          latitude: 32.056071941285616,
          longitude: 118.78071847288084
        }
      },
      {
        name: '北大楼',
        coords: {
          latitude: 32.05689357932788,
          longitude: 118.78097916355443
        }
      },
      {
        name: '革命烈士纪念碑',
        coords: {
          latitude: 32.05621368784742,
          longitude: 118.78019601293454
        }
      },
      {
        name: '大纛坪',
        coords: {
          latitude: 32.05584764537453,
          longitude: 118.77886909273411
        }
      },
      {
        name: '赛珍珠故居',
        coords: {
          latitude: 32.05518987690895,
          longitude: 118.77834734590897
        }
      },
      {
        name: '斗鸡闸',
        coords: {
          latitude: 32.05486493188022,
          longitude: 118.78002502178742
        }
      },
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
  // 开始位置监听
  startLocationMonitoring() {
    const that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        // 启动实时位置监听
        wx.startLocationUpdate({
          success() {
            wx.onLocationChange((res) => {
              //console.log("LA: ", res.latitude);
              //console.log("LO: ", res.longitude);
              // that.setData({
              //   latitude: res.latitude,
              //   longitude: res.longitude
              // });
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
   
  onTabsChange(e){
    let currentTab = e.detail.value;  // 获取当前选中的 tab 的 value
    currentTab = parseInt(currentTab, 10);  // 将字符串转换为整数
    this.setData({
      tab_value:currentTab,
      
    });
    console.log(currentTab)
    this.setData({
      polyline: this.getRoutePolyline(currentTab), // 获取对应路线的坐标
    });
  } ,

  // 获取路线的 polyline 配置
  getRoutePolyline(routeName) {
    console.log(routeName);
    switch (routeName) {
      case 0:
        return [{
          points: this.data.routeOnePoints,
          color: "#00CD66", // 浅蓝色路径
          width: 8, // 路线宽度
          dottedLine: false, // 实线
          arrowLine: true, // 显示方向箭头
          borderColor: "#FFFFFF", // 白色边框（透明度50%）
          borderWidth: 2 // 边框宽度
        }];
      case 1:
        return [{
          points: this.data.routeTwoPoints,
          color: "#FF6347", // 浅红色路径
          width: 8, // 路线宽度
          dottedLine: false, // 实线
          arrowLine: true, // 显示方向箭头
          borderColor: "#FFFFFF", // 白色边框（透明度50%）
          borderWidth: 2 // 边框宽度
        }];
      case 2:
        return [{
          points: this.data.routeThreePoints,
          color: "#1E90FF", // 浅蓝色路径
          width: 8, // 路线宽度
          dottedLine: false, // 实线
          arrowLine: true, // 显示方向箭头
          borderColor: "#FFFFFF", // 白色边框（透明度50%）
          borderWidth: 2 // 边框宽度
        }];
      default:
        return [];
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const page = getCurrentPages().pop();
      this.getTabBar().setData({
        value: '/' + page.route
      })
	}
	
	const app = getApp();
    if (app.globalData.exitPolyline) {
      this.setData({
        showCompleteDialog: true,
        completedRouteName: app.globalData.completePolylineName,
        completedRouteTime: app.globalData.completePolylineTime
	  });
	  console.log("show: ", this.data.showCompleteDialog, this.data.completedRouteName, this.data.completedRouteTime)
      // Reset global flag
      app.globalData.exitPolyline = false;
    }
  },

  onUnload() {
    wx.stopLocationUpdate();
    this.stopCompass();
  },
  onLinkClick() {
    this.setData({
      showOverlay: true
    })
  },
  closeDialog() {
    this.setData({
      showOverlay: false,
      showSpotDetail: false,
    })
  },
  closeCompleteDialog() {
	  this.setData({
		  showCompleteDialog: false
	  })
  },

  onDrawerChange(e) {
    const {
      y
    } = e.detail;

  },
  // 点击地图任意位置事
  mapTap: function (e) {
    const latitude = e.detail.latitude; // 点击位置的纬度
    const longitude = e.detail.longitude; // 点击位置的经度
    // 打印经纬度到控制台
    console.log(`点击位置的经度: ${longitude}, 纬度: ${latitude}`);
  },
  onDrawerTouchEnd(e) {
  },
  handleTouchStart(e) {
    e.stopPropagation(); // 阻止冒泡，确保地图的点击事件能够触发
  },
  startNavigate: function () {
    const polylineData = JSON.stringify(this.data.polyline); // 将 polyline 转换为 JSON 字符串
    const markData = JSON.stringify(this.data.markers);
    // 使用 wx.navigateTo 跳转页面并传递 polyline 数据
    wx.navigateTo({
      url: '/pages/camera/camera',
      success: function (res) {
        const sendPolyline = {
          data: polylineData,
          mark: markData
        };
        res.eventChannel.emit('polylineEvent', sendPolyline);
      }
    }   
    );
  }, // 开始导航传递信息
  markertap:function(e){
     console.log(e)
     this.setData({
       showSpotDetail:true
     })
  }
});
