// pages/destination/destination.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        schemes: null,
        city: null,
    },
    //按钮方法，浏览活动
    viewActivity() {
        wx.navigateTo({
            url: '/pages/activity/activity',
        })
    },
    //按钮方法，浏览城市的评论
    viewComment() {
        wx.navigateTo({
            url: "/pages/comment/comment?type=0&areaId="+this.data.city.id,
        })
    },
    //按钮方法，浏览门票
    viewTicket() {
        wx.navigateTo({
            url: '/pages/ticket/ticket',
        })
    },
    //按钮方法，浏览饭店
    viewRestaurant() {
        wx.navigateTo({
            url: '/pages/restaurant/restaurant',
        })
    },
    //调用方法获取信息
    onLoad(options) {
        const cityId = options.cityId;
        wx.showToast({
            title: '正在加载',
            icon: 'loading',
            duration: 400,
        });
        this.getCityInfo(cityId);
    },
    //获取城市信息
    getCityInfo(cityId) {
        wx.cloud.callFunction({
            name: "getCityById",
            data: {
                id: cityId
            },
            success: (res) => {
                console.log("getCityById调用成功")
                let data = res.result.data
                this.setData({
                    city: {
                        id: data._id,
                        name: data.name,
                        visited_count: 100,
                        wish_to_go_count: 50,
                        cover: data.cover,
                        schemesIds: data.schemesIds
                    },
                })
                this.getSchemeInfo(data.schemesIds);
            },
            fail: (res) => {
                console.log("getCityById调用失败")
            }
        })
    },
    //浏览方案
    viewScheme(e) {
        const id = e.currentTarget.dataset.id;
        const data = this.data.schemes[id]
        console.log("this is destination", data)
        wx.navigateTo({
            url: `../detail/detail?id=${data.medalId}`,
        });
    },
    //获取方案信息
    getSchemeInfo(arry) {
        let schemes = [];
        arry.forEach(item => {
            wx.cloud.callFunction({
                name: "getSchemeById",
                data: {
                    id: item
                },
                success: (res) => {
                    let data = res.result.data
                    schemes.push({
                        id: data._id,
                        name: data.name,
                        rating: data.rating,
                        rating_users: data.rating_users,
                        cover: data.cover,
                        contentId: data.contentId,
                        medalId: data.medalId,
                    })
                    this.setData({
                        schemes: schemes
                    })
                },
                fail: (res) => {
                    console.log("getSchemeById调用失败")
                }
            })
        });
    },
})