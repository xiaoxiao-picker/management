define(function(require, exports, module) {
	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var MemberService = require("MemberService");
	var OrganizationService = require("OrganizationService");
	var Pagination = require("lib.Pagination");

	var limit, page, keyword, schoolId, orgType;

	var Controller = function() {
		var controller = this;
		controller.namespace = "organization.list";
		controller.actions = {
			selectSchool: function() {
				var $input = this;
				require.async("lib.SchoolSelector", function(SchoolSelector) {
					SchoolSelector({
						select: function(school) {
							var modal = this;
							schoolId = school.id;
							$input.val(school.name);
							modal.destroy();
						}
					});
				});
			},
			search: function() {
				var btn = this;
				page = 1;

				Helper.begin(btn);
				controller.render().always(function() {
					Helper.end(btn);
				});
			},
			// 打开编辑层
			addAdministrator: function() {
				var btn = this;
				var organizationId = btn.attr("data-value");

				var modal = Helper.modal({
					title: "添加管理员"
				});
				modal.html(template("app/templates/public/single-input-modal", {
					name: "手机号码",
					placeholder: "请填写手机号码"
				}));
				modal.addAction(".btn-save", "click", function(modal) {
					var btn = this;
					var phoneNumber = $.trim(btn.parents(".modal-form").find(".input").val());
					if (!Helper.validation.isPhoneNumber(phoneNumber)) {
						return Helper.errorToast("请填写正确的手机号码！");
					}

					Helper.begin(btn);
					OrganizationService.member.add(organizationId, phoneNumber, "").done(function(data) {
						Helper.successToast("添加成功！");
						modal.destroy();
					}).fail(function(error) {
						Helper.alert(error);
					}).always(function() {
						Helper.end(btn);
					});

				});
			},
			checkAdministrators: function() {
				var btn = this;
				var organizationId = btn.attr("data-value");

				Helper.begin(btn);
				var modal = Helper.modal({
					title: "查看管理员"
				});
				OrganizationService.member.getList(organizationId, 0, 0, 100).done(function(data) {
					var members = data.result.data;
					$(members).each(function(idx, member) {
						member.user = member.user || {};
					});
					modal.html(template("app/templates/organization/organization-members", {
						members: members
					}));
					modal.addAction(".btnRemoveMemberRank", "click", function(modal) {
						var btn = this;
						var memberId = btn.parents("li.member").attr("data-member-id");
						var memberName = btn.parents("li.member").attr("data-member-name");
						Helper.confirm("确定将 " + memberName + " 移除组织？", function() {
							Helper.begin(btn);
							OrganizationService.member.remove(memberId).done(function(data) {
								btn.parents("li.member").slideUp(500, function() {
									$(this).remove();
								})
							}).fail(function(error) {
								Helper.alert(error);
							}).always(function() {
								Helper.end(btn);
							});
						});
					});
				}).fail(function(error) {
					Helper.alert(error);
				}).always(function() {
					Helper.end(btn);
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
		limit = +Helper.param.search("limit") || 20;
		page = +Helper.param.search("page") || 1;
		keyword = "";
		schoolId = null;
		orgType = "";

		Helper.globalRender(template("app/templates/organization/list", {}));

		this.render();
	};

	/**
	 * 模板渲染函数
	 */
	Controller.prototype.render = function() {
		var controller = this;
		var callback = controller.callback;

		var $form = $(".search-xx-input");
		keyword = $form.find(".keyword").val();
		orgType = $form.find(".org-type").val();

		skip = (page - 1) * limit;

		return OrganizationService.getList({
			keyword: keyword,
			schoolId: schoolId,
			orgType: orgType,
			skip: skip,
			limit: limit
		}).done(function(data) {
			var orgs = data.result.data;
			var count = data.result.total;
			$("#Results").html(template("app/templates/organization/org-rows", {
				orgs: orgs,
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
			Helper.execute(callback);
		});
	};

	module.exports = Controller;
});