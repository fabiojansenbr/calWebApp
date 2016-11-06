'use strict';
app.factory('calendarService', ['$http', 'serverSettings', function ( $http, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    var calendarServiceFactory = {};

    var _currentCalendarId ='';
    var _myCalendar = '';

    var _getUserCalendar= function () {

        return $http.get(serviceBase + 'api/calendars').then(function (result) {    
            _myCalendar = result.data;      
            return result.data;
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

   var _getMyCalendar = function(){
       return _myCalendar;
   };
    calendarServiceFactory.getCurrentCalendarId = _getCurrentCalendarId;
    calendarServiceFactory.setCurrentCalendarId = _setCurrentCalendarId;
    calendarServiceFactory.getMyCalendar = _getMyCalendar;
    calendarServiceFactory.getUserCalendar= _getUserCalendar;
    calendarServiceFactory.getUserInfo = _getUserInfo;
    return calendarServiceFactory;

}]);