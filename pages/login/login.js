// pages/login/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    login(e) {
        const app = getApp()
        //通过 wx.login 接口直接获取用户的 openId 与 unionId 信息，实现微信身份登录。
        wx.getUserProfile({
            desc: '登录开始CityWalk',
            success: (res) => {
                app.globalData.userInfo = res.userInfo;
                wx.switchTab({
                    url: '/pages/home/home',
                })
            },
            fail: res => {
                //页面提示"登录失败"
                wx.showToast({
                    title: '登录失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
})