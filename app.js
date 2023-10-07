// app.js
App({
  onLaunch() {
      wx.cloud.init({
          env: "citywalk-5g9vd8810031b4ae"
      })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    medals:null
  }
})


