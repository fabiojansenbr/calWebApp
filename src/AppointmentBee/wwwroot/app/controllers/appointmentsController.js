'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', 'calendarService', 'serverSettings', '$mdDialog', function ($scope, appointmentsService, calendarService, serverSettings, $mdDialog) {

    var serviceBase = serverSettings.serviceBaseUri;

    $scope.appointments = [];

    var clearNewAppointment = function () {
        $scope.oNewAppointment = {
            StartDate: '',
            EndDate: '',
            Patient: {
                PatientName: '',
                PhoneNumber: ''
            }
        };
    };

    

    //this function get's only the users own calendars appointments.
    var getAppointments = function () {
        appointmentsService.getAppointments().then(function (results) {
            $scope.appointments = results.data;

            //maybe there is better way?
            $scope.eventSources[0] = results.data;

        }, function (error) {
            //alert(error.data.message);
        });
    };

    var postAppointment = function (data) {
        appointmentsService.postAppointment(data).then(function (result) {
            getAppointments();
        })
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
                title: '<strong>' + data.Creator.Name + '</strong>' + ' added an appointment.',
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
        var fullEvent = { id: eventData.Id, title: "", start: eventData.StartDate, end: eventData.EndDate, className: "eventAvailable" };
        if (eventData.Patient)
            fullEvent.title = eventData.Patient.PatientName;

        if (eventData.IsAvailable == false) {
            fullEvent.className = "eventUnavailable";
            if (eventData.AppointmentNote)
                fullEvent.title = eventData.AppointmentNote;
            else
                fullEvent.title = "Unavailable";
        }
        
        return $.extend(eventData, fullEvent);
    }

    //quick and dirty hack to show labels for each time slot for resolving fullcalendar issue:  https://github.com/fullcalendar/fullcalendar/issues/2786
    function TimeFix(durationInMinutes, minTime) {
        var hour = moment(minTime, "HH:mm");
        $(".fc-body .fc-slats table tr").each(function (index) {
            $(this).find("td.fc-widget-content").eq(0).html("<span>" + hour.format("HH:mm") + "</span>")
            hour.add(durationInMinutes, "minutes");
        });
    }

    $scope.viewRender = function (view, element) {
        var item = view;
        TimeFix(45, "08:00:00");
    }

    $scope.showAdvanced = function (ev, date) {
        var useFullScreen = false; //($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        clearNewAppointment();

        $scope.oNewAppointment.StartDate = date.format("MM/DD/YYYY HH:mm");
        $scope.oNewAppointment.EndDate = date.add(45, 'minutes').format("MM/DD/YYYY HH:mm");

        $mdDialog.show({
            templateUrl: 'dialog1.tmpl.html',
            scope: $scope,
            preserveScope: true,
            bindToController: true,
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function (answer) {
            postAppointment($scope.oNewAppointment);
            clearNewAppointment();
            //$scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            clearNewAppointment();
            //$scope.status = 'You cancelled the dialog.';
        });
    }

    $scope.dayClick = function(date, jsEvent, view) {
        $scope.showAdvanced(jsEvent, date);
        //alert('Clicked on: ' + date.format());

        // change the day's background color just for fun
        //$(this).css('background-color', 'red');

    }

    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: 550,
            editable: true,
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            defaultView: 'agendaWeek',
            slotLabelFormat: 'hh:mm',
            minTime: "08:00:00",
            maxTime: "20:00:00",
            slotDuration: "00:45:00",
            slotLabelInterval: "00:45:00",
            snapDuration: "00:45:00",
            weekends: false,
            displayEventEnd: false,
            timeFormat: "HH:mm",
            eventDataTransform: $scope.eventDataTransform,
            changeView: $scope.changeView,
            renderCalender: $scope.renderCalender,
            viewRender: $scope.viewRender,
            dayClick: $scope.dayClick
        }
    };

    $scope.eventSources = [];
    getAppointments();
    getUserCalendar();

    

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

}]);

//function DialogController($scope, $mdDialog) {
//    $scope.hide = function () {
//        $mdDialog.hide();
//    };

//    $scope.cancel = function () {
//        $mdDialog.cancel();
//    };

//    $scope.answer = function (answer) {
//        $mdDialog.hide(answer);
//    };
//}