define(function(require, exports, module) {
	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var UserService = require("UserService");

	var controller = function(userId) {
		this.namespace = "user.info";
		this.actions = {};
		this.id=userId;
	};
	bC.extend(controller);

	controller.prototype.init = function() {
		var _controller = this;
		tmp = "app/templates/member/info";

		render(_controller.id);
	};

	function render() {
		Helper.modal.dynamicModal(userAuthModalId, template, {
			title: "用户信息",
			className: "user-info-modal"
		});
		UserService.getInfo(userId).then(function(data) {
			var userInfo = data.result;

			Helper.modal.fillModal("UserInfoModal", template('app/templates/user/info-modal', {
				user: userInfo
			}));
		})["catch"](function(error) {
			Helper.alert(error);
		});
	}
	module.exports = controller;
});