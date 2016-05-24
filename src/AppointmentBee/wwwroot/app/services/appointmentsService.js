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
        
        //When Patient object is empty server side is responding with error.
        //Therefore if null check is true - removing the Patient object from the appointment object
        if (data.Patient.PatientName == '' && data.Patient.PhoneNumber == '')
            delete data.Patient;

        return $http.post(serviceBase + 'api/appointments', data).then(function (results) {
            return results;
        });
    };

    var _deleteAppointment = function (data) {

        return $http.delete(serviceBase + 'api/appointments/' + data.Id, data).then(function (results) {
            return results;
        }, function (error) {
            var tmp = error;
            console.error(error.statusText);
        });
    };
   
    var _putAppointment = function (data) {

        //When Patient object is empty server side is responding with error.
        //Therefore if null check is true - removing the Patient object from the appointment object
        if (data.Patient.PatientName == '' && data.Patient.PhoneNumber == '')
            delete data.Patient;

        return $http.put(serviceBase + 'api/appointments/' + data.Id, data).then(function (results) {
            return results;
        }, function (error) {
            var tmp = error;
            console.error(error.statusText);
        });
    };

    appointmentsServiceFactory.getAppointments = _getAppointments;
    appointmentsServiceFactory.postAppointment = _postAppointment;
    appointmentsServiceFactory.deleteAppointment = _deleteAppointment;
    appointmentsServiceFactory.putAppointment = _putAppointment;

    return appointmentsServiceFactory;

}]);