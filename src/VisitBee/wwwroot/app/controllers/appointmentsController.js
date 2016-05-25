﻿'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', 'calendarService', 'serverSettings', '$mdDialog', '$mdMedia', '$mdToast', '$log', 'patientsService', '$q',
function ($scope, appointmentsService, calendarService, serverSettings, $mdDialog, $mdMedia, $mdToast, $log, patientsService, $q) {

    var serviceBase = serverSettings.serviceBaseUri;
    $scope.IsTouchMove = false;

    $scope.DetectTouchScreen = function () {
        // solution based on http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
        return 'ontouchstart' in window        // works on most browsers 
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };

    $scope.oNewAppointment = {
        StartDate: '',
        EndDate: '',
        PatientId: '',
        Patient: {
            PatientName: '',
            PhoneNumber: ''
        },
        IsAvailable: true,
        AppointmentNote: ''
    };

    var clearNewAppointment = function () {
        $scope.oNewAppointment = {
            StartDate: '',
            EndDate: '',
            PatientId: '',
           Patient: {
                PatientName: '',
                PhoneNumber: ''
            },
            IsAvailable: true,
            AppointmentNote: ''
        };
        $scope.searchText = '';
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
            $('#calendar').fullCalendar('removeEvents', data.Id);
            $('#calendar').fullCalendar('rerenderEvents');
        })
    };

    var putAppointment = function (data) {
        appointmentsService.putAppointment(data).then(function (result) {                     
        
            $('#calendar').fullCalendar('renderEvent', data, false);
            $('#calendar').fullCalendar('rerenderEvents');
        })
    };

    //get the User's own calendar
    var getUserCalendar = function () {
        calendarService.getUserCalendar().then(function (result) {
            subscribeToAppointments(result);
        })
    };

    //get User Info
    var getUserInfo = function () {
        calendarService.getUserInfo().then(function (result) {
            //TODO This will return Email Confirmation and user name. Display banner for unconfirmed emails. Use the name in sidenav
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
                         .position('bottom left')
                         .capsule(true)
                         .theme('success-toast')
                         .hideDelay(1500));
        };

        appointments.client.deleteAppointment = function (data) {
            
            $('#calendar').fullCalendar('removeEvents', data.Id);
            $('#calendar').fullCalendar('rerenderEvents');

            var appointmantDate = new Date(data.StartDate);

            $mdToast.show($mdToast.simple()
                         .textContent(data.Creator.Name + ' removed an appointment.  ' + appointmantDate.toUTCString())
                         .position('bottom left')
                         .capsule(true)
                         .theme('error-toast')
                         .hideDelay(1500));

        };

        appointments.client.updateAppointment = function (data) {
                              
            $('#calendar').fullCalendar('removeEvents', data.Id);
            $('#calendar').fullCalendar('renderEvent', data, false);
            $('#calendar').fullCalendar('rerenderEvents');
            var appointmantDate = new Date(data.StartDate);

            $mdToast.show($mdToast.simple()
                        .textContent(data.Creator.Name + ' updated an appointment.  ' + appointmantDate.toUTCString())
                        .position('bottom left')
                        .capsule(true)
                        .theme('info-toast')
                        .hideDelay(1500));
        };

        $.connection.hub.logging = true;

        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
            $.connection.hub.start().done(function () {
                appointments.server.subscribeToCalendar(calendarId);
            });
        }
    };

    $scope.eventDataTransform = function (eventData) {
        
        if (eventData.Patient) {
            var fullEvent = {
                id: eventData.Id,
                title: "",
                start: eventData.StartDate,
                end: eventData.EndDate,
                className: "eventAvailable",

            };
            fullEvent.title = eventData.Patient.PatientName;
        } else {
            var fullEvent = {
                id: eventData.Id,
                title: "",
                Patient: {
                    PatientName: '',
                    PhoneNumber: ''
                },
                start: eventData.StartDate,
                end: eventData.EndDate,
                className: "eventAvailable",

            };
        }

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
            if (data.Patient) {
                $scope.searchText = data.Patient.PatientName;
            }
            $scope.oNewAppointment = data;
            $scope.oNewAppointment.StartDate = data.start;
            $scope.oNewAppointment.EndDate = data.end;

            data = null;
        }
        else
        {
            $scope.oNewAppointment.StartDate = start; //date.clone();
            $scope.oNewAppointment.EndDate = end; //date.clone().add(45, 'minutes'); //.format("MM/DD/YYYY HH:mm"); 
            $scope.oNewAppointment.Patient.PatientName = "";
            $scope.oNewAppointment.Patient.PhoneNumber = "";
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

    // When day drag/drop and resize happens
    $scope.eventDateUpdate = function (event, delta, revertFunc) {
        $scope.oNewAppointment = event;
        $scope.oNewAppointment.source = {}; //was causing circular reference exceptiion - probably needs to limit appointment object
        $scope.oNewAppointment.CreatorId = $scope.oNewAppointment.Creator.Id;
        $scope.oNewAppointment.StartDate = event.start;
        $scope.oNewAppointment.EndDate = event.end;
        putAppointment($scope.oNewAppointment);
    };

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
        eventDrop: $scope.eventDateUpdate,
        eventResize: $scope.eventDateUpdate,
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

    $scope.eventSources = [];
    getAppointments();
    getUserCalendar();


    // *************************************************************************************
    // Appointment Dialog Buttons
    // *************************************************************************************

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.DialogCancel = function () {
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
        $mdDialog.hide();     
    };

    $scope.DialogDeleteAppointment = function () {
        if ($scope.oNewAppointment.Id) {
            deleteAppointment($scope.oNewAppointment);
            $mdDialog.hide();        
        }
    };


       // *************************************************************************************
       // Smart Patient search Box
       // *************************************************************************************


    // array of patients
    $scope.patients = "";
    loadAll();
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;
        /**
         * Search for patients.
         */
    function querySearch(query) {
        var results = query ? $scope.patients.filter(createFilterFor(query)) : $scope.patients, deferred;   
        return results;
    }

    function searchTextChange(text) {
        if (text != '' && text != null)
        {
            $scope.oNewAppointment.Patient.PatientName = text;          
        }    
    }

    function selectedItemChange(item) {
        if (item != '' && item != null) {
            $scope.oNewAppointment.Patient = item;
            $scope.oNewAppointment.PatientId = item.Id;
        }           
    }
        /**
         * Get all the patients at once. This is a cheap operation
         */
    function loadAll() {

        patientsService.getPatients().then(function (results) {

            $scope.patients = results.data;

        }, function (error) {
            //alert(error.data.message);
        });


    }
       
         //Create filter function for a query string

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(patient) {
            return (patient.PatientName.indexOf(lowercaseQuery) === 0);
        };

    }


}]
    // *************************************************************************************
    // Custom Directives
    // *************************************************************************************
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

