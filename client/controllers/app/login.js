angular.module('app').controller('app_login', app_login);
function app_login($scope, $rootScope, app, $q, $ionicPopup) {
    'use strict';

    app.init($scope);

    if (!$scope.data) {
        $scope.data = {};
    }

    var checkSupport = function () {
        var deferred = $q.defer();
        if (typeof cordova !== 'undefined' && window.plugins && window.plugins.touchid) {
            window.plugins.touchid.isAvailable(function() {
                window.plugins.touchid.has('credentials', function() {
                    deferred.resolve(true);
                }, function() {
                    deferred.resolve(false);
                });
            });
        }
        return deferred.promise;
    };

    $scope.loginViaTouch = function () {
        checkSupport().then(function(isAvailable) {
            if (isAvailable) {
                window.plugins.touchid.verify('credentials', ' ', 
                    function(stringCreds) {
                        var credentials = JSON.parse(stringCreds);
                        $scope.data.username = credentials.username;
                        $scope.data.password = credentials.password;
                        $scope.$apply();
                        $scope.doLogin();
                    }, function(err) {
                        alert(err);
                    }
                )                 
            } else {
                alert('touch id is not available');
            } 
        });
    };

    $scope.reset = function () {
        localStorage.clear();
    };

    $scope.login = function () {
        $scope.doLogin({
            username: $scope.data.username,
            password: $scope.data.password
        }, false);
    };

    $scope.doLogin = function () {
        $scope.app.showLoading('Logging in');
        app.action('login', 'submit', this);
    };
    
    $scope.doAppLogin = function (credentials) {
        window.plugins.touchid.save('credentials', JSON.stringify(credentials));
        $scope.doLogin(credentials, true);
    };
}

