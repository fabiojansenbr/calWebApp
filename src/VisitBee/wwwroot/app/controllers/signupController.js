'use strict';
app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', '$mdToast',
function ($scope, $location, $timeout, authService, $mdToast) {

    $scope.isProcessing = false;
    $scope.savedSuccessfully = false;

    $scope.registration = {
        email: "",
        fullName: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signUp = function () {
         $scope.isProcessing = true;
        authService.register($scope.registration).then(function (response) {

            $location.path('/login');

            $scope.savedSuccessfully = true;
            $mdToast.show($mdToast.simple()
                        .textContent("We just sent a confirmation email to " + $scope.registration.email)
                        .action('ok')
                        .highlightAction(true)
                        .position('top left')
                        .capsule(true)
                        .theme('success-toast')
                        .hideDelay(250000));
        },
         function (response) {
             var errors = [];
             for (var key in response.data.ModelState) {
                 for (var i = 0; i < response.data.ModelState[key].length; i++) {
                     errors.push(response.data.ModelState[key][i]);
                 }
             }
             $mdToast.show($mdToast.simple()
                       .textContent( errors.join(' '))
                       .action('ok')
                       .highlightAction(true)
                       .position('top left')
                       .capsule(true)
                       .theme('error-toast')
                       .hideDelay(250000));
            
         }).finally(function () {
              $scope.isProcessing = false;
         });
    };

   

}]);