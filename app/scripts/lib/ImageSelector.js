/**
 *	图片库选择器
 */
define(function(require, exports, module) {
	var Helper = require("helper");
	var uploader = require("scripts/lib/uploadify");
	var flash = require("scripts/lib/flash");
	var ResourceService = require('ResourceService');
	var PublicService = require("PublicService");
	var template = require("template");

	var boxTemp = "app/templates/public/image-selector/selector";
	var groupTemp = "app/templates/public/image-selector/group";
	var imagesTemp = "app/templates/public/image-selector/images";

	var skip, Groups, CurGroup;
	var session = Application.getSession();

	var ImageSelector = function(options) {
		options = $.extend({
			title: '选择图片',
			className: 'image-selector-modal width-800',
			limit: 15,
			optionLimit: 1, //选项限制个数，等于－1是为无限个
			systemCode: "",
			cutButton: true, //是否允许剪切
			cleanButton: false, //是否允许空图
			crop: { //剪切配置信息
				preview: false,
				previewWidth: 100,
				previewHeight: 100,
				borderRadius: false
			},
			actions: {
				'#Group h5': {
					event: 'click',
					fnc: packup
				},
				'#Group .sub-group >li': {
					event: 'click',
					fnc: switchGroup
				},
				'#Images .image-box': {
					event: 'click',
					fnc: selectedPicture
				},
				'.btn-cut': {
					event: 'click',
					fnc: crop
				},
				'.btn-confirm': {
					event: 'click',
					fnc: confirm
				},
				'.btn-empty': {
					event: 'click',
					fnc: clean
				},
				'.btn-load-more': {
					event: 'click',
					fnc: function(selector) {
						renderMoreImages(selector, $(this));
					}
				}
			}
		}, options, true);

		var modal = Helper.modal(options);
		modal.images = [];
		render(modal);

		Groups = [];
		CurGroup = {};

		return modal;
	}

	function render(selector) {
		if (!flash.checker().hasFlash) {
			Helper.alert("上传图片功能需要您安装flash！");
		}
		var systemCode = selector.options.systemCode;
		
		ResourceService.image.group.getList().done(function(data) {
			Groups = data.result;

			var systemGroups = [],
				customGroups = [];
			$.each(Groups, function(idx, group) {
				if (group.type == "SYSTEM") {
					systemGroups.push(group);
				} else {
					customGroups.push(group);
				}
			});
			customGroups.sort(function compare(a, b) {
				return a.id - b.id;
			});

			CurGroup = systemCode ? systemGroups[systemGroups.indexOfAttr('code', systemCode)] : customGroups[0];

			selector.html(template(boxTemp, {
				title: selector.options.title,
				systemGroups: systemGroups,
				customGroups: customGroups,
				curGroupId: CurGroup.id,
				optionLimit: selector.options.optionLimit > -1 ? selector.options.optionLimit : '无限',
				canCrop: selector.options.cutButton,
				canEmpty: selector.options.cleanButton
			}));

			uploadListenser(selector);
			renderImages(selector);

		}).fail(function(error) {
			Helper.alert(error);
		});
	}

	function renderImages(selector) {
		skip = 0;
		selector.box.find(".images-wrapper").html(template("app/templates/public/loading", {}));
		selector.box.find(".list-empty").addClass('hide');
		selector.box.find(".more-wrapper").addClass('hide');

		//如果是系统图库，隐藏本地上传
		selector.box.find(".box-header")[CurGroup.type == "SYSTEM" ? 'addClass' : 'removeClass']('hide');

		ResourceService.image.getList(CurGroup.id, skip, selector.options.limit).done(function(data) {
			var pictures = data.result.data;
			var count = data.result.total;
			var hasMore = count > skip + pictures.length;

			skip = pictures.length;

			selector.box.find(".images-wrapper").html(template(imagesTemp, {
				pictures: pictures,
				count: count,
				code: CurGroup.code || ""
			}));

			if (!count) {
				selector.box.find(".list-empty").removeClass('hide');
			}
			if (hasMore) {
				selector.box.find(".more-wrapper").removeClass('hide');
			}

		}).fail(function(error) {
			Helper.alert(error);
		});
	}

	/**
	 *	渲染更多图片列表
	 */
	function renderMoreImages(selector, btn) {

		btn && Helper.begin(btn);
		ResourceService.image.getList(CurGroup.id, skip, selector.options.limit).done(function(data) {
			var pictures = data.result.data;
			var count = data.result.total;
			var hasMore = count > skip + pictures.length;

			skip += pictures.length;

			selector.box.find(".images-wrapper").append(template(imagesTemp, {
				pictures: pictures,
				count: count,
				code: CurGroup.code || ""
			}));

			if (hasMore) {
				selector.box.find(".more-wrapper").removeClass('hide');
			} else {
				selector.box.find(".more-wrapper").addClass('hide');
			}

		}).fail(function(error) {
			Helper.alert(error);
		}).always(function() {
			btn && Helper.end(btn);
		});
	}

	function uploadListenser(selector) {
		var $input = selector.box.find("#Modal_ImageUpload");

		var fileCount;
		uploader.image($input, CurGroup.id||'', session, {
			onDialogClose: function(queueData) {
				fileCount = queueData.filesSelected;
			},
			onUploadStart: function(file) {
				var imagesbox = selector.box.find(".images-wrapper");

				//设置上传按钮禁用
				$input.uploadify("disable", true);
				$input.uploadify("settings", 'buttonText', '上传中&nbsp;(' + ++file.index + '/' + fileCount + ')');

				//添加一项并显示加载中
				var children = imagesbox.children(".wrapper");
				if (children.length) {
					imagesbox.prepend(template(imagesTemp, {
						pictures: [{
							name: file.name
						}],
						count: 1
					}));
				} else {
					selector.box.find(".list-empty").addClass('hide');
					imagesbox.html(template(imagesTemp, {
						pictures: [{
							name: file.name
						}],
						count: 1
					}));
				}
				var children = imagesbox.children(".wrapper");
				$(children[0]).find(".img-wrapper").addClass('loading');

				//对应分组的图片数
				var curGroup = selector.box.find("#Modal_Group_" + CurGroup.id + " .group-count");
				var groupCount = +curGroup.text();
				curGroup.text(++groupCount);
			},
			onUploadProgress: function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {

			},
			onUploadSuccess: function(file, data, response) {
				var imagesbox = selector.box.find(".images-wrapper");
				var children = imagesbox.children(".wrapper");

				data = $.parseJSON(data);
				if (data.status == "OK") {
					Helper.successToast("图片上传成功");
					var picture = data.result;
					$(children[0]).replaceWith(template(imagesTemp, {
						pictures: [picture],
						count: 1
					}));
					skip++;
				} else {
					$(children[0]).remove();
					//对应分组的图片数
					var curGroup = selector.box.find("#Modal_Group_" + CurGroup.id + " .group-count");
					var groupCount = +curGroup.text();
					curGroup.text(--groupCount);

					Helper.alert(data.message);
				}

			},
			onUploadError: function(file, errorCode, errorMsg, errorString) {
				Helper.alert("图片 " + file.name + " 上传失败：" + errorString);
				var imagesbox = selector.box.find(".images-wrapper");
				var children = imagesbox.children(".wrapper");
				$(children[0]).remove();
			},
			onQueueComplete: function(queueData) {
				//设置上传按钮可用
				$input.uploadify("disable", false);
				$input.uploadify("settings", 'buttonText', '本地上传');
			}
		});
	};

	//图库收起展开
	function packup(selector) {
		var subGroup = $(this).parents('li').find('.sub-group');
		if ($(subGroup).hasClass('packup')) {
			$(subGroup).removeClass('packup');
		} else {
			$(subGroup).addClass('packup');
		}
	};

	//分组选择
	function switchGroup(selector) {
		selector.images = [];
		var _btn = $(this);
		var groupId = _btn.attr("data-value");

		if (CurGroup.id != groupId) {
			CurGroup.id = groupId;
			CurGroup.type = _btn.attr("data-type");
			CurGroup.code = _btn.attr("data-code");

			selector.box.find("#Group .sub-group >li").removeClass('active');
			_btn.addClass('active');

			renderImages(selector);
		};
	};

	//图片选择
	function selectedPicture(selector) {
		selector.images = [];
		var imagebox = $(this);

		if (imagebox.find('.img-wrapper').hasClass('loading')) {
			return;
		};

		if (selector.options.optionLimit == 1) { //单选
			selector.box.find('.image-box.active').not(imagebox).removeClass("active");
			imagebox.toggleClass("active");
		} else { //多选			
			if (!imagebox.hasClass("active") && selector.images.length >= selector.options.optionLimit) {
				return Helper.errorToast("您最多可选" + selector.images.length + "张图片！");
			}
			imagebox.toggleClass("active");
		}

		selector.box.find('.image-box.active').each(function(idx, imagebox) {
			selector.images.push($(imagebox).attr("data-value"));
		});
		selector.box.find("#OptionCount").text(selector.images.length);
	};

	//剪切
	function crop(selector) {
		if (!selector.images.length) {
			Helper.errorToast("请先选择一张图片");
			return;
		};
		//调用图片剪切插件
		require.async("lib.ImageCrop", function(ImageCrop) {
			ImageCrop(selector.images[0], {
				title: "剪切图片",
				preview: selector.options.crop.preview,
				orientation: selector.options.crop.orientation,
				jcrop: selector.options.crop,
				cut: function(imageUrl) {
					var imagecrop = this;
					imagecrop.destroy();
					selector.options.cut && $.isFunction(selector.options.cut) && selector.options.cut.call(selector, imageUrl);
				}
			});
		});
	};

	//使用原图
	function confirm(selector) {
		if (!selector.images.length) {
			Helper.errorToast("请先选择一张图片");
			return;
		};
		var images = [];
		var completeLength = 0;
		var btn = $(this);
		Helper.begin(btn);
		$(selector.images).each(function(idx, imageURL) {
			var image = new Image();
			image.src = imageURL;
			image.onload = function() {
				var width = image.width;
				var height = image.height;
				var key = getImageKey(imageURL);
				PublicService.imageUpload2({
					key: key,
					x1: 0,
					y1: 0,
					w: width,
					h: height
				}).done(function(data) {
					images.push(data.result);
				}).fail(function(error) {
					Helper.errorToast(error);
				}).always(function() {
					completeLength++;
					if (completeLength == selector.images.length) {
						Helper.end(btn);
						selector.options.choose && $.isFunction(selector.options.choose) && selector.options.choose.call(selector, images);
					}
				});
			};
		});

	};

	//空图
	function clean(selector) {
		selector.options.clean && $.isFunction(selector.options.clean) && selector.options.clean.call(selector);
	};

	function getImageKey(url) {
		if (!url) return null;
		var Reg = new RegExp("http\\:\\/\\/img\\.xiaoxiao\\.la[\\/]+([\\w\\d-]+\\.[\\w]+)[\\@]?");
		var result = url.match(Reg);
		return result ? result[1] : null;
	}

	module.exports = ImageSelector;
});