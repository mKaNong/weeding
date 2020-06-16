Page({
  data: {
    PageCur: 'index'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: 'welcome',
      imageUrl: '/images/8.jpg',
      path: '/pages/index/index'
    }
  },
})