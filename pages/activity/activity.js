const app = getApp();
Page({
    data: {
        activityList: [{
                name: '活动1',
                time: '2022-01-01',
                place: '地点1',
                intro: '活动1的简介'
            },
            {
                name: '活动2',
                time: '2022-02-02',
                place: '地点2',
                intro: '活动2的简介'
            },
            {
                name: '活动3',
                time: '2022-03-03',
                place: '地点3',
                intro: '活动3的简介'
            }
        ],
        userInfo: null,
    },
    //从全局变量中获取用户信息
    onLoad() {
        this.getActivitiesInfo()
        this.setData({
            userInfo: app.globalData.userInfo[0],
        })
    },
    //获取活动信息
    getActivitiesInfo() {
        wx.cloud.callFunction({
            name: "getActivity",
            success: (res) => {
                console.log("getActivity调用成功")
                let datas = res.result.data
                datas.forEach(item => {
                    this.data.elements[0].data.push({
                        id: item._id,
                        name: item.name,
                        cover: item.cover,
                        intro: item.intro,
                        place: item.place,
                        time: item.time
                    });
                });
                this.setData({
                    activity: this.data.activity
                });
            },
            fail: (res) => {
                console.log("云函数调用失败")
            }
        })
    },
    //按钮函数，加入活动
    joinActivity(event) {
        console.log(event.currentTarget.dataset)
        const activityIndex = event.currentTarget.dataset.index;
        const activity = this.data.activityList[activityIndex];
        console.log('参与活动', activity.name);
        this.joinByName(activity.name)
        wx.showToast({
            title: '参与成功',
            icon: 'loading',
            duration: 400,
        });
        wx.switchTab({
            url: '/pages/home/home',
        })
    },
    //调用云函数，加入活动
    joinByName(name) {
        wx.cloud.callFunction({
            name: "joinActivity",
            data: {
                name: name,
                userId: userInfo._id,
            },
            success: (res) => {
                console.log("joinActivity调用成功")
            },
            fail: (res) => {
                console.log("云函数调用失败")
            }
        })
    }
});