'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    $scope.loginData = {
        email: "",
        password: ""
    };
    $scope.message = "";

    //forgotten password related stuff
    $scope.retrieveSuccess = false;
    $scope.isProcessing = false;
    $scope.progressMessage = "";


    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/appointments');

        },
         function (err) {
             $scope.message = err.error_description;
         });
    };

    $scope.retrievePasswordReset = function () {
        $scope.isProcessing = true;
        $scope.progressMessage = "Requesting password reset email..";

        authService.retrievePasswordReset($scope.loginData.email).then(function (respnse) {
            $scope.retrieveSuccess = true;
            $scope.message = 'We just sent a password reset link to ' + $scope.loginData.email;
            startTimer('/login');
        },
        function (response) {
            var errors = [];
            for (var key in response.data.ModelState) {
                for (var i = 0; i < response.data.ModelState[key].length; i++) {
                    errors.push(response.data.ModelState[key][i]);
                }
            }
            $scope.message = errors.join(' ');
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