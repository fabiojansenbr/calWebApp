'use strict';
app.controller('sideNavController', ['$mdDialog', '$scope', '$mdSidenav', '$mdBottomSheet', '$log',
function ($mdDialog, $scope, $mdSidenav, $mdBottomSheet, $log) {
    $scope.toggleList = function () {
        $mdSidenav('left').toggle();
    };

    $scope.openMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };
}]);