'use strict';
window.mocks = window.mocks || {};
window.mocks.reportissueerror = window.mocks.reportissueerror || {};
window.mocks.reportissueerror.gotoReportIssue = function ($scope, params, app) {
    return app.go('app.home');
};