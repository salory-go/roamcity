// 引入小程序实例
const app = getApp();
Page({
    data: {
        userInfo: null, // 用户信息
        message: null, //消息
        messageDetails: null, //消息详细列表
        partner: null, //对方信息
        inputValue: '', // 输入框的值
        toView: "", //底部信息
    },
    // 页面加载时获取全局变量中的用户信息
    onLoad: function (options) {
        var userInfo = wx.getStorageSync('userInfo')
        this.setRoom();
        this.setData({
            userInfo: userInfo,
            chatRoomId: options.chatRoomId,
            partner: {
                name: options.name,
                avatar: options.avatar,
                id: options.id
            }
        })
        this.getMessageInfo()
    },

    //获取界面信息
    setRoom(){
        // 获取屏幕高度
        wx.getSystemInfo({
            success: (res) => {
                const windowHeight = res.windowHeight;
                // 设置地图的高度
                this.setData({
                    chatHeight: windowHeight
                });
            }
        });
    },

    //根据Id获取Message信息
    getMessageInfo() {
        wx.cloud.callFunction({
            name: "getMessageById",
            data: {
                id: this.data.chatRoomId
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
                messageDetails: res.result,
                toView: 'message' + (res.result.length - 1)
            })
        })
    },

    // 输入框内容改变时触发的事件
    inputChange: function (event) {
        this.setData({
            inputValue: event.detail.value
        });
    },
    // 发送消息
    sendMessage: function () {
        const inputValue = this.data.inputValue;
        this.setData({
            inputValue: ""
        })
        this.creatMessage(inputValue, 0)
    },

    //创建消息
    creatMessage(message, type) {
        var time = ""
        wx.cloud.callFunction({
            name: "getCurrentFormattedDateTime"
        }).then(res => {
            time = res.result
        })
        const newMessage = {
            messageType: type,
            senderId: this.data.userInfo._id,
            text: message
        };
        // 动态push数据
        let length = this.data.messageDetails.length;
        this.setData({
                [`messageDetails[${length}]`]: newMessage,
            },
            () => {
                // 在这个回调函数中进行定位
                this.setData({
                    toView: 'message' + (length - 1)
                });
            }
        );
        wx.cloud.callFunction({
            name: "addMessageDetail",
            data: {
                newMessage: newMessage
            }
        }).then(res => {
            wx.cloud.callFunction({
                name: "updateChatMessage",
                data: {
                    chatRoomId: this.data.chatRoomId,
                    messageId: res.result._id
                }
            }).then(re => {
                wx.cloud.callFunction({
                    name: "getCurrentFormattedDateTime",
                }).then(res => {
                    wx.cloud.callFunction({
                        name: "updateChatRoom",
                        data: {
                            chatRoomId: this.data.chatRoomId,
                            time: res.result,
                            userId: this.data.userInfo._id
                        }
                    })
                })
            })

        })
        wx.cloud.database().collection("userRoom").where({
            userId: this.data.partner.id
        }).update({
            data: {
                status: true
            }
        })
    },
});