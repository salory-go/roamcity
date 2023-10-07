// pages/detail/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        key: "3FDBZ-LLNCA-P5NKU-CEEHA-7YOO3-KOF3K",
        longitude: 118.8152527, // 默认经度
        latitude: 31.935977, // 默认纬度
        markers: [{
            id: 1,
            latitude: 31.935977,
            longitude: 118.8152527,
            iconPath: '/images/marker.jpg',
            width: 30,
            height: 30
          }],
        title: '',
        pois: null,
        info: null,
        description: '南京百家湖位于南京市江宁区，是一个风景秀丽的湖泊景区。湖泊面积宽阔，湖水清澈而宜人，周边山岳环抱，景色优美。百家湖景区拥有丰富的自然资源和人文景观，其中的白马石艺术广场展示了众多精美的石雕作品，艺术家们以石头雕刻出华丽的花鸟、虎豹等形象。乘船游览百家湖，可以欣赏湖光山色和湖区的水鸟、荷花等自然风光。在夜晚，湖岸的夜市繁华热闹，各种小吃、手工艺品等琳琅满目。百家湖是一个适合度假和休闲的旅游景点，你可以在这里享受美丽的自然风景，品味当地美食，体验浓厚的文化氛围。请根据实际情况和个人需求，调整旅游计划并提前了解景区开放时间和相关注意事项。'
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("this is detail",options)
        const type = options.type;
        const id = options.id;
        const name = options.name;
        // wx.showToast({
        //   title: '正在加载',
        //   icon: 'loading',
        //   duration: 10000,
        // });
        this.setData({
          title: name,
        });
        this.getPlaceInfo(type, id);
    },
    

    getPlaceInfo(type, id) {
        const name_zh = this.data.title
        this.setData({
            info: {
                name_zh: name_zh,
                visited_count: 100,
                wish_to_go_count: 50,
                hottest_places: [
                  {
                    photo: '/images/city/xiaoboshi.png',
                    place: '景点A'
                  },
                  {
                    photo: '/images/city/shouer.png',
                    place: '景点B'
                  }
                ]
              },
              windowWidth: 375 // 假设窗口宽度为375px
        })
    
    },

    addStar(e){
        // const e = e.currentTarget.dataset;
        // console.log(e)
        wx.navigateTo({
          url: '/pages/medal/medal',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})