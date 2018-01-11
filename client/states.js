angular.module('app').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('app', {
        abstract: true,
        controller: 'app',
        templateProvider: function (app) {
            return app.templateProvider('app');
        }
    }).state('app.menu', {
        views: {
            app: {
                controller: 'app_menu',
                templateProvider: function (app) {
                    return app.templateProvider('app.menu');
                }
            }
        }
    }).state('app.multiselect', {
        views: {
            app: {
                controller: 'app_multiselect',
                templateProvider: function (app) {
                    return app.templateProvider('app.multiselect');
                }
            }
        }
    }).state('app.login', {
        views: {
            app: {
                controller: 'app_login',
                templateProvider: function (app) {
                    return app.templateProvider('app.login');
                }
            }
        }
    }).state('app.home', {
        views: {
            app: {
                controller: 'app_home',
                templateProvider: function (app) {
                    return app.templateProvider('app.home');
                }
            }
        }
    }).state('app.reportissue', {
        views: {
            app: {
                controller: 'app_reportissue',
                templateProvider: function (app) {
                    return app.templateProvider('app.reportissue');
                }
            }
        }
    }).state('app.viewdetails', {
        views: {
            app: {
                controller: 'app_viewdetails',
                templateProvider: function (app) {
                    return app.templateProvider('app.viewdetails');
                }
            }
        }
    }).state('app.reportissuesuccess', {
        views: {
            app: {
                controller: 'app_reportissuesuccess',
                templateProvider: function (app) {
                    return app.templateProvider('app.reportissuesuccess');
                }
            }
        }
    }).state('app.reportissueerror', {
        views: {
            app: {
                controller: 'app_reportissueerror',
                templateProvider: function (app) {
                    return app.templateProvider('app.reportissueerror');
                }
            }
        }
    }).state('app.howto', {
        views: {
            app: {
                controller: 'app_howto',
                templateProvider: function (app) {
                    return app.templateProvider('app.howto');
                }
            }
        }
    });
});