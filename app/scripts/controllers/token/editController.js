define(function(require, exports, module) {
	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var TokenService = require("TokenService");

	var Controller = function() {
		var _controller = this;
		_controller.namespace = "token.edit";
		_controller.actions = {
			check: function() {
				var _btn = this;
				var phoneNumber = $("#PHONE").val();
				var type = $("#TYPE").val();

				if (!Helper.validation.isPhoneNumber(phoneNumber)) {
					Helper.errorToast('手机号码格式错误！');
					return;
				};

				Helper.begin(_btn);
				TokenService.check(phoneNumber, type).done(function(data) {
					Helper.alert('当前有效验证码：' + data.result);
				}).fail(function(error) {
					Helper.alert(error);
				}).always(function() {
					Helper.end(_btn);
				});
				
			}
		};
	};

	bC.extend(Controller);
	/**
	 * 初始化参数，渲染模板
	 */
	Controller.prototype.init = function(callback) {
		this.callback = callback;

		this.render();
	};

	/**
	 * 模板渲染函数
	 */
	Controller.prototype.render = function() {
		var controller = this;	

		Helper.globalRender(template('app/templates/token/edit', {}));
		
	};

	module.exports = Controller;
});