'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', 'calendarService', 'serverSettings', '$mdDialog', '$mdMedia', '$mdToast', '$log', 'patientsService', '$q',
function ($scope, appointmentsService, calendarService, serverSettings, $mdDialog, $mdMedia, $mdToast, $log, patientsService, $q) {

    var serviceBase = serverSettings.serviceBaseUri;
    $scope.IsTouchMove = false;

   var DetectTouchScreen = function () {
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
            PhoneNumber: '',
            OwnerId: ''
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
                PhoneNumber: '',
                OwnerId: ''
            },
            IsAvailable: true,
            AppointmentNote: ''
        };
        $scope.searchText = '';
    };

    
    //this function get's only the users own calendars all appointments.
    var getAppointments = function () {
        appointmentsService.getAppointments().then(function (results) {
            $scope.eventSources[0] = results.data;
        }, function (error) {
        });
    };

    //this function gets users own calendars +-2 weeks of appointments.
    var getAppointments4weeks = function (centerDate) {
        appointmentsService.getAppointments4weeks(centerDate).then(function (results) {
            $scope.eventSources[0] = results.data.Appointments;
        }, function (error) {
            //alert(error.data.message);
        });
    };

     //this function gets users own calendars appointments in the given range.
    var getAppointmentsRange = function (startDate, endDate) {
        appointmentsService.getAppointmentsRange(startDate, endDate).then(function (results) {
            $scope.eventSources[0] = results.data.Appointments;
        }, function (error) {
            //alert(error.data.message);
        });
    };

    var postAppointment = function (data) {
        appointmentsService.postAppointment(data).then(function (result) {
            getAppointments4weeks(new Date(data.StartDate).toJSON().slice(0, 10));
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
            //TODO Tomasz; This will return Email Confirmation and user name. Display banner for unconfirmed emails. Use the name in sidenav
        })
    };

    var subscribeToAppointments = function (calendarId) {
        $.connection.hub.url = serviceBase + 'signalr';
        var appointments = $.connection.appointmentHub;
        appointments.client.newAppointment = function (data) {
  
            //get +- 2 weeks of appointments from the added appointment's start date
            getAppointments4weeks(new Date(data.StartDate).toJSON().slice(0, 10));

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

    var eventDataTransform = function (eventData) {
        
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

    var viewRender = function (view, element) {

        //if month view, fetch appointments for the given motnhs' range.
        if (view.name == "month") {
            getAppointmentsRange(new Date(view.intervalStart._d).toJSON().slice(0, 10),
            new Date(view.intervalEnd._d).toJSON().slice(0, 10));
        } else { //for week view and day view
            //get +- 2 weeks of appointments by current weeks first day.
            getAppointments4weeks(new Date(view.intervalStart._d).toJSON().slice(0, 10));
        }
       
        TimeFix(45, "08:00:00");
    }

    var showAddAppointmentDialog = function (start, end, data) {
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

    var dayClick = function (date, jsEvent, view) {
        if (!$scope.IsTouchMove) {
            showAddAppointmentDialog(date, date.clone().add(45, 'minutes'));
        } 
    }

    var eventClick = function (event, jsEvent, view) {
        showAddAppointmentDialog(null, null, event);
    }

    var select = function (start, end) {
        if (!$scope.IsTouchMove) {
            showAddAppointmentDialog(start, end);
        }
    }   
    
    var renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };

    // When day drag/drop and resize happens
   var eventDateUpdate = function (event, delta, revertFunc) {
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
        eventDataTransform: eventDataTransform,
        eventDrop: eventDateUpdate,
        eventResize: eventDateUpdate,
        renderCalender: renderCalender,
        viewRender: viewRender,
        eventClick: eventClick
    };
    

    if (DetectTouchScreen()) {
        calendarConfig.dayClick = dayClick;
    }
    else {
        calendarConfig.selectable = true;
        calendarConfig.selectHelper = true;
        calendarConfig.select = select;
        calendarConfig.editable = true;
    }
    
    $scope.uiConfig = {
        calendar: calendarConfig
    };

    $scope.eventSources = [];
    getUserCalendar();


    // *************************************************************************************
    // Dialog Buttons: Appointment, New Patient, Existing Patient
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

    $scope.DialogSavePatient = function () {
        patientsService.postPatient($scope.newPatient).then(function (result) {
            $mdDialog.hide();
        })
    };

    // *************************************************************************************
    // Smart search Box - Appointment dialog, Toolbar on top
    // *************************************************************************************

    // array of patients
    $scope.patients = "";

    autoCompletePatientsloadAll();

    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;
    $scope.createNewPatient = createNewPatient;
   
    //this function is used for md-autocomplete on topbar
    function createNewPatient(patient) {

        $scope.newPatient = {
            patientName: patient,
            phoneNumber: '',
            note: ''
        };

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
            templateUrl: 'createNewClient',
            scope: $scope,
            preserveScope: true,
            bindToController: true,
            //targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
       .then(function () {

       }, function () {

       });
    }

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
    
    //Get all the patients at once and cache it
    function autoCompletePatientsloadAll() {
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

