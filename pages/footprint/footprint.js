Page({
	data: {
		routes: [],
	},

	onLoad: function () {
		var app = getApp();
		const openid = app.globalData.openid;
		this.getPolylineByOpenId(openid);
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



					const routins = res.data.result;
					this.setData({ routes: routins }, () => {
						// 在回调中更新描述
						var index = 1;
						let updatedRoutes = this.data.routes.map(route => {
						  let newRoute = { ...route };
						  newRoute.id = index;
						  index++;
						  if (route.name === "历史寻根之旅") {
							newRoute.description = "从汉口路校门踏入南京大学鼓楼校区，便开启了一场穿越时空的历史寻根与建筑美学之旅。沿着校园的道路前行，首先映入眼帘的是充满古朴韵味的北大楼，其常春藤攀附的墙面仿佛诉说着百年的沧桑与辉煌，中西合璧的建筑风格在岁月中沉淀出庄重典雅的气质。不远处的小礼堂，精致的歇山顶、拱形门以及独特的砖石雕刻，尽显当年金陵大学建筑的精美绝伦，其东侧钟亭的钟声仿佛依旧回荡在校园的上空，承载着师生们的往昔回忆。继续漫步，大礼堂以其仿照中国古代庙宇的独特造型矗立眼前，明城墙砖砌筑的外墙厚重坚实，见证了学校的重要历史时刻。校史博物馆与图书馆相连，古色古香中陈列着南京大学珍贵的历史资料，展示着学校的发展脉络。二源壁则静静伫立，铭刻着 “两江师范学堂” 与 “金陵大学堂”，昭示着南京大学百廿校史的起源。赛珍珠故居的西洋风格别墅见证了这位文学巨匠的创作岁月，而拉贝故居在那段沉重的历史中为众多生命提供庇护，承载着人道主义的光辉。最后来到费彝民楼，其简洁大方的建筑外观下，蕴含着时代的印记和独特的校园文化底蕴，在这一方天地里，继续书写着南京大学鼓楼校区的历史新篇，让人在品味每一处建筑之美的同时，深深感受到历史的厚重与文化的传承。.";
						  } else if (route.name === "体验生活之旅") {
							newRoute.description = "晨光熹微，踏入南大南园，融入操场晨练人群，尽情感受青春活力。随后步入食堂，在丰富菜品与热闹氛围中开启活力满满的一天。走进教学楼，于知识海洋中尽情遨游，课间到图书馆沉浸书海，享受静谧。中午在食堂与同学畅谈，下午参观实验室与社团活动室，领略探索精神与青春热情。傍晚时分，北园草坪上歌声与欢笑声交织，躺在草坪上，回味这充实而精彩的一天，真切体验到南大生活的独特魅力，不舍离去，期待再来。";
							newRoute.showDetail = false;
						  } else if (route.name === "一路向南之旅") {
							newRoute.description = "从西北门出发，首先映入眼帘的是北大楼那爬满常春藤的庄重身影，在阳光下透着历史的厚重感。我沿着小道缓缓前行，来到了小礼堂，独特的建筑风格和静谧的氛围让人不禁驻足欣赏。不一会儿，大礼堂的宏伟身姿展现在眼前，其古朴的气质仿佛在诉说着过去的故事。随后，踱步至校史博物馆，在馆内快速领略了学校的百年发展脉络，那些珍贵的文物和资料让人对这所学校肃然起敬。接着，我来到了充满文化气息的赛珍珠故居和拉贝故居，感受着不同的历史人文底蕴。沿途的花园中，花草繁茂，绿树成荫，偶尔还能听到鸟儿的欢唱。当走到图书馆时，那简洁大气的建筑外观和浓厚的学习氛围让人心生向往。最后，在汉口路门前停下脚步，回首这一路的风景，仅仅 30 分钟，却仿佛穿越了时空，将北园的美景与历史文化尽收心底，每一处建筑、每一片花草都印刻在了记忆之中。";
						  }
						  return newRoute;
						});
			
						// 一次性更新整个数组
						this.setData({
						  routes: updatedRoutes
						});
					  });
					
					// // 请求成功，处理返回的数据
					// const routins = res.data.result;
					// console.log("ROUTING: ", routins);
					// // 假设你将这些照片显示在页面上
					// this.setData({
					// 	routes: routins
					// });


					// for (let index = 0; index < this.data.routes.length; index++) {
					// 	const element = this.data.routes[index];
					// 	console.log("ele: ", element.name);
					// 	if (element.name == "历史寻根之旅") {
					// 		this.setData({
					// 			'routes[index].description': "从汉口路校门踏入南京大学鼓楼校区，便开启了一场穿越时空的历史寻根与建筑美学之旅。沿着校园的道路前行，首先映入眼帘的是充满古朴韵味的北大楼，其常春藤攀附的墙面仿佛诉说着百年的沧桑与辉煌，中西合璧的建筑风格在岁月中沉淀出庄重典雅的气质。不远处的小礼堂，精致的歇山顶、拱形门以及独特的砖石雕刻，尽显当年金陵大学建筑的精美绝伦，其东侧钟亭的钟声仿佛依旧回荡在校园的上空，承载着师生们的往昔回忆。继续漫步，大礼堂以其仿照中国古代庙宇的独特造型矗立眼前，明城墙砖砌筑的外墙厚重坚实，见证了学校的重要历史时刻。校史博物馆与图书馆相连，古色古香中陈列着南京大学珍贵的历史资料，展示着学校的发展脉络。二源壁则静静伫立，铭刻着 “两江师范学堂” 与 “金陵大学堂”，昭示着南京大学百廿校史的起源。赛珍珠故居的西洋风格别墅见证了这位文学巨匠的创作岁月，而拉贝故居在那段沉重的历史中为众多生命提供庇护，承载着人道主义的光辉。最后来到费彝民楼，其简洁大方的建筑外观下，蕴含着时代的印记和独特的校园文化底蕴，在这一方天地里，继续书写着南京大学鼓楼校区的历史新篇，让人在品味每一处建筑之美的同时，深深感受到历史的厚重与文化的传承。"
					// 		})
					// 	}
					// 	else if (element.name == "体验生活之旅") {
					// 		this.setData({
					// 			'routes[index].description': "晨光熹微，踏入南大南园，融入操场晨练人群，尽情感受青春活力。随后步入食堂，在丰富菜品与热闹氛围中开启活力满满的一天。走进教学楼，于知识海洋中尽情遨游，课间到图书馆沉浸书海，享受静谧。中午在食堂与同学畅谈，下午参观实验室与社团活动室，领略探索精神与青春热情。傍晚时分，北园草坪上歌声与欢笑声交织，躺在草坪上，回味这充实而精彩的一天，真切体验到南大生活的独特魅力，不舍离去，期待再来。"
					// 		})
					// 	}
					// 	else if (element.name == "一路向南之旅") {
					// 		this.setData({
					// 			'routes[index].description': "从西北门出发，首先映入眼帘的是北大楼那爬满常春藤的庄重身影，在阳光下透着历史的厚重感。我沿着小道缓缓前行，来到了小礼堂，独特的建筑风格和静谧的氛围让人不禁驻足欣赏。不一会儿，大礼堂的宏伟身姿展现在眼前，其古朴的气质仿佛在诉说着过去的故事。随后，踱步至校史博物馆，在馆内快速领略了学校的百年发展脉络，那些珍贵的文物和资料让人对这所学校肃然起敬。接着，我来到了充满文化气息的赛珍珠故居和拉贝故居，感受着不同的历史人文底蕴。沿途的花园中，花草繁茂，绿树成荫，偶尔还能听到鸟儿的欢唱。当走到图书馆时，那简洁大气的建筑外观和浓厚的学习氛围让人心生向往。最后，在汉口路门前停下脚步，回首这一路的风景，仅仅 30 分钟，却仿佛穿越了时空，将北园的美景与历史文化尽收心底，每一处建筑、每一片花草都印刻在了记忆之中。"
					// 		})
					// 	}
					// }
					console.log("routes: ", this.data.routes);
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
				console.log("ID: ", id);
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