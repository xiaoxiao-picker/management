define(function(require, exports, module) {
	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var PublicService = require('PublicService');

	var Controller = function() {
		this.namespace = "static.index";
		this.actions = {};
	};

	bC.extend(Controller);
	/**
	 * 初始化参数，渲染模板
	 */
	Controller.prototype.init = function(callback) {
		PublicService.statistics().done(function(data) {
			Helper.globalRender(template('app/templates/static/welcome', data.result));
		}).fail(function(error) {
			Helper.alert(error);
		}).always(function() {
			Helper.execute(callback);
		});
	};

	module.exports = Controller;
});