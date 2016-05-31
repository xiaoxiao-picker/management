define(function(require, exports, module) {
	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var PublicService = require("PublicService");

	var Controller = function() {
		var _controller = this;
		_controller.namespace = "advertisement.edit";
		_controller.actions = {
			update: function() {
				var _btn = this;
				var viewPrice = +$("#VIEW").val();
				var clickPrice = +$("#CLICK").val();

				Helper.begin(_btn);
				PublicService.config.update({
					viewPrice: viewPrice,
					clickPrice: clickPrice
				}).done(function(data) {
					_controller.render();
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

		Application.getConfig(true).done(function() {
			var config = Application.config.advConfig;
			Helper.globalRender(template('app/templates/advertisement/edit', config));
		});
		
	};

	module.exports = Controller;
});