'use strict';
app.factory('calendarService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var calendarServiceFactory = {};

    var _getUserCalendar= function () {

        return $http.get(serviceBase + 'api/calendars').then(function (result) {          
            return result.data.Id;
        });
    };

   
    calendarServiceFactory.getUserCalendar= _getUserCalendar;

    return calendarServiceFactory;

}]);