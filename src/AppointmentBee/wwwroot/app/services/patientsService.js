'use strict';
app.factory('patientsService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var patientsServiceFactory = {};

    var _getPatients = function () {

        return $http.get(serviceBase + 'api/patients').then(function (results) {
            return results;
        });
    };

    var _postPatient = function (data) {
        
        return $http.post(serviceBase + 'api/patients', data).then(function (results) {
            return results;
        });
    };

    var _deletePatient = function (data) {

        return $http.delete(serviceBase + 'api/patients/' + data.Id, data).then(function (results) {
            return results;
        }, function (error) {
            var tmp = error;
            console.error(error.statusText);
        });
    };
   
    var _putPatient = function (data) {

        return $http.put(serviceBase + 'api/patients/' + data.Id, data).then(function (results) {
            return results;
        }, function (error) {
            var tmp = error;
            console.error(error.statusText);
        });
    };

    patientsServiceFactory.getPatients = _getPatients;
    patientsServiceFactory.postPatient = _postPatient;
    patientsServiceFactory.deletePatient = _deletePatient;
    patientsServiceFactory.putPatient = _putPatient;

    return patientsServiceFactory;

}]);