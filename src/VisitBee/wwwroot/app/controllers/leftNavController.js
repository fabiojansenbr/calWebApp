'use strict';
app.controller('leftNavController', ['$scope', '$location', 'authService', 'calendarService',
    function ($scope, $location, authService, calendarService) {

    $scope.userAccount = {
        userName: '',
        email: '',
        emailConfirmed: true
    };

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }

    $scope.authentication = authService.authentication; 

    //get User Info
    var getUserInfo = function () {
        calendarService.getUserInfo().then(function (result) {
            $scope.userAccount.userName = result.Name;
            $scope.userAccount.email = result.Email;
            $scope.userAccount.emailConfirmed = result.EmailConfirmed;
        })
    };

    //Default initialized methods
    getUserInfo();

}]);