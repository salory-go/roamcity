// pages/annoucement/annoucement.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: null, //消息
        notification: null,//消息详细列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getMessageInfo(options.chatRoomId)
    },

    //根据Id获取Message信息
    getMessageInfo(chatRoomId) {
        wx.cloud.callFunction({
            name: "getMessageById",
            data: {
                id: chatRoomId
            }
        }).then(res => {
            this.setData({
                message: res.result.data[0]
            })
            this.getMessageDetail();
        })
    },

    //获取所有详细消息
    getMessageDetail() {
        wx.cloud.callFunction({
            name: "getMessageDetail",
            data: {
                ids: this.data.message.messageIds
            }
        }).then(res => {
            this.setData({
                notification: res.result
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})