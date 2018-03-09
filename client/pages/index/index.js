//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
      date: '2018-03-08',
      time: '12:00',
      sex: ['男','女'],
      index: 0
    },

    bindTimeChange: function (e) {
      this.setData({
        time: e.detail.value
      })
    },

    bindDateChange: function (e) {
      this.setData({
        date: e.detail.value
      })
    },

    bindSexChange: function (e) {
      this.setData({
        index: e.detail.value
      })
    },

    formSubmit: function (e) {
      var that = this;
      var formData = e.detail.value;
      wx.request({
        url: 'http://test.com:8080/test/socket.php?msg=2',
        data: formData,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          that.modalTap();
        }
      })
    },
    formReset: function () {
      this.setData({ date: '2018-03-08', time: '12:00', index: 0 })
    },


    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    }
})
