'use strict';
app.controller('passwordResetController', ['$scope', '$location', '$timeout', 'authService', 
function ($scope, $location, $timeout, authService) {

    $scope.resetSuccess = false;
    $scope.isProcessing = false;
    $scope.message = "";
    $scope.progressMessage = "";

    $scope.resetPasswordData = {
        userid: $location.search().userid,
        token: $location.search().token,
        email: $location.search().email
    };

    $scope.newPassword = {
        password: "",
        confirmPassword: ""
    };

    $scope.passwordReset = function () {
        if ($scope.newPassword.password == $scope.newPassword.confirmPassword) {
            $scope.progressMessage = "Resetting your password";
            authService.resetPassword($scope.newPassword.password, $scope.resetPasswordData).then(function (response) {
                if (response == 200) {
                    $scope.resetSuccess = true;
                    $scope.message = "Your password is changed.";
                    $scope.progressMessage = "Redirecting you to login page.."; 
                    $scope.isProcessing = true;
                    startTimer('/login');
                };

            },
            function (response) {
                var errors = [];
                for (var key in response.data.ModelState) {
                    for (var i = 0; i < response.data.ModelState[key].length; i++) {
                        errors.push(response.data.ModelState[key][i]);
                    }
                }
                $scope.message = 'Error Occured: ' + errors.join(' ');
                $scope.isProcessing = false;
            }).finally(function () {
                // 
            });
        }
        else {
            $scope.message = 'Passwords should match';
        }
     
    };

    var startTimer = function (navigationpath) {
         var timer = $timeout(function () {
             $timeout.cancel(timer);
             $location.search({ }); //clear the query parameters
             $location.path(navigationpath);
         }, 2000);
     }
}]);