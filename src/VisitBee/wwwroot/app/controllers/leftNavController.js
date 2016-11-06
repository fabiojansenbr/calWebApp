'use strict';
app.controller('leftNavController', ['$scope', '$rootScope', '$location', 'authService', 'calendarService', 'sharedCalendarService', '$mdDialog', '$mdMedia', '$mdToast',
    function ($scope, $rootScope, $location, authService, calendarService, sharedCalendarService, $mdDialog, $mdMedia, $mdToast) {

    $scope.userAccount = {
        userName: '',
        email: '',
        emailConfirmed: true
    };
  
    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }

    $scope.authentication = authService.authentication; 

    //Whether to use full screen or not in a dialog. Fullscreen dialog causes performance problems on Edge browser. therefore disabled.  
    var shouldUseFullScreen = function () {
        if (navigator.appVersion.indexOf('Edge') > -1)
            return false;
        else
            return ($mdMedia('sm') || $mdMedia('xs'));
    };

    var useFullScreen = shouldUseFullScreen();

    $scope.DialogCancel = function () {
        $mdDialog.cancel();
    };

    /************************************************************
    * Calendar sharing
    ************************************************************/
    

    $scope.allCollaborators = '';

    $scope.showInvitationDialog = function(){

        $scope.collaborator = {
            CollaboratorEmail: '',
            CollaborationLevel: 'FullEdit'
        };

        $mdDialog.show({
            templateUrl: 'inviteCollaborator',
            scope: $scope,
            preserveScope: true,
            bindToController: true,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
       .then(function () {

       }, function () {

       });
    }
    
    $scope.isSendingInvitation = false;
    
    $scope.sendInvitation = function () {

        $scope.isSendingInvitation = true;

        sharedCalendarService.shareCalendarWith($scope.collaborator).then(function (response) {

            $mdToast.show($mdToast.simple()
                       .textContent('You shared your calendar with ' + $scope.collaborator.CollaboratorEmail)
                       .position('top left')
                       .capsule(true)
                       .theme('success-toast')
                       .hideDelay(2000));
        },
        function (response) {

            $mdToast.show($mdToast.simple()
                     .textContent(response.statusText)
                     .highlightAction(true)
                     .position('top left')
                     .capsule(true)
                     .theme('error-toast')
                     .hideDelay(2000));

        }).finally(function () {
            $scope.isSendingInvitation = false;
            $mdDialog.cancel();
        });
    };


     /************************************************************
    * Shared Calendars with me
    ************************************************************/
    
    $scope.acceptedCalendars = {}

    var getAcceptedCalendars = function () {
        sharedCalendarService.getAcceptedCalendars().then(function (result) {
            $scope.acceptedCalendars = result;
        },
        function (err) {
            //handle error result.
        });
    };


    //User account details. 
    var getUserInfo = function () {
        calendarService.getUserInfo().then(function (result) {
            $scope.userAccount.userName = result.Name;
            $scope.userAccount.email = result.Email;
            $scope.userAccount.emailConfirmed = result.EmailConfirmed;
        })
    };

    //Default initialized methods
    getUserInfo();
    getAcceptedCalendars();

}]);