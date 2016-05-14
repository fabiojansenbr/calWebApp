'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', '$mdToast','$timeout', function ($scope, $location, authService, $mdToast, $timeout) {

    $scope.loginData = {
        email: "",
        password: ""
    };

    //forgotten password related stuff
    $scope.retrieveSuccess = false;
    $scope.isProcessing = false;


    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/appointments');

        },
         function (err) { 
             $mdToast.show($mdToast.simple()
                      .textContent(err.error_description)
                      .position('top left')
                      .capsule(true)
                      .theme('error-toast')
                      .hideDelay(1200));
         });
    };

    $scope.retrievePasswordReset = function () {
        $scope.isProcessing = true;
    
        authService.retrievePasswordReset($scope.loginData.email).then(function (respnse) {
            $scope.retrieveSuccess = true;
           
            $mdToast.show($mdToast.simple()
                       .textContent('We just sent a password reset link to ' + $scope.loginData.email)
                       .position('top left')
                       .capsule(true)
                       .theme('success-toast')
                       .hideDelay(2000));
            startTimer('/login');
        },
        function (response) {
            
            $mdToast.show($mdToast.simple()
                     .textContent(response.statusText)
                     .action('ok')
                     .highlightAction(true)
                     .position('top left')
                     .capsule(true)
                     .theme('error-toast')
                     .hideDelay(2000));

        }).finally(function () {
            $scope.isProcessing = false;
        });
    };


    var startTimer = function (navigationpath) {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.search({}); //clear the query parameters
            $location.path(navigationpath);
        }, 2000);
    }
}]);