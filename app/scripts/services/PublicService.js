define(function(require, exports, module) {
    var globalResponseHandler = require('ajaxhandler');

    exports.createSession = function() {
        return globalResponseHandler({
            url: 'session/create'
        }, {
            description: '创建session'
        });
    };

    exports.logout = function() {
        return globalResponseHandler({
            url: 'session/logout',
            type: 'post'
        }, {
            description: '退出账号'
        });
    };

    exports.statistics = function() {
        return globalResponseHandler({
            url: 'statistics/get',
        }, {
            description: '获取统计信息'
        });
    };

    exports.imageUpload = function(key, x, y, w, h, scale) {
        return globalResponseHandler({
            url: 'attach/IMAGE/cut',
            type: 'post',
            data: {
                key: key,
                x: x,
                y: y,
                w: w,
                h: h,
                scale: scale
            }
        }, {
            description: '剪切图片'
        });
    };

    exports.imageUpload2 = function(image) {
        return globalResponseHandler({
            url: 'attach/IMAGE/cut',
            type: 'post',
            data: {
                key: image.key,
                x: image.x1,
                y: image.y1,
                w: image.w,
                h: image.h,
                scale: 1
            }
        }, {
            description: '剪切图片2'
        });
    };

    exports.config = {
        get: function() {
            return globalResponseHandler({
                url: 'config/get',
            }, {
                description: '获取配置信息'
            });
        },
        update: function(data) {
            return globalResponseHandler({
                url: 'config/update',
                type: 'post',
                data: data
            }, {
                description: '更新配置信息'
            });
        }
    };

});
