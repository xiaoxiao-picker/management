define(function(require, exports, module) {
	var Helper = require("helper");
	module.exports = {
		checkUser: function() {
			var userId = this.attr("data-user-id");
			require.async("lib.UserModal", function(UserModal) {
				UserModal(userId);
			});
		},
		checkQRCode: function() {
			var name = this.attr("data-name") || "";
			var url = this.attr("data-url") || "";
			if (!url) return Helper.alert("地址为空，滚去看代码！！！");

			require.async("lib.ImageModal", function(ImageModal) {
				ImageModal(url, {
					title: name + " 二维码",
					width: "300px",
					description: "扫描二维码进入[ " + name + " ]页面"
				});
			});
		}
	};
});