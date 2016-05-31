define(function(require, exports, module) {
	require("plugins/ueditor/ueditor.all.min");

	// 注册秀米编辑器
	// 样式文件在 global/xiumi.scss 文件
	UE.registerUI('dialog', function(editor, uiName) {
		var btn = new UE.ui.Button({
			name: 'xiumi-connect',
			title: '秀米',
			onclick: function() {
				var dialog = new UE.ui.Dialog({
					iframeUrl: './plugins/ueditor/xiumi-ue-dialog-v1.html',
					editor: editor,
					name: 'xiumi-connect',
					title: "秀米图文消息助手",
					cssRules: "width: " + (window.innerWidth - 60) + "px;" + "height: " + (window.innerHeight - 60) + "px;",
				});
				dialog.render();
				dialog.open();
			}
		});

		return btn;
	});

	// 初始化插件
	function init(container) {
		try {
			UE.getEditor(container).destroy();
		} catch (error) {}
		var ue = UE.getEditor(container);

		return ue;
	};

	exports.init = init;
});