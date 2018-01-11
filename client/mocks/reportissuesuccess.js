'use strict';
window.mocks = window.mocks || {};
window.mocks.reportissuesuccess = window.mocks.reportissuesuccess || {};
window.mocks.reportissuesuccess.gotohome = function ($scope, params, app) {
    return app.go('app.home');
};