define({
    /* =============数据统计============== */
    "index": {
        controller: "static/indexController"
    },
    "log/list": {
        controller: "log/listController",
        menu: "LOGS"
    },
    "log/info": {
        controller: "log/infoController",
        menu: "LOGS"
    },

    /* =============企业资料============== */
    "employee/list": {
        controller: "employee/listController",
        menu: "EMPLOYEES"
    },

    /* =============数据展示============== */
    "organization/list": {
        controller: "organization/listController",
        menu: "ORGANIZATIONS"
    },
    "user/list": {
        controller: "user/listController",
        menu: "USERS"
    },
    "event/list": {
        controller: "event/listController",
        menu: "EVENTS"
    },
    "article/list": {
        controller: "article/listController",
        menu: "ARTICLES"
    },
    "vote/list": {
        controller: "vote/listController",
        menu: "VOTES"
    },
    "ticket/list": {
        controller: "ticket/listController",
        menu: "TICKETS"
    },

    /* =============功能管理============== */
    "wallet/money/list": {
        controller: "wallet/money/listController",
        menu: "WALLET"
    },
    "wallet/account/list": {
        controller: "wallet/account/listController",
        menu: "WALLET"
    },
    "message/send": {
    	controller: "message/editController",
        menu: "MESSAGE"
    },
    "token/check": {
        controller: "token/editController",
        menu: "TOKEN"
    },

    /* =============数据维护============== */
    "advertisement/edit": {
        controller: "advertisement/editController",
        menu: "ADVERT_CONFIG"
    },
    "image/list": {
        controller: "image/listController",
        menu: "IMAGES"
    },
    "school/list": {
        controller: "school/listController",
        menu: "SCHOOLS"
    },

    /* =============权限管理============== */
    "user/roles": {
        controller: "user-role/listController",
        menu: "USERROLES"
    },
    "roles": {
        controller: "role/listController",
        menu: "ROLES"
    },
    "authoritys": {
        controller: "authority/listController",
        menu: "AUTHORITYS"
    },
});
