define(function(require, exports, module) {
	var validation = require('validation');
	var Alert = require('alert');
	
	exports.modal = require("modal");

	exports.param = require("scripts/public/param");
	exports.loader = require("loader");

	exports.config = {
		system: require("sysconfig")
	};

	/**
	 *	表单验证
	 */
	exports.getFormData = validation.getFormData;
	exports.formValid = validation.formValid;
	exports.validation = validation;

	/**
	 *	日期格式化
	 */
	require("date");
	exports.makedate = function(d, format) {
		format = format ? format : "yyyy-MM-dd";
		return d ? new Date(parseInt(d)).Format(format) : "";
	};

	/**	
	 *	页面跳转
	 */
	exports.goHome = function(msg) {
		if (msg)
			Alert.alert(msg, {}, function() {
				window.location.href = sysConfig.pages.login;
			});
	};
	exports.go = function(url) {
		window.location.href = url;
	};
	exports.jump = function(url) {
		window.location.hash = url;
	};

	/**
	 * 	渲染页面并且隐藏loading层
	 */
	exports.globalRender = function(html) {
		$("#content").html(html);
	};
	
	/**
	 *	分页
	 */
	exports.pagination = function(count, limit, page) {
		return {
			iTotalPage: count % limit == 0 ? count / limit : Math.floor(count / limit) + 1,
			iCurPage: page,
			limit: limit,
			page: page,
			hash: (location.hash.indexOf('page=') != -1) ? location.hash.replace(/page\=([\d]+)/, "") : location.hash + "&"
		};
	};

	/**
	 * 	取消event默认事件
	 */
	exports.preventDefault = function(event) {
		if (event.preventDefault)
			event.preventDefault();
		else
			event.returnValue = false;
	};

	/**
	 * 	提交中的按钮
	 */
	exports.begin = function(btn) {
		btn.addClass("loading").attr("disabled", "disabled");
	};
	exports.end = function(btn) {
		btn.removeClass("loading").removeAttr("disabled");
	};


	/**
	 * 	弹出框插件
	 */
	function pkAlert(message, options, callback) {
		if ($.isFunction(options)) {
			callback = options;
		}
		options = $.extend({}, options);
		Alert.alert(message, options, callback);
	};
	exports.alert = pkAlert;
	exports.confirm = function(message, options, successCallback, errorCallback) {
		if ($.isFunction(options)) {
			errorCallback = successCallback;
			successCallback = options;
		}
		options = $.extend({}, options);
		Alert.confirm(message, options, successCallback, errorCallback);
	};

	/**
	 * 	提示组
	 */
	var Toast = require('toast');
	var successToast = function(message, options) {
		Toast.toast(message, {
			theme: 'success',
			position: 'center'
		});
	};
	var errorToast = function(message, options) {
		Toast.toast(message, {
			theme: 'danger',
			position: 'center'
		});
	};
	exports.successToast = successToast;
	exports.errorToast = errorToast;

	/**
	 *	事件执行
	 */
	function execute(callback, data) {
		callback && $.isFunction(callback) && callback(data);
	};
	exports.execute = execute;


	/**
	 * 	事件监听
	 */
	var eventListener = require('scripts/public/eventListener');
	exports.eventListener = eventListener.eventListener;
	exports.globalEventListener = eventListener.globalEventListener;

	/**
	 * 	复制到剪贴板 ZeroClipboard 由home.html页面引入
	 * 	btn 复制按钮 DOM对象
	 * 	options 其他参数
	 */
	var flash = require("scripts/lib/flash");
	exports.copyClientboard = function(btn, options) {
		if (!flash.checker().hasFlash) {
			errorToast("复制功能需要您安装flash！");
			return;
		}
		var aftercopy = (options && options.aftercopy) ? options.aftercopy : function(event) {
			successToast('复制成功！');
		};

		try {
			var client = new ZeroClipboard(btn);
			client.on("ready", function(readyEvent) {
				client.on("aftercopy", aftercopy);
			});
		} catch (error) {
			window.console && console.log && console.log(error);
		}
	};

	/**
	 *	二维码生成器
	 */
	exports.generateQRCode = require("generateQRCode");
});