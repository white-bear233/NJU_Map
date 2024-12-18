// custom-tab-bar/index.js
Component({
  properties: {},

  data: {
    value: '/pages/index/index',  // 默认选中首页
    list: [
      { value: '/pages/index/index', label: '首页', icon: 'home' },
      { value: '/pages/getInfo/getInfo', label: '景点列表', icon: 'architecture-hui-style' },
      { value: '/pages/pictureWall/pictureWall', label: '主页', icon: 'user' },
    ],
  },

  methods: {
    onChange(e) {
      wx.switchTab({
        url: e.detail.value
      });
    }
  },
});