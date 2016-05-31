define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');
	/**
	 * 	设置管理员
	 */
	exports.setAdmin = function(orgId, userIds) {
		return globalResponseHandler({
			url: 'system/member/setadmin',
			type: 'post',
			data: {
				orgId: orgId,
				userIds: userIds
			}
		});
	};

});