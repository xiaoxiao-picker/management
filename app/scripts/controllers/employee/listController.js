define(function(require, exports, module) {
	require("datetimepicker");

    var baseController = require('baseController');
    var bC = new baseController();
    var template = require('template');
    var Helper = require('helper');
    var EmployeeService = require("EmployeeService");

    var skip, limit, page, keyword;

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "employee.list";
        _controller.actions = {
            switchPage: function() {
                var _btn = this;
                page = +_btn.attr("data-value");

                renderList(_btn);
            },
            goPage: function() {
                var _btn = this;
                page = +_btn.parents("li").find("#PageInput").val() || 1;

                renderList(_btn);
            },
            openEmployeeModal: function() {
                var _btn = this;
                var employeeId = _btn.attr("data-value");

                openEditModal(employeeId);
            },
            search: function() {
                var _btn = this;

                page = 1;
                renderList(_btn);
            },
            remove: function() {
                var _btn = this;
                var employeeId = _btn.attr("data-value");

                Helper.confirm("确定删除该员工信息？", {
                    yesText: "删除",
                    noText: "哎哟，点错了"
                }, function() {
                    Helper.begin(_btn);
                    EmployeeService.remove(employeeId).done(function(data) {
                        renderList();
                    }).fail(function(error) {
                        Helper.alert(error);
                    }).always(function() {
                        Helper.end(_btn);
                    });
                });
            },
            openOrganizations: function() {
                var _btn = this;
                var employeeId = _btn.attr("data-value");

                openOrganizationsModal(employeeId);
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

        this.render();
    };

    /**
     * 模板渲染函数
     */
    Controller.prototype.render = function() {
        var controller = this;

        Helper.globalRender(template('app/templates/employee/list', {}));
        renderList();
    };

    function renderList(btn) {
        keyword = $("#KW_TITLE").val();

        skip = (page - 1) * limit;
        $("#Employees").html(template("app/templates/public/loading", {}));

        btn && Helper.begin(btn);
        EmployeeService.getList(skip, limit, keyword).done(function(data) {
            var employees = makeEmployees(data.result);
            var count = data.result.length;
            $("#Employees").html(template("app/templates/employee/list-rows", {
                employees: employees,
                pagination: Helper.pagination(count, limit, page)
            }));

        }).fail(function(error) {
            Helper.alert(error);
            $("#Employees").html('');
        }).always(function() {
            btn && Helper.end(btn);
        });
    };

    function makeEmployees(employees) {
        $.each(employees, function(idx, employee) {
            employee.contactInfo = employee.contactInfo ? $.parseJSON(employee.contactInfo) : {};
        });

        return employees;
    }

    // 初始化时间选择器控件
    function initDatetimepicker() {
        $('.datetimepicker').datetimepicker({
            format: 'yyyy/mm/dd',
            minView: 2,
            autoclose: true,
            language: 'zh-CN',
            pickerPosition: 'bottom-right'
        });
    };

    // 打开编辑层
    function openEditModal(employeeId) {
        var modal = Helper.modal({
            title: '员工编辑'
        });

        if (employeeId != '0') {
            EmployeeService.get(employeeId).done(function(data) {
                var contactInfo = data.result.contactInfo;
                data.result.contactInfo = contactInfo ? $.parseJSON(contactInfo) : {};
                renderInit(data.result);
            }).fail(function(error) {
                Helper.alert(error);
            });
        } else {
            renderInit({
                id: 0,
                contactInfo: {}
            });
        }

        function renderInit(employee) {
            modal.html(template('app/templates/employee/editor-modal', employee));
            initDatetimepicker();

            modal.addAction('.btn-save', 'click', function() {
                var _btn = this;
                var form = _btn.parents("form");
                var formData = Helper.getFormData(form);

                if (!validate(formData)) return;

                var data = {
                    name: formData.name,
                    contactInfo: JSON.stringify({
                        phoneNumber: formData.phoneNumber
                    })
                };
                if (formData.entryDate) {
                    data.entryDate = formData.entryDate;
                };

                Helper.begin(_btn);
                var action = employee.id ? EmployeeService.update(employee.id, data) : EmployeeService.add(data);
                action.done(function(data) {
                    renderList();
                    modal.close();
                }).fail(function(error) {
                    Helper.alert(error);
                }).always(function() {
                    Helper.end(_btn);
                });
            });
        }
    };

    function validate(employee) {
        if (Helper.validation.isEmpty(employee.name)) {
            Helper.errorToast('姓名不得为空');
            return false;
        };

        return true;
    }

    function openOrganizationsModal(employeeId) {
        var modal = Helper.modal({
            title: '管理组织列表',
            className: 'width-800'
        });

        function renderOrganizations() {
            EmployeeService.organization.getList(employeeId).done(function(data) {
                modal.html(template('app/templates/employee/organizations-modal', {
                    organizations: data.result,
                    pagination: Helper.pagination(data.result.length, 1000, 1)
                }));
            }).fail(function(error) {
                Helper.alert(error);
            });
        }
        renderOrganizations();

        modal.addAction('.btn-remove', 'click', function() {
            var _btn = this;
            var organizationId = _btn.attr("data-value");

            Helper.begin(_btn);
            Helper.confirm("确定删除该组织？", {
                yesText: "删除",
                noText: "哎哟，点错了"
            }, function() {
                EmployeeService.organization.remove(employeeId, organizationId).done(function(data) {
                    renderOrganizations();
                }).fail(function(error) {
                    Helper.alert(error);
                }).always(function() {
                    Helper.end(_btn);
                });
            });

        });

        modal.addAction('.btn-add-organizations', 'click', function() {
            var _btn = this;

            require.async("lib.OrganizationSelector", function(OrganizationSelector) {
                OrganizationSelector({
                    canEmpty: false,
                    limit: -1,
                    select: function(organizations) {
                        var modal = this;
                        addOrganizations(organizations, function() {
                            renderOrganizations();
                            modal.destroy();
                        });
                    }
                });
            });

            function addOrganizations(organizations, callback) {
                var organizationIds = [];
                $.each(organizations, function(idx, organization) {
                    organizationIds.push(organization.id);
                });
                EmployeeService.organization.add(employeeId, organizationIds.join(',')).done(function(data) {
                    Helper.execute(callback);
                }).fail(function(error) {
                    Helper.alert(error);
                });
            }
        });

    }

    module.exports = Controller;
});
