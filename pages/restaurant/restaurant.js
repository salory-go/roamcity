// 获取小程序实例
const app = getApp();

Page({
    data: {
        userInfo: null,
        bookingList: [{
                name: '辣五味麻辣香锅',
                price: '100元/人',
                time: '18:00-21:00',
                description: '豪华自助晚餐'
            },
            {
                name: '传奇炒饭炒面',
                price: '30元/人',
                time: '全天',
                description: '著名爆火炒饭'
            },
            {
                name: '优鲜三文鱼',
                price: '200元/人',
                time: '09:00-17:00',
                description: '精致食材选购'
            },
            {
                name: '焖百味黄焖鸡',
                price: '30元/人',
                time: '15:00-18:00',
                description: '经典平价美食'
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 从全局变量中获取用户信息
        this.setData({
            userInfo: app.globalData.userInfo[0],
        })
    },

    // 跳转到预订和购买详情页面
    goToBookingDetail(event) {
        const bookingIndex = event.currentTarget.dataset.index;
        const booking = this.data.bookingList[bookingIndex];
        console.log('跳转到预订和购买详情页面', booking.name);
        wx.showModal({
            title: '确认支付',
            content: '是否确认支付？',
            cancelText: '取消',
            confirmText: '确定',
            success: (res) => {
                if (res.confirm) {
                    // 用户点击了确定按钮
                    console.log('用户点击了确定支付');
                    this.addOrder(booking.index)
                } else if (res.cancel) {
                    // 用户点击了取消按钮
                    console.log('用户取消了支付');
                }
            }
        });
    },

    // 调用云函数添加订单
    addOrder(index) {
        wx.cloud.callFunction({
            name: "addOrderById",
            data: {
                userId: userInfo._id,
                index: index
            },
            success: (res) => {
                console.log("addorderById调用成功")
            },
        });
    },
});