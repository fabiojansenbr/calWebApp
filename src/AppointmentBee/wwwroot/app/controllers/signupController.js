'use strict';
app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', 
function ($scope, $location, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.isProcessing = false;
    $scope.message = "";

    $scope.registration = {
        email: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signUp = function () {
         $scope.isProcessing = true;
        authService.register($scope.registration).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "We just sent a confirmation email to " + $scope.registration.email + ".";
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

   

}]);