'use strict';
app.controller('passwordResetController', ['$scope', '$location', '$timeout', 'authService', '$mdToast', 
function ($scope, $location, $timeout, authService, $mdToast) {

    $scope.resetSuccess = false;
    $scope.isProcessing = false;

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

            authService.resetPassword($scope.newPassword.password, $scope.resetPasswordData).then(function (response) {
                if (response == 200) {
                    $scope.resetSuccess = true;
                    $mdToast.show($mdToast.simple()
                       .textContent("Your password is changed. Redirecting you to login page..")
                       .position('top left')
                       .capsule(true)
                       .theme('success-toast')
                       .hideDelay(4000));
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
              
                $mdToast.show($mdToast.simple()
                      .textContent('Error Occured: ' + errors.join(' '))
                      .action('ok')
                      .highlightAction(true)
                      .position('top left')
                      .capsule(true)
                      .theme('error-toast')
                      .hideDelay(2000));

                $scope.isProcessing = false;
            }).finally(function () {
                // 
            });
        }
        else {
            $mdToast.show($mdToast.simple()
                    .textContent('Passwords should match')
                    .position('top left')
                    .capsule(true)
                    .theme('error-toast')
                    .hideDelay(2000));
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