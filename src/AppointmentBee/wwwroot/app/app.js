var app = angular.module('AngularCalendar', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'ui.calendar', 'ngMaterial', 'ngMessages']);

app.config(function ($routeProvider, $mdThemingProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/confirmemail", {
        controller: "confirmController",
        templateUrl: "/app/views/confirm.html"
    });

    $routeProvider.when("/appointments", {
        controller: "appointmentsController",
        templateUrl: "/app/views/appointments.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });

    $mdThemingProvider.theme('default')
        .primaryPalette('blue');

});

var serviceBase = 'http://calrest.azurewebsites.net/';
//var serviceBase  = 'http://localhost:53292/';
app.constant('serverSettings', {
   serviceBaseUri: serviceBase
});

app.run(['$rootScope', '$location', 'authService', function ($rootScope, $location, authService) {
    //Populate authService variables from local storage.
    authService.fillAuthData();

    //Attempt auto-login if user is not authenticated/token is expired.
    if (authService.getAuthStatus() == false) {
        authService.autoLogin().finally(function () {
            //ReDirect to home, if authentication succeeds, user will be redirected to appointments on listener.
            authService.fillAuthData();
        });
    }

    //Direct user to appointment page if authenticated
    //Note this could be done in homecontroller as well, but in that case it would load the home.html
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.originalPath == '/home') {
            if (authService.getAuthStatus()) {
                event.preventDefault();
                $location.path('/appointments');
            }
           
        }

    });

}]);






app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});