define(function(require, exports, module) {
	var	baseController = require('baseController');
	var	bC = new baseController();
	var	template = require('template');
	var	Helper = require('helper');
	var	MessageService = require("MessageService");

	var type, skip, limit, page;
	var targets;

	var Controller = function() {
		var _controller = this;
		_controller.namespace = "message.edit";
		_controller.actions = {
			openSelector: function() {
				require.async("lib.OrganizationSelector", function(OrganizationSelector) {
					OrganizationSelector({
						limit: 100,
						canEmpty: false,
						select: function(organizations) {
							var modal = this;
							targets = organizations;
							renderTargets();
							modal.destroy();
						}
					});
				});
			},
			removeTargets: function() {
				var _btn = this,
					targetId = _btn.attr("data-value");

				for (var i = 0; i < targets.length; i++) {
					if (targetId == targets[i].id) {
						targets.splice(i, 1);
					}
				}
				_btn.parents(".xx-tag-wrapper").remove();
			},
			sendNotice: function() {
				var _btn = this;

				var context = $('#Context').val();
				if (!context.length) {
					Helper.errorToast('发送内容不得为空');
					return;
				};

				Helper.confirm("确定发送该条公告给所有组织？", {
					yesText: "发送",
					noText: "哎哟，点错了"
				}, function() {
					Helper.begin(_btn);
					MessageService.sendNotice(context).done(function(data) {
						Helper.successToast('发送成功');
					}).fail(function(error) {
						Helper.alert(error);
					}).always(function() {
						Helper.end(_btn);
					});
				});
			},
			sendMessage: function() {
				var _btn = this;

				var context = $('#Context').val();
				if (!context.length) {
					Helper.errorToast('发送内容不得为空');
					return;
				};
				if (targets.length == 0) {
					Helper.errorToast("请选择发送对象！");
					return;
				}

				var orgIds = new Array();
				for (var i = 0; i < targets.length; i++) {
					orgIds.push(targets[i].id);
				}

				Helper.confirm("确定发送该条通知给对应组织？", {
					yesText: "发送",
					noText: "哎哟，点错了"
				}, function() {
					Helper.begin(_btn);
					MessageService.sendMessage(context, orgIds.join(',')).done(function(data) {
						Helper.successToast('发送成功');
					}).fail(function(error) {
						Helper.alert(error);
					}).always(function() {
						Helper.end(_btn);
					});
				});
			},
		};
	};

	bC.extend(Controller);
	/**
	 * 初始化参数，渲染模板
	 */
	Controller.prototype.init = function(callback) {
		this.callback = callback;

		type = Helper.param.search("type") || "NOTICE";
		targets = [];

		this.render();
	};

	/**
	 * 模板渲染函数
	 */
	Controller.prototype.render = function() {

		Helper.globalRender(template('app/templates/message/edit', {
			type: type
		}));
	};

	/**
	 *	渲染发送联系人页面
	 */
	function renderTargets() {
		$('.tags-container').html(template("app/templates/message/tag-manage", {
			targets: targets
		}));
	};

	module.exports = Controller;
});