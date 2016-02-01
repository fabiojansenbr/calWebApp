'use strict';
app.factory('appointmentsService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var appointmentsServiceFactory = {};

    var _getAppointments = function () {

        return $http.get(serviceBase + 'api/appointments').then(function (results) {
            return results;
        });
    };

    var _postAppointment = function (data) {
        
        return $http.post(serviceBase + 'api/appointments', data).then(function (results) {
            return results;
        });
    };
   
    appointmentsServiceFactory.getAppointments = _getAppointments;
    appointmentsServiceFactory.postAppointment = _postAppointment;

    return appointmentsServiceFactory;

}]);