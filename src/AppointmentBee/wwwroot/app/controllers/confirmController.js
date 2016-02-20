'use strict';
app.controller('confirmController', ['$scope', '$location', '$timeout', 'authService', 
function ($scope, $location, $timeout, authService) {

    $scope.confirmSuccess = false;
    $scope.isConfirming = true;
    $scope.confirmationProgress = 'indeterminate'
    $scope.message = "";

    $scope.confirmData = {
        userid: $location.search().userid,
        token: $location.search().token
    };

        authService.confirmEmail($scope.confirmData).then(function (response) {
            if (response == 200) {
                $scope.confirmSuccess = true;
                $scope.message = "Your account is Activated!";
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
           
        }).finally(function () {
            $scope.isConfirming = false;
            $scope.confirmationProgress = null;
        });


}]);