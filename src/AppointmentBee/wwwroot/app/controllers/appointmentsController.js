'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', 'calendarService', 'serverSettings', '$mdDialog', '$mdMedia', '$mdToast' , '$rootScope',
    function ($scope, appointmentsService, calendarService, serverSettings, $mdDialog, $mdMedia, $mdToast, $rootScope, uiCalendarConfig) {

    var serviceBase = serverSettings.serviceBaseUri;
    $scope.IsTouchMove = false;

    $scope.DetectTouchScreen = function () {
        // solution based on http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
        return 'ontouchstart' in window        // works on most browsers 
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };


    var clearNewAppointment = function () {
        $scope.oNewAppointment = {
            StartDate: '',
            EndDate: '',
            /*Patient: {
                PatientName: '',
                PhoneNumber: ''
            },*/
            IsAvailable: true,
            AppointmentNote: ''
        };
    };

    
    //this function get's only the users own calendars appointments.
    var getAppointments = function () {
        appointmentsService.getAppointments().then(function (results) {
          
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

    var deleteAppointment = function (data) {
        appointmentsService.deleteAppointment(data).then(function (result) {
            getAppointments();
        })
    };

    var putAppointment = function (data) {
        appointmentsService.putAppointment(data).then(function (result) {
          
            getAppointments();
            $scope.eventDataTransform(data);
            $('#calendar').fullCalendar('refetchEvents');
            $('#calendar').fullCalendar('rerenderEvents');
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
          
            var appointmantDate = new Date(data.StartDate);

            $mdToast.show($mdToast.simple()
                         .textContent(data.Creator.Name + ' added an appointment.  ' + appointmantDate.toUTCString())
                         .action('OK')
                         .position('bottom left')
                         .theme('success-toast')
                         .hideDelay(2000));
        };

        appointments.client.deleteAppointment = function (data) {
            getAppointments();
          
            var appointmantDate = new Date(data.StartDate);

            $mdToast.show($mdToast.simple()
                         .textContent(data.Creator.Name + ' removed an appointment.  ' + appointmantDate.toUTCString())
                         .action('OK')
                         .position('bottom left')
                         .theme('error-toast')
                         .hideDelay(2000));

        };

        appointments.client.updateAppointment = function (data) {
                   
            getAppointments();
            $scope.eventDataTransform(data);
            $('#calendar').fullCalendar('refetchEvents');
            $('#calendar').fullCalendar('rerenderEvents');

            var appointmantDate = new Date(data.StartDate);

            $mdToast.show($mdToast.simple()
                        .textContent(data.Creator.Name + ' updated an appointment.  ' + appointmantDate.toUTCString())
                        .action('OK')
                        .position('bottom left')
                        .theme('info-toast')
                        .hideDelay(2000));
        };

        $.connection.hub.logging = true;

        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
            $.connection.hub.start().done(function () {
                appointments.server.subscribeToCalendar(calendarId);
            });
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

    $scope.showAddAppointmentDialog = function (start, end, data) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')); //  && $scope.customFullscreen;
        clearNewAppointment();

        if (data)
        {
            $scope.oNewAppointment = data;
            $scope.oNewAppointment.StartDate = data.start;
            $scope.oNewAppointment.EndDate = data.end;
            
        }
        else
        {
            $scope.oNewAppointment.StartDate = start; //date.clone();
            $scope.oNewAppointment.EndDate = end; //date.clone().add(45, 'minutes'); //.format("MM/DD/YYYY HH:mm");
        }
        
        $mdDialog.show({
            templateUrl: 'dialog1.tmpl.html',
            scope: $scope,
            preserveScope: true,
            bindToController: true,
            //targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
        .then(function () {
            
        }, function () {
            clearNewAppointment();
        });
    }

    $scope.dayClick = function (date, jsEvent, view) {
        if (!$scope.IsTouchMove) {
            $scope.showAddAppointmentDialog(date, date.clone().add(45, 'minutes'));
        } 
    }

    $scope.eventClick = function (event, jsEvent, view) {
        $scope.showAddAppointmentDialog(null, null, event);
    }

    $scope.select = function (start, end) {
        if (!$scope.IsTouchMove) {
            $scope.showAddAppointmentDialog(start, end);
        }
    }

    //Change the calendars view
    $scope.changeView = function (view) {
        if (view == 'today')
            $('#calendar').fullCalendar('today');
        else
            $('#calendar').fullCalendar('changeView', view);
    };

    //hook calendar view change event to update pressed button status
    $scope.viewChanged = function (view) {
        //TODO - change pressed buttons
    };
       
    $scope.renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
        /* config object */
    var calendarConfig = {
        height: "auto",
        header: {
            left: 'prev',
            center: 'title',
            right: 'next'
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
        //eventOverlap: false,
        eventDataTransform: $scope.eventDataTransform,
        changeView: $scope.viewChanged,
        renderCalender: $scope.renderCalender,
        viewRender: $scope.viewRender,
        eventClick: $scope.eventClick
    };
    
    if ($scope.DetectTouchScreen()) {
        calendarConfig.dayClick = $scope.dayClick;
    }
    else {
        calendarConfig.selectable = true;
        calendarConfig.selectHelper = true;
        calendarConfig.select = $scope.select;
        calendarConfig.editable = true;
    }
    

    $scope.uiConfig = {
        calendar: calendarConfig
    };
        /* Change View */
   
    $scope.eventSources = [];
    getAppointments();
    getUserCalendar();

    

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.DialogCancel = function () {
        clearNewAppointment();
        $mdDialog.cancel();
    };

    $scope.DialogAddAppointment = function () {
        if ($scope.oNewAppointment.Id) {
            $scope.oNewAppointment.source = {}; //was causing circular reference exceptiion - probably needs to limit appointment object
            $scope.oNewAppointment.CreatorId = $scope.oNewAppointment.Creator.Id;
            putAppointment($scope.oNewAppointment);
        }
        else
            postAppointment($scope.oNewAppointment);
        clearNewAppointment();
        $mdDialog.hide();
    };

    $scope.DialogDeleteAppointment = function () {
        deleteAppointment($scope.oNewAppointment);
        clearNewAppointment();
        $mdDialog.hide();
    };

    }]
).directive('hbTouchmove', [function () {
    return function (scope, element, attr) {
        element.on('touchmove', function (event) {
            scope.$apply(function () {
                scope.$eval(attr.hbTouchmove);
            });
        });
    };
}]).directive('hbTouchend', [function () {
    return function (scope, element, attr) {
        element.on('touchend', function (event) {
            scope.$apply(function () {
                scope.$eval(attr.hbTouchend);
            });
        });
    };
}]);

