angular.module('app').controller('app_reportissue', app_reportissue);
function app_reportissue($scope, app) {
    'use strict';
    var reader = new FileReader();
    app.init($scope, function(){
         if ($scope.data.category) {
            $scope.categories = $scope.data.category.options;
           
        }
        if ($scope.data.reproducibility) {
            $scope.reproducibility = $scope.data.reproducibility.options;
           
        }
        if ($scope.data.Severity) {
            $scope.Severity = $scope.data.Severity.options;
           
        }
        if ($scope.data.Prority) {
            $scope.Prority = $scope.data.Prority.options;
           
        }
        if ($scope.data.assignTo) {
            $scope.assignTo = $scope.data.assignTo.options;
           
        }
    });
    $scope.submitissue = function () {
        if(window.mocks){
            app.go('app.home');
        }
        else{
            reader.readAsBinaryString(document.getElementById("myFile").files[0]);
            reader.onload = function(e) {
                $scope.data.blobContent = reader.result;
                $scope.data.fileName = document.getElementById("myFile").files[0].name;
                app.call('home.submitissue', $scope.data);
            }
        }
    };
  }