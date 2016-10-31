'use strict';
app.controller('appointmentsController', ['$scope', 'appointmentsService', 'calendarService', 'serverSettings', '$mdDialog', '$mdMedia', '$mdToast', '$log', 'patientsService', '$q', '$mdBottomSheet', '$timeout',
function ($scope, appointmentsService, calendarService, serverSettings, $mdDialog, $mdMedia, $mdToast, $log, patientsService, $q, $mdBottomSheet, $timeout) {

    // countdown
    var countDowner, countDown = 30;
    countDowner = function () {
        if (countDown < 0) {
            $("#warning").fadeOut(2000);
            countDown = 0;
            return; 
        } else {
            $scope.countDown_text = countDown;
            countDown--;
            $timeout(countDowner, 1000);
        }
    };

    $scope.countDown_text = countDown;
    countDowner();

    var serviceBase = serverSettings.serviceBaseUri;
    $scope.IsTouchMove = false;


   var DetectTouchScreen = function () {
        // solution based on http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
        return 'ontouchstart' in window        // works on most browsers 
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };

    var clearNewAppointment = function () {
        $scope.oNewAppointment = {
            StartDate: '',
            EndDate: '',
            PatientId: '',
            Patient: {
                Id: '',
                PatientName: '',
                PhoneNumber: '',
                Note: '',
                OwnerId: ''
            },
            IsAvailable: true,
            AppointmentNote: ''
        };
        $scope.searchText = '';
    };

    var clearPatient = function () {
        $scope.oNewAppointment.PatientId = '';
        $scope.oNewAppointment.Patient.PatientName = '';
        $scope.oNewAppointment.Patient.PhoneNumber = '';
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
            //Add +10 days more threshold for the months range to retrieve last and next months' ending and beginning weeks' appointments.
            var start = new Date(view.intervalStart._d);
            start.setDate(start.getDate() - 10);
            var end = new Date(view.intervalEnd._d);
            end.setDate(start.getDate() + 10);

            getAppointmentsRange(start.toJSON().slice(0, 10), end.toJSON().slice(0, 10));
        } else { //for week view and day view
            //get +- 2 weeks of appointments by current weeks first day.
            getAppointments4weeks(new Date(view.intervalStart._d).toJSON().slice(0, 10));
        }
       
        TimeFix(45, "08:00:00");
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

    // *************************************************************************************
    // Initializers
    // *************************************************************************************
    clearNewAppointment();
    $scope.uiConfig = {
        calendar: calendarConfig
    };

    $scope.eventSources = [];
    getUserCalendar();


    // *************************************************************************************
    // Dialogs and dialog Buttons: Appointment, New Patient, Existing Patient
    // *************************************************************************************

    //Whether to use full screen or not. Fullscreen dialog causes performance problems on Edge browser. therefore disabled.  
    var shouldUseFullScreen =  function () {
        if (navigator.appVersion.indexOf('Edge') > -1)
            return false;
        else 
            return ($mdMedia('sm') || $mdMedia('xs'));
    };

    var useFullScreen = shouldUseFullScreen();

    var showAddAppointmentDialog = function (start, end, data) {

        clearNewAppointment();

        $scope.isPhoneNumEditable = true;
        if (data) {
            if (data.Patient) {
                $scope.searchText = data.Patient.PatientName;
            }
            $scope.oNewAppointment = data;
            $scope.oNewAppointment.StartDate = data.start;
            $scope.oNewAppointment.EndDate = data.end;
            data = null;
            $scope.isPhoneNumEditable = false;
        }
        else {
            $scope.oNewAppointment.StartDate = start; //date.clone();
            $scope.oNewAppointment.EndDate = end; //date.clone().add(45, 'minutes'); //.format("MM/DD/YYYY HH:mm"); 
            $scope.oNewAppointment.Patient.PatientName = "";
            $scope.oNewAppointment.Patient.PhoneNumber = "";
            $scope.isPhoneNumEditable = true;
        }

        $mdDialog.show({
            templateUrl: 'appointmentDialog',
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

        //reload patients after a new appointment is posted. Maybe a new patient name is entered.
        autoCompletePatientsloadAll();
        //clear the searchtext. this is being shared by two md-autocompletes (appointment dialog, navbar top)
        $scope.searchText = '';
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
            //reload patients after a new patient is posted.
            autoCompletePatientsloadAll();
        })
    };

    $scope.DialogUpdatePatient = function () {
        patientsService.putPatient($scope.existingPatient).then(function (result) {
            $mdDialog.hide();
            //reload patients after a patient is updated.
            autoCompletePatientsloadAll();
        })
    };

    $scope.DialogDeletePatient = function () {
        patientsService.deletePatient($scope.existingPatient).then(function (result) {
            $mdDialog.hide();
            //reload patients after a patient is updated.
            autoCompletePatientsloadAll();
        })
    };

    // *************************************************************************************
    // Smart search Box - Appointment dialog, Toolbar on top, All Patients
    // *************************************************************************************

    // array of patients
    var patients = "";

    autoCompletePatientsloadAll();

    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;
    $scope.createNewPatient = createNewPatient;
    $scope.showPatient = showPatient;
    $scope.showAllPatients = showAllPatients;


    //this function is triggered thru md-autocomplete on topbar
    function createNewPatient(patient) {

        $scope.newPatient = {
            patientName: patient,
            phoneNumber: '',
            note: ''
        };
      
        $mdDialog.show({
            templateUrl: 'createNewPatient',
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

    //this function is triggered thru md-autocomplete on topbar
    function showPatient(patient) {

        $scope.existingPatient = {
            Id: patient.Id,
            ownerId: patient.OwnerId,
            patientName: patient.PatientName,
            phoneNumber: patient.PhoneNumber,
            isActive: patient.IsActive,
            note: patient.Note
        };

       
        $mdDialog.show({
            templateUrl: 'showPatientData',
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

        //Load patients appointment history after dialog is shown
        appointmentsService.getAppointmentsByPatient(patient.Id).then(function (results) {
            $scope.patientAppointments = results.data;
        }, function (error) {
        });
    }


    function showAllPatients() {
        $scope.allPatients = '';
        $scope.isLoadingAllPatients = true;

        $mdDialog.show({
            templateUrl: 'showAllPatients',
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

        //patient service get all patients
        patientsService.getPatients().then(function (results) {
            $scope.allPatients = results.data;
            $scope.isLoadingAllPatients = false;
        }, function (error) {
            //alert(error.data.message);
        });
    }

    $scope.toUTCString = function (timeStamp) {
            var convertedDate = new Date(timeStamp);
            return convertedDate.toUTCString();
    }

    function querySearch(query) {
        var results = query ? patients.filter(createFilterFor(query)) :patients, deferred;   
        return results;
    }

    function searchTextChange(text) {
        if (text !== '' && text !== null){
            $scope.oNewAppointment.Patient.PatientName = text;
        }else{
            clearPatient();
            $scope.isPhoneNumEditable = true;
        }
    }

    function selectedItemChange(item) {
        if (item !== '' && item !== null) {
            $scope.oNewAppointment.Patient = item;
            $scope.oNewAppointment.PatientId = item.Id;
            //if an existing patient from the patient array is selected, make phone num editing false
            $scope.isPhoneNumEditable = false;
        } else {
            clearPatient();
            $scope.isPhoneNumEditable = true;
        }
    }
    
    //Get all the patients at once and cache it
    function autoCompletePatientsloadAll() {
        patientsService.getPatients().then(function (results) {
            patients = results.data;
        }, function (error) {
            //alert(error.data.message);
        });
    }
       
    //Create filter function for a query string
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(patient) {
            var lowercasePatientName = angular.lowercase(patient.PatientName);
            return (lowercasePatientName.indexOf(lowercaseQuery) === 0);
        };
    }

    // *************************************************************************************
    // Settings
    // *************************************************************************************

     $scope.showSettings = function() {
        $mdBottomSheet.show({
            templateUrl: 'settingsBottomSheet',
            scope: $scope,
            preserveScope: true,
            bindToController: true,
          clickOutsideToClose: true
        }).then(function () {

    });
  };

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

