'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', 'calendarService', 'serverSettings', function ($scope, appointmentsService, calendarService, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    $scope.appointments = [];
   
    //this function get's only the users own calendars appointments.
    var getAppointments = function () {
        appointmentsService.getAppointments().then(function (results) {

            $scope.appointments = results.data;

        }, function (error) {
            alert(error.data.message);
        });
    };
   
    //get the User's own calendar
    var getUserCalendar = function () {
        calendarService.getUserCalendar().then(function (result) {
            subscribeToAppointments(result);
        })
    };

    var subscribeToAppointments = function (calendarId) {
        $.connection.hub.url = serviceBase + 'signalr';
        var appointments = $.connection.appointmentHub;
        appointments.client.newAppointment = function (data) {
            getAppointments();
           // $.notify("<strong>" + data.Creator.Name + "<strong>" + " added an appointment");
            $.notify({
                title:  '<strong>' + data.Creator.Name + '</strong>' + ' added an appointment.',
                message: '<p>' + data.StartDate + '</p>',
                icon: 'glyphicon glyphicon-plus'
            }, {
                type: 'info',
                placement: {
                    from: "bottom",
                    align: "right"
                }
            });
     
        };
        $.connection.hub.logging = true;

        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
            $.connection.hub.start().done(function () {
                appointments.server.subscribeToCalendar(calendarId);
            });
        }
    };

    getAppointments();
    getUserCalendar();
   

}]);