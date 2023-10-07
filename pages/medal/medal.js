// pages/medal/medal.js

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        medals: [] // 存储勋章信息的数组
    },

    // 点击勋章跳转到对应的城市漫步页面
    navi(event) {
        // const c = event.currentTarget.dataset.medal.cityWalkId
        // wx.navigateTo({
        //     url: `/pages/citywalk/citywalk?cityWalkId=${c}`,
        // })
    },

    /**
     * 生命周期函数--监听页面加载
     */

     // 获取勋章信息
    getMedalInfo() {
        var arry = this.data.medals
        arry.forEach(item => {
            wx.cloud.callFunction({
                name: "getMedalById",
                data: {
                    id: item.medalId
                }
            }).then(res => {
                item.medal = res.result.data
            })
        })
    },

    onLoad(options) {
        // 从全局变量中获取勋章信息
        let medals = app.globalData.medals
        // 显示加载中的提示框
        wx.showToast({
            title: '正在加载',
            icon: 'loading',
            duration: 400,
        });
        this.setData({
            medals: medals
        })
        this.getMedalInfo()
    }
})