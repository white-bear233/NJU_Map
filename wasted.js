        // 获取周围的兴趣点（POI）
        // myAmapFun.getPoiAround({
        //   iconPathSelected: '../../img/1.jpg',
        //   iconPath: '../../img/2.jpg',
        //   success: function (data) {
        //     markersData = data.markers;

        //     将用户当前位置添加为一个标记
        //     markersData.push({
        //       id: 0,
        //       latitude: res.latitude,
        //       longitude: res.longitude,
        //       iconPath: "../../img/5.jpg", // 自定义图标
        //       title: '我的位置'
        //     });

        //     // 更新数据
        //     that.setData({
        //       markers: markersData
        //     });

        //     // 显示第一个标记的信息
        //     that.showMarkerInfo(markersData, 0);
        //   },
        //   fail: function (info) {
        //     wx.showModal({
        //       title: info.errMsg
        //     });
        //   }
        // });

  // 点击标记事件
  // makertap: function (e) {
  //   var id = e.markerId;
  //   var that = this;
  //   that.showMarkerInfo(markersData, id);
  //   that.changeMarkerColor(markersData, id);
  // },

    // 显示标记信息
  // showMarkerInfo: function (data, i) {
  //   var that = this;
  //   that.setData({
  //     textData: {
  //       name: data[i].name,
  //       desc: data[i].address
  //     }
  //   });
  // },

  // 更改标记颜色
  // changeMarkerColor: function (data, i) {
  //   var that = this;
  //   var markers = [];
  //   for (var j = 0; j < data.length; j++) {
  //     if (j == i) {
  //       data[j].iconPath = "../../img/3.jpg";
  //     } else {
  //       data[j].iconPath = "../../img/4.jpg";
  //     }
  //     markers.push(data[j]);
  //   }
  //   that.setData({
  //     markers: markers
  //   });
  // },

  
  // 推荐距离当前位置最近的路线
  // recommendNearestRoute() {
  //   const {
  //     latitude,
  //     longitude,
  //     routeOnePoints,
  //     routeTwoPoints,
  //     routeThreePoints
  //   } = this.data;

  //   // 获取各条路线的起点位置
  //   const routeOneStart = routeOnePoints[0]; // 路线一起点
  //   const routeTwoStart = routeTwoPoints[0]; // 路线二起点
  //   const routeThreeStart = routeThreePoints[0]; // 路线三起点

  //   // 计算当前位置与各个起点之间的距离
  //   const distanceToRouteOne = calculateDistance(latitude, longitude, routeOneStart.latitude, routeOneStart.longitude);
  //   const distanceToRouteTwo = calculateDistance(latitude, longitude, routeTwoStart.latitude, routeTwoStart.longitude);
  //   const distanceToRouteThree = calculateDistance(latitude, longitude, routeThreeStart.latitude, routeThreeStart.longitude);

  //   // 找到最近的路线
  //   const distances = [{
  //       route: 'routeOne',
  //       distance: distanceToRouteOne
  //     },
  //     {
  //       route: 'routeTwo',
  //       distance: distanceToRouteTwo
  //     },
  //     {
  //       route: 'routeThree',
  //       distance: distanceToRouteThree
  //     }
  //   ];

  //   // 按照距离从小到大排序，选择最短的距离
  //   distances.sort((a, b) => a.distance - b.distance);
  //   const nearestRoute = distances[0].route;

  //   // 更新选中的路线
  //   this.setData({
  //     selectedRoute: nearestRoute
  //   });
  //   // 可以在这里执行一些额外的操作，比如更新地图的显示
  //   console.log(`推荐路线: ${nearestRoute}，距离: ${distances[0].distance} 米`);
  // },
  // onPointClick(e) {
  //   const {
  //     longitude,
  //     latitude,
  //     name
  //   } = e.currentTarget.dataset; // 获取点击点的信息
  //   console.log(e);
  //   console.log(name);
  //   // 更新地图中心点和 markers
  //   this.setData({
  //     latitude: latitude,
  //     longitude: longitude,
  //   });

  //   // 使用地图 API 移动到目标点
  //   const mapCtx = wx.createMapContext('map'); // 确保地图组件的 ID 为 "myMap"
  //   mapCtx.moveToLocation({
  //     longitude: longitude,
  //     latitude: latitude,
  //   });
  // },