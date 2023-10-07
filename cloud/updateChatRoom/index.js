// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
        return db.collection('chatRoom').doc(event.chatRoomId).update({
            data: {
                status: true,
                updateTime: event.time,
                senderId: event.userId
            }
        })
}