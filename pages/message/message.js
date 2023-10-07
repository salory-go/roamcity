// 获取小程序实例
const app = getApp();

Page({
    data: {
        userInfo: null, // 用户信息
        chatRooms: []
    },

    //页面显示
    onShow(){
        var Rooms = this.data.chatRooms
        Rooms.map(item => {
            if (item.id == this.data.selectChatRoom.id) {
              item.status = false;
            }
          })
          console.log(this.data.chatRooms)
        this.setData({
            chatRooms: Rooms
          });
    },

    // 页面加载时触发，从全局变量中获取用户信息
    onLoad: function (options) {
        var userInfo = wx.getStorageSync('userInfo')
        this.setData({
            userInfo: userInfo,
            chatRoomIds: options.chatRoomIds
        })
        this.getChatRoomsInfo(options.chatRoomIds)
    },

    //获取聊天室
    async getChatRoomsInfo(str) {
        let arry = str.split(",");
        let chatRooms = [];

        for (let item of arry) {
            try {
                const res = await wx.cloud.callFunction({
                    name: "getChatRoomById",
                    data: {
                        id: item
                    }
                });

                let data = res.result.data;
                // 获取对方id
                const id =
                    data.userIds[0] == this.data.userInfo._id ? data.userIds[1] : data.userIds[0];

                // 获取对方的name和avatar
                const res2 = await wx.cloud.callFunction({
                    name: "getUserName",
                    data: {
                        id: id
                    }
                });
                
                const avatar = res2.result.data.avatar
                const name = res2.result.data.nickName;
                console.log(name)
                chatRooms.push({
                    id: data._id,
                    avatar: avatar,
                    creatTime: data.creatTime,
                    senderId: data.senderId,
                    status: data.status,
                    type: data.type,
                    updateTime: data.updateTime,
                    userIds: data.userIds,
                    name: name
                });

            } catch (error) {
                console.error(error);
            }
        }

        this.setData({
            chatRooms: chatRooms
        });
    },

    // 点击消息列表项时触发
    viewMessage: function (event) {
        const chatRoomIndex = event.currentTarget.dataset.index;
        const chatRoom = this.data.chatRooms[chatRoomIndex];
        const chatRoomId = chatRoom.id
        const id = chatRoom.userIds[0]==this.data.userInfo._id?chatRoom.userIds[1]:chatRoom.userIds[0]
        this.setData({
            selectChatRoom: chatRoom
        })
        //取消status
        console.log(chatRoom.status)
        if(chatRoom.status){
            wx.cloud.database().collection("chatRoom").doc(chatRoomId).update({
                data:{
                    status:false
                }
            }).then(res => {
                console.log(res)
            })
        }
        //跳转到公告页面
        if(chatRoom.type==0){
            wx.navigateTo({
                url: '/pages/annoucement/annoucement?chatRoomId='+chatRoomId,
            })
        }
        // 跳转到聊天页面
        wx.navigateTo({
            url: '/pages/chat/chat?chatRoomId='+chatRoomId+"&name="+chatRoom.name+"&avatar="+chatRoom.avatar+"&id="+id,
        })
    }
});