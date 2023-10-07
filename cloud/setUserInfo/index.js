// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    return cloud.database().collection("user").doc(event.id).update({
        data: {
            nickName:event.name,
            gender:event.gender,
            age:event.age,
            address:event.address,
            phone:event.phone,
            email:event.email
        }
    })
}