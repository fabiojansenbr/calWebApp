'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'serverSettings', function ($http, $q, localStorageService, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,  
        email: ""
    };

    var _credentials = {
        email: "",
        password: ""
    };

    var _register = function (registration) {

        _logOut();

        var deferred = $q.defer();

        return $http.post(serviceBase + 'api/account/register', registration).success(function (response) {
            deferred.resolve(response);
            localStorageService.set('credentials', { email: registration.email, password: registration.password });
        }).error(function (err, status) {            
            deferred.reject(err)
        });

        return deferred.promise;
    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.email + "&password=" + loginData.password;

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, email: loginData.email });

            _authentication.isAuth = true;
            _authentication.email = loginData.email;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.email = "";
        //stop the signalr connection.
        $.connection.hub.stop();

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.email = authData.email;
        }

    };

    var _confirmEmail = function (confirmData) {

        return $http.get(serviceBase + 'api/account/ConfirmEmail?userid=' + confirmData.userid
                                     + '&token=' + encodeURIComponent(confirmData.token))
            .then(function (response) {
            return response.status;
        });           
    };

    var _getCredentials = function () {
        var credentials = localStorageService.get('credentials');
        if (credentials) {
            _credentials.email = credentials.email;
            _credentials.password = credentials.password;
             
        }
    };

    authServiceFactory.register = _register;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.getCredentials = _getCredentials;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.confirmEmail = _confirmEmail;

    return authServiceFactory;
}]);