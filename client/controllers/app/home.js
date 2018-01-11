angular.module('app')
.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            return input.split(splitChar)[splitIndex];  
    }
}).controller('app_home', app_home);

function app_home($scope, app) {
    'use strict';
    app.init($scope);
    
    $scope.goToIssueDetails = function(idx) {
        if (window.mocks) {
            app.go('app.viewdetails');
        } else {
            app.call('home.goToIssue', { index: idx });
        }
    }
}
