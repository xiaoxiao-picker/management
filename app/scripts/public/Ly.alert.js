define(function(require, exports, module) {
	var Alert = function() {
		this.options = {
			effects: 'scale',
			position: null // 默认居中
		};
		this.callback = null;
	};
	Alert.prototype.init = function(type, message, options, callback, errorCallback) {
		var _this = this;
		_this.type = type;
		_this.message = message;
		_this.options = $.extend(_this.options, options);
		_this.callback = callback;
		_this.errorCallback = errorCallback || null;
	};
	Alert.prototype.createHTML = function() {
		var footerHtml, html, messageBox,
			type = this.type,
			title = this.options.title || '校校提示',
			yesText = this.options.yesText || '确定',
			noText = this.options.noText || '取消';

		if (type == "alert")
			footerHtml = '<button class="ly-btn ly-btn-yes btn"><span class="inside-loading"><i class="fa fa-spinner rolling font-18"></i></span><span class="inside-text">' + yesText + '</span></button>';
		else if (type == "confirm")
			footerHtml = '<button class="ly-btn ly-btn-yes btn"><span class="inside-loading"><i class="fa fa-spinner rolling font-18"></i></span><span class="inside-text">' + yesText + '</span></button><button class="ly-btn ly-btn-no btn "><span class="inside-loading"><i class="fa fa-spinner rolling font-18"></i></span><span class="inside-text">' + noText + '</span></button>';

		messageBox = $('<div class="ly-message-box-container"></div>');
		html = ['<div class="ly-message-box '+this.options.effects+'">',
			'<div class="ly-message-box-header unselect">',
			title,
			'</div>',
			'<div class="ly-message-box-body">',
			this.message,
			'</div>',
			'<div class="ly-message-box-footer">',
			footerHtml,
			'</div>',
			'</div>'
		].join('');
		messageBox.html(html);
		this.messageBox = messageBox;
		this.eventListener();
	};
	Alert.prototype.eventListener = function() {
		var _this = this,
			type = _this.type;
		_this.messageBox.on('click.Ly.alert', '.ly-btn-yes', function() {
			_this.confirm();
		});
		_this.messageBox.on('click.Ly.alert', '.ly-btn-no', function() {
			_this.cancel();
		});
	};
	Alert.prototype.confirm = function() {
		var _this = this;
		_this.messageBox.find(".ly-message-box").animate({
			marginTop: -100
		}, 200, function() {
			_this.messageBox.off('click.Ly.alert').remove();
			_this.callback && $.isFunction(_this.callback) && _this.callback();
		});
	};
	Alert.prototype.cancel = function() {
		var _this = this;
		_this.messageBox.find(".ly-message-box").animate({
			marginTop: -100
		}, 200, function() {
			_this.messageBox.off('click.Ly.alert').remove();
			_this.errorCallback && $.isFunction(_this.errorCallback) && _this.errorCallback();
			_this = null;
		});
	};
	/**
	 * 要使用callback函数必须先传options，以后在优化
	 */
	Alert.prototype.render = function(type, message, options, callback, errorCallback) {
		var _this = this;
		this.init(type, message, options, callback, errorCallback);
		this.createHTML();
		this.messageBox.appendTo(document.body);

		var btnYes = _this.messageBox.find(".ly-btn-yes");
		var btnNo = _this.messageBox.find(".ly-btn-no");

		// 确定按钮获取焦点，防止Enter键触发其他button的click事件
		btnYes.trigger("focus");

		if (window.SmartEvent) {
			// SmartEvent 在application.js中定义，旨在全局管理键盘快捷键事件
			// esc
			SmartEvent.add(27, function() {
				if (!_this) return;
				btnNo.trigger("click");
				SmartEvent.remove(13, SmartEvent["13"].length - 1);
			});
			// Enter
			SmartEvent.add(13, function() {
				if (!_this) return;
				btnYes.trigger("click");
				SmartEvent.remove(27, SmartEvent["27"].length - 1);
			});
		}
	};

	exports.alert = function(message, options, callback) {
		(new Alert()).render("alert", message, options, callback);
	};
	exports.confirm = function(message, options, successCallback, errorCallback) {
		(new Alert()).render("confirm", message, options, successCallback, errorCallback);
	};
});