﻿'use strict';
app.factory('sharedCalendarService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var sharedCalendarServiceFactory = {};

    var _getPendingCalendars = function () {

        return $http.get(serviceBase + 'api/SharedCalendars/GetSharedCalendarsByStatus/Pending').then(function (result) {
            return result.data;
        });
    };

    var _getAcceptedCalendars = function () {

        return $http.get(serviceBase + 'api/SharedCalendars/GetSharedCalendarsByStatus/Accepted').then(function (result) {
            return result.data;
        });
    };

    var _acceptPendingCalendar = function (calendarId) {
        return $http.put(serviceBase + 'api/SharedCalendars/InvitationStatus/' + calendarId +  '/accepted').then(function (result) {
            return result;
        });
    };

    var _declinePendingCalendar = function (calendarId) {
        return $http.put(serviceBase + 'api/SharedCalendars/InvitationStatus/' + calendarId + '/declined').then(function (result) {
            return result;
        });
    };

    var _shareCalendarWith = function (data) {

        return $http.post(serviceBase + 'api/SharedCalendars/ShareCalendarWith', data).then(function (results) {
            return results;
        });
    };
   
    sharedCalendarServiceFactory.getPendingCalendars = _getPendingCalendars;
    sharedCalendarServiceFactory.getAcceptedCalendars = _getAcceptedCalendars;
    sharedCalendarServiceFactory.acceptPendingCalendar = _acceptPendingCalendar;
    sharedCalendarServiceFactory.declinePendingCalendar = _declinePendingCalendar;
    sharedCalendarServiceFactory.shareCalendarWith = _shareCalendarWith;
    return sharedCalendarServiceFactory;

}]);