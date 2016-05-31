define(function(require, exports, module) {
    var baseController = require('baseController');
    var bC = new baseController();
    var template = require('template');
    var Helper = require('helper');
    var WalletService = require("WalletService");

    var temp, skip, limit, page;

    var Controller = function() {
        var _controller = this;
        _controller.namespace = "wallet.accounts";
        _controller.actions = {
            switchPage: function() {
                var _btn = this;
                page = +_btn.attr("data-value");

                accountsRender();
            },
            goPage: function() {
                var _btn = this;
                page = +_btn.parents("li").find("#PageInput").val() || 1;

                accountsRender();
            },
            approve: function() {
                var _btn = this;
                var accountId = _btn.attr("data-value");

                Helper.confirm("是否确认通过该账号申请？", {}, function() {
                    Helper.begin(_btn);
                    WalletService.account.approve(accountId).done(function(data) {
                        Helper.successToast("操作成功！");
                        accountsRender();
                    }).fail(function(error) {
                        Helper.alert(error);
                    }).always(function() {
                        Helper.end(_btn);
                    });
                });
            },
            reject: function() {
                var accountId = this.attr("data-value");

                var modal = Helper.modal({
                    title: '拒绝申请'
                });
                modal.html(template('app/templates/public/single-input-modal', {
                    name: '拒绝原因'
                }));

                modal.addAction('.btn-save', 'click', function() {
                    var btn = this;
                    var text = btn.parents(".modal").find(".input").val();

                    if (Helper.validation.isEmpty(text)) {
                        Helper.errorToast('请输入拒绝原因');
                        return;
                    };

                    Helper.confirm("是否确认拒绝该账号申请？", {}, function() {
                        Helper.begin(btn);
                        WalletService.account.reject(accountId, text).done(function(data) {
                            Helper.successToast("操作成功！");
                            modal.close();
                            accountsRender();
                        }).fail(function(error) {
                            Helper.alert(error);
                        }).always(function() {
                            Helper.end(btn);
                        });
                    });
                });
            },
            showInfo: function() {
                var accountId = this.attr("data-value");

                var modal = Helper.modal({
                    title: '账号详情'
                });
                WalletService.account.get(accountId).done(function(data) {
                    var account = data.result;
                    account.photos = account.photos.split(',');
                    modal.html(template('app/templates/wallet/account/info-modal', account));
                }).fail(function(error) {
                    Helper.alert(error);
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
        skip = 0;

        logs = [];
        this.render();
    };

    /**
     * 模板渲染函数
     */
    Controller.prototype.render = function() {

        Helper.globalRender(template('app/templates/wallet/account/list', {}));
        accountsRender();

    };

    function accountsRender() {
        skip = (page - 1) * limit;
        $("#AccountContainer").html(template("app/templates/public/loading", {}));

        WalletService.account.getList(skip, limit).done(function(data) {
            logs = data.result.data;
            var count = data.result.total;
            $("#AccountContainer").html(template("app/templates/wallet/account/rows", {
                logs: logs,
                pagination: Helper.pagination(count, limit, page)
            }));
        }).fail(function(error) {
            Helper.alert(error);
            $("#AccountContainer").html('');
        });
    }

    module.exports = Controller;
});
