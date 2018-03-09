/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'gcktpoxx.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        //五行服务
        fiveScore: `${host}/weapp/fiveScore`,
        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    }
};

module.exports = config;
