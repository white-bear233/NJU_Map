import amapFile from '../../libs/amap-wx.130';

var markersData = [];

Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {
      name: '欢迎使用校园导览',
      desc: '请选择一个标记以查看详细信息'
    }
  },
  
  // 点击标记事件
  makertap: function (e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
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
  }
});
