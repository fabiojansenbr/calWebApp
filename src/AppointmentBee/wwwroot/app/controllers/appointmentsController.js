'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', function ($scope, appointmentsService) {

    $scope.appointments = [];

    appointmentsService.getAppointments().then(function (results) {

        $scope.appointments = results.data;

    }, function (error) {
        alert(error.data.message);
    });

}]);