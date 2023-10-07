// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    return cloud.database().collection("comment").add({
        data: {
            areaId: event.areaId,
            commentDate: event.commentDate,
            content: event.content,
            parentId: event.parentId,
            upvotes: 0, 
            userId: event.userId
        }
    })
}