Page({
    data: {
        showWindow: false,
        showInfo: false,
        windowItems: [{
                image: '/images/city/shouer.png',
                text: '文物碎片'
            },
            {
                image: '/images/city/nanjin.png',
                text: '故事碎片'
            },
        ]
    },

    showWindow: function () {
        this.setData({
            showWindow: true
        });
    },

    closeWindow: function () {
        this.setData({
            showWindow: false
        });
    },
    showInfo: function () {
        this.setData({
            showInfo: true
        });
    },

    closeInfo: function () {
        this.setData({
            showInfo: false
        });
    }
})