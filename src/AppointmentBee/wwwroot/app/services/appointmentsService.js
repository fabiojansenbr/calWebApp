'use strict';
app.factory('appointmentsService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var appointmentsServiceFactory = {};

    var _getAppointments = function () {

        return $http.get(serviceBase + 'api/appointments').then(function (results) {
            return results;
        });
    };

   
    appointmentsServiceFactory.getAppointments = _getAppointments;

    return appointmentsServiceFactory;

}]);