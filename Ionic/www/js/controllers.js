angular.module('Recite.controllers', [])

.controller('AppCtrl', function($state, $rootScope, $resource, baseURL, $scope, $location, $ionicModal, $localStorage, $ionicPlatform, $ionicPopover, $cordovaToast, localRecordFactory, cloudRecordFactory, userFactory, authFactory, localInfo, loginData, regToastType, loginToastType, settingToastType, uploadToastType, downloadToastType, lang) {

    $scope.loggedIn = false;
    $scope.registration = {};
    $scope.loginData = loginData;
    $scope.localInfo = localInfo;
    $scope.tmpInfo = { "lang": localInfo.lang };
    $scope.lang = lang;

    if (authFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.localInfo.username = authFactory.getUsername();
    }

    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.register_modal = modal;
    });
    $scope.register = function() {
        $scope.register_modal.show();
    };
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;
        authFactory.register($scope.registration);
        $scope.closeRegister();
    };
    $scope.closeRegister = function() {
        $scope.register_modal.hide();
    };

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = authFactory.isAuthenticated();
        $ionicPlatform.ready(function() {
            $cordovaToast
                .showLongBottom(regToastType("success"))
                .then(
                    function (success) {},
                    function (error) {}
                );
        });
    });

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.login_modal = modal;
    });
    $scope.login = function() {
        $scope.login_modal.show();
    };
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        authFactory.login($scope.loginData);
        $scope.closeLogin();
    };
    $scope.closeLogin = function() {
        $scope.login_modal.hide();
    };

    $scope.logOut = function() {
        authFactory.logout();
        $scope.loggedIn = false;
    };

    $rootScope.$on('login:Successful', function() {
        $scope.loggedIn = authFactory.isAuthenticated();
        $scope.tmpInfo.username = authFactory.getUsername();
        $scope.localInfo.username = authFactory.getUsername();
        $ionicPlatform.ready(function() {
            $cordovaToast
                .showLongBottom(loginToastType("success"))
                .then(
                    function (success) {},
                    function (error) {}
                );
        });
    });

    $ionicModal.fromTemplateUrl('templates/setting.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.setting_modal = modal;
    });
    $scope.setting = function() {
        $scope.setting_modal.show();
    };
    $scope.doSetting = function() {
        $scope.localInfo.lang = $scope.tmpInfo.lang;
        $scope.localInfo.icon = $scope.tmpInfo.icon;
        $scope.localInfo.username = $scope.tmpInfo.username;
        $scope.localInfo.income = $scope.tmpInfo.income;
        $localStorage.storeObject('localInfo', $scope.localInfo);

        $rootScope.$broadcast("refresh:" + $location.path());

        $ionicPlatform.ready(function() {
            $cordovaToast
                .showLongBottom(settingToastType("success"))
                .then(
                    function (success) {},
                    function (error) {}
                );
            $scope.closeSetting();
        });
    };
    $scope.closeSetting = function() {
        $scope.setting_modal.hide();
    };

    $ionicPopover.fromTemplateUrl('templates/sync-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.sync = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };

})

.controller('homeController', function($ionicListDelegate, $scope, localRecordFactory, userFactory, lang, doDel, getTypes) {

    var refresh = function() {
        $scope.num = localRecordFactory.getNum();
        $scope.words = localRecordFactory.getWords();
        $scope.localInfo = userFactory.getLocalInfo();
    };

    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/home', refresh);

    $scope.lang = lang;

    $scope.getTypes = getTypes;
    $scope.doOK = function(id) {
        var word = $scope.words[id];
        var len = $scope.words.length;
        $scope.words.push(word);
        $scope.words.splice(id, 1);
        for (var i = len - 2; i >= id; i--)
            $scope.words[i].id -= 1;
        $scope.words[len - 1].id = len - 1;
        localRecordFactory.updateWords($scope.words);
        $ionicListDelegate.closeOptionButtons();
    };
    $scope.doArchive = function(id) {
        doDel("archive", id, function () {
            var word = $scope.words[id];
            var archived = localRecordFactory.getArchived();
            word.id = archived.length;
            archived.push(word);
            localRecordFactory.updateArchived(archived);
        });
    };
    
})

