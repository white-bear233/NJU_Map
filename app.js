// app.js


App({
  "pages": [
    "pages/start/start",
    "pages/index/index",
    "pages/getInfo/getInfo",
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
