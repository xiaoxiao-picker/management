define(function(require, exports, module) {
	require("datetimepicker");

	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var LogService = require("LogService");
	var EmployeeService = require("EmployeeService");
	var dateCompare = require("dateCompare");
	var Pagination = require("lib.Pagination");

	var logConfig = require('scripts/configs/log.js')

	var skip, limit, page, organizationIds;

	var Controller = function() {
		var _controller = this;
		_controller.namespace = "log.list";
		_controller.actions = {
			selectOrganization: function() {
				var $input = this;
				require.async("lib.OrganizationSelector", function(OrganizationSelector) {
					OrganizationSelector({
						select: function(organization) {
							var modal = this;
							organizationIds = organization.id;
							$input.val(organization.name);
							modal.destroy();
						}
					});
				});
			},
			search: function() {
				var _btn = this;

				page = 1;
				renderLogs(_controller, _btn);
			},
			openDetail: function() {
				var _btn = this;
				var orgId = _btn.attr("data-value");

				var modal = Helper.modal({
					title: '查看热度详情'
				});

				var options = {};
				var startDate = $("#StartDate").val();
				var endDate = $("#EndDate").val();
				if (!Helper.validation.isEmpty(startDate) && !Helper.validation.isEmpty(endDate)) {
					options.startDate = new Date(startDate).getTime();
					options.endDate = new Date(endDate).getTime();
				};

				LogService.rank.get(orgId, options).done(function(data) {
					modal.html(template('app/templates/log/rank-modal', {
						details: data.result.details,
						total: data.result.total,
						targets: logConfig.targets,
						organizationId: orgId
					}));
				}).fail(function(error) {
					Helper.alert(error);
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

		limit = +Helper.param.search("limit") || 30;
		page = +Helper.param.search("page") || 1;
		type = Helper.param.search('type') || 'DEFAULT';
		employeeId = Helper.param.search('eid');

		organizationIds = null;
		this.render();
	};

	/**
	 * 模板渲染函数
	 */
	Controller.prototype.render = function() {
		var controller = this;

		Helper.globalRender(template('app/templates/log/list', {
			targets: logConfig.targets,
			type: type
		}));
		initDatetimepicker();

		if (type == 'EMPLOYEE') {
			EmployeeService.organization.getList(employeeId).done(function(data) {
				var organizations = data.result;
				var ids = [];
				$.each(organizations, function(idx, organization) {
					ids.push(organization.id);
				});
				organizationIds = ids.join(',');
				renderLogs(controller);
			}).fail(function(error) {
				Helper.alert(error);
			});
		} else {
			renderLogs(controller);
		}

	};

	function renderLogs(controller, btn) {
		var options = {};
		if (type == 'EMPLOYEE' || (organizationIds && type != 'EMPLOYEE')) {
			options.organizationIds = organizationIds;
		};
		var businessModule = $(".target-type").val();
		if (!Helper.validation.isEmpty(businessModule)) {
			options.businessModule = businessModule;
		};
		var startDate = $("#StartDate").val();
		var endDate = $("#EndDate").val();
		if (!Helper.validation.isEmpty(startDate)) {
			options.startDate = new Date(startDate).getTime();
		}
		if (!Helper.validation.isEmpty(endDate)) {
			options.endDate = new Date(endDate).getTime();
		}

		skip = (page - 1) * limit;
		$("#Results").html(template("app/templates/public/loading", {}));

		btn && Helper.begin(btn);
		LogService.rank.getList(skip, limit, options).done(function(data) {
			var logs = data.result;
			var count = 1000;
			$("#Results").html(template("app/templates/log/results", {
				logs: logs,
				pagination: Helper.pagination(count, limit, page)
			}));

			Pagination(count, limit, page, {
                switchPage: function(pageIndex) {
                    page = pageIndex;
                    controller.render();
                }
            });

		}).fail(function(error) {
			Helper.alert(error);
			$("#Results").html('');
		}).always(function() {
			btn && Helper.end(btn);
		});
	};

	// 初始化时间选择器控件
	function initDatetimepicker() {
		$('.datetimepicker').datetimepicker({
			format: 'yyyy/mm/dd hh:ii',
			autoclose: true,
			language: 'zh-CN',
			pickerPosition: 'bottom-right'
		}).on("changeDate", function(evt) {
			var _input = $(this);
			var date = evt.date.valueOf();
			dateCompare.compare(_input, Helper.errorToast);
		});
	};

	module.exports = Controller;
});