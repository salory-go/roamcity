// 获取小程序实例
const app = getApp();

Page({
    data: {
        userInfo: null,
        bookingList: [{
                name: '长城门票',
                price: '80元/人',
                time: '全天',
                description: '参观世界文化遗产长城'
            },
            {
                name: '故宫门票',
                price: '60元/人',
                time: '09:00-17:00',
                description: '探索中国皇家宫殿'
            },
            {
                name: '千岛湖游船',
                price: '150元/人',
                time: '10:00-16:00',
                description: '欣赏美丽的自然风光'
            },
            {
                name: '迪士尼乐园门票',
                price: '399元/人',
                time: '全天',
                description: '与迪士尼角色一起玩乐'
            }
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
                    this.addOrder(bookingIndex);
                    // TODO: 编写支付的逻辑
                } else if (res.cancel) {
                    // 用户点击了取消按钮
                    console.log('用户取消了支付');
                }
            }
        });
    },

    // 添加订单
    addOrder(index) {
        const userInfo = this.data.userInfo;
        wx.cloud.callFunction({
            name: "addOrderById",
            data: {
                userId: userInfo._id,
                index: index
            },
            success: (res) => {
                console.log("addOrderById调用成功")
            },
            // 添加失败的处理逻辑
            fail: (error) => {
                console.log("addOrderById调用失败", error)
            }
        });
    }
})