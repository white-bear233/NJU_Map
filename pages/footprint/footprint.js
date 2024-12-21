Page({
	data: {
		routes: [{
				id: 1,
				date: '2024-03-15',
				duration: '00:25:30',
				percentage: 85,
				distance: '1.2',
				speed: '5\'20"'
			},
			{
				id: 2,
				date: '2024-03-14',
				duration: '00:15:20',
				percentage: 60,
				distance: '0.8',
				speed: '5\'40"'
			}
		]
	},

	onLoad: function () {
		var app = getApp();
		const openid = app.globalData.openid;
		// this.getPolylineByOpenId(openid);
	},

	getPolylineByOpenId(openId) {
		wx.request({
			url: 'http://172.29.4.191:8080/api/polyline/getPolylineByOpenId', // 替换为你的后端接口地址
			method: 'GET',
			data: {
				openId: openId // 传递 openId 参数
			},
			success: (res) => {
				console.log('路线列表:', res.data);
				if (res.data.code === '000') {
					// 请求成功，处理返回的数据
					const routins = res.data.result;
					// 假设你将这些照片显示在页面上
					this.setData({
						routes: routins
					});
				} else {
					wx.showToast({
						title: '获取路线失败',
						icon: 'none'
					});
				}
			},
			fail: (error) => {
				console.error('请求失败:', error);
				wx.showToast({
					title: '网络请求失败',
					icon: 'none'
				});
			}
		})
	},

	getRouteHistory() {
		const app = getApp();
		// 从服务器获取路线历史
		wx.request({
			url: 'your_api_url/routes',
			data: {
				openid: app.globalData.openid
			},
			success: (res) => {
				if (res.data.code === '000') {
					this.setData({
						routes: res.data.routes
					});
				}
			}
		});
	},
	toggleDetail(e) {
		const id = e.currentTarget.dataset.id;
		const routes = this.data.routes.map(route => {
			if (route.id === id) {
				return {
					...route,
					showDetail: !route.showDetail
				};
			}
			return route;
		});
		this.setData({
			routes
		});
	},

	previewImage(e) {
		const urls = e.currentTarget.dataset.urls.map(photo => photo.url);
		const current = e.currentTarget.dataset.current;
		wx.previewImage({
			urls,
			current
		});
	}
});