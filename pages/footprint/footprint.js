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
		this.getRouteHistory();
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