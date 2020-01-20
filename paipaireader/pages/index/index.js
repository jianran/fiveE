Page({
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onPaiTap() {
    my.navigateTo({
      url: '../index/pai'
    });
  },
  onHisTap() {
    my.navigateTo({
      url: '../index/his'
    });
  },
  selectImage() {
    my.chooseImage({
      count: 1,
      success: (res) => {
        const path = res.apFilePaths[0];
        console.log(path);
        const ctx = my.createCanvasContext('imgCanvas');
        ctx.drawImage(path, 0, 0, 768, 1024);
        ctx.getImageData({
          x: 0,
          y: 0,
          width: 768,
          height: 1024,
          success(res) {
            console.log(res.data)
          }
})
        // my.uploadFile({
        //   url: 'http://123.56.189.222:3000/upload',
        //   fileType: 'image',
        //   fileName: 'file',
        //   filePath: path,
        //   success: res => {
        //    my.navigateTo({
        //       url: '../index/pai'
        //    });
        //   },
        //   fail: function(res) {
        //     my.alert({ title: '上传失败' });
        //   },
        // });
      }
    })
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '拍拍读汇本',
      desc: 'read baby book by photo',
      path: 'pages/index/index',
    };
  },
});
