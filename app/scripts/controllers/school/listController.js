define(function(require, exports, module) {
    var baseController = require('baseController');
    var bC = new baseController();
    var template = require('template');
    var Helper = require('helper');
    var SchoolService = require("SchoolService");
    var Pagination = require("lib.Pagination");

    var skip, limit, page;

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "school.list";
        _controller.actions = {
            openSchoolEditModal: function() {
                var _btn = this;
                var schoolId = _btn.attr("data-value");

                openEditModal(_controller, schoolId);
            },
            search: function() {
                var _btn = this;

                page = 1;
                schoolListRender(_controller, _btn);
            },
            remove: function() {
                var _btn = this;
                var schoolId = _btn.attr("data-value");

                Helper.confirm("确定删除该学校信息？", {
                    yesText: "删除",
                    noText: "哎哟，点错了"
                }, function() {
                    Helper.begin(_btn);
                    SchoolService.remove(schoolId).done(function(data) {
                        if (count == skip + 1)
                            page--;
                        schoolListRender(_controller);
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

        limit = +Helper.param.search("limit") || 30;
        page = +Helper.param.search("page") || 1;

        this.render();
    };

    /**
     * 模板渲染函数
     */
    Controller.prototype.render = function() {
        var controller = this;
        var callback = controller.callback;

        Helper.globalRender(template('app/templates/school/list', {}));

        schoolListRender(controller);
    };

    function schoolListRender(controller, btn) {
        var kw_province = $("#KW_Province").val();
        var kw_school = $("#KW_School").val();

        skip = (page - 1) * limit;
        $("#SchoolContainer").html(template("app/templates/public/loading", {}));

        btn && Helper.begin(btn);
        SchoolService.getList(kw_school, kw_province, skip, limit).done(function(data) {
            var schools = data.result.data;
            count = data.result.total;

            $("#SchoolContainer").html(template("app/templates/school/list-results", {
                schools: schools,
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
        }).always(function() {
            btn && Helper.end(btn);
        });
    };

    // 打开编辑层
    function openEditModal(controller, schoolId) {
        var modal = Helper.modal({
            title: '学校编辑'
        });

        if (schoolId != '0') {
            SchoolService.get(schoolId).done(function(data) {
                renderInit(data.result);
            }).fail(function(error) {
                Helper.alert(error);
            });
        } else {
            var school = {
                id: 0,
                country: '中国'
            };
            renderInit(school);
        }

        function renderInit(school) {
            modal.html(template('app/templates/school/editor-modal', school));

            modal.addAction('.btn-save', 'click', function() {
                var _btn = this;
                var form = _btn.parents("form");
                var data = Helper.getFormData(form);

                if (!validate(data)) return;

                Helper.begin(_btn);
                var action = school.id ? SchoolService.update(school.id, data) : SchoolService.add(data);
                action.done(function(data) {
                    schoolListRender(controller);
                    modal.close();
                }).fail(function(error) {
                    Helper.alert(error);
                }).always(function() {
                    Helper.end(_btn);
                });
            });
        }
    };

    function validate(school) {
        if (Helper.validation.isEmpty(school.country)) {
            Helper.errorToast('国家不得为空');
            return false;
        };
        if (Helper.validation.isEmpty(school.province)) {
            Helper.errorToast('省份不得为空');
            return false;
        };
        if (Helper.validation.isEmpty(school.name)) {
            Helper.errorToast('学校名称不得为空');
            return false;
        };

        return true;
    }

    module.exports = Controller;
});
