/** 
 * 定义事件监听
 */
define(function(require, exports, module) {
	/**
	 * 上传事件监听
	 */
	exports.dragToUpload = function(namespace, uploadFnc) {
		$(document).on("change", ".input-upload", function() {
			var files = this.files;
			$.each(files, function(idx, item) {
				uploadFnc && $.isFunction(uploadFnc) && uploadFnc(item);
			});
		});
		$(document).on("dragleave", ".drag-to-upload", function(evt) {
			evt = evt || window.event;
			preventDefault(evt);
			evt.stopPropagation();
		});
		$(document).on("dragenter", ".drag-to-upload", function(evt) {
			evt = evt || window.event;
			preventDefault(evt);
			evt.stopPropagation();
		});
		$(document).on("dragover", ".drag-to-upload", function(evt) {
			evt = evt || window.event;
			preventDefault(evt);
			evt.stopPropagation();
		});
		$(document).on("drop", ".drag-to-upload", function(evt) {
			evt = evt || window.event;
			preventDefault(evt);
			evt.stopPropagation();
			var files = evt.dataTransfer.files[0];
			$.each(files, function(idx, item) {
				uploadFnc && $.isFunction(uploadFnc) && uploadFnc(item);
			});
		});
	};

	/**
	 * 全局事件监听函数
	 */
	exports.globalEventListener = function(eventName, dataEventAction, actions, prevent) {
		$(document).on(eventName, "[" + dataEventAction + "]", function(evt) {
			evt = evt || window.event;
			if (!prevent) preventDefault(evt);
			var _this = $(this);
			var actionName = _this.attr(dataEventAction);
			var action = actions[actionName];
			action && $.isFunction(action) && action.call(_this, evt);
		});
	};

	function preventDefault(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	};
});