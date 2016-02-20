'use strict';
app.controller('confirmController', ['$scope', '$location', '$timeout', 'authService', 
function ($scope, $location, $timeout, authService) {

    $scope.confirmSuccess = false;
    $scope.isProcessing = true;
    $scope.message = "";
    $scope.progressMessage = "";

    $scope.confirmData = {
        userid: $location.search().userid,
        token: $location.search().token
    };

    $scope.progressMessage = "Confirming your email..";
    $scope.isProcessing = true;

        authService.confirmEmail($scope.confirmData).then(function (response) {
            if (response == 200) {
                $scope.confirmSuccess = true;
                $scope.message = "Your account is Activated!";
                $scope.isProcessing = true;
                $scope.progressMessage = "Logging you in..";
                authService.autoLogin().then(function (response) { startTimer('/appointments'); }, //autologin succesful navigate to appointments
                                             function (response) { startTimer('/login'); });
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
            $scope.confirmSuccess = false;
            $scope.isProcessing = false;
        }).finally(function () {
           // 
        });


    var startTimer = function (navigationpath) {
         var timer = $timeout(function () {
             $timeout.cancel(timer);
             $location.search({ }); //clear the query parameters
             $location.path(navigationpath);
         }, 2000);
     }
}]);