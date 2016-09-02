angular.module('Recite', ['ionic', 'ngCordova', 'Recite.controllers', 'Recite.services'])

.run(function($ionicPlatform, $rootScope, $location, $ionicLoading, $ionicHistory, $cordovaSplashscreen, $cordovaToast, $timeout, languageFactory, userFactory) {

    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        $timeout(function () {
            $cordovaSplashscreen.hide();
        }, 0)
    });

    $rootScope.$on("loading:show", function() {
        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> ' + lang.loading.loading + ' ...'
        });
    });
    $rootScope.$on("loading:hide", function() {
        $ionicLoading.hide();
    });
    $rootScope.$on("$stateChangeStart", function() {
        console.log('Loading ...');
        $rootScope.$broadcast("loading:show");
    });
    $rootScope.$on("$stateChangeSuccess", function() {
        console.log('done');
        $rootScope.$broadcast("loading:hide");
    });

    $ionicPlatform.registerBackButtonAction(function(e) {

        var lang = languageFactory.lang(userFactory.getLocalInfo().lang);

        if ($location.path() == '/app/home') {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            }
            else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortCenter(lang.exit.exit);
                setTimeout(function() {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        }
        else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        }
        else {
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.showShortCenter(lang.exit.exit);
            setTimeout(function() {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
        }
        e.preventDefault();
        return false;

    }, 101);

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-back');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-ios-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl',
        resolve: {
            localInfo: ['userFactory', function(userFac) {
                return userFac.getLocalInfo();
            }],
            lang: ['languageFactory', function(lFac) {
                return lFac.lang;
            }],
            loginData: ['userFactory', function(userFac) {
                return userFac.getLoginData();
            }],
            regToastType: ['textManageFactory', function(tmFac) {
                return tmFac.regToastType;
            }],
            loginToastType: ['textManageFactory', function(tmFac) {
                return tmFac.loginToastType;
            }],
            settingToastType: ['textManageFactory', function(tmFac) {
                return tmFac.settingToastType;
            }],
            uploadToastType: ['textManageFactory', function(tmFac) {
                return tmFac.uploadToastType;
            }],
            downloadToastType: ['textManageFactory', function(tmFac) {
                return tmFac.downloadToastType;
            }]
        }
    })

    .state('app.home', {
        url: '/home',
        views: {
            'mainContent': {
                templateUrl: 'templates/home.html',
                controller: 'homeController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }],
                    getTypes: ['recordManageFactory', function(rmFac) {
                        return rmFac.getTypes;
                    }]
                }
            }
        }
    })

    .state('app.add', {
        url: '/add',
        views: {
            'mainContent': {
                templateUrl: 'templates/add.html',
                controller: 'addController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    updateWords: ['localRecordFactory', function(recFac) {
                        return recFac.updateWords;
                    }]
                }
            }
        }
    })

    .state('app.check', {
        url: '/check',
        views: {
            'mainContent': {
                templateUrl: 'templates/check.html',
                controller: 'checkController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }],
                    getTypes: ['recordManageFactory', function(rmFac) {
                        return rmFac.getTypes;
                    }]
                }
            }
        }
    })

    .state('app.detail', {
        url: '/check/:id',
        views: {
            'mainContent': {
                templateUrl: 'templates/detail.html',
                controller: 'detailController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    localInfo: ['userFactory', function(userFac) {
                        return userFac.getLocalInfo();
                    }],
                    words: ['localRecordFactory', function(recFac) {
                        return recFac.getWords();
                    }],
                    id: ['$stateParams', function($param) {
                        return $param.id;
                    }]
                }
            }
        }
    })

    .state('app.archived', {
        url: '/archived',
        views: {
            'mainContent': {
                templateUrl: 'templates/archived.html',
                controller: 'archivedController',
                resolve: {
                    lang: ['languageFactory', function(lFac) {
                        return lFac.lang;
                    }],
                    doDel: ['recordManageFactory', function(rmFac) {
                        return rmFac.doDel;
                    }],
                    getTypes: ['recordManageFactory', function(rmFac) {
                        return rmFac.getTypes;
                    }]
                }
            }
        }
    })

    ;

    $urlRouterProvider.otherwise('/app/home');

});
