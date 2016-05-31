define(function(require, exports, module) {
    var baseController = require('baseController');
    var bC = new baseController();
    var template = require('template');
    var Helper = require('helper');
    var AuthorityService = require("AuthorityService");

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "role.list";
        _controller.actions = {
            remove: function() {
                var _btn = this;
                var roleId = +_btn.attr("data-value");
                var role = getRoleById(roleId);
                Helper.confirm("确定删除 [" + role.name + "] 权限么？", {
                    yesText: "删除",
                    noText: "又手贱了！"
                }, function() {
                    Helper.begin(_btn);
                    AuthorityService.role.remove(roleId).then(function(data) {
                        removeRoleById(roleId);
                        roleListRender();
                    })["catch"](function(error) {
                        Helper.alert(error);
                    }).done(function() {
                        Helper.end(_btn);
                    });
                });
            },
            openEditModal: function() {
                var _btn = this;
                var roleId = _btn.attr("data-value");

                openEditModal(_controller, roleId);
            },
            openOperationsEditModal: function() {
                var _btn = this;
                var roleId = _btn.attr("data-value");

                openOperationsEditModal(_controller, roleId);
            },
            saveRoleRights: function() {
                var _btn = this;
                var roleId = +_btn.attr("data-value");
                var role = getRoleById(roleId);
                var rights = [];
                var rights2 = [];
                _btn.parents(".modal").find("input:checkbox[name=right]:checked").each(function(idx, item) {
                    var code = $(item).val();
                    var right = getRightByCode(code);
                    rights.push(right);
                    rights2.push({
                        opCode: code
                    });
                });
                Helper.begin(_btn);
                AuthorityService.addRoleOperations(roleId, rights2).then(function(data) {
                    role.rights = rights;
                    closeModal(_btn);
                })["catch"](function(error) {
                    Helper.alert(error);
                }).done(function() {
                    Helper.end(_btn);
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

        this.roles = [];
        this.operations = [];

        this.render();
    };

    /**
     * 模板渲染函数
     */
    Controller.prototype.render = function() {
        var controller = this;
        var callback = controller.callback;

        Helper.globalRender(template('app/templates/role/list', {}));
        Helper.execute(callback);

        AuthorityService.role.getList().done(function(data) {
            controller.roles = data.result;
            roleListRender(controller);
        }).fail(function(error) {
            Helper.alert(error);
            $("#Results").html('');
        });
    };


    // 用户列表渲染
    function roleListRender(controller) {
        $("#Results").html(template("app/templates/role/rows", {
            roles: controller.roles,
            pagination: Helper.pagination(controller.roles.length, 100, 1)
        }));
    };

    // 打开角色设置层
    function openEditModal(controller, roleId) {
        var modal = Helper.modal({
            title: '角色编辑'
        });
        
        var role;
        if (roleId != '0') {
            role = controller.roles.objOfAttr('id', roleId);
        } else {
            role = {
                id: 0,
                name: "",
                remark: ""
            };
        }

        modal.html(template('app/templates/role/editor-modal', role));

        modal.addAction('.btn-save', 'click', function() {
            var _btn = this;

            var name = _btn.parents(".modal").find("#Name").val();
            var remark = _btn.parents(".modal").find("#Remark").val();
            if (Helper.validation.isEmpty(name)) {
                Helper.errorToast("角色名称不能为空！");
                return;
            }

            Helper.begin(_btn);
            var action = roleId != '0' ? AuthorityService.role.update(roleId, name, remark) : AuthorityService.role.add(name, remark);
            action.done(function(data) {
                controller.render();
                modal.close();
            }).fail(function(error) {
                Helper.alert(error);
            }).always(function() {
                Helper.end(_btn);
            });
        });
    };

    // 角色权限设置弹出层
    function openOperationsEditModal(controller, roleId) {
        var role = controller.roles.objOfAttr('id', roleId);

        if (!controller.operations.length) {
        	getOperations(openModal);
        }else {
        	openModal();
        }

        function getOperations(callback) {
            AuthorityService.operation.getList().done(function(data) {
                controller.operations = data.result;
                Helper.execute(callback);
            }).fail(function(error) {
                Helper.alert(error);
            });
        };

        function getRoleOperations(callback) {
            AuthorityService.role.operation.getList(roleId).done(function(data) {
                role.operations = data.result;
                Helper.execute(callback);
            }).fail(function(error) {
                Helper.alert(error);
            });
        };

        function openModal() {
            if (role.operations) {
                renderInit();
            } else {
                getRoleOperations(renderInit);
            }

            function renderInit() {
            	makeRoleOperations(controller, role.operations);

            	var modal = Helper.modal({
            		title: role.name + " 权限设置"
            	});

            	modal.html(template('app/templates/role/operations-editor-modal', {
            		operations: controller.operations
            	}));

            	modal.addAction('.btn-save', 'click', function() {
            		modal.close();
            	});

            	modal.addAction('input[name=operation]', 'change', function() {
            		var _input = this;
            		var operationId = _input.val();

            		var action = _input.prop('checked') ? 'add' : 'remove';
            		AuthorityService.role.operation[action](roleId, operationId).fail(function(error) {
            			Helper.alert(error);
            		});
            	});
            }
        };
    };

    /**
     * 根据角色判断权限是否已拥有某权限
     */
    function makeRoleOperations(controller, operations) {
        $(controller.operations).each(function(idx, item) {
            var code = item.code;
            item.selected = false;
            $(operations).each(function(idx2, item2) {
                if (item2.code == code) {
                    item.selected = true;
                    return false;
                }
            });
        });
    };

    module.exports = Controller;
});
