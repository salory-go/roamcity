const app = getApp();
Page({
    data: {
        userInfo: {},
        comments: [],
        dynamicList: [ // 动态列表
            {
                user: {
                    avatar: '/images/头像.png', // 发布动态的用户头像
                    nickname: '小红', // 发布动态的用户昵称
                },
                content: '今天去了故宫，真是太壮观了！', // 动态内容
                commentDate: null,
                childComments: [ // 动态的评论列表
                    {
                        userNickname: '小明', // 评论用户的昵称
                        avatar: '/images/头像.png', // 发布动态的用户头像
                        content: '是的，故宫真的很美！' // 评论内容
                    }
                ]
            }

        ],
        inputValue: null, //输入框里的内容
        areaId: "", //区域id
        parentId: "", //父评论id
        index: null, //父评论索引
    },
    // 从全局变量中获取用户信息
    onLoad: function (options) {
        this.setData({
            userInfo: app.globalData.userInfo[0], // 更新页面中的用户信息
        })
        this.getComments(options.areaId, options.type)
    },

    //获取父评论
    async getComments(areaId, type) {
        const res = await wx.cloud.callFunction({
            name: "getFirstCommentByAreaId",
            data: {
                areaId
            }
        });

        const arry = res.result.data;
        for (let item of arry) {
            const userRes = await wx.cloud.callFunction({
                name: "getUserName",
                data: {
                    id: item.userId
                }
            });
            item.user = {
                avatar: userRes.result.data.avatar,
                nickName: userRes.result.data.nickName,
            };
            await this.getCommentByParentId(item);
        }
        this.setData({
            comments: arry
        });
    },

    async getCommentByParentId(comment) {
        const res = await wx.cloud.callFunction({
            name: "getChildCommentById",
            data: {
                id: comment._id
            }
        });
        for (let item of res.result.data) {
            const userRes = await wx.cloud.callFunction({
                name: "getUserName",
                data: {
                    id: item.userId
                }
            });
            item.user = {
                avatar: userRes.result.data.avatar,
                nickName: userRes.result.data.nickName,
            };
        }
        comment.childComments = res.result.data;
        return comment;
    },

    //点赞评论等
    interact(event) {
        const action = event.currentTarget.dataset.action;
        const index = event.currentTarget.dataset.index;
        const areaId = event.currentTarget.dataset.areaid;
        //改变参数
        if (action == '0') {
            //点赞
        } else if (action == '1') {
            //点踩
        } else if (action == '2') {
            //评论,拉起输入框
            wx.pageScrollTo({
                scrollTop: 0,
            });
            this.setData({
                inputFocus: true
            })
            //设定需要回复的评论的id
            this.setData({
                areaId: areaId,
                index: index,
            })
        } else if (action == '3') {}
    },

    // 获取输入框中的动态内容
    inputChange: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

    publishDynamic(event) {
        const content = this.data.inputValue
        console.log(this.data.inputValue)
        const newDynamic = {
            user: {
                avatar: this.data.userInfo.avatar, // 使用当前用户的头像
                nickname: this.data.userInfo.nickName, // 使用当前用户的昵称
                travelHistory: this.data.userInfo.travelHistory // 使用当前用户的旅行经历
            },
            content: content, // 设置动态的内容为输入框中的内容
            comments: [] // 初始化动态的评论列表为空
        };

        const dynamicList = this.data.dynamicList.concat(newDynamic); // 将新动态添加到动态列表中
        this.setData({
            dynamicList: dynamicList, // 更新页面中的动态列表
            newComment: '' // 清空输入框内容
        });

    },

    commentDynamic: function (event) {
        const dynamicIndex = event.currentTarget.dataset.index; // 获取当前评论的动态在动态列表中的索引
        const newComment = event.detail.value; // 获取输入框中的评论内容

        const dynamicList = this.data.dynamicList;
        dynamicList[dynamicIndex].comments.push({
            userNickname: this.data.userInfo.nickName, // 使用当前用户的昵称
            content: newComment // 设置评论的内容为输入框中的内容
        });

        this.setData({
            dynamicList: dynamicList // 更新页面中的动态列表
        });
    },

    //回复评论
    async sendReply() {
        //获取时间
        const time = await wx.cloud.callFunction({
            name: "getCurrentFormattedDateTime",
        }).result
        //创建信息对象
        var newComment = {
            areaId: this.data.areaId,
            commentDate: time,
            content: this.data.inputValue,
            parentId: this.data.parentId,
            upvotes: 0, //记得-'0'
            userId: this.data.userInfo._id
        }
        //渲染
        const userRes = await wx.cloud.callFunction({
            name: "getUserName",
            data: {
                id:this.data.userInfo._id
            }
        });
        var user = {
            avatar: userRes.result.data.avatar,
            nickName: userRes.result.data.nickName,
        };
        newComment.user = user
        var comment = this.data.comments[this.data.index]
        comment.childComments.push(newComment)
        let index = this.data.index; // 按你的需求获取index的实际值。
        this.setData({
            ['comments[' + index + ']']: comment
        })
        //修改数据库
        console.log(newComment.commentDate)
        wx.cloud.callFunction({
            name: "addComment",
            data: {
                areaId: newComment.areaId,
                commentDate: newComment.commentDate,
                content: newComment.content,
                parentId: newComment.parentId,
                upvotes: 0, 
                userId: this.data.userInfo._id
            }
        }).then(res => {
            console.log(res)
        })
    },
});