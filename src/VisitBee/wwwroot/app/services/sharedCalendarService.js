'use strict';
app.factory('sharedCalendarService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var sharedCalendarServiceFactory = {};

    var _getPendingCalendars = function () {

        return $http.get(serviceBase + 'api/SharedCalendars/GetSharedCalendarsByStatus/Pending').then(function (result) {
            return result.data;
        });
    };
   
    sharedCalendarServiceFactory.getPendingCalendars = _getPendingCalendars;
    return sharedCalendarServiceFactory;

}]);