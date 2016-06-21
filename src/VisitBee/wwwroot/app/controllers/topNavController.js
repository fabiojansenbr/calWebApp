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
            $scope.pendingCalendarCount = result.length;
            $scope.pendingCalendars = result;
        },
        function (err) {
            //handle error result.
        });
    };

    getPendingCalendars();

  
}]);