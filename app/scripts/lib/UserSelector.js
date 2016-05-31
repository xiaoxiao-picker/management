/**
 *  用户选择器
 */
define(function(require, exports, module) {
    var UserService = require('UserService');
    var Helper = require("helper");
    var template = require("template");

    var boxTemp = "app/templates/public/user-selector/box";
    var resultTemp = "app/templates/public/user-selector/results";

    var Selector = function(options) {
        options = $.extend({
            title: '选择用户',
            canEmpty: true,
            select: function() {}
        }, options);
        limit = 30;

        var modal = Helper.modal(options);

        modal.users = [];
        render(modal);

        return modal;
    };

    function render(selector) {
        selector.html(template(boxTemp, {}));

        addActions(selector);
        renderList(selector);
    };

    function renderList(selector) {
        var name = selector.box.find('#KW_NAME').val();
        var nickName = selector.box.find('#KW_NICK').val();
        var phoneNumber = selector.box.find('#KW_PHONE').val();

        var skip = selector.options.canEmpty ? (selector.users.length ? selector.users.length-1 : 0) : selector.users.length;
        UserService.getList(skip, limit, name, nickName, phoneNumber).done(function(data) {
            if (!selector.users.length && selector.options.canEmpty) {
                selector.users.push({
                    name: '不限',
                    id: null
                });
            };
            selector.users = selector.users.concat(data.result.data);
            selector.count = data.result.total;
            selector.box.find("#Results").html(template(resultTemp, {
                users: selector.users,
                optionLimit: selector.options.limit
            }));
            selector.box.find(".btn-more")[selector.count > selector.users.length ? 'removeClass' : 'addClass']('hide');
        }).fail(function(error) {
            Helper.alert(error);
        });
    };

    function addActions(selector) {
        selector.addAction(".btn-search", "click", function() {
            selector.users = [];
            renderList(selector);
        });

        selector.addAction(".btn-more", "click", function() {
            renderList(selector);
        });

        selector.addAction(".user", "click", function(evt) {
            var _btn = $(this);
            var userName = _btn.attr("data-name");
            var userId = _btn.attr("data-id");

            selector.options.select && $.isFunction(selector.options.select) && selector.options.select.call(selector, {
                name: userName,
                id: userId
            });
        });
    };

    module.exports = Selector;
});
