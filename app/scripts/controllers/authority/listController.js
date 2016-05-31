define(function(require, exports, module) {
    var baseController = require('baseController');
    var bC = new baseController();
    var template = require('template');
    var Helper = require('helper');
    var AuthorityService = require("AuthorityService");

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "authority.list";
        _controller.actions = {
            openEditModal: function() {
                var _btn = this;
                var code = _btn.attr("data-value");
                openEditModal(_controller, code);
            },
            remove: function() {
                var _btn = this;
                var code = _btn.attr("data-value");
                var operation = _controller.operations.objOfAttr('code', code);

                Helper.confirm("确定删除 [" + operation.name + "] 权限么？", {
                    yesText: "删除",
                    noText: "哎哟，点错了"
                }, function() {
                    Helper.begin(_btn);
                    AuthorityService.operation.remove(code).done(function(data) {
                        renderOperations(_controller);
                    }).fail(function(error) {
                        Helper.alert(error);
                    }).always(function() {
                        Helper.end(_btn);
                    });
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

        this.operations = [];
        this.render();
    };

    /**
     * 模板渲染函数
     */
    Controller.prototype.render = function() {
        var controller = this;
        var callback = controller.callback;

        Helper.globalRender(template('app/templates/authority/list', {}));
        Helper.execute(callback);

        renderOperations(controller);

    };

    function renderOperations(controller) {
        AuthorityService.operation.getList().done(function(data) {
            controller.operations = data.result;
            $("#Results").html(template("app/templates/authority/rows", {
                operations: controller.operations,
                pagination: Helper.pagination(controller.operations.length, 100, 1)
            }));
        }).fail(function(error) {
            Helper.alert(error);
            $("#Results").html('');
        });
    }

    // 打开权限编辑层
    function openEditModal(controller, code) {
        var modal = Helper.modal({
            title: '权限编辑'
        });

        if (code) {
            AuthorityService.operation.get(code).done(function(data) {
                renderInit(data.result, 'true');
            }).fail(function(error) {
                Helper.alert(error);
            });
        } else {
            var operation = {};
            renderInit(operation, 'false');
        }

        function renderInit(operation, isUpdate) {
            operation.isUpdate = isUpdate;

            modal.html(template('app/templates/authority/editor-modal', operation));

            modal.addAction('.btn-save', 'click', function(modal) {
                var _btn = this;
                var isUpdate = _btn.attr("data-value");
                var code = _btn.parents(".modal").find("#Code").val();
                var name = _btn.parents(".modal").find("#Name").val();
                var remark = _btn.parents(".modal").find("#Remark").val();

                if (Helper.validation.isEmpty(code)) {
                    Helper.errorToast("权限唯一标记不能为空！");
                    return;
                }
                if (Helper.validation.isEmpty(name)) {
                    Helper.errorToast("权限名称不能为空！");
                    return;
                }

                Helper.begin(_btn);
                AuthorityService.operation[isUpdate == "true" ? 'update' : 'add'](code, name, remark).done(function(data) {
                    renderOperations(controller);
                    modal.close();
                }).fail(function(error) {
                    Helper.alert(error);
                }).always(function() {
                    Helper.end(_btn);
                });
            });
        }

    };

    module.exports = Controller;
});
