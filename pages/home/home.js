// 引入小程序的App实例
const App = getApp();

// 定义页面对象
Page({
    // 页面的初始数据
    data: {
        elements: [{
            title: '推荐旅游地',
            data: []
        }, ],
    },

    // 页面加载完成时触发的函数
    onReady() {},

    // 调用云函数获取城市信息
    getCitiesInfo() {
        wx.cloud.callFunction({
            name: "getCity",
            success: (res) => {
                console.log("getCity调用成功")
                let datas = res.result.data
                datas.forEach(item => {
                    this.data.elements[0].data.push({
                        id: item._id,
                        name: item.name,
                        cover: item.cover,
                        schemes: item.schemes
                    });
                });
                this.setData({
                    elements: this.data.elements
                });
            },
            fail: (res) => {
                console.log("云函数调用失败")
            }
        })
    },

    // 页面加载时触发的函数
    onLoad() {
        // 显示加载提示
        wx.showToast({
            title: '正在加载',
            icon: 'loading',
            duration: 400,
        });
        // 调用获取城市信息的函数
        this.getCitiesInfo();
    },

    // 选择图片的函数
    choose() {
        wx.chooseMedia({
            count: 1,
            sizeType: ["orginal", "compressed"],
            sourceType: ["album", "camera"],
            success: (res) => {
                this.upLoad(res.tempFiles[0].tempFilePath)
            }
        })
    },

    // 上传图片的函数
    upLoad(temFile) {
        wx.cloud.uploadFile({
            cloudPath: "cityCover/" + "nanjing.png",
            filePath: temFile,
            success: (res) => {
                console.log("上传成功", res.fileID)
            },
            fail: (res) => {
                console.log(temFile)
            }
        })
    },

    // 查看城市详情的函数
    viewCity(e) {
        const data = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../destination/destination?cityId=${data.id}`,
        });
    },
});