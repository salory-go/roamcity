// pages/my/my.js
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null, // 用户信息
        chatRoomIds: [],
        messageStatus: false,
    },

    // 点击导航到勋章页面
    naviMedal() {
        wx.navigateTo({
            url: `/pages/medal/medal`,
        })
    },

    // 退出登录
    logout: function () {
        // 清除用户登录状态的逻辑
        wx.clearStorageSync();

        // 跳转到登录页面的逻辑
        wx.redirectTo({
            url: '/pages/login/login' // 这里的路径应该是你的登录页面的路径
        });
    },

    onShow(){
        this.getMessageInfo()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 从全局变量中获取用户信息
        let userInfo = wx.getStorageSync('userInfo')
        let data = wx.getStorageSync('data')
        app.globalData.medals = data.medals
        this.setData({
            userInfo: userInfo,
            data: data,
        })
        this.getMessageInfo()
    },
    
    //获取消息
    getMessageInfo(){
        wx.cloud.callFunction({
            name:"getUserRoom",
            data:{
                userId: this.data.userInfo._id
            }
        }).then( res =>{
            var data = res.result.data[0]
            this.setData({
                chatRoomIds: data.chatRoomIds,
                messageStatus: data.status,
                userRoom: data
            })
        }).catch( err=>{
            this.creatSystemMessage()
        })
    },

    // 选择头像
    chooseAvatar(e) {
        const tempFilePath = e.detail.avatarUrl
        wx.cloud.uploadFile({
            cloudPath: 'userAvatar/' + this.data.userInfo._id,
            filePath: tempFilePath,
        }).then(res => {
            this.setData({
                "userInfo.avatar": res.fileID,
            })
            wx.cloud.callFunction({
                name:'changeAvatar',
                data:{
                    id: this.data.userInfo._id,
                    avatar: this.data.userInfo.avatar
                }
            }).then(res => {
                console.log(res)
            })
        })
        
    },

    //创建聊天室
    async creatSystemMessage(){
        const sysytemId = "f03f49e864d71d790000086d41380cf1"
        var userIds=[]
        userIds.push(sysytemId)
        userIds.push(this.data.userInfo._id)
        var time = ""
        await wx.cloud.callFunction({name:"getCurrentFormattedDateTime"}).then(res => {
            time = res.result
        })
        console.log(time)
        wx.cloud.callFunction({
            name:"addChatRoom",
            data:{
                type:0,
                avatar:"cloud://citywalk-5g9vd8810031b4ae.6369-citywalk-5g9vd8810031b4ae-1319376518/icons/systemMessageIcon.png",
                creatTime:time,
                senderId:"f03f49e864d71d790000086d41380cf1",
                status:true,
                updateTime:time,
                userIds:userIds,
            }
        }).then(res => {
            wx.cloud.callFunction({
                name:"addUserRoom",
                data:{
                    chatRoomIds:[res.result._id],
                    userId:this.data.userInfo._id
                }
            }).then(res => {
                console.log(res)
            })
        })
    },

    //查看消息
    viewMessage(){
        this.setData({
            messageStatus:false
        })
        wx.cloud.database().collection("userRoom").doc(this.data.userRoom._id).update({
            data:{
                status:false,
            }
        }).then(res => {
            console.log(res)
        })
        wx.navigateTo({
          url: "/pages/message/message?chatRoomIds="+this.data.chatRoomIds,
        })
    }
})