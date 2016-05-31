define(function(require, exports, module) {
	require("plugins/uploadify/jquery.uploadify");

	function uploadListenser(_input, url, session, options) {
		options = $.extend({
			fileObjName: "uploadfile",
			swf: 'plugins/uploadify/uploadify.swf',
			uploader: url,
			onUploadStart: function(file) {
				//start upload 
				var start = options.start;
				start && $.isFunction(start) && start(file);
			},
			onUploadSuccess: function(file, data, response) {
				var success = options.success;
				success && $.isFunction(success) && success(file, data, response);
			},
			onUploadError: function(file, errorCode, errorMsg, errorString) {
				var error = options.error;
				error && $.isFunction(error) && error(file, errorCode, errorMsg, errorString);
			},
			onUploadComplete: function(file) {
				var complate = options.complate;
				complate && $.isFunction(complate) && complate(file);
				_input.val('');
			},
			onUploadProgress: function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
				var progress = options.progress;
				progress && $.isFunction(progress) && progress(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal);
			}
		}, options);
		_input.uploadify(options);
	}

	exports.image = function($input, groupId, session, options) {
		options = $.extend({
			fileSizeLimit: '2MB',
			buttonText: '本地上传',
			fileTypeExts: "*.jpg;*.jpeg;*.gif;*.png",
			width: 100,
			multi: true,
			queueSizeLimit: 10,
			buttonClass: "btn btn-xx-green btn-image-uploader",
			formData: {
				session: session,
				classId: groupId
			}
		}, options);
		uploadListenser($input, "/api-interior/attach/IMAGE/upload", session, options);
	};
});