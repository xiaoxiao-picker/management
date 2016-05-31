define(function(require, exports, module) {
    var globalResponseHandler = require('ajaxhandler');

    exports.rank = {
        getList: function(skip, limit, options) {
            data = options || {};
            data.skip = skip;
            data.limit = limit;
            return globalResponseHandler({
                url: 'log/rank/list',
                data: data
            }, {
                description: "获取操作热度列表"
            });
        },
        get: function(orgId, options) {
            data = options || {};
            return globalResponseHandler({
                url: 'log/rank/' + orgId + '/detail',
                data: data
            }, {
                description: "获取操作热度详情"
            });
        }
    };

    exports.getList = function(skip, limit, options) {
        data = options || {};
        data.skip = skip;
        data.limit = limit;
        return globalResponseHandler({
            url: 'log/list',
            data: data
        }, {
            description: "获取操作日志列表"
        });
    };

});
