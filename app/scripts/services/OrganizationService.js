define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');

	// 组织
	exports.getList = function(data) {
		return globalResponseHandler({
			url: 'org/list',
			data: data
		}, {
			description: "获取组织列表"
		});
	};

	exports.member = {
		getList: function(organizationId, rank, skip, limit) {
			return globalResponseHandler({
				url: "member/list-user-by-organization",
				data: {
					organizationId: organizationId,
					rank: rank,
					skip: skip,
					limit: limit
				}
			}, {
				description: "获取组织成员"
			});
		},
		add: function(organizationId, phoneNumber, remark) {
			return globalResponseHandler({
				url: "member/add-by-phone-number",
				type: "post",
				data: {
					organizationId: organizationId,
					phoneNumber: phoneNumber,
					remark: remark,
					rank: 1
				}
			}, {
				description: "添加管理员"
			});
		},
		remove: function(memberId) {
			return globalResponseHandler({
				url: "member/" + memberId + "/remove",
				type: "post"
			}, {
				description: "删除组织成员"
			});
		}
	};
});