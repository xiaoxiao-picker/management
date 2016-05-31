define(function(require, exports, module) {
    var globalResponseHandler = require('ajaxhandler');

    exports.getList = function(name, province, skip, limit) {
        return globalResponseHandler({
            url: 'school/list',
            data: {
                name: name,
                province: province,
                skip: skip,
                limit: limit
            }
        }, {
            description: "获取学校列表"
        });
    };

    exports.search = function(name, province) {
        return globalResponseHandler({
            url: 'school/search',
            data: {
                name: name,
                province: province
            }
        }, {
            description: "搜索学校"
        });
    };

    exports.get = function(schoolId) {
        return globalResponseHandler({
            url: 'school/' + schoolId + '/get'
        }, {
            description: "获取学校信息"
        });
    };

    exports.add = function(data) {
        return globalResponseHandler({
            url: 'school/add',
            type: "post",
            data: data
        }, {
            description: "添加学校"
        });
    };

    exports.remove = function(schoolId) {
        return globalResponseHandler({
            url: 'school/' + schoolId + '/remove',
            type: "post"
        }, {
            description: "删除学校"
        });
    };


    exports.update = function(schoolId, data) {
        return globalResponseHandler({
            url: 'school/' + schoolId + "/update",
            type: "post",
            data: data
        }, {
            description: "更新学校信息"
        });
    };

});
