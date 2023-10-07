// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    return cloud.database().collection('chatMessage').where({
        chatRoomId: event.chatRoomId
    }).update({
        data: {
            messageIds: cloud.database().command.push(event.messageId) // 使用db.command.push
        }
    }).catch(err => {
        throw(err)
    })
}