﻿'use strict';
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

    // *************************************************************************************
    // Smart Patient search Box
    // *************************************************************************************


    var patients = '';
    $scope.searchText = '';
    //Load Patients at once
    autoCompletePatientsloadAll();
    $scope.querySearch = querySearch;
    $scope.newPatient = newPatient;

    function newPatient(patient) {
        $scope.patient = patient;
       var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
            templateUrl: 'createNewClient',
            scope: $scope,
            preserveScope: true,
            bindToController: true,
            //targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
       .then(function () {

       }, function () {
          
       });
    }


    function autoCompletePatientsloadAll() {

        patientsService.getPatients().then(function (results) {
            patients = results.data;
        }, function (error) {
            //alert(error.data.message);
        });
    }

    function querySearch(query) {
        var results = query ? patients.filter(createFilterFor(query)) : patients, deferred;
        return results;
    }

    //Create filter function for a query string
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(patient) {
            return (patient.PatientName.indexOf(lowercaseQuery) === 0);
        };

    }

    //Dialog buttons

    $scope.DialogCancel = function () {
        $mdDialog.cancel();
    };

  
}]);