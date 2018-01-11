'use strict';
window.mocks = window.mocks || {};
window.mocks.viewdetails = window.mocks.viewdetails || {};
window.mocks.viewdetails.gotoreportissue = function ($scope, params, app) {
    return app.go('app.reportissue');
};
window.mocks.viewdetails.gotohome = function ($scope, params, app) {
    return app.go('app.home');
};