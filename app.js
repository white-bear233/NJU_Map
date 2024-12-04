// app.js


App({
  globalData: {
    locationArray: [
      { name: "中山楼", latitude: 32.053605539912716, longitude: 118.78101314513998 },
      {name: "赛珍珠纪念馆", latitude: 32.053980620125216, longitude: 118.78159520896541},
      {name: "大礼堂", latitude: 32.05616973858758, longitude: 118.78050841847768},
      {name: "百年大鼎", latitude: 32.05539240000003, longitude: 118.7795580724084},
      {name: "斗鸡闸", latitude: 32.05489364703179, longitude: 118.78031569333115},
      {name: "校史馆", latitude: 32.054762564556796, longitude: 118.78179597449513},
      {name: "五二零纪念亭", latitude: 32.05535365696394, longitude: 118.78137244809074},
      {name: "北大楼", latitude: 32.05710520617599, longitude: 118.7809480606773},
      {name: "西大楼", latitude: 32.056594885094945, longitude: 118.78052292550687},
      {name: "东大楼", latitude: 32.05767025927746, longitude: 118.78140784951229},
      {name: "南京大学革命烈士纪念碑", latitude: 32.05627646327862, longitude: 118.7801589997433}

    ]
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
  }
})
