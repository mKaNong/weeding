const DB = wx.cloud.database().collection('xl-location')

Component({

  data: {
    latitude: 32.52169385,
    longitude: 117.7184727,
    markers: [{
      id: 1,
      latitude: 32.52169385,
      longitude: 117.7184727,
      callout: {
        content: '定远县'
      }
    }],
  },

  methods:{
    go: function(e) {
      var lat, lon, name;
      let markerId = e.markerId;
      let markers = this.data.markers;
      wx.showModal({
        title: '导航',
        content: '立即导航前往吗？',
        confirmText: "立即前往",
        confirmColor: "#d4237a",
        success(res) {
          if (res.confirm) {
            for (let item of markers) {
              if(item.id == markerId) {
                lat = item.latitude;
                lon = item.longitude;
                name = item.callout.content;
                wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
                  latitude: lat,
                  longitude: lon,
                  name: name,
                  scale: 28
                })
                break;
              }
            }
          } else if (res.cancel) {
            wx.showToast({
              title: '下次点击图标即可开启导航',
              icon: "none"
            })
          }
        }
      })
    },
    markertap(e) {
      this.go()
    },
  },


  lifetimes: {
    attached: function() {
      DB.get({
        success: (res) => {
          if(res.errMsg == 'collection.get:ok' && res.data) {
            let data = res.data[0];
            var marks = this.data.markers
            marks[0].latitude = Number.parseFloat(data.latitude)
            marks[0].longitude = Number.parseFloat(data.longitude)
            marks[0].callout.name = data.name
            this.setData({
              latitude: data.latitude,
              longitude: data.longitude,
              markers: marks
            })
          } else {
            this.setData({
              latitude: 32.52169385,
              longitude: 117.7184727,
              markers: [{
                latitude: 32.52169385,
                longitude: 117.7184727,
                callout: {
                  content: '定远县'
                }
              }] 
            });
          }
        }
      })
    },
  }
  // onReady: function () {
  //   this.mapCtx = wx.createMapContext('myMap')
  // },

  


})