// pages/index/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    // 获取用户信息并存储到全局变量
    async onLoad(options) {
        wx.cloud.callFunction({
            name: "getUserInfo", // 调用云函数getUserInfo
            success: (res) => {
                wx.setStorageSync('userInfo', res.result.data[0])
                wx.cloud.callFunction({
                    name: "getData",
                    data:{
                        userId: res.result.data[0]._id
                    }
                }).then( res => {
                    wx.setStorageSync('data', res.result.data[0])
                })
                wx.switchTab({
                    url: '/pages/home/home', // 跳转到home页面
                })
            },
            fail: (res) => {
                wx.navigateTo({
                    url: '/pages', // 跳转到pages页面
                })
            }
        })
    },
})