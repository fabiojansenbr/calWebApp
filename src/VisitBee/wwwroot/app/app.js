var app = angular.module('AngularCalendar', ['ngAnimate', 'ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'ui.calendar', 'ngMaterial', 'ngMessages', 'ngAria']);

app.config(['$routeProvider', '$mdThemingProvider', '$provide',function ($routeProvider, $mdThemingProvider, $provide) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });
        $routeProvider.when("/landing", {
        controller: "homeController",
        templateUrl: "/app/views/landing.html"
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

    $routeProvider.when("/forgotpassword", {
        controller: "loginController",
        templateUrl: "/app/views/forgotpassword.html"
    });

    $routeProvider.when("/resetpassword", {
        controller: "passwordResetController",
        templateUrl: "/app/views/resetpassword.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink');

    $mdThemingProvider.theme('myCalendar')
        .primaryPalette('blue')
        .accentPalette('pink');

    $mdThemingProvider.theme('sharedCalendar')
        .primaryPalette('purple')
        .accentPalette('green');

    $mdThemingProvider.alwaysWatchTheme(true);
    $provide.value('themeProvider', $mdThemingProvider);
}]);

var serviceBase = 'http://calrest.azurewebsites.net/';
//var serviceBase  = 'http://localhost:53292/';
app.constant('serverSettings', {
   serviceBaseUri: serviceBase
});

app.run(['$rootScope', '$location', 'authService', '$mdDialog', '$window', function ($rootScope, $location, authService, $mdDialog, $window) {

    $rootScope.$on('$locationChangeStart', function (event) {
        // Check if there is a dialog active
        if (angular.element(document).find('md-dialog').length > 0) {
            event.preventDefault(); // Prevent route from changing
            $mdDialog.cancel();  // hide the active dialog
        }
    })

    //Attempt auto-login if user is not authenticated/token is expired and credentials saved.
    if (authService.getAuthStatus() == false && authService.rememberMe()) {
        authService.autoLogin().finally(function () {
            authService.fillAuthData();
        });
    }

    if (authService.getAuthStatus()) {
        //Populate authService variables from local storage.
        authService.fillAuthData();
       

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
    }

}]);



app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});