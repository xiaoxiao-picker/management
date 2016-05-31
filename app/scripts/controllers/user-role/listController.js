define(function(require, exports, module) {
    var baseController = require('baseController');
    var bC = new baseController();
    var template = require('template');
    var Helper = require('helper');
    var AuthorityService = require("AuthorityService");
    var UserService = require("UserService");
    var Pagination = require("lib.Pagination");

    var skip, limit, page;

    // 系统目前已存在的角色列表
    var StaticRoles;

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "user.roles";
        _controller.actions = {
            search: function() {
                var _btn = this;

                page = 1;
                getUsers(_controller, _btn);
            },
            showRoles: function() {
                var _btn = this;
                var userId = _btn.attr("data-value");

                showUserRoleModal(_controller, userId);
            },
            updateUserRoles: function() {

            },
            showUser: function() {
                var userId = this.attr("data-value");
                new User(userId).render();
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

        this.users = [];
        this.render();
    };

    /**
     * 模板渲染函数
     */
    Controller.prototype.render = function() {
        var controller = this;
        var callback = controller.callback;

        Helper.globalRender(template('app/templates/user-role/list', {}));
        Helper.execute(callback);

        getUsers(controller);
    };


    function getUsers(controller, btn) {
        var name = $('#KW_NAME').val();
        var nickName = $('#KW_NICK').val();
        var phoneNumber = $('#KW_PHONE').val();

        skip = (page - 1) * limit;
        $("#ResultUsers").html(template('app/templates/public/loading', {}));

        btn && Helper.begin(btn);
        UserService.getList(skip, limit, name, nickName, phoneNumber).done(function(data) {
            controller.users = data.result.data;
            controller.count = data.result.total;

            var length = controller.users.length;
            if (length === 0) {
                $("#ResultUsers").html("");
                return;
            }
            var index = 0;
            $(controller.users).each(function(idx, user) {
                AuthorityService.user.role.getList(user.id).done(function(data) {
                    var roles = data.result;
                    user.roles = roles;
                }).fail(function(error) {
                    Helper.errorToast(user.name + " 权限获取失败，请刷新重试！");
                }).always(function() {
                    index++;
                });
            });

            // 确保所有用户都已查询过权限再渲染显示
            var timer = function() {
                setTimeout(function() {
                    if (index == length) {
                        userListRender(controller);
                    } else {
                        timer();
                    }
                }, 100);
            };
            timer();

        }).fail(function(error) {
            Helper.alert(error);
            $("#ResultUsers").html('');
        }).always(function() {
            btn && Helper.end(btn);
        });
    };

    // 用户列表渲染
    function userListRender(controller) {
        $("#ResultUsers").html(template("app/templates/user-role/results", {
            users: controller.users,
            pagination: Helper.pagination(controller.count, limit, page)
        }));

        Pagination(controller.count, limit, page, {
            switchPage: function(pageIndex) {
                page = pageIndex;
                controller.render();
            }
        });
    };

    // 打开用户角色设置层
    function showUserRoleModal(controller, userId) {
        var user = controller.users.objOfAttr('id', userId);
        var modal = Helper.modal({
            title: '角色设置'
        });

        if (!controller.roles) {
            AuthorityService.role.getList().done(function(data) {
                controller.roles = data.result;
                renderInit();
            }).fail(function(error) {
                Helper.alert(error);
            })
        } else {
            renderInit();
        }

        function renderInit() {
            $(controller.roles).each(function(idx, role) {
                role.selected = hasUserAuth(user, role);
            });

            modal.html(template('app/templates/user-role/roles-modal', {
                roles: controller.roles
            }));

            modal.addAction('.btn-save', 'click', function() {
                modal.close();
            });

            modal.addAction('input[name=role]', 'change', function() {
                var _input = this;
                var roleId = _input.val();

                var action = _input.prop('checked') ? 'add' : 'remove';
                AuthorityService.user.role[action](userId, roleId).done(function(data) {
                    var role = controller.roles.objOfAttr('id', roleId);
                    if (_input.prop('checked')) {
                        user.roles.push(role);
                    } else {
                        $(user.roles).each(function(idx, item) {
                            if (item.id == roleId) {
                                user.roles.splice(idx, 1);
                                return false;
                            };
                        });
                    }
                    userListRender(controller);

                }).fail(function(error) {
                    Helper.alert(error);
                });
            });
        }
    };

    /**
     * 判断用户是否已拥有某个角色
     */
    function hasUserAuth(user, role) {
        var result = false;
        $(user.roles).each(function(idx, item) {
            if (item.id === role.id) {
                result = true;
                return false;
            }
        });
        return result;
    };

    module.exports = Controller;
});
