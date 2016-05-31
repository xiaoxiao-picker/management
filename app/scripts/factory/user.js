define(function(require, exports, module) {
	var Helper = require("helper");
	var UserService = require("UserService");

	var User = function(userId) {
		this.id = userId;
	};

	User.prototype.reload = function(done, fail, always) {
		var userId = this.id;
		var user = this;
		return UserService.get(userId).done(function(data) {
			user.info = data.result;
			user.info.grade = user.info.grade ? +user.info.grade : null;
		});
	};

	User.prototype.getRank = function(refresh) {
		var user = this;
		refresh = refresh ? true : false;

		var orgId = Application.organization.id;
		user.rank = user.rank || {};
		if (refresh || !user.rank[orgId]) {
			return UserService.getMemberRank(orgId).done(function(data) {
				user.rank[orgId] = data.result;
			});
		} else {
			var defer = $.Deferred();
			defer.resolve();
			return defer.promise();
		}
	};

	// 确保用户已绑定手机号码才能操作
	User.prototype.withinPhoneNumber = function(message, callback) {
		var user = this;
		if (user.info.phoneNumber) {
			Helper.execute(callback);
			return;
		}
		// 如果未绑定手机号，则弹出绑定手机层
		Helper.confirm(message, function() {
			require.async("lib.phoneBindBox", function(PhoneBindBox) {
				PhoneBindBox({
					success: callback
				});
			});
		});
	};

	module.exports = function(userId) {
		return new User(userId);
	};
});