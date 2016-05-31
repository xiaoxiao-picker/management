define(function(require, exports, module) {
	var Helper = require("helper");
	module.exports = {
        foldMenu: function() {
			$(this).parent().toggleClass("active");
		}
    };
});