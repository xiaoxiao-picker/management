// config file
seajs.config({

	// 别名配置
	alias: {
		"baseController": "scripts/baseController",
		"template": "scripts/public/template",

		// factory
		"factory.application": "scripts/factory/Application",
		"factory.user": "scripts/factory/user",

		//custom plugins
		"toast": "scripts/public/Ly.toast",
		"alert": "scripts/public/Ly.alert",
		"modal": "scripts/public/Ly.modal",

		"validation": "scripts/public/validation",

		"array": "scripts/public/array",
		"browser": "scripts/public/browser",
		"fileupload": "scripts/lib/ajaxFileUpload",
		"uploadify": "scripts/lib/uploadify",
		"flash": "scripts/lib/flash",
		"dateCompare": "scripts/lib/dateCompare",
		
		"loader": "scripts/public/loader",
		"qrcode": "scripts/public/QRCode",
		"helper": "scripts/public/helper",
		"render": "scripts/public/render",
		"ajaxhandler": "scripts/public/ajax",
		"date": "scripts/public/date",
		"generateQRCode": "scripts/public/generateQRCode",


		"lib.SchoolSelector": "scripts/lib/SchoolSelector",
		"lib.OrganizationSelector": "scripts/lib/OrganizationSelector",
		"lib.UserSelector": "scripts/lib/UserSelector",
		"lib.ImageSelector": "scripts/lib/ImageSelector",
		"lib.ImageCrop": "scripts/lib/ImageCrop",
		"lib.ImageModal": "scripts/lib/ImageModal",
		// "lib.Pagination": "scripts/lib/Pagination",

		"ueditor": "scripts/public/ueditor",
		"Jcrop.min": "plugins/jcrop/js/jquery.Jcrop.min",
		"Jcrop.min.css": "plugins/jcrop/css/jquery.Jcrop.min.css",
		"datetimepicker": "plugins/datetimepicker/bootstrap-datetimepicker",



		// services
		"PublicService": "scripts/services/PublicService",
		"UserService": "scripts/services/UserService",
		"AuthorityService": "scripts/services/AuthorityService",
		"SchoolService": "scripts/services/SchoolService",
		"WalletService": "scripts/services/WalletService",
		"MessageService": "scripts/services/MessageService",
		"MemberService": "scripts/services/MemberService",
		"OrganizationService": "scripts/services/OrganizationService",
		"EventService": "scripts/services/EventService",
		"ArticleService": "scripts/services/ArticleService",
		"LogService": "scripts/services/LogService",
		"VoteService": "scripts/services/VoteService",
		"TicketService": "scripts/services/TicketService",
		"WechatService": "scripts/services/WechatService",
		"ResourceService": "scripts/services/ResourceService",
		"TokenService": "scripts/services/TokenService",
		"EmployeeService": "scripts/services/EmployeeService",

		"sysconfig": "scripts/configs/system"
	},

	// 路径配置
	paths: {

	},

	// 变量配置
	vars: {
		"locale": "zh-cn",
		version: (Date.now && Date.now()) || new Date().getTime()
	},

	// 映射配置
	map: [
		[".js", ".js?v=2.1.10"]
		// 增加时间戳,避免浏览器缓存
	],

	// 预加载项
	preload: [],

	// 调试模式
	debug: true,

	// Sea.js 的基础路径
	base: "/",

	// 文件编码
	charset: "utf-8"
});;