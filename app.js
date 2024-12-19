// app.js


App({
  globalData: {
    token: null,  // 存储后端返回的 token
    openid: null, // 存储用户的 openid
    locationArray: [{
        name: "中山楼",
        latitude: 32.053605539912716,
        longitude: 118.78101314513998,
        description: "南京大学中山楼"
      },
      {
        name: "赛珍珠纪念馆",
        latitude: 32.053980620125216,
        longitude: 118.78159520896541,
        description: "南京大学赛珍珠纪念馆"
      },
      {
        name: "大礼堂",
        latitude: 32.05616973858758,
        longitude: 118.78050841847768,
        description: "南京大学理塘"
      },
      {
        name: "百年大鼎",
        latitude: 32.05539240000003,
        longitude: 118.7795580724084,
        description: "南鼎"
      },
      {
        name: "斗鸡闸",
        latitude: 32.05489364703179,
        longitude: 118.78031569333115,
        description: "南京大学斗鸡闸"
      },
      {
        name: "校史馆",
        latitude: 32.054762564556796,
        longitude: 118.78179597449513,
        description: "南京大学校史馆"
      },
      {
        name: "五二零纪念亭",
        latitude: 32.05535365696394,
        longitude: 118.78137244809074,
        description: "南京大学520"
      },
      {
        name: "北大楼",
        latitude: 32.05710520617599,
        longitude: 118.7809480606773,
        description: "南京大学北大楼"
      },
      {
        name: "西大楼",
        latitude: 32.056594885094945,
        longitude: 118.78052292550687,
        description: "南京大学西大楼"
      },
      {
        name: "东大楼",
        latitude: 32.05767025927746,
        longitude: 118.78140784951229,
        description: "南京大学东大楼"
      },
      {
        name: "南京大学革命烈士纪念碑",
        latitude: 32.05627646327862,
        longitude: 118.7801589997433,
        description: "南京大学革命烈士纪念碑"
      }
    ],
  },

  onLaunch() {
    console.log("小程序启动");
    this.login(); // 在启动时调用登录逻辑
  },

  login() {
    const that = this;

    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: 'http://172.29.4.191:8080/user/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success(response) {
              console.log(response.data);
              if (response.data.code === '000') {
                console.log('登录成功', response.data.result);
                console.log(response.data.result.openid);
                that.openid = response.data.result.openid;
                console.log(that.openid);
              } else {
                console.error('登录失败', response.data.msg);
              }
            }
          });
        } else {
          console.error('登录失败！' + res.errMsg);
        }
      }
    });
  },

  "pages": [
    "pages/start/start",
    "pages/index/index",
	"pages/getInfo/getInfo"
  ],
  "window": {
	"navigationBarTitleText": "校园导览",
	"navigationStyle": "custom"
  },
  "permission": {
    "scope.userLocation": {
      "desc": "需要获取您的地理位置用于导航"
    }
  }
})
