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

            localStorageService.set('authorizationData', { token: response.access_token, email: loginData.email, tokenExpiration: response['.expires'] });
        
            _authentication.isAuth = true;
            _authentication.email = loginData.email;
            //Save credentials for auto-log in.
            localStorageService.set('credentials', { email: loginData.email, password: loginData.password });
            _credentials.email = loginData.email;
            _credentials.password = loginData.password;
            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _autoLogin = function () {
        if (_credentials)
        {
            return _login(_credentials);
        }     
    };

    var _logOut = function () {

        _clearLocalData();
        //stop the signalr connection.
        $.connection.hub.stop();

    };

    var _clearLocalData = function (){
        localStorageService.remove('authorizationData');
        localStorageService.remove('credentials');
        _authentication.isAuth = false;
        _authentication.email = "";
        _credentials.email = "";
        _credentials.password = "";
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            var tokenExpiration = new Date(authData.tokenExpiration);
            var currentDate = new Date();
            tokenExpiration > currentDate ? _authentication.isAuth = true : _authentication.isAuth = false;
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

    var _fillCredentials = function () {
        var credentials = localStorageService.get('credentials');
        if (credentials) {
            _credentials.email = credentials.email;
            _credentials.password = credentials.password;
             
        }
    };

    authServiceFactory.register = _register;
    authServiceFactory.login = _login;
    authServiceFactory.autoLogin = _autoLogin;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.fillCredentials = _fillCredentials;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.credentials = _credentials;
    authServiceFactory.confirmEmail = _confirmEmail;

    return authServiceFactory;
}]);