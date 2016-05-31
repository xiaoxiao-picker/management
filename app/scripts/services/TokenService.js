define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');

	exports.check = function(phoneNumber, type) {
		return globalResponseHandler({
			url: 'token/query',
			data: {
				name: phoneNumber,
				type: type
			}
		}, {
			description: "验证码查询"
		});
	};

});