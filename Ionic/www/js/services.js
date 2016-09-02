'use strict';

angular.module('Recite.services', ['ngResource'])

// .constant("baseURL", "https://(your ip):3443/")
.constant("baseURL", "https://localhost:3443/")
.constant("default_lang", "en")

.filter('wordLimitFilter', function() {
    return function(words, num) {
        if (words.length <= num)
            return words;
        var rs = [];
        for (var i = 0; i < 5; i++)
            rs.push(words[i]);
        return rs;
    }
})

.factory('$localStorage', function($window) {
    return {
        store: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
})

.factory('cloudRecordFactory', function($resource, baseURL) {
    var recFac = {};

    recFac.upload_info = function(info) {
        $resource(baseURL + "users/info", null, { 'update': { method: 'PUT'} }).update(info, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };

    recFac.upload_mRec = function(rec) {
        $resource(baseURL + "records/m", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_tRec = function(rec) {
        $resource(baseURL + "records/t", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_taRec = function(rec) {
        $resource(baseURL + "records/ta", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_tpRec = function(rec) {
        $resource(baseURL + "records/tp", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_trRec = function(rec) {
        $resource(baseURL + "records/tr", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };
    recFac.upload_mtRec = function(rec) {
        $resource(baseURL + "records/mt", null, { 'update': { method: 'PUT'} }).update(rec, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };

    recFac.upload_allRec = function(records) {
        $resource(baseURL + "records/all", null, { 'update': { method: 'PUT'} }).update(records, function(res) {
            console.log(res.body);
        }, function(res){
            console.log(res.data.err)
        });
    };

    return recFac;
})

.factory('localRecordFactory', ['$localStorage', 'cloudRecordFactory', function($localStorage, cRecFac) {
    var recFac = {};
    var records = {};

    records.num = $localStorage.get('num', 5);
    records.words = $localStorage.getObject('words', '[]');
    records.types = $localStorage.getObject('types', '[]');
    records.archived = $localStorage.getObject('archived', '[]');

    recFac.getAllRecords = function() {
        return records;
    };

    recFac.getWords = function() {
        return records.words;
    };
    recFac.getTypes = function() {
        return records.types;
    };
    recFac.getArchived = function() {
        return records.archived;
    };
    recFac.getNum = function() {
        return records.num;
    };

    recFac.updateNum = function(num) {
        records.num = num;
        $localStorage.storeObject('num', num);
    };
    recFac.updateWords = function(words) {
        records.words = words;
        $localStorage.storeObject('words', words);
    };
    recFac.updateTypes = function(types) {
        records.types = types;
        $localStorage.storeObject('types', types);
    };
    recFac.updateArchived = function(archived) {
        records.archived = archived;
        $localStorage.storeObject('archived', archived);
    };

    recFac.delById = function(id, rec, type) {
        for (var i = rec.length - 1; i >= 0; i--) {
            if (i == id) {
                rec.splice(i, 1);
                break;
            }
        }
        for (var j = rec.length - 1; j >= 0; j--) {
            if (j >= id)
                rec[j].id = j;
        }
        if (type)
            $localStorage.storeObject(type, rec);
    };
    recFac.delFromWords = function(id) {
        recFac.delById(id, records.words, "words");
    };
    recFac.delFromArchived = function(id) {
        recFac.delById(id, records.archived, "archived");
    };

    recFac.editFromWords = function(id, word) {
        records.words[id] = word;
        $localStorage.storeObject('words', records.words);
    };

    recFac.wordTemplate = [];
    recFac.initWordTemplate = function () {
        recFac.wordTemplate["name"] = "";
        recFac.wordTemplate["hiragana"] = "";
        recFac.wordTemplate["type"] = "";
        recFac.wordTemplate["accent"] = 0;
        recFac.wordTemplate["meaning"] = "";
    };

    return recFac;
}])

.factory('textManageFactory', ['languageFactory', 'userFactory', function(lFac, uFac) {
    var tmFac = {};

    tmFac.regToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.regToastType.success;
        return lang.regToastType.failed;
    };
    tmFac.loginToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.loginToastType.success;
        return lang.loginToastType.failed;
    };
    tmFac.settingToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.settingToastType.success;
        return lang.settingToastType.failed;
    };
    tmFac.uploadToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.uploadToastType.success;
        return lang.uploadToastType.failed;
    };
    tmFac.downloadToastType = function(type) {
        var lang = lFac.lang(uFac.getLocalInfo().lang);
        if (type === "success")
            return lang.downloadToastType.success;
        return lang.downloadToastType.failed;
    };

    return tmFac;
}])

.factory('recordManageFactory', function($ionicPlatform, $ionicListDelegate, $ionicPopup, $cordovaToast, localRecordFactory, languageFactory, userFactory) {
    var rmFac = {};

    rmFac.doDel = function(category, id, before, putBack, next) {

        var del_method, pop_msg, toast_msg;
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);

        if (category === "archive") {
            del_method = localRecordFactory.delFromWords;
            pop_msg = lang.rmFac.archivePop;
            toast_msg = lang.rmFac.archiveToast;
        }
        else if (category === "delete") {
            del_method = localRecordFactory.delFromArchived;
            if (!putBack) {
                pop_msg = lang.rmFac.deletePop;
                toast_msg = lang.rmFac.deleteToast;
            }
            else {
                pop_msg = lang.rmFac.putBackPop;
                toast_msg = lang.rmFac.putBackToast;
            }
        }
        else {
            console.log("Error, doDel not implemented with " + category + " !");
        }

        $ionicListDelegate.closeOptionButtons();
        var confirmPopup = $ionicPopup.confirm({
            template: '<p style="text-align:center;">' + pop_msg + "</p>"
        });
        confirmPopup.then(function(res) {
            if (res) {
                before();
                del_method(id);
                if (next)
                    next();
                $ionicPlatform.ready(function () {
                    $cordovaToast
                        .showLongBottom(toast_msg)
                        .then(
                            function (success) {},
                            function (error) {}
                        );
                });
            }
            else {
                console.log('Canceled');
            }
        });

    };

    return rmFac;
})

.factory('userFactory', function($resource, $localStorage, default_lang) {
    var userFac = {};

    var localInfo = $localStorage.getObject('localInfo', '{}');
    var loginData = $localStorage.getObject('loginData', '{}');

    if (!localInfo.lang)
        localInfo.lang = default_lang;

    userFac.getLocalInfo = function() {
        return localInfo;
    };
    userFac.getLoginData = function() {
        return loginData;
    };

    return userFac;
})

.factory('formFactory', function($resource, baseURL, languageFactory) {
    var fFac = {};

    fFac.getAddForm = function(l) {
        var lang = languageFactory.lang(l);
        return {
            "title": lang.aForm.title,
            "contents": [
                {
                    "title": lang.aForm.content1,
                    "idx": "name"
                },
                {
                    "title": lang.aForm.content2,
                    "idx": "hiragana"
                },
                {
                    "title": lang.aForm.content3,
                    "idx": "type"
                },
                {
                    "title": lang.aForm.content4,
                    "idx": "accent"
                },
                {
                    "title": lang.aForm.content5,
                    "idx": "meaning"
                }
            ]
        };
    };

    return fFac;
})

.factory('authFactory', function($resource, $http, $localStorage, $rootScope, baseURL, $ionicPopup, userFactory, languageFactory) {

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;

    var loadUserCredentials = function() {
        var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
        if (credentials.username != undefined) {
            useCredentials(credentials);
        }
    };
    var storeUserCredentials = function(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
    };
    var useCredentials = function(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
        $http.defaults.headers.common['x-access-token'] = authToken;
    };
    var destroyUserCredentials = function() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    };

    authFac.login = function(loginData) {
        $resource(baseURL + "users/login").save(loginData, function(res) {
            storeUserCredentials({username: loginData.username, token: res.token});
            $rootScope.$broadcast('login:Successful');
        }, function(res){
            isAuthenticated = false;
            var message = '<div><p>' +  res.data.err.message + '</p></div>';
            var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
            var alertPopup = $ionicPopup.alert({
                title: '<h4>' + lang.loginToastType.failed + '</h4>',
                template: message
            });
            alertPopup.then(function(res) {
                console.log('Login Failed!');
            });
        });
    };
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) {});
        destroyUserCredentials();
    };
    authFac.register = function(registerData) {
        $resource(baseURL + "users/register").save(registerData, function(res) {
            authFac.login({username: registerData.username, password: registerData.password});
            $rootScope.$broadcast('registration:Successful');
        }, function(res){
            var message = '<div><p>' +  res.data.err.message + '</p></div>';
            var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
            var alertPopup = $ionicPopup.alert({
                title: '<h4>' + lang.regToastType.failed + '</h4>',
                template: message
            });
            alertPopup.then(function(res) {
                console.log('Registration Failed!');
            });
        });
    };
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    authFac.getUsername = function() {
        return username;
    };

    loadUserCredentials();

    return authFac;

})

.factory('languageFactory', function() {
    var langFac = {};
    // {{lang(localInfo.lang).home.a}}
    langFac.zh_cn = {

        "aForm": {
            "title": "增添单词",
            "content1": "单词",
            "content2": "平假",
            "content3": "类型",
            "content4": "声调",
            "content5": "意思"
        },

        "add": {
            "viewTitle": "增添单词",
            "pop_msg": function (info) {
                return "确认覆盖:<br>" + info + "<br>吗 ?"
            },
            "toast_msg": "覆盖成功 !"
        },
        "check": {
            "viewTitle": "查询单词",
            "current": "当前单词",
            "archived": "归档单词",
            "archive": "归档"
        },
        "detail": {
            "viewTitle": "单词细节",
            "name": "原词",
            "hiragana": "平假",
            "accent": "声调",
            "toast_msg": "修改成功 !"
        },
        "archived": {
            "viewTitle": "归档单词",
            "putBack": "重背",
            "delete": "删除"
        },

        "home": {
            "viewTitle": "主页",
            "title": "背一背",
            "ok": "置底",
            "archive": "归档",
            "username": "用户名"
        },
        "login": {
            "title": "登录",
            "username": "用户名",
            "password": "密码"
        },
        "recent": {
            "viewTitle": "今日账本",
            "mAccount": "财务账本",
            "tAccount": "事件账本",
            "mTitle": "今日财务统计",
            "sumOutput": "总支出数额",
            "sumIncome": "总收入数额",
            "output": "支出",
            "income": "收入",
            "amount": "数额",
            "mDetail": "今日财务记录",
            "tTitle": "今日事件统计",
            "sumPtGet": "总得点",
            "sumPtLost": "总失点",
            "tDetail": "今日事件记录",
            "time": "具体时间",
            "today": "今日",
            "todayAmount": "次数",
            "todayTime": "时间"
        },
        "register": {
            "title": "注册",
            "username": "用户名",
            "password": "密码"
        },
        "setting": {
            "title": "设置",
            "lang": "语言",
            "avatar": "头像",
            "username": "用户名",
            "yIncome": "年收入"
        },
        "sidebar": {
            "title": "导航",
            "home": "主页",
            "add": "增添",
            "check": "查询",
            "archived": "档案",
            "services": "服务",
            "login": "登录",
            "register": "注册",
            "setting": "设置",
            "sync": "同步"
        },
        "sync": {
            "upload": "上传数据",
            "download": "下载数据"
        },

        "regToastType": {
            "success": "注册成功 !",
            "failed": "注册失败 !"
        },
        "loginToastType": {
            "success": "登录成功 !",
            "failed": "登录失败 !"
        },
        "settingToastType": {
            "success": "设置成功 !",
            "failed": "设置失败 !"
        },
        "uploadToastType": {
            "success": "上传成功 !",
            "failed": "上传失败 !"
        },
        "downloadToastType": {
            "success": "下载成功 !",
            "failed": "下载失败 !"
        },

        "rmFac": {
            "archivePop": "你确定要归档这个单词吗 ?",
            "archiveToast": "归档成功 !",
            "deletePop": "你确定要删除这个单词吗 ?",
            "deleteToast": "删除成功 !",
            "putBackPop": "你确定要重背这个单词吗 ?",
            "putBackToast": "操作成功 !",
            "addToast": "增添成功 !"
        },

        "loading": {
            "loading": "加载中"
        },
        "exit": {
            "exit": "再按一次退出"
        }

    };
    langFac.en = {

        "aForm": {
            "title": "Add a word !",
            "content1": "Word",
            "content2": "Hiragana",
            "content3": "Type",
            "content4": "Accent",
            "content5": "Meaning"
        },

        "add": {
            "viewTitle": "Add",
            "pop_msg": function (info) {
                return "Replace:<br>" + info + "<br>?"
            },
            "toast_msg": "Success !"
        },
        "check": {
            "viewTitle": "Check",
            "current": "Current",
            "archived": "Archived",
            "archive": "Archive",
            "delete": "Delete"
        },
        "detail": {
            "viewTitle": "Detail",
            "name": "Word",
            "hiragana": "Hiragana",
            "accent": "Accent",
            "toast_msg": "Success !"
        },
        "archived": {
            "viewTitle": "Archived Words",
            "putBack": "Review",
            "delete": "Delete"
        },

        "home": {
            "viewTitle": "Home",
            "title": "Recite !",
            "ok": "OK!",
            "archive": "Archive",
            "username": "Username"
        },
        "login": {
            "title": "Log In",
            "username": "Username",
            "password": "Password"
        },
        "recent": {
            "viewTitle": "Today's Account",
            "mAccount": "Finance",
            "tAccount": "Event",
            "mTitle": "Today's Financial Summary",
            "sumOutput": "Total Expenditure",
            "sumIncome": "Total Income",
            "output": "Expenditure",
            "income": "Income",
            "amount": "Amount",
            "mDetail": "Details",
            "tTitle": "Today's Event Summary",
            "sumPtGet": "Total pt. Gained",
            "sumPtLost": "Total pt. Lost",
            "tDetail": "Details",
            "time": "Time",
            "today": "",
            "todayAmount": "",
            "todayTime": "Time(s)"
        },
        "register": {
            "title": "Register",
            "username": "Username",
            "password": "Password"
        },
        "setting": {
            "title": "Setting",
            "lang": "Language",
            "avatar": "Avatar",
            "username": "Username",
            "yIncome": "Income"
        },
        "sidebar": {
            "title": "Navigation",
            "home": "Home",
            "add": "Add",
            "check": "Check",
            "archived": "Archived",
            "services": "Services",
            "login": "Log in",
            "register": "Register",
            "setting": "Settings",
            "sync": "Sync"
        },
        "sync": {
            "upload": "Upload",
            "download": "Download"
        },

        "regToastType": {
            "success": "Registration Succeeded !",
            "failed": "Registration Failed !"
        },
        "loginToastType": {
            "success": "Log In Successfully !",
            "failed": "Log In Failed !"
        },
        "settingToastType": {
            "success": "Updated !",
            "failed": "Failed !"
        },
        "uploadToastType": {
            "success": "Upload Completed !",
            "failed": "Upload Failed !"
        },
        "downloadToastType": {
            "success": "Download Completed !",
            "failed": "Download Failed !"
        },

        "rmFac": {
            "archivePop": "Confirm Archiving ?",
            "archiveToast": "Archived Successfully !",
            "deletePop": "Confirm Deletion ?",
            "deleteToast": "Deleted Successfully !",
            "putBackPop": "Confirm Reviewing ?",
            "putBackToast": "Success !",
            "addToast": "Added Successfully !"
        },

        "loading": {
            "loading": "Loading"
        },
        "exit": {
            "exit": "Press again to Exit"
        }

    };

    langFac.lang = function(type) {
        if (type === "zh_cn")
            return langFac.zh_cn;
        if (type === "en")
            return langFac.en;
    };

    return langFac;
})

;
