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

            //TODO - Note, username coming from server is email. 
            //When usernames are actually introduced as a different data we may need to change this
            var userEmail = response.userName;
            localStorageService.set('authorizationData', { token: response.access_token, email: userEmail, tokenExpiration: response['.expires'] });

            _authentication.isAuth = true;
            _authentication.email = userEmail;

            if (loginData.remember) {               
                //Save credentials for auto-log in.
                localStorageService.set('credentials', { email: userEmail, password: loginData.password });
                _credentials.email = userEmail;
                _credentials.password = loginData.password;
            }
           

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _autoLogin = function () {

        var deferred = $q.defer();

     var credentials = localStorageService.get('credentials');
        if (credentials) {
            _credentials.email = credentials.email;
            _credentials.password = credentials.password;
            return _login(_credentials);             
        } else {
            deferred.reject(false);
            return deferred.promise;
        }

       
    };

    //If credentials are saved, it means remember me.
    var _rememberMe = function () {
        var credentials = localStorageService.get('credentials');
        var rememberMe = false;
        credentials ? rememberMe = true : rememberMe = false;

        return rememberMe;
    }

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
            _authentication.isAuth = _getAuthStatus();
            _authentication.email = authData.email;
        }
    };

    //Checks the local storage token for expiration. Returns true if token is not expired.
    //Note that it doesn't validate the token from the server side.
    var _getAuthStatus = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            var tokenExpiration = new Date(authData.tokenExpiration);
            var currentDate = new Date();
            tokenExpiration > currentDate ? _authentication.isAuth = true : _authentication.isAuth = false;
        } else { _authentication.isAuth = false; }

        return _authentication.isAuth;
    };

    //Returns true if the token is about to expire or doesn't exist at all.
    //TODO: Currently using this method in authinterceptor in every http request.
    var _shouldRefreshToken = function () {
        var authData = localStorageService.get('authorizationData');
        var shouldRefresh = true;
        if (authData) {
            var tokenExpiration = new Date(authData.tokenExpiration);
            var currentDate = new Date();
            var diffMinutes = Math.floor(((tokenExpiration - currentDate) / 1000) / 60);
            diffMinutes < 10 ? shouldRefresh = true : shouldRefresh = false;
        }

        return shouldRefresh;

    };

    var _confirmEmail = function (confirmData) {

        return $http.get(serviceBase + 'api/account/ConfirmEmail?userid=' + confirmData.userid
                                     + '&token=' + encodeURIComponent(confirmData.token))
            .then(function (response) {
            return response.status;
        });           
    };

    //Returns the email from credentials that is first populated after sign-up and updated after logins.
    var _getEmail = function () {
        var credentials = localStorageService.get('credentials');
        if (credentials) {
            return localStorageService.get('credentials').email;
        } else { return null;}
      
    };

    authServiceFactory.register = _register;
    authServiceFactory.login = _login;
    authServiceFactory.autoLogin = _autoLogin;
    authServiceFactory.rememberMe = _rememberMe;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.getAuthStatus = _getAuthStatus;
    authServiceFactory.shouldRefreshToken = _shouldRefreshToken;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.credentials = _credentials;
    authServiceFactory.confirmEmail = _confirmEmail;
    authServiceFactory.getEmail = _getEmail;

    return authServiceFactory;
}]);