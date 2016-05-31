define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');
	/**
	 * 	发送通知
	 */
	exports.sendMessage = function(text, orgIds) {
		return globalResponseHandler({
			url: 'sys-announcement/add-to-org',
			type: 'post',
			data: {
				text: text,
				orgIds: orgIds,
			}
		});
	};

	/**
	 * 	添加公告
	 */
	exports.sendNotice = function(text) {
		return globalResponseHandler({
			url: 'sys-announcement/add',
			type: 'post',
			data: {
				text: text
			}
		});
	};

});