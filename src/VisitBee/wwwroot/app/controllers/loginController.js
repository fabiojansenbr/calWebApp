'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', '$mdToast', '$timeout', 'serverSettings', function ($scope, $location, authService, $mdToast, $timeout, serverSettings) {

    $scope.loginData = {
        email: "",
        password: ""
    };

    //forgotten password related stuff
    $scope.retrieveSuccess = false;
    $scope.isProcessing = false;


    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/appointments');

        },
         function (err) { 
             $mdToast.show($mdToast.simple()
                      .textContent(err.error_description)
                      .position('top left')
                      .capsule(true)
                      .theme('error-toast')
                      .hideDelay(1200));
         });
    };

    $scope.retrievePasswordReset = function () {
        $scope.isProcessing = true;
    
        authService.retrievePasswordReset($scope.loginData.email).then(function (respnse) {
            $scope.retrieveSuccess = true;
           
            $mdToast.show($mdToast.simple()
                       .textContent('We just sent a password reset link to ' + $scope.loginData.email)
                       .position('top left')
                       .capsule(true)
                       .theme('success-toast')
                       .hideDelay(2000));
            startTimer('/login');
        },
        function (response) {
            
            $mdToast.show($mdToast.simple()
                     .textContent(response.statusText)
                     .action('ok')
                     .highlightAction(true)
                     .position('top left')
                     .capsule(true)
                     .theme('error-toast')
                     .hideDelay(2000));

        }).finally(function () {
            $scope.isProcessing = false;
        });
    };


    var startTimer = function (navigationpath) {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.search({}); //clear the query parameters
            $location.path(navigationpath);
        }, 2000);
    }

    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = serverSettings.serviceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + serverSettings.clientId
                                                                    + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };

                authService.registerExternal(authService.externalAuthData).then(function (response) {

                    $scope.savedSuccessfully = true;
                    $scope.message = "User has been registered successfully, you will be redicted to orders page in 2 seconds.";
                    var timer = $timeout(function () {
                        $timeout.cancel(timer);
                        $location.path('/appointments');
                    }, 2000);

                        },
                  function (response) {
                      var errors = [];
                      for (var key in response.modelState) {
                          errors.push(response.modelState[key]);
                      }
                      $scope.message = "Failed to register user due to:" + errors.join(' ');
                  });

                //$location.path('/associate');

            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {

                    $location.path('/appointments');

                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
    }

}]);