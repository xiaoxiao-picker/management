define(function(require, exports, module) {
	var globalResponseHandler = require('ajaxhandler');

	exports.money = {
		getList: function(state, skip, limit) {
			return globalResponseHandler({
				url: 'draw-money/list',
				data: {
					state: state,
					skip: skip,
					limit: limit
				}
			}, {
				description: '获取申请取款列表'
			});
		},
		approve: function(applyId) {
			return globalResponseHandler({
				url: 'draw-money/' + applyId + '/approve',
				type: 'post'
			}, {
				description: '同意取款'
			});
		},
		reject: function(applyId, text) {
			return globalResponseHandler({
				url: 'draw-money/' + applyId + '/reject',
				type: 'post',
				data: {
					text: text
				}
			}, {
				description: '拒绝取款'
			});
		}
	};
	
	exports.account = {
		getList: function(skip, limit) {
			return globalResponseHandler({
				url: 'pay-account/list',
				data: {
					skip: skip,
					limit: limit
				}
			}, {
				description: '获取申请取款列表'
			});
		},
		get: function(accountId) {
			return globalResponseHandler({
				url: 'pay-account/' + accountId + '/get'
			}, {
				description: '获取申请取款列表'
			});
		},
		approve: function(accountId) {
			return globalResponseHandler({
				url: 'pay-account/' + accountId + '/approve',
				type: 'post'
			}, {
				description: '同意取款'
			});
		},
		reject: function(accountId, text) {
			return globalResponseHandler({
				url: 'pay-account/' + accountId + '/reject',
				type: 'post',
				data: {
					text: text
				}
			}, {
				description: '拒绝取款'
			});
		}
	};

});