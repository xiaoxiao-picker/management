define(function(require, exports, module) {
	module.exports = function(url, session) {
		return "/api-interior/barcode/generate?value=" + encodeURIComponent(url) + "&session=" + session;
	};
});