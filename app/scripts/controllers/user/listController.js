define(function(require, exports, module) {
    var baseController = require('baseController');
    var bC = new baseController();
    var template = require('template');
    var Helper = require('helper');
    var UserService = require("UserService");
    var Pagination = require("lib.Pagination");

    var skip, limit, page;

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "user.list";
        _controller.actions = {
            search: function() {
                var _btn = this;

                page = 1;
                getUsers(_controller, _btn);
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

        this.render();

    };

    /**
     * 模板渲染函数
     */
    Controller.prototype.render = function() {
        var controller = this;
        var callback = controller.callback;

        Helper.globalRender(template('app/templates/user/list', {}));
        Helper.execute(callback);

        getUsers(controller);
    };


    function getUsers(controller, btn) {
        var name = $('#KW_NAME').val();
        var nickName = $('#KW_NICK').val();
        var phoneNumber = $('#KW_PHONE').val();

        skip = (page - 1) * limit;
        $("#Results").html(template('app/templates/public/loading', {}));

        btn && Helper.begin(btn);
        UserService.getList(skip, limit, name, nickName, phoneNumber).done(function(data) {
            var users = data.result.data;
            var count = data.result.total;

            $("#Results").html(template("app/templates/user/rows", {
                users: users,
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

    module.exports = Controller;
});
