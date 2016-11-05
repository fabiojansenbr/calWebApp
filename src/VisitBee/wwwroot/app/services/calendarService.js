'use strict';
app.factory('calendarService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var calendarServiceFactory = {};

    var _currentCalendarId ='';
    var _myCalendarId = '';

    var _getUserCalendar= function () {

        return $http.get(serviceBase + 'api/calendars').then(function (result) {    
            _myCalendarId = result.data.Id;      
            return result.data.Id;
        });
    };

    var _getUserInfo = function () {

        return $http.get(serviceBase + 'api/account/GetUserInfo').then(function (result) {
            return result.data;
        });
    };
   
   var _getCurrentCalendarId = function (){
       return _currentCalendarId;
   };

   var _setCurrentCalendarId = function (id){
       _currentCalendarId = id;
   };

   var _getMyCalendarId = function(){
       return _myCalendarId;
   };
    calendarServiceFactory.getCurrentCalendarId = _getCurrentCalendarId;
    calendarServiceFactory.setCurrentCalendarId = _setCurrentCalendarId;
    calendarServiceFactory.getMyCalendarId = _getMyCalendarId;
    calendarServiceFactory.getUserCalendar= _getUserCalendar;
    calendarServiceFactory.getUserInfo = _getUserInfo;
    return calendarServiceFactory;

}]);