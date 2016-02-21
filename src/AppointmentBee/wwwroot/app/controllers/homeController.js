'use strict';
app.controller('homeController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    //If authenticated - redirect to appointments.
    if (authService.getAuthStatus()){
        $location.path('/appointments');
    }

}]);