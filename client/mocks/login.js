'use strict';
window.mocks = window.mocks || {};
window.mocks.login = window.mocks.login || {};
window.mocks.login.submit = function ($scope, params, app) {
    return app.go('app.home');
};