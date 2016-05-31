define(function(require, exports, module) {
	var template = require("scripts/template");
	
	// 时间格式转化
	template.helper('makedate', function(d, format) {
		format = format ? format : "yyyy-MM-dd";
		return d ? new Date(parseInt(d)).Format(format) : "";
	});

	// 图片过滤器
	template.helper("imageUrl", function(imageUrl, param, errorImage) {
		return imageUrl ? (imageUrl + param) : (errorImage || "");
	});

	template.helper("index", function(i, page, limit) {
		i = (+i);
		return ((i + 1) + (page - 1) * limit) < 10 ? "0" + ((i + 1) + (page - 1) * limit) : ((i + 1) + (page - 1) * limit);
	});

	module.exports = template;
});