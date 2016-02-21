﻿var app = angular.module('AngularCalendar', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'ui.calendar', 'ngMaterial', 'ngMessages']);

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

app.run(['authService', function (authService) {
    //This is used to populate user email from local storage here.
    authService.fillAuthData();

    if (authService.getAuthStatus() == false) {
        authService.autoLogin();
    }
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});