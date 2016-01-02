var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($routeProvider) {

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

    $routeProvider.when("/appointments", {
        controller: "appointmentsController",
        templateUrl: "/app/views/appointments.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });
});

//var serviceBase = 'http://calrest.azurewebsites.net/';
var serviceBase  = 'http://localhost:53292/';
app.constant('serverSettings', {
   serviceBaseUri: serviceBase
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});