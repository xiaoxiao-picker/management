define(function(require, exports, module) {
	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var UserService = require("UserService");
	var PublicService = require("PublicService");

	var Application = window.Application = require("factory.application");

	var session;

	var Controller = function() {
		var _controller = this;
		_controller.namespace = "static.login";
		_controller.actions = {
			// 登陆
			login: function() {
				var _btn = this;
				var _form = _btn.parents("form");
				var ipt_userName = _form.find("#UserName");
				var ipt_password = _form.find("#Password");
				var userName = ipt_userName.val();
				var password = ipt_password.val();

				// validate the form 
				if (Helper.validation.isEmpty(userName)) {
					Helper.errorToast("用户名不能为空！");
					ipt_userName.focus();
					return;
				}
				if (!Helper.validation.isPhoneNumber(userName)) {
					Helper.errorToast("用户名格式错误！");
					ipt_userName.focus();
					return;
				}
				if (Helper.validation.isEmpty(password)) {
					Helper.errorToast("密码不能为空！");
					ipt_password.focus();
					return;
				}

				Helper.begin(_btn);
				UserService.login(userName, password).done(function(data) {
					window.location.href = "./index.html";
				}).fail(function(error) {
					Helper.errorToast(error);
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
	Controller.prototype.init = function() {
		var controller = this;
		Helper.globalEventListener("click." + controller.namespace, "data-xx-action", controller.actions);
		session = store.get("userSession");
		if (session) {
			Application.setSession(session);
			UserService.authSession(session).done(function(data) {
				if (data.result) {
					window.location.href = "./index.html";
				} else {
					Application.clearSession();
					createSession(render);
				}
			}).fail(function(error) {
				Helper.alert(error);
			});
		} else {
			createSession(render);
		}


		function createSession(callback) {
			PublicService.createSession().done(function(data) {
				session = data.result;
				Application.setSession(session);
				Helper.execute(callback);
			}).fail(function(error) {
				Helper.alert(error);
			});
		}
	};

	/**
	 * 模板渲染函数
	 */
	function render() {
		$("#RootContainer").html(template("app/templates/static/login", {}));
	};

	module.exports = Controller;
});