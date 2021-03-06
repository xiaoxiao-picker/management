define(function(require, exports, module) {
	var baseController = require('baseController');
	var bC = new baseController();
	var template = require('template');
	var Helper = require('helper');
	var ArticleService = require("ArticleService");
	var Pagination = require("lib.Pagination");

	var skip, limit, page, organizationId, keyword;

	var Controller = function() {
		var _controller = this;
		_controller.namespace = "article.list";
		_controller.actions = {
			selectOrganization: function() {
				var $input = this;
				require.async("lib.OrganizationSelector", function(OrganizationSelector) {
					OrganizationSelector({
						select: function(organization) {
							var modal = this;
							organizationId = organization.id;
							$input.val(organization.name);
							modal.destroy();
						}
					});
				});
			},
			search: function() {
				var _btn = this;
				
				page = 1;
				renderArticles(_controller, _btn);
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
		organizationId = null;
        keyword = "";

		this.render();
	};

	/**
	 * 模板渲染函数
	 */
	Controller.prototype.render = function() {
		var controller = this;	

		Helper.globalRender(template('app/templates/article/list', {}));
		renderArticles(controller);
	};

	function renderArticles(controller, btn) {
		keyword = $("#KW_TITLE").val();

		skip = (page - 1) * limit;
		$("#ArticlesContainer").html(template("app/templates/public/loading", {}));

		btn && Helper.begin(btn);
		ArticleService.getList(skip, limit, keyword, organizationId).done(function(data) {
			var articles = data.result.data;
			var count = data.result.total;
			$("#ArticlesContainer").html(template("app/templates/article/list-results", {
				articles: articles,
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
			$("#ArticlesContainer").html('');
		}).always(function() {
			btn && Helper.end(btn);
		});
	};

	module.exports = Controller;
});