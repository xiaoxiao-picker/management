define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');

	exports.getList = function(skip, limit, keyword, orgId) {
		return globalResponseHandler({
			url: 'ticket-source/list',
			data: {
				skip: skip,
				limit: limit,
				keyword: keyword,
				organizationId: orgId
			}
		}, {
			description: "获取电子票列表"
		});
	};

});