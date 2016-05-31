//
//                   _ooOoo_
//                  o8888888o
//                  88" . "88
//                  (| -_- |)
//                  O\  =  /O
//               ____/`---'\____
//             .'  \\|     |//  `.
//            /  \\|||  :  |||//  \
//           /  _||||| -:- |||||-  \
//           |   | \\\  -  /// |   |
//           | \_|  ''\---/''  |   |
//           \  .-\__  `-`  ___/-. /
//         ___`. .'  /--.--\  `. . __
//      ."" '<  `.___\_<|>_/___.'  >'"".
//     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//     \  \ `-.   \_ __\ /__ _/   .-` /  /
//======`-.____`-.___\_____/___.-`____.-'======
//                   `=---='
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//            佛祖保佑       永无BUG

define(function(require, exports, module) {
	require("array");
	var controller = null;
	var template = require('template');
	var previousController;
	var previousControllerNS = "";
	var router = require('scripts/public/router');
	var Helper = require("helper");

	var Application = require('factory.application');

	// 渲染函数，根据controller参数实例化控制器，保存到controller参数
	var render = function(controller, fnCallback) {
		fnCallback = fnCallback || function() {
			// 渲染完成后执行 hashChange end
			$(document).trigger("sui.mvc.router.change.end");
		};

		var controllerBase = "scripts/controllers/";
		var _controller = controller; // 避免在SUI.use环境中参数污染controller变量
		var routeRes = router(_controller);
		var controllerName = controllerBase + ((routeRes && routeRes['controller']) ? routeRes['controller'] : (controller + "Controller"));
		seajs.use(controllerName, function(controller) {
			// Fixed：判断controller是否存在，避免用户输入错误url导致系统卡死	 
			if (!controller) {
				Helper.alert("无效的URL地址！！！");
				Helper.execute(fnCallback);
				return;
			}

			var tmp = new controller();
			$.isFunction(tmp.isController) && tmp.isController() && tmp.init(fnCallback);

			Helper.modal().clear();

			var namespace = tmp.namespace || _controller.replace(/\//g, ".").toLowerCase();
			previousController = tmp;
			// 在主循环中保存上一个对象的NS,用于解绑.NS命名空间下的事件委托,防止内存溢出
			previousControllerNS = namespace;

			// 绑定[data-xx-action]事件
			Helper.globalEventListener("click." + namespace, "data-xx-action", tmp.actions);
			Helper.globalEventListener("change." + namespace, "data-xx-change-action", tmp.actions, true);
			Helper.globalEventListener("keyup." + namespace, "data-xx-keyup-action", tmp.actions, true);
			Helper.globalEventListener("focus." + namespace, "data-xx-focus-action", tmp.actions, true);
		});
	};

	// 监听路由变化开始
	$(document).on("sui.mvc.router.change.start", function() {
		$(document).scrollTop(0);
		var ns = previousControllerNS || "index";
		$(document).off("." + ns);
		Helper.loader.show();
		// $("#content").removeAttr("class");
	});
	// 监听路由变化结束
	$(document).on("sui.mvc.router.change.end", function() {
		Helper.loader.hide();
	});
	// 监听APP级别的hashchange事件
	$(window).on('hashchange.application', function() {
		$(document).trigger("sui.mvc.router.change.start");
		hash = window.location.hash.replace(new RegExp(/(\/)+/g), "/");
		controller = hash ? hash.match(/^#([\w\/\-\u4e00-\u9fa5]+)\??/)[1] : 'index';

		if (previousController && previousController.destroy) {
			var destroy = previousController.destroy;
			Helper.execute(destroy);
		}

		render(controller);
	});

	// 初始化用户，全局唯一的用户示例
	window.Application = Application;
	Application.init(function() {
		// 去除模板蒙版层
		$('div#FrontLoading').after(template('app/templates/application', {
			user: Application.user.info
		})).hide();

		// 手动触发APP界别
		$(window).trigger('hashchange.application');
	});

	// 若点击的a标签地址与当前地址相同时手动触发hashchange事件
	$(document).on("click.application", "a", function() {
		if (window.location.hash == $(this).attr("href")) {
			$(window).trigger('hashchange.application');
		}
	});

	// 全局事件
	var globalActions = require("scripts/public/global-actions");
	var sidebarActions = require("scripts/public/sidebar");
	var headerActions = require("scripts/public/header");
	Helper.globalEventListener("click.global", "data-xx-action", globalActions);
	Helper.globalEventListener("click.sidebar", "data-xx-action", sidebarActions);
	Helper.globalEventListener("click.header", "data-xx-action", headerActions);
});