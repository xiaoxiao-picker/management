define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');

	exports.getList = function(skip, limit, keyword) {
		return globalResponseHandler({
			url: 'employee/list',
			data: {
				skip: skip,
				limit: limit,
				keyword: keyword
			}
		}, {
			description: "获取员工列表"
		});
	};

	exports.get = function(employeeId) {
		return globalResponseHandler({
			url: 'employee/' + employeeId + '/get'
		}, {
			description: "获取员工详情"
		});
	};

	exports.add = function(data) {
		return globalResponseHandler({
			url: 'employee/add',
			type: 'post',
			data: data
		}, {
			description: "添加员工"
		});
	};

	exports.update = function(employeeId, data) {
		return globalResponseHandler({
			url: 'employee/' + employeeId + '/update',
			type: 'post',
			data: data
		}, {
			description: "更新员工"
		});
	};

	exports.remove = function(employeeId) {
		return globalResponseHandler({
			url: 'employee/' + employeeId + '/remove',
			type: 'post'
		}, {
			description: "删除员工"
		});
	};

	exports.organization = {
		getList: function(employeeId) {
			return globalResponseHandler({
				url: 'employee/' + employeeId + '/list-organizations'
			}, {
				description: "员工管理组织列表"
			});
		},
		add: function(employeeId, organizationIds) {
			return globalResponseHandler({
				url: 'employee/' + employeeId + '/add-organizations',
				type: 'post',
				data: {
					organizationIds: organizationIds
				}
			}, {
				description: "员工添加管理组织"
			});
		},
		remove: function(employeeId, organizationId) {
			return globalResponseHandler({
				url: 'employee/' + employeeId + '/remove-organization',
				type: 'post',
				data: {
					organizationId: organizationId
				}
			}, {
				description: "员工删除管理组织"
			});
		}
	};

});