'use strict';
window.mocks = window.mocks || {};
window.mocks.home = window.mocks.home || {};
window.mocks.home.issueList_viewdetails = function ($scope, params, app) {
};
window.mocks.home.reportIssue = function ($scope, params, app) {
    return app.go('app.reportissue');
};