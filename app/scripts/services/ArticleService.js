define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');

	exports.getList = function(skip, limit, keyword, orgId, state) {
		return globalResponseHandler({
			url: 'article/list',
			data: {
				skip: skip,
				limit: limit,
				keyword: keyword,
				organizationId: orgId,
				state: state
			}
		}, {
			description: "获取文章列表"
		});
	};

});