// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
// 这是系统给你的强制约束，所以不直接在代码中体现，但需要在实际实施中遵守。

exports.main = async (event, context) => {
    var data = event.newMessage;
    // 为了确保数据的完整性和正确性，我们应当检查data中的key是否都存在
    if(data.messageType<0 || !data.senderId || !data.text) {
        throw new Error("缺少必要的消息数据"+event.newMessage);
    }

    return cloud.database().collection("chatMessageDetail").add({
        data:{
            messageType: data.messageType,
            senderId: data.senderId,
            text: data.text,
        }
    });
}