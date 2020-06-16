Component({
  options:{
    addGlobalClass: true,
  },

  lifetimes:{
    // 生命周期函数
    onLoad() {
      this.towerSwiper('swiperList');
      // 初始化towerSwiper 传已有的数组名即可
    },
  },

  data: {
    cardCur: 0,
    swiperList: [{
      id: 1,
      name: "背景图片",
      swipers: [{
          id: 11,
          url: "/images/photos/p1.png",
          type: "image"
        }, {
          id: 12,
          url: "/images/photos/p2.png",
          type: "image"
        },{
          id: 13,
          url: "/images/photos/p3.png",
          type: "image"
        },{
          id: 14,
          url: "/images/photos/p4.png",
          type: "image"
        },
      ]
    }, {
      id: 2,
      name: "英雄联盟",
      swipers: [{
          id: 21,
          url: "/images/photos/g1.png",
          type: "image"
        },{
          id: 22,
          url: "/images/photos/g2.png",
          type: "image"
        }, {
          id: 23,
          url: "/images/photos/g3.png",
          type: "image"
        }, {
          id: 24,
          url: "/images/photos/g4.png",
          type: "image"
        }, 
      ]
    }, 
  ],
  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }

})