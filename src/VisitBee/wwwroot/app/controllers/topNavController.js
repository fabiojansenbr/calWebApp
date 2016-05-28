'use strict';
app.controller('topNavController', ['$mdDialog', '$scope', '$mdSidenav', '$mdBottomSheet', '$log', 'patientsService', '$q', '$mdMedia',
function ($mdDialog, $scope, $mdSidenav, $mdBottomSheet, $log, patientsService, $q, $mdMedia) {

   
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

  
}]);