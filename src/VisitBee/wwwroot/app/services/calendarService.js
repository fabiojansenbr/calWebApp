'use strict';
app.factory('calendarService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var calendarServiceFactory = {};

    var _getUserCalendar= function () {

        return $http.get(serviceBase + 'api/calendars').then(function (result) {          
            return result.data.Id;
        });
    };

    var _getUserInfo = function () {

        return $http.get(serviceBase + 'api/account/GetUserInfo').then(function (result) {
            return result;
        });
    };
   
    calendarServiceFactory.getUserCalendar= _getUserCalendar;
    calendarServiceFactory.getUserInfo = _getUserInfo;
    return calendarServiceFactory;

}]);