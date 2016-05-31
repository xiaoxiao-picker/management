 define(function(require, exports, module) {
     require("datetimepicker");

     var baseController = require('baseController');
     var bC = new baseController();
     var template = require('template');
     var Helper = require('helper');
     var LogService = require("LogService");
     var dateCompare = require("dateCompare");

     var logConfig = require('scripts/configs/log.js')

     var skip, limit, page, userId;

     var Controller = function() {
         var _controller = this;
         _controller.namespace = "log.info";
         _controller.actions = {
             switchPage: function() {
                 var _btn = this;
                 page = +_btn.attr("data-value");

                 renderLogs(_controller, _btn);
             },
             goPage: function() {
                 var _btn = this;
                 page = +_btn.parents("li").find("#PageInput").val() || 1;
                 
                 renderLogs(_controller, _btn);
             },
             selectUser: function() {
                 var $input = this;
                 require.async("lib.UserSelector", function(UserSelector) {
                     UserSelector({
                         select: function(user) {
                             var modal = this;
                             userId = user.id;
                             $input.val(user.name);
                             modal.destroy();
                         }
                     });
                 });
             },
             search: function() {
                 var _btn = this;

                 page = 1;
                 renderLogs(_controller, _btn);
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
         organizationId = Helper.param.search("oid");

         userId = '';
         this.logs = [];
         this.count = 0;
         this.render();
     };

     /**
      * 模板渲染函数
      */
     Controller.prototype.render = function() {
         var controller = this;

         Helper.globalRender(template('app/templates/log/info', {
             targets: logConfig.targets,
             operations: logConfig.operations
         }));
         initDatetimepicker();
         renderLogs(controller);
     };

     function renderLogs(controller, btn) {
         var options = {
         	organizationIds: organizationId
         };

         if (!Helper.validation.isEmpty(userId)) {
             options.userIds = userId;
         };

         var targetType = $(".target-type").val();
         if (!Helper.validation.isEmpty(targetType)) {
             options.targetType = targetType;
         };
         var operationType = $(".operation-type").val();
         if (!Helper.validation.isEmpty(operationType)) {
             options.operationType = operationType;
         };

         var startDate = $("#StartDate").val();
         var endDate = $("#EndDate").val();
         if (!Helper.validation.isEmpty(startDate) && !Helper.validation.isEmpty(endDate)) {
             options.startDate = new Date(startDate).getTime();
             options.endDate = new Date(endDate).getTime();
         };

         skip = (page - 1) * limit;
         $("#Results").html(template("app/templates/public/loading", {}));

         btn && Helper.begin(btn);
         LogService.getList(skip, limit, options).done(function(data) {
             controller.logs = makeLogs(data.result.data);
             controller.count = data.result.total;
             $("#Results").html(template("app/templates/log/info-rows", {
                 logs: controller.logs,
                 pagination: Helper.pagination(controller.count, limit, page)
             }));

         }).fail(function(error) {
             Helper.alert(error);
             $("#Results").html('');
         }).always(function() {
             btn && Helper.end(btn);
         });
     };

     function makeLogs(logs) {
         $.each(logs, function(idx, log) {
             log.targetName = logConfig.targets.objOfAttr('type', log.targetType).name;
             log.operationName = logConfig.operations.objOfAttr('type', log.operationType).name;
         });

         return logs;
     }

     // 初始化时间选择器控件
     function initDatetimepicker() {
         $('.datetimepicker').datetimepicker({
             format: 'yyyy/mm/dd hh:ii',
             autoclose: true,
             language: 'zh-CN',
             pickerPosition: 'bottom-right'
         }).on("changeDate", function(evt) {
             var _input = $(this);
             var date = evt.date.valueOf();
             dateCompare.compare(_input, Helper.errorToast);
         });
     };

     module.exports = Controller;
 });
