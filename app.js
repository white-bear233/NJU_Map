App({
  globalData: {
    locationArray: [{
        name: "中山楼",
        latitude: 32.053605539912716,
        longitude: 118.78101314513998
      },
      {
        name: "赛珍珠纪念馆",
        latitude: 32.053980620125216,
        longitude: 118.78159520896541
      },
      {
        name: "大礼堂",
        latitude: 32.05616973858758,
        longitude: 118.78050841847768
      },
      {
        name: "百年大鼎",
        latitude: 32.05539240000003,
        longitude: 118.7795580724084
      },
      {
        name: "斗鸡闸",
        latitude: 32.05489364703179,
        longitude: 118.78031569333115
      },
      {
        name: "校史馆",
        latitude: 32.054762564556796,
        longitude: 118.78179597449513
      },
      {
        name: "五二零纪念亭",
        latitude: 32.05535365696394,
        longitude: 118.78137244809074
      },
      {
        name: "北大楼",
        latitude: 32.05710520617599,
        longitude: 118.7809480606773
      },
      {
        name: "西大楼",
        latitude: 32.056594885094945,
        longitude: 118.78052292550687
      },
      {
        name: "东大楼",
        latitude: 32.05767025927746,
        longitude: 118.78140784951229
      },
      {
        name: "南京大学革命烈士纪念碑",
        latitude: 32.05627646327862,
        longitude: 118.7801589997433
      }
    ],
    openid: null,
  },
  "pages": [
    "pages/getInfo/getInfo",
    "pages/index/index"
  ],
  "window": {
    "navigationBarTitleText": "校园导览"
  },
  "permission": {
    "scope.userLocation": {
      "desc": "需要获取您的地理位置用于导航"
    }
  },

  onLaunch() {
    // 调用 wx.login 获取临时登录凭证
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('登录成功，临时凭证:', res.code);
          // 将 code 发送到后端，获取 openid
          wx.request({
            url: 'http://172.29.4.191:8080/user/login', // 替换为你的后端接口地址
            method: 'POST',
            data: {
              code: res.code,
            },
            success: (response) => {
              console.log(response.data)
              console.log('获取到的 openid:', response.data.result.openid);
              // 将 openid 存储到全局变量
              this.globalData.openid = response.data.result.openid;
              console.log(this.globalData.openid)
            },
            fail: (err) => {
              console.error('获取 openid 失败:', err);
            },
          });
        } else {
          console.log('登录失败:', res.errMsg);
        }
      },
    });
  }
})
