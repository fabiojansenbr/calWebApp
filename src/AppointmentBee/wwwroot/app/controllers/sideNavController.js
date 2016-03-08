'use strict';
app.controller('sideNavController', ['$scope', '$mdSidenav', '$mdBottomSheet', '$log',
function ($scope, $mdSidenav, $mdBottomSheet, $log) {
    $scope.toggleList= function() {
        $mdSidenav('left').toggle();
    }

}]);