/**
 *	组织选择器
 */
define(function(require, exports, module) {
	var OrganizationService = require('OrganizationService');
	var Helper = require("helper");
	var template = require("template");

	var boxTemp = "app/templates/public/organization-selector/box";
	var resultTemp = "app/templates/public/organization-selector/results";

	var Selector = function(options) {
		options = $.extend({
			title: '选择组织',
			canEmpty: true,
			limit: 1,
			select: function() {}
		}, options);
		limit = 30;
		SearchText = "";

		var modal = Helper.modal(options);

		modal.organizations = [];
		render(modal);

		return modal;
	};

	function render(selector) {
		selector.html(template(boxTemp, {}));

		addActions(selector);
		renderList(selector);
	};

	function renderList(selector, keyword) {
		var skip = selector.options.canEmpty ? (selector.organizations.length ? selector.organizations.length - 1 : 0) : selector.organizations.length;
		OrganizationService.getList({
			skip: skip,
			limit: limit,
			keyword: keyword
		}).done(function(data) {
			if (!selector.organizations.length && selector.options.canEmpty) {
				selector.organizations.push({
					name: '不限',
					id: null
				});
			};
			selector.organizations = selector.organizations.concat(data.result.data);
			selector.count = data.result.total;
			selector.box.find("#Results").html(template(resultTemp, {
				organizations: selector.organizations,
				optionLimit: selector.options.limit
			}));
			selector.box.find(".btn-more")[selector.count > selector.organizations.length ? 'removeClass' : 'addClass']('hide');
		}).fail(function(error) {
			Helper.alert(error);
		});
	};

	function addActions(selector) {
		var SEARCH;
		selector.addAction("#SearchInput", "keyup", function() {
			var _input = $(this);
			SearchText = _input.val();

			clearTimeout(SEARCH);
			SEARCH = setTimeout(function() {
				selector.organizations = [];
				renderList(selector, SearchText);
			}, 500);
		}, false);

		selector.addAction(".btn-more", "click", function() {
			renderList(selector, SearchText);
		});

		if (selector.options.limit == 1) {
			selector.addAction(".organization", "click", function(evt) {
				var _btn = $(this);
				var organizationName = _btn.attr("data-name");
				var organizationId = _btn.attr("data-id");

				selector.options.select && $.isFunction(selector.options.select) && selector.options.select.call(selector, {
					name: organizationName || '未命名',
					id: organizationId
				});
			});
		} else {
			selector.addAction(".btn-save", "click", function(evt) {
				var organizations = [];
				$("input[name=organization]:checked").each(function(idx, input) {
					var organizationName = $(input).attr("data-name");
					var organizationId = $(input).attr("data-id");

					organizations.push({
						name: organizationName || '未命名',
						id: organizationId
					});
				});

				selector.options.select && $.isFunction(selector.options.select) && selector.options.select.call(selector, organizations);
			});
		}
	};

	module.exports = Selector;
});