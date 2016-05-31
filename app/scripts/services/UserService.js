define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');
	/**
	 * 用户通过手机号和密码登陆
	 */
	exports.login = function(phoneNumber, password) {
		return globalResponseHandler({
			url: 'account/login',
			type: 'post',
			data: {
				phoneNumber: phoneNumber,
				password: password
			}
		}, {
			description: "登陆"
		});
	};

	/**
	 * 验证当前session的状态，是否已登录
	 */
	exports.authSession = function() {
		return globalResponseHandler({
			url: 'session/get-user'
		}, {
			description: "验证Session"
		});
	};

	// 获取用户信息
	exports.get = function(userId) {
		return globalResponseHandler({
			url: 'user/' + userId + '/info'
		}, {
			description: "获取用户信息"
		});
	};

	// 获取用户列表
	exports.getList = function(skip, limit, name, nickName, phoneNumber) {
		return globalResponseHandler({
			url: 'user/list',
			data: {
				name: name,
				nickName: nickName,
				phoneNumber: phoneNumber,
				skip: skip,
				limit: limit
			}
		}, {
			description: "获取用户列表"
		});
	};

});