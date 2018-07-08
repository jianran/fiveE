//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var drawPieChart = require('../../utils/drawPieChart.js')
var animation = require('../../utils/animation.js')

var date = new Date()
var dyear = date.getFullYear() ;
var dmonth = date.getMonth() + 1 > 9 ? "" + (date.getMonth() + 1): "0" + (date.getMonth() + 1);
var ddate = date.getDate() > 9 ? "" + date.getDate() : "0" + date.getDate();
var dhour = date.getHours() > 9 ? "" + date.getHours() : "0" + date.getHours();
var dminuter = date.getMinutes() > 9 ? "" + date.getMinutes() : "0" + date.getMinutes();

Page({
    data: {
      loginUrl: config.service.loginUrl,
      date: dyear + "-" + dmonth + "-" + ddate,
      time: dhour + ":" + dminuter,
      sex: ['公历','阴历'],
      index: 0,
      yuns: ['否','是'],
      yindex: 0,
      fiveTitle: '',
      fiveDesc: ''
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

    bindYunChange: function (e) {
      this.setData({
        yindex: e.detail.value
      })
    },

    formSubmit: function (e) {
      var that = this;
      var formData = this.data;
      wx.request({
        url: config.service.baziUrl,
        data: formData,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(formData)
          if (res.data.split === undefined) {
            console.log(res.data)
            that.setData({ fiveDesc: "" + res.data.error, fiveTitle: "error" });
          } else {
            const wcolors = ['#f7a35c', '#90ed7d', '#7cb5ec', '#ff0000', '#434348']
            var fa = res.data.split("@@@@@");
            that.setData({ fiveDesc: fa[1], fiveTitle: fa[0] });
            var f3 = fa[2].substring(0, fa[2].length - 1).split(";");
            var i = 0
            var series = f3.map((item) => {
              var v = item.split(":")
              console.log(parseFloat(v[1]))
              return { data: parseFloat(v[1]) * 100, color: wcolors[parseInt(v[0])]};
            });
            drawPieChart.drawPieAngle(series, 1);

                    
          }
        }
      })
    },
    formReset: function () {
      this.setData({ date: '2018-03-08', time: '12:00', index: 0, fiveDesc: '', fiveTitle: '' })
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
    },

    closeTunnel() {
      if (this.tunnel) {
        this.tunnel.close();
      }

      this.setData({ tunnelStatus: 'closed' });
    },

    openChat: function() {
      // 微信只允许一个信道再运行，聊天室使用信道前，我们先把当前的关闭
      this.closeTunnel();
      wx.navigateTo({ url: '../chat/chat' });
    }
})
