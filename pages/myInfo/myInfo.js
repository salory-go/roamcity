const app = getApp(); // 获取小程序实例

Page({
    data: {
        gender: null, // 性别
        userInfo: null, // 用户信息
        genderList: ['男', '女'], // 性别列表
        address: [] // 地址
    },

    // 表单提交事件
    formSubmit: function (e) {
        const formData = e.detail.value; // 获取表单数据
        // 进行表单验证
        if (!formData.name) {
            wx.showToast({
                title: '名称不能为空',
                icon: 'none'
            });
            return;
        }
        // 提交表单数据
        const user = this.data.userInfo;
        console.log(formData)
        wx.cloud.callFunction({
            name: "setUserInfo", // 调用云函数
            data: {
                name: formData.name || user.name,
                age: formData.age || user.age,
                gender: this.data.gender,
                address: formData.address || user.address,
                phone: formData.phone || user.phone,
                email: formData.email || user.email,
                id: user._id
            },
            success: (res) => {
                wx.showToast({
                    title: '更新成功',
                    icon: 'none'
                });
            }
        });
    },

    // 性别选择事件
    genderChange: function (e) {
        const index = e.detail.value; // 获取选择的索引
        const gender = this.data.genderList[index]; // 根据索引获取性别
        this.setData({
            gender: gender // 更新性别
        });
    },

    // 页面加载事件
    onLoad(options) {
        this.setData({
            userInfo: app.globalData.userInfo[0], // 从全局变量中获取用户信息
            gender: app.globalData.userInfo[0].gender // 设置界面性别变量的值
        });
    }
});