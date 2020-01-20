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
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '拍拍读汇本',
      desc: 'read baby book by photo',
      path: 'pages/index/pai',
    };
  },
});