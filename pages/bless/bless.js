var app = getApp()
const DB = wx.cloud.database().collection('xl-bless')
var util = require('../../utils/util.js')
var checkEmoji = []

Component({
  options:{
    addGlobalClass: true,
  },

  data: {
    message: '',
    userInfo: null,
    pageNo: 1,
    pageSize: 10,
    scrollHeight: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    messages: [],
    loadMore: false, //上拉加载的变量，默认false，隐藏  
    loadAll: false, //没有数据的变量，默认false，隐藏
  },

  lifetimes:{
    attached: function() {
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo
          })
        } else if (this.data.canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            if (res.userInfo) {
              this.setData({
                userInfo: res.userInfo
              })
            }
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              if (res.userInfo) {
                app.globalData.userInfo = res.userInfo
                this.setData({
                  userInfo: res.userInfo
                })
              }
            }
          })
        }
        wx.getSystemInfo({
          success: (res) => {
            this.setData({
              scrollHeight: res.windowHeight
            });
          }
        })
        this.getDbData()
    }
  },

  methods: {
    bindKeyInput: function(e) {
      this.setData({
        message: e.detail.value
      })
    },

    getUserInfo: function(e) {
      if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo
        })
        this.submitMsg()
      } else {
        wx.showToast({
          title: '请授权登录',
          icon: 'none'
        })
      }
    },

    submitMsg: function() {
      wx.showLoading({
        title: '祝福发送中...',
      })
      var msg = this.data.message;
      let bgColors = ['#55efc4', '#81ecec', '#74b9ff', '#a29bfe', '#00b894', '#00cec9', '#0984e3', '#fd79a8', '#ffeaa7', '#e17055', '#e84393', '#f5f6fa', '#7f8fa6', '#ffc048', '#ffdd59', '#00d8d6', '#34e7e4', '#82ccdd', '#60a3bc', '#f8c291', '#4a69bd', '#b8e994', '#78e08f', '#38ada9', '#079992'];
      let index = Math.floor((Math.random() * bgColors.length));
      console.log('[submitMsg][添加数据] 成功：' + bgColors[index]);
      
      var addData = {
          id: new Date().getTime(),
          url: this.data.userInfo.avatarUrl,
          userName: this.data.userInfo.nickName,
          message: msg,
          createTime: util.formatTime(new Date()),
          bgColor: bgColors[index],
          zan: 0
      }

      if(msg == '' || msg.length == 0) {
        wx.showToast({
          title: '发送失败！',
          icon: "success"
        })
        return;
      }
      DB.add({
        data: addData,
        success: (res) => {
          this.getUpdDbData()
        },
        fail: function(res) {
          this.getUpdDbData();
        } 
      });

      wx.showToast({
        title: '祝福已送达！',
        icon: "success"
      })
    },

    getUpdDbData: function() {
      this.setData({
        pageNo: 1
      });
      var ye = (this.data.pageNo - 1) * this.data.pageSize;
      var size = this.data.pageSize;
      DB.skip(ye).limit(size).orderBy('createTime', 'desc').get({
        success: (res) => {
          if(res.data && res.data.length > 0) {
            var list = res.data;
            this.setData({
              messages: list,
              pageNo: 2,
              message: ''
            })
          } 
        }
      })
    },

    // 获取数据库数据
    getDbData: function() {
      var ye = (this.data.pageNo - 1) * this.data.pageSize;
      var size = this.data.pageSize;
      if (this.data.pageNo == 1) {
        this.setData({
          loadMore: true, //把"上拉加载"的变量设为true，显示  
          loadAll: false //把“没有数据”设为false，隐藏  
        })
      }
      DB.skip(ye).limit(size).orderBy('createTime', 'desc').get({
        success: (res) => {
          if(res.data && res.data.length > 0) {
            var list = this.data.messages.concat(res.data);
            this.setData({
              messages: list,
              pageNo: this.data.pageNo + 1,
            })
          } else {
            this.setData({
              loadAll: true, //把“没有数据”设为true，显示  
              loadMore: false //把"上拉加载"的变量设为false，隐藏  
            });
          }
        },
        fail: function(res){
          console.log("请求失败", res)
          this.setData({
            loadAll: false,
            loadMore: false
          });
        }
      })
    },
    //  加载更多
    loadMore: function(){
      this.getDbData()
    },

    // 点赞
    zanClick: function(e) {
      let id = e.currentTarget.dataset.id;
      let list = this.data.messages;
      for(let i = 0; i < list.length; i++) {
        if(list[i].id == id) {
          let _id = list[i]._id;
          if(!_id) {
            continue;
          }
          let zan = list[i].zan;
          list[i].zan = zan + 1;
          DB.doc(_id).update({
            data: {
              zan:  zan + 1
            },
            success: res => {
              console.log('[zanClick][数据库] [更新记录] 成功：', res)
              this.setData({
                messages: list
              });
            },
            fail: err => {
              console.error('[zanClick][数据库] [更新记录] 失败：', err)
            }
          })
          break;
        }
      }
    },


  },

  
})