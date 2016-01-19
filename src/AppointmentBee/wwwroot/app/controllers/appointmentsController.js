'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', 'calendarService', 'serverSettings', function ($scope, appointmentsService, calendarService, serverSettings) {

    var serviceBase = serverSettings.serviceBaseUri;

    $scope.appointments = [];
   
    //this function get's only the users own calendars appointments.
    var getAppointments = function () {
        appointmentsService.getAppointments().then(function (results) {

            var fullAppointments = [];

            $scope.appointments = results.data;
            /*angular.forEach(results.data, function (value, key) {
                //alert("key: " + key + ", val: " + value.StartDate +" "+ value.EndDate +" "+ value.Patient.PatientName + " " + value.Id);
                fullAppointments.push({ title: value.Patient.PatientName, start: "2016-01-06T12:00:00+01:00", end: "2016-01-06T12:30:00+01:00" }); //start: value.StartDate, end: value.EndDate
            });*/

            /*$scope.events = [
          { title: 'Long Event', start: "2016-01-06T12:00:00+01:00", end: "2016-01-06T12:30:00+01:00" },
          { title: 'full day Event', start: "2016-01-14T12:00:00+01:00", allDay: true }
            ];*/

            $scope.eventSources[0] = results.data;
            var tmp = [];

        }, function (error) {
            //alert(error.data.message);
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


    //$scope.eventSources = [];
   
    
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        /* event source that contains custom events on the scope */
        /*$scope.events = [
          { title: 'All Day Event', start: new Date(y, m, 1) },
          { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
          { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
          { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
          { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false }
        ];*/
        
        
        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };

        $scope.eventDataTransform = function (eventData) {
            var fullEvent = { title: "", start: eventData.StartDate, end: eventData.EndDate, backgroundColor: "#00ff00" };
            if (eventData.Patient)
                fullEvent.title = eventData.Patient.PatientName;
            else
                fullEvent.title = eventData.AppointmenNote;

            if (eventData.IsAvailable == false) {
                fullEvent.backgroundColor = "#ff0000";
            }

            return fullEvent;
        }
        
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                defaultView: 'agendaWeek',
                slotLabelFormat: 'hh:mm',
                minTime: "08:15:00",
                slotDuration: "00:45:00",
                slotLabelInterval: "00:45:00",
                weekends: false,
                eventDataTransform: $scope.eventDataTransform,
                changeView: $scope.changeView,
                renderCalender: $scope.renderCalender
            }
        };

        /* event sources array*/
        //$scope.eventSources = [$scope.events]; //, $scope.notAvailableEvents]; //[$scope.events, $scope.eventSource, $scope.eventsF];
        //$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
    
        //alert(JSON.stringify($scope.eventSources));
        $scope.eventSources = [];
    getAppointments();
    getUserCalendar();
   

}]);