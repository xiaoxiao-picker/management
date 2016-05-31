define(function(require, exports, module) {
	function globalRender(html, callback) {
		$("#RootContainer").html(html);
		callback && $.isFunction(callback) && callback();
		$("#FrontLoading").animate({
			//"opacity": "0",
			top: "-100%"
		}, 200, function() {
			$(this).hide();
		});
	};
	module.exports = globalRender;

	function smartGlobalRender() {};
});