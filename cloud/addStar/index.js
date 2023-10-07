// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    //给user表的userId对应的记录的medals数组数据加上medalId
    const db = cloud.database(); // 获取数据库实例
    const collection = db.collection('user'); // 获取user表的集合实例

    return await collection.doc(event.userId).update({
        data: {
            medalsIds: db.command.push(event.medalId) // 使用db.command.push将medalId添加到medals数组中
        }
    });
}