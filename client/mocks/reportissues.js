'use strict';
window.mocks = window.mocks || {};
window.mocks.reportissues = window.mocks.reportissues || {};
window.mocks.reportissues.gotohome = function ($scope, params, app) {
    return app.go('app.home');
};
window.mocks.reportissues.submitIssues = function ($scope, params, app) {
    return app.go('app.home');
};