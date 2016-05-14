'use strict';
app.controller('confirmController', ['$scope', '$location', '$timeout', 'authService', '$mdToast',
function ($scope, $location, $timeout, authService, $mdToast) {

    $scope.confirmSuccess = false;
    $scope.isProcessing = true;


    $scope.confirmData = {
        userid: $location.search().userid,
        token: $location.search().token,
        email: $location.search().email
    };

    $scope.isProcessing = true;
    $mdToast.show($mdToast.simple()
                       .textContent("Confirming your email..")
                       .position('top left')
                       .capsule(true)
                       .theme('info-toast')
                       .hideDelay(3000));

        authService.confirmEmail($scope.confirmData).then(function (response) {
            if (response == 200) {
                $scope.confirmSuccess = true;
                $scope.isProcessing = true;
                $mdToast.show($mdToast.simple()
                       .textContent("Your account is Activated! Logging you in..")
                       .position('top left')
                       .capsule(true)
                       .theme('success-toast')
                       .hideDelay(2000));

                //Check the email from the confirmation link, if matches auto-login user
                if ($scope.confirmData.email == authService.getEmail()) {
                    //No previous authentication
                    if (authService.getAuthStatus() == false) {
                        var result = authService.autoLogin().then(function (response) { startTimer('/appointments'); }, //autologin succesful navigate to appointments
                                               function (response) { startTimer('/login'); });
                    } else {
                        startTimer('/appointments');
                    }
                } else {
                    authService.logOut();
                    startTimer('/login');
                }
               
             
            };
          
        }, 
        function (response) {

            var errors = [];
            for (var key in response.data.ModelState) {
                for (var i = 0; i < response.data.ModelState[key].length; i++) {
                    errors.push(response.data.ModelState[key][i]);
                }
            }

            $mdToast.show($mdToast.simple()
                                   .textContent('Error Occured: ' + errors.join(' '))
                                   .position('top left')
                                   .capsule(true)
                                   .theme('error-toast')
                                   .hideDelay(50000));
            $scope.confirmSuccess = false;
            $scope.isProcessing = false;
        }).finally(function () {
           // 
        });


    var startTimer = function (navigationpath) {
         var timer = $timeout(function () {
             $timeout.cancel(timer);
             $location.search({ }); //clear the query parameters
             $location.path(navigationpath);
         }, 2000);
     }
}]);