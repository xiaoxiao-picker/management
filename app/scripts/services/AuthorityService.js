define(function(require, exports, module) {
    var globalResponseHandler = require('ajaxhandler');

    // 用户角色
    exports.user = {
    	role: {
    		getList: function(userId) {
	            return globalResponseHandler({
	                url: 'authority/user/' + userId + '/role/list'
	            }, {
					description: "获取用户角色列表"
				});
	        },
	        add: function(userId, roleId) {
	            return globalResponseHandler({
	                url: 'authority/user/' + userId + '/role/add',
	                type: 'post',
	                data: {
	                	roleId: roleId
	                }
	            }, {
					description: "添加用户角色"
				});
	        },
	        remove: function(userId, roleId) {
	            return globalResponseHandler({
	                url: 'authority/user/' + userId + '/role/remove',
	                type: 'post',
	                data: {
	                	roleId: roleId
	                }
	            }, {
					description: "删除用户角色"
				});
	        },
    	}
    };

    // 角色
    exports.role = {
        getList: function() {
            return globalResponseHandler({
                url: 'authority/role/list'
            }, {
				description: "获取角色列表"
			});
        },
        get: function(roleId) {
            return globalResponseHandler({
                url: 'authority/role/' + roleId + '/get'
            }, {
				description: "获取角色详情"
			});
        },
        add: function(name, remark) {
            return globalResponseHandler({
                url: 'authority/role/add',
                type: 'post',
                data: {
                	name: name,
                	remark: remark
                }
            }, {
				description: "添加角色"
			});
        },
        update: function(roleId, name, remark) {
            return globalResponseHandler({
                url: 'authority/role/' + roleId + '/update',
                type: 'post',
                data: {
                	name: name,
                	remark: remark
                }
            }, {
				description: "更新角色"
			});
        },
        remove: function(roleId) {
            return globalResponseHandler({
                url: 'authority/role/' + roleId + '/remove',
                type: 'post'
            }, {
				description: "删除角色"
			});
        },
        operation: {
        	getList: function(roleId) {
	            return globalResponseHandler({
	                url: 'authority/role/' + roleId + '/operation/list'
	            }, {
					description: "获取角色对应操作列表"
				});
	        },
        	add: function(roleId, operationCode) {
	            return globalResponseHandler({
	                url: 'authority/role/' + roleId + '/operation/add',
	                type: 'post',
	                data: {
	                	operationCode: operationCode
	                }
	            }, {
					description: "角色添加操作"
				});
	        },
        	remove: function(roleId, operationCode) {
	            return globalResponseHandler({
	                url: 'authority/role/' + roleId + '/operation/remove',
	                type: 'post',
	                data: {
	                	operationCode: operationCode
	                }
	            }, {
					description: "角色删除操作"
				});
	        },
        }
    };

    // 操作
    exports.operation = {
        getList: function() {
            return globalResponseHandler({
                url: 'authority/operation/list'
            }, {
				description: "获取操作列表"
			});
        },
        get: function(code) {
            return globalResponseHandler({
                url: 'authority/operation/' + code + '/get'
            }, {
				description: "获取操作详情"
			});
        },
        add: function(code, name, remark) {
            return globalResponseHandler({
                url: 'authority/operation/add',
                type: 'post',
                data: {
                    code: code,
                    name: name,
                    remark: remark
                }
            }, {
				description: "添加操作"
			});
        },
        update: function(code, name, remark) {
            return globalResponseHandler({
                url: 'authority/operation/' + code + '/update',
                type: 'post',
                data: {
                    name: name,
                    remark: remark
                }
            }, {
				description: "更新操作"
			});
        },
        remove: function(code) {
            return globalResponseHandler({
                url: 'authority/operation/' + code + '/remove',
                type: 'post'
            }, {
				description: "删除操作"
			});
        },
    };

});
