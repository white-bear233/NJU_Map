// app.js


App({
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
