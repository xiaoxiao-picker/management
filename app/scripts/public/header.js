define(function(require, exports, module) {
	var Helper = require("helper");
    module.exports = {
        goHome: function() {
            Helper.jump('#');
        },
        logout: function() {
            Helper.confirm("是否确认退出账号？", {}, function() {
                Application.logout(function() {
                    window.location.href = 'login.html';
                });
            });
        }
    };

});
