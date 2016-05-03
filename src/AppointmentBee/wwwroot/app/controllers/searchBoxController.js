'use strict';
app.controller('SearchBoxController', ['$scope', '$location', '$timeout', 'patientsService', '$q', '$log',
function ($scope, $location, $timeout, patientsService, $q, $log) {

    $scope.simulateQuery = false;
    $scope.isDisabled = false;
    // array of patients
    $scope.patients = "";
    loadAll();
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;
    $scope.newPatient = newPatient;

    function newPatient(patient) {
        $log.info('Create New patient for:' + patient);
    }

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for patients.
     */
    function querySearch(query) {
        var results = query ? $scope.patients.filter(createFilterFor(query)) : $scope.patients,
          deferred;
        if ($scope.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Get all the patients at once. This is a cheap operation
     */
    function loadAll() {
        
        patientsService.getPatients().then(function (results) {

            $scope.patients = results.data;

        }, function (error) {
            //alert(error.data.message);
        });

       
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(patient) {
            return (patient.PatientName.indexOf(lowercaseQuery) === 0);
        };

    }
}
]);


