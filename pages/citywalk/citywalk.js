// pages/map/map.js
var QQMapWX = require('libs/qqmap-wx-jssdk.js');
const app = getApp();
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        key: "3FDBZ-LLNCA-P5NKU-CEEHA-7YOO3-KOF3K",
        longitude: '', // 默认经度
        latitude: '', // 默认纬度
        mapHeight: null,
        referer: 'CityWalk',
        markers: [],
        finished: 0,
        all: 0,
        markerWorkStatus: false,
        showWindow: false,
        showBag: false,
        otherButtonTap: 'view',
        title: '',
        background: '',
        target: '',
        rewards: [],
        progress: null,
        password: '',
        propBag: [],
        success: false,
        claim: true,
        markersShow: [],
        showTaskPotins: false,
        taskController: "showTask",
        polygon: [{
            points: [{
              latitude: 32.027889,
              longitude: 118.77961
            }, {
              latitude: 32.023384,
              longitude: 118.783377
            }, {
              latitude: 32.024928,
              longitude: 118.781619
            }],
            strokeWidth: 3,
            strokeColor: '#FF0000',
            fillColor: 'rgba(0,0,0,0)',
            dashArray:[10,10],
          }],
    },

    markerTap(e) {
        this.showWork(this.data.markers[e.markerId - 1])
    },

    closeTask() {
        this.setData({
            showTaskPoints: false,
            taskController: "showTask"
        })
        wx.pageScrollTo({
            scrollTop: 9999,
            duration: 300 // 可选，滚动动画的时长，默认300ms
        })
    },

    showTask() {
        this.setData({
            showTaskPoints: true,
            taskController: "closeTask"
        })
        wx.pageScrollTo({
            scrollTop: 9999,
            duration: 300 // 可选，滚动动画的时长，默认300ms
        })

    },

    updateData() {
        var markers = this.data.markers
        var success = this.data.success
        var markerStatus = []
        var propBag = this.data.propBag
        var taskStatus = []

        for (var i = 0; i < markers.length; i++) {
            var status = []
            status[0] = markers[i].status
            status[1] = markers[i].success
            markerStatus[i] = status

            taskStatus[i] = markers[i].tasks.status
        }

        var dataId = this.data.data._id
        var id = this.data.data.citywalk.id
        var citywalk = {
            id: id,
            markerStatus: markerStatus,
            propBag: propBag,
            taskStatus: taskStatus,
            success: success,
        }
        var success = this.data.success
        // wx.cloud.callFunction({
        //     name: "updateData",
        //     data: {
        //         citywalk: citywalk,
        //         _id: dataId,
        //     }
        // }).then( res => {
        //     console.log(res)
        // })
    },

    showBag() {
        this.setData({
            showBag: true,
        })
    },

    closeBag() {
        this.setData({
            showBag: false,
        })
    },

    //下一页
    turnRight() {
        var marker = this.data.marker
        var progress = this.data.progress
        if (marker.progress <= progress) {
            console.log("翻页失败")
            return 0
        }
        progress++;
        this.setData({
            title: marker.tasks[progress - 1].title,
            background: marker.tasks[progress - 1].background,
            target: marker.tasks[progress - 1].target,
            rewards: marker.tasks[progress - 1].rewards,
            progress: progress,
        })
    },

    //上一页
    turnLeft() {
        var marker = this.data.marker
        var progress = this.data.progress
        if (progress <= 1) {
            console.log("翻页失败")
            return 0
        }
        progress--;
        this.setData({
            title: marker.tasks[progress - 1].title,
            background: marker.tasks[progress - 1].background,
            target: marker.tasks[progress - 1].target,
            rewards: marker.tasks[progress - 1].rewards,
            progress: progress,
        })
    },

    //获取道具
    getProps() {
        var rewards = this.data.rewards
        var propBag = this.data.propBag
        rewards.forEach(reward => {
            if (reward.area == 0) {
                var flag = false
                propBag.forEach(prop => {
                    if (prop.id == reward.id) {
                        prop.number += reward.number;
                        flag = true;
                        return;
                    }
                })
                if (!flag) {
                    propBag.push(reward)
                }
            }
        })
        this.setData({
            propBag: propBag
        })
    },

    //领取奖励
    async getReward() {
        console.log(this.data.marker)
        //验证密码和清空密码
        if (this.data.password != '123') {
            console.log("领取失败")
            this.setData({
                password: '',
            })
            return
        }
        console.log("领取成功")
        //判断翻页
        var id = this.data.markers.length - this.data.marker.id
        var marker = this.data.marker
        marker.tasks.status[marker.progress - 1] = true
        if (marker.progress == marker.tasks.length) {
            this.closeWindow()
            marker.success = true;
            console.log("最后一页")
            let success = true
            this.data.markers.forEach(item => {
                if (!item.success)
                    success = false
            })
            if (success) {
                this.setData({
                    success: success
                })
                console.log("citywalk已完成")
            }
        } else {
            marker.progress++;
        }
        //渲染页面
        console.log("渲染成功")
        var markers = this.data.markers
        markers[id] = marker
        this.getProps()
        this.setData({
            progress: marker.progress,
            marker: marker,
            password: "",
            markers: markers,
        })
        var progress = marker.progress
        this.setData({
            title: marker.tasks[progress - 1].title,
            background: marker.tasks[progress - 1].background,
            target: marker.tasks[progress - 1].target,
            rewards: marker.tasks[progress - 1].rewards,
            progress: progress,
        })
    },

    passwordChange(e) {
        var claim = false
        if (this.data.marker.tasks.status[this.data.progress - 1] || e.detail.value == '') {
            claim = true;
        }
        this.setData({
            password: e.detail.value,
            claim: claim,
        });
    },

    //废弃函数
    async ConsolidateData() {
        var markerStatus = this.data.data.citywalk.markerStatus;
        var markers = this.data.markers
        for (let i = 0; i < markerStatus.length; i++) {
            // 先整合markerstatus
            markers[i].status = markerStatus[i][0]
            markers[i].success = false
            console.log(markers[i]);
        }

        this.setData({
            markers: markers
        })
        this.locationCheckIn();
    },

    async getTaskById() {
        var taskStatus = this.data.data.citywalk.taskStatus;
        var i = 0;
        var arry = this.data.markers
        for (let i = 0; i < arry.length; i++) {
            let item = arry[i];
            wx.cloud.callFunction({
                name: "getTaskByIds",
                data: {
                    ids: item.taskIds
                }
            }).then(res => {
                item.tasks = res.result
                item.tasks.status = taskStatus[i]
                var progress = 0
                for (var j = 0; j < item.tasks.status.length; j++) {
                    // 判断当前元素是否为true
                    if (item.tasks.status[j] === true) {
                        // 如果是true，则计数器加1
                        progress++;
                    }
                }
                if (progress < item.tasks.length) progress++;
                item.progress = progress
                i++;
                for (let j = 0; j < item.tasks.length; j++) {
                    let task = item.tasks[j];
                    wx.cloud.callFunction({
                        name: "getRewardByIds",
                        data: {
                            ids: task.rewardIds
                        }
                    }).then(res => {
                        task.rewards = res.result
                    })
                }
            })
        }
        this.setData({
            markers: arry,
        })
    },

    showWork(marker) {
        var progress = marker.progress
        this.setData({
            showWindow: true,
            otherButtonTap: 'disabble',
            title: marker.tasks[progress - 1].title,
            background: marker.tasks[progress - 1].background,
            target: marker.tasks[progress - 1].target,
            rewards: marker.tasks[progress - 1].rewards,
            progress: marker.progress,
            marker: marker,
        })
    },

    closeWindow() {
        this.setData({
            showWindow: false,
            otherButtonTap: 'view',
            password: '',
        })
    },

    disabble() {},

    view(event) {
        const id = event.currentTarget.dataset.id;
        const marker = this.data.markers[this.data.all - id];
        if (marker.status) {
            // 已经到达目的地
            this.showWork(marker)
        } else {
            //未到达目的地，导航
            this.navi(marker)
        }
    },

    navi(marker) {
        const lat = marker.latitude;
        const lon = marker.longitude;
        const name = marker.name;
        const mode = "driving";
        const key = this.data.key;
        const referer = this.data.referer
        // this.getUserLocattion();
        let endPoint = JSON.stringify({ //终点
            name: name,
            latitude: lat,
            longitude: lon
        })
        wx.navigateTo({
            url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&navigation=1' + '&mode=' + mode
        })
    },

    // 加载地图
    mapLoad() {
        // 获取地图上下文
        const mapContext = wx.createMapContext('myMap');
        // 获取屏幕高度
        wx.getSystemInfo({
            success: (res) => {
                const windowHeight = res.windowHeight;
                // 设置地图的高度
                this.setData({
                    mapHeight: windowHeight
                });
            }
        });
        // 获取当前位置经纬度
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                const latitude = res.latitude;
                const longitude = res.longitude;
                // 设置当前位置的标记
                this.setData({
                    latitude: latitude,
                    longitude: longitude
                });
                // 将地图视角移动到当前位置
                mapContext.moveToLocation();
            }
        });
    },
    //调用方法获取必要信息
    onLoad(options) {
        // let markersCheck = this.data.markers
        // markersCheck.push({
        //     _id:"111",
        //     height:"30rpx",
        //     id:6,
        //     latitude:31.915589,
        //     longitude:118.78705,
        //     name:"hehai",
        //     taskIds:null,
        //     width:"30rpx"
        // })
        // this.setData({
        //     markersCheck: markers,
        // })
        var data = wx.getStorageSync('data')
        this.setData({
            data: data
        })
        this.mapLoad();

        this.getCityWalk(data.citywalk.id)
        setInterval(() => {
            this.updateData();
            this.locationCheckIn()
        }, 5000); // 间隔时间为5秒
    },
    //获取服务对象
    getCityWalk(cityWalkId) {
        wx.cloud.callFunction({
            name: "getCityWalkById",
            data: {
                id: cityWalkId
            }
        }).then(res => {
            var cityWalk = res.result.data
            var polygons = []
            var polygon = {
                points: cityWalk.polygons[0].points,
                strokeWidth: 3,
                strokeColor: '#FF0000',
                fillColor: '#00000000',//这里只能用十六进制，不能用rgb
                dashArray:[10,10],
              }
            polygons.push(polygon)
            this.setData({
                all: cityWalk.markersIds.length,
                markersIds: cityWalk.markersIds,
                polygons: polygons
            })
            this.getMarkersByIds()
        })

    },
    //获取地标
    async getMarkersByIds() {

        var markerStatus = this.data.data.citywalk.markerStatus;
        var i = 0
        let markers = [];
        let arry = this.data.markersIds;
        for (let item of arry) {
            try {
                let res = await wx.cloud.callFunction({
                    name: "getMarkerById",
                    data: {
                        id: item
                    }
                });
                let data = res.result.data;
                data.width = "15rpx";
                data.height = "30rpx";
                data.id = arry.length - data.id + 1;
                //整合进入status
                data.status = markerStatus[i][0]
                data.success = markerStatus[i][1]
                markers.push(data);
                markers.sort((a, b) => {
                    return b.id - a.id;
                });
                this.setData({
                    markers: markers,
                    markersCheck: markers,
                });
                i++;
            } catch (err) {
                console.log(err);
            }
        }
        //计算抵达的目标点的数量
        var finished = 0;
        markers.forEach(item => {
            if (item.status) {
                finished++;
            }
        })
        this.setData({
            finished: finished
        })
        await this.getTaskById();
        this.markersCheck()
        this.locationCheckIn()
    },

    //添加已到达地标
    markersCheck() {
        var markersShow = []
        var markers = this.data.markers
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].status) {
                markersShow.push(markers[i])
            }
        };
        this.setData({
            markersShow: markersShow
        })
    },

    //定位打卡功能
    locationCheckIn() {
        // 在合适的位置获取当前位置的经纬度
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                const currentLatitude = res.latitude;
                const currentLongitude = res.longitude;
                // 遍历markers数组，与当前位置进行距离计算
                var markersShow = this.data.markersShow
                var markers = this.data.markers

                for (var i = 0; i < markers.length; i++) {
                    if (markers[i].status) continue
                    var distance = this.getDistance(currentLatitude, currentLongitude, markers[i].latitude, markers[i].longitude)
                    if (distance <= 20) {
                        markers[i].status = true
                        markersShow.push(markers[i])
                        this.showWork(markers[i])
                    }
                };


                // 更新markers数据，触发页面重新渲染
                this.setData({
                    markers: markers,
                    markersShow: markersShow,
                });
            },
            fail: (res => {
                console.log(res)
            })
        });
    },
    // 计算两个经纬度之间的距离（单位为米）
    getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // 地球平均半径，单位为千米
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000; // 转换为米
        return distance;
    },
    //位置更新
    onShow() {
        this.locationCheckIn()
    }
})