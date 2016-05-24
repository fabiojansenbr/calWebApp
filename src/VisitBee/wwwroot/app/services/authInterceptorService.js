'use strict';
app.factory('authInterceptorService', ['$q', '$location', '$injector', 'localStorageService', function ($q, $location, $injector, localStorageService) {

    var authInterceptorServiceFactory = {};
    var isRequestingToken = false;
    
    var _request = function (config) {

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        //Add token to the header if it exists locally
        if (authData) {
            var authService = $injector.get('authService');
            config.headers.Authorization = 'Bearer ' + authData.token;

            //If the token is about to expire - refresh it.
            if (authService.shouldRefreshToken()) {
                if (!isRequestingToken) {
                    isRequestingToken = true;
                    authService.autoLogin().then(function (response) { }, //Login Success - left here for future refactoring.
                                                 function (response) { }) //Failed
                                           .finally(function () { isRequestingToken = false; });
                }
                
            }
          
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            $location.path('/login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);