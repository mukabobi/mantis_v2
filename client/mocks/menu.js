'use strict';
window.mocks = window.mocks || {};
window.mocks.menu = window.mocks.menu || {};
window.mocks.menu.logout = function ($scope, params, app) {
    return app.go('app.login');
};
window.mocks.menu.gotohome = function ($scope, params, app) {
    return app.go('app.home');
};