.controller('addController', function($ionicPlatform, $ionicPopup, $cordovaToast, $state, $scope, localRecordFactory, cloudRecordFactory, userFactory, formFactory, languageFactory, lang, updateWords) {

    var refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.words = localRecordFactory.getWords();
        $scope.types = localRecordFactory.getTypes();
        $scope.form = formFactory.getAddForm($scope.localInfo.lang);
        $scope.template = localRecordFactory.wordTemplate;
        localRecordFactory.initWordTemplate();
    };

    $scope.$on('$ionicView.beforeEnter', refresh);
    $scope.$on('refresh:/app/add', refresh);

    $scope.lang = lang;

    $scope.doAdd = function() {

        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
        var name = $scope.template["name"];
        var type = $scope.template["type"];
        var meaning = $scope.template["meaning"];
        var len = $scope.words.length;
        var idx = -1;
        for (var i = len - 1; i >= 0; i--) {
            if ($scope.words[i].name == name) {
                idx = i; break;
            }
        }
        var info;
        var flag = 1;

        if (idx < 0) {
            info = {
                "id": $scope.words.length,
                "name": name,
                "hiragana": $scope.template["hiragana"],
                "accent": $scope.template["accent"],
                "meanings": [{
                    "type": type,
                    "meaning": meaning
                }]
            };
            $scope.words.push(info);
            updateWords($scope.words);
        }
        else {
            info = $scope.words[idx];
            var sub_idx = -1;
            for (var j = info.meanings.length - 1; j >= 0; j--) {
                if (info.meanings[j].type == type) {
                    sub_idx = j; break;
                }
            }
            var new_meaning = {
                "type": type,
                "meaning": meaning
            };
            if (sub_idx < 0) {
                info.meanings.push(new_meaning);
                updateWords($scope.words);
            } else {
                flag = -1;
                var pop_info = name + "<br>" + type + "<br>" + $scope.words[idx].meanings[sub_idx].meaning;
                var confirmPopup = $ionicPopup.confirm({
                    template: '<p style="text-align:center;">' + lang.add.pop_msg(pop_info) + "</p>"
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        info.meanings[idx] = new_meaning;
                        updateWords($scope.words);
                        $ionicPlatform.ready(function() {
                            $cordovaToast
                                .showLongBottom(lang.add.toast_msg)
                                .then(
                                    function (success) {},
                                    function (error) {}
                                );
                        });
                    } else {
                        console.log('Canceled');
                    }
                });
            }
        }
        
        var type_idx = $scope.types.indexOf(type);
        if (type_idx < 0) {
            $scope.types.push(type);
            localRecordFactory.updateTypes($scope.types);
        }
        
        if (flag >= 0) {
            $ionicPlatform.ready(function() {
                $cordovaToast
                    .show(lang.rmFac.addToast, 'long', 'center')
                    .then(
                        function (success) {},
                        function (error) {}
                    );
            });
        }

    };

})

.controller('checkController', function($rootScope, $scope, localRecordFactory, cloudRecordFactory, userFactory, lang, getTypes, doDel) {

    $scope.dt = {};
    $scope.dt.rs = [];
    $scope.dt.words = [];
    $scope.dt.filter = "";

    $scope.dt.doFilter = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.dt.words = localRecordFactory.getWords();
        $scope.dt.rs.length = 0;
        for (var i = $scope.dt.words.length - 1; i >= 0; i--) {
            if ($scope.dt.words[i].name.indexOf($scope.dt.filter) >= 0)
                $scope.dt.rs.push($scope.dt.words[i]);
        }
    };
    $scope.dt.refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.dt.doFilter();
    };

    $scope.$on('$ionicView.beforeEnter', $scope.dt.refresh);
    $scope.$on('refresh:/app/check', $scope.dt.refresh);

    $scope.lang = lang;

    $scope.getTypes = getTypes;
    $scope.doArchive = function(id) {
        doDel("archive", id, function () {
            var word = $scope.dt.words[id];
            var archived = localRecordFactory.getArchived();
            word.id = archived.length;
            archived.push(word);
            localRecordFactory.updateArchived(archived);
        }, false, $scope.dt.refresh);
    };

})

.controller('detailController', function($scope, $ionicPlatform, $ionicHistory, $cordovaToast, localRecordFactory, lang, localInfo, words, id) {

    $scope.lang = lang;
    $scope.localInfo = localInfo;

    $scope.tmp_word = {};

    var word = words[id];
    $scope.tmp_word.id = word.id;
    $scope.tmp_word.name = word.name;
    $scope.tmp_word.hiragana = word.hiragana;
    $scope.tmp_word.accent = word.accent;
    $scope.tmp_word.meanings = [];
    for (var i = word.meanings.length - 1; i >= 0; i--) {
        var tmp_info = word.meanings[i];
        $scope.tmp_word.meanings.push({
            "type": tmp_info.type,
            "meaning": tmp_info.meaning
        })
    }

    $scope.finishEdit = function() {
        for (var i = $scope.tmp_word.meanings.length - 1; i >= 0; i--) {
            if ($scope.tmp_word.meanings[i].meaning.length == 0)
                $scope.tmp_word.meanings.splice(i, 1);
        }
        words[id] = $scope.tmp_word;
        localRecordFactory.updateWords(words);

        $ionicPlatform.ready(function() {
            $cordovaToast
                .showLongBottom(lang(localInfo.lang).detail.toast_msg)
                .then(
                    function (success) {},
                    function (error) {}
                );
            $ionicHistory.goBack();
        });
    };

})

.controller('archivedController', function($rootScope, $scope, localRecordFactory, cloudRecordFactory, userFactory, lang, getTypes, doDel) {

    $scope.dt = {};
    $scope.dt.rs = [];
    $scope.dt.filter = "";

    $scope.dt.doFilter = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        var archived = localRecordFactory.getArchived();
        $scope.dt.rs.length = 0;
        for (var i = archived.length - 1; i >= 0; i--) {
            if (archived[i].name.indexOf($scope.dt.filter) >= 0)
                $scope.dt.rs.push(archived[i]);
        }
    };
    $scope.dt.refresh = function() {
        $scope.localInfo = userFactory.getLocalInfo();
        $scope.dt.doFilter();
    };

    $scope.$on('$ionicView.beforeEnter', $scope.dt.refresh);
    $scope.$on('refresh:/app/check', $scope.dt.refresh);

    $scope.lang = lang;

    $scope.getTypes = getTypes;
    $scope.doPutBack = function(id) {
        doDel("delete", id, function () {
            var word = localRecordFactory.getArchived()[id];
            var words = localRecordFactory.getWords();
            word.id = words.length;
            words.push(word);
            localRecordFactory.updateWords(words);
        }, true, $scope.dt.refresh);
    };
    $scope.doDel = function(id) {
        doDel("delete", id, function () {}, false, $scope.dt.refresh);
    };

})

;
