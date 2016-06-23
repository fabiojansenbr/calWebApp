'use strict';
app.controller('topNavController', ['$mdDialog', '$scope', '$mdSidenav', 'sharedCalendarService',
function ($mdDialog, $scope, $mdSidenav, sharedCalendarService) {

   
    $scope.toggleList = function () {
        $mdSidenav('left').toggle();
    };

    $scope.openMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };
 
    //Change the calendars view
    $scope.changeView = function (view) {
        if (view == 'today')
            $('#calendar').fullCalendar('today');
        else
            $('#calendar').fullCalendar('changeView', view);
    };

    //Pending Calendar Share Requests.
    $scope.pendingCalendarCount;
    $scope.pendingCalendars;
   
    var getPendingCalendars = function () {
        sharedCalendarService.getPendingCalendars().then(function (result) {

            if (result.length == 0) {
                $scope.pendingCalendarCount = '';
            } else {
                $scope.pendingCalendarCount = result.length;
            }
        
            $scope.pendingCalendars = result;
        },
        function (err) {
            //handle error result.
        });
    };

    $scope.acceptPendingCalendar = function (id) {
        sharedCalendarService.acceptPendingCalendar(id).then(function (result) {
            //after successfull acception - refresh pending calendar count.
            getPendingCalendars();
        });
    };

    $scope.declinePendingCalendar = function (id) {
        sharedCalendarService.declinePendingCalendar(id).then(function (result) {
            //after successfull rejection - refresh pending calendar count.
            getPendingCalendars();
        });
    };

    //Initialized functions by default.
    getPendingCalendars();

  
}]);