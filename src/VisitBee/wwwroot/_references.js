﻿/// <autosync enabled="true" />
/// <reference path="app/app.js" />
/// <reference path="app/controllers/appointmentsController.js" />
/// <reference path="app/controllers/confirmcontroller.js" />
/// <reference path="app/controllers/homeController.js" />
/// <reference path="app/controllers/indexController.js" />
/// <reference path="app/controllers/loginController.js" />
/// <reference path="app/controllers/passwordresetcontroller.js" />
/// <reference path="app/controllers/sidenavcontroller.js" />
/// <reference path="app/controllers/signupController.js" />
/// <reference path="app/services/appointmentsService.js" />
/// <reference path="app/services/authInterceptorService.js" />
/// <reference path="app/services/authService.js" />
/// <reference path="app/services/calendarService.js" />
/// <reference path="app/services/patientsservice.js" />
/// <reference path="lib/angular/angular.js" />
/// <reference path="lib/angular/index.js" />
/// <reference path="lib/angular-animate/angular-animate.js" />
/// <reference path="lib/angular-animate/index.js" />
/// <reference path="lib/angular-aria/angular-aria.js" />
/// <reference path="lib/angular-aria/index.js" />
/// <reference path="lib/angular-loading-bar/Gruntfile.js" />
/// <reference path="lib/angular-loading-bar/index.js" />
/// <reference path="lib/angular-loading-bar/src/loading-bar.js" />
/// <reference path="lib/angular-local-storage/demo/demo-app.js" />
/// <reference path="lib/angular-local-storage/dist/angular-local-storage.js" />
/// <reference path="lib/angular-material/angular-material.js" />
/// <reference path="lib/angular-material/angular-material-mocks.js" />
/// <reference path="lib/angular-material/index.js" />
/// <reference path="lib/angular-material/modules/closure/autocomplete/autocomplete.js" />
/// <reference path="lib/angular-material/modules/closure/backdrop/backdrop.js" />
/// <reference path="lib/angular-material/modules/closure/bottomSheet/bottomSheet.js" />
/// <reference path="lib/angular-material/modules/closure/button/button.js" />
/// <reference path="lib/angular-material/modules/closure/card/card.js" />
/// <reference path="lib/angular-material/modules/closure/checkbox/checkbox.js" />
/// <reference path="lib/angular-material/modules/closure/chips/chips.js" />
/// <reference path="lib/angular-material/modules/closure/content/content.js" />
/// <reference path="lib/angular-material/modules/closure/core/core.js" />
/// <reference path="lib/angular-material/modules/closure/core/default-theme.js" />
/// <reference path="lib/angular-material/modules/closure/datepicker/datepicker.js" />
/// <reference path="lib/angular-material/modules/closure/dialog/dialog.js" />
/// <reference path="lib/angular-material/modules/closure/divider/divider.js" />
/// <reference path="lib/angular-material/modules/closure/fabActions/fabActions.js" />
/// <reference path="lib/angular-material/modules/closure/fabSpeedDial/fabSpeedDial.js" />
/// <reference path="lib/angular-material/modules/closure/fabToolbar/fabToolbar.js" />
/// <reference path="lib/angular-material/modules/closure/fabTrigger/fabTrigger.js" />
/// <reference path="lib/angular-material/modules/closure/gridList/gridList.js" />
/// <reference path="lib/angular-material/modules/closure/icon/icon.js" />
/// <reference path="lib/angular-material/modules/closure/input/input.js" />
/// <reference path="lib/angular-material/modules/closure/list/list.js" />
/// <reference path="lib/angular-material/modules/closure/menu/menu.js" />
/// <reference path="lib/angular-material/modules/closure/menuBar/menuBar.js" />
/// <reference path="lib/angular-material/modules/closure/progressCircular/progressCircular.js" />
/// <reference path="lib/angular-material/modules/closure/progressLinear/progressLinear.js" />
/// <reference path="lib/angular-material/modules/closure/radioButton/radioButton.js" />
/// <reference path="lib/angular-material/modules/closure/select/select.js" />
/// <reference path="lib/angular-material/modules/closure/showHide/showHide.js" />
/// <reference path="lib/angular-material/modules/closure/sidenav/sidenav.js" />
/// <reference path="lib/angular-material/modules/closure/slider/slider.js" />
/// <reference path="lib/angular-material/modules/closure/sticky/sticky.js" />
/// <reference path="lib/angular-material/modules/closure/subheader/subheader.js" />
/// <reference path="lib/angular-material/modules/closure/swipe/swipe.js" />
/// <reference path="lib/angular-material/modules/closure/switch/switch.js" />
/// <reference path="lib/angular-material/modules/closure/tabs/tabs.js" />
/// <reference path="lib/angular-material/modules/closure/textField/textField.js" />
/// <reference path="lib/angular-material/modules/closure/toast/toast.js" />
/// <reference path="lib/angular-material/modules/closure/toolbar/toolbar.js" />
/// <reference path="lib/angular-material/modules/closure/tooltip/tooltip.js" />
/// <reference path="lib/angular-material/modules/closure/virtualRepeat/virtualRepeat.js" />
/// <reference path="lib/angular-material/modules/closure/whiteframe/whiteframe.js" />
/// <reference path="lib/angular-material/modules/js/autocomplete/autocomplete.js" />
/// <reference path="lib/angular-material/modules/js/backdrop/backdrop.js" />
/// <reference path="lib/angular-material/modules/js/bottomSheet/bottomSheet.js" />
/// <reference path="lib/angular-material/modules/js/button/button.js" />
/// <reference path="lib/angular-material/modules/js/card/card.js" />
/// <reference path="lib/angular-material/modules/js/checkbox/checkbox.js" />
/// <reference path="lib/angular-material/modules/js/chips/chips.js" />
/// <reference path="lib/angular-material/modules/js/content/content.js" />
/// <reference path="lib/angular-material/modules/js/core/core.js" />
/// <reference path="lib/angular-material/modules/js/core/default-theme.js" />
/// <reference path="lib/angular-material/modules/js/datepicker/datepicker.js" />
/// <reference path="lib/angular-material/modules/js/dialog/dialog.js" />
/// <reference path="lib/angular-material/modules/js/divider/divider.js" />
/// <reference path="lib/angular-material/modules/js/fabActions/fabActions.js" />
/// <reference path="lib/angular-material/modules/js/fabSpeedDial/fabSpeedDial.js" />
/// <reference path="lib/angular-material/modules/js/fabToolbar/fabToolbar.js" />
/// <reference path="lib/angular-material/modules/js/fabTrigger/fabTrigger.js" />
/// <reference path="lib/angular-material/modules/js/gridList/gridList.js" />
/// <reference path="lib/angular-material/modules/js/icon/icon.js" />
/// <reference path="lib/angular-material/modules/js/input/input.js" />
/// <reference path="lib/angular-material/modules/js/list/list.js" />
/// <reference path="lib/angular-material/modules/js/menu/menu.js" />
/// <reference path="lib/angular-material/modules/js/menuBar/menuBar.js" />
/// <reference path="lib/angular-material/modules/js/progressCircular/progressCircular.js" />
/// <reference path="lib/angular-material/modules/js/progressLinear/progressLinear.js" />
/// <reference path="lib/angular-material/modules/js/radioButton/radioButton.js" />
/// <reference path="lib/angular-material/modules/js/select/select.js" />
/// <reference path="lib/angular-material/modules/js/showHide/showHide.js" />
/// <reference path="lib/angular-material/modules/js/sidenav/sidenav.js" />
/// <reference path="lib/angular-material/modules/js/slider/slider.min.js" />
/// <reference path="lib/angular-material/modules/js/sticky/sticky.js" />
/// <reference path="lib/angular-material/modules/js/subheader/subheader.js" />
/// <reference path="lib/angular-material/modules/js/swipe/swipe.js" />
/// <reference path="lib/angular-material/modules/js/switch/switch.js" />
/// <reference path="lib/angular-material/modules/js/tabs/tabs.min.js" />
/// <reference path="lib/angular-material/modules/js/textField/textField.js" />
/// <reference path="lib/angular-material/modules/js/toast/toast.js" />
/// <reference path="lib/angular-material/modules/js/toolbar/toolbar.js" />
/// <reference path="lib/angular-material/modules/js/tooltip/tooltip.js" />
/// <reference path="lib/angular-material/modules/js/virtualRepeat/virtualRepeat.js" />
/// <reference path="lib/angular-material/modules/js/whiteframe/whiteframe.js" />
/// <reference path="lib/angular-messages/angular-messages.js" />
/// <reference path="lib/angular-messages/index.js" />
/// <reference path="lib/angular-ui-calendar/src/calendar.js" />
/// <reference path="lib/bootstrap/dist/js/bootstrap.js" />
/// <reference path="lib/bootstrap/dist/js/npm.js" />
/// <reference path="lib/bootstrap-notify/bootstrap-notify.js" />
/// <reference path="lib/fullcalendar/dist/fullcalendar.min.js" />
/// <reference path="lib/fullcalendar/dist/gcal.js" />
/// <reference path="lib/fullcalendar/dist/lang/ar.js" />
/// <reference path="lib/fullcalendar/dist/lang/ar-ma.js" />
/// <reference path="lib/fullcalendar/dist/lang/ar-sa.js" />
/// <reference path="lib/fullcalendar/dist/lang/ar-tn.js" />
/// <reference path="lib/fullcalendar/dist/lang/bg.js" />
/// <reference path="lib/fullcalendar/dist/lang/ca.js" />
/// <reference path="lib/fullcalendar/dist/lang/cs.js" />
/// <reference path="lib/fullcalendar/dist/lang/da.js" />
/// <reference path="lib/fullcalendar/dist/lang/de.js" />
/// <reference path="lib/fullcalendar/dist/lang/de-at.js" />
/// <reference path="lib/fullcalendar/dist/lang/el.js" />
/// <reference path="lib/fullcalendar/dist/lang/en-au.js" />
/// <reference path="lib/fullcalendar/dist/lang/en-ca.js" />
/// <reference path="lib/fullcalendar/dist/lang/en-gb.js" />
/// <reference path="lib/fullcalendar/dist/lang/es.js" />
/// <reference path="lib/fullcalendar/dist/lang/fa.js" />
/// <reference path="lib/fullcalendar/dist/lang/fi.js" />
/// <reference path="lib/fullcalendar/dist/lang/fr.js" />
/// <reference path="lib/fullcalendar/dist/lang/fr-ca.js" />
/// <reference path="lib/fullcalendar/dist/lang/he.js" />
/// <reference path="lib/fullcalendar/dist/lang/hi.js" />
/// <reference path="lib/fullcalendar/dist/lang/hr.js" />
/// <reference path="lib/fullcalendar/dist/lang/hu.js" />
/// <reference path="lib/fullcalendar/dist/lang/id.js" />
/// <reference path="lib/fullcalendar/dist/lang/is.js" />
/// <reference path="lib/fullcalendar/dist/lang/it.js" />
/// <reference path="lib/fullcalendar/dist/lang/ja.js" />
/// <reference path="lib/fullcalendar/dist/lang/ko.js" />
/// <reference path="lib/fullcalendar/dist/lang/lt.js" />
/// <reference path="lib/fullcalendar/dist/lang/lv.js" />
/// <reference path="lib/fullcalendar/dist/lang/nb.js" />
/// <reference path="lib/fullcalendar/dist/lang/nl.js" />
/// <reference path="lib/fullcalendar/dist/lang/pl.js" />
/// <reference path="lib/fullcalendar/dist/lang/pt.js" />
/// <reference path="lib/fullcalendar/dist/lang/pt-br.js" />
/// <reference path="lib/fullcalendar/dist/lang/ro.js" />
/// <reference path="lib/fullcalendar/dist/lang/ru.js" />
/// <reference path="lib/fullcalendar/dist/lang/sk.js" />
/// <reference path="lib/fullcalendar/dist/lang/sl.js" />
/// <reference path="lib/fullcalendar/dist/lang/sr.js" />
/// <reference path="lib/fullcalendar/dist/lang/sr-cyrl.js" />
/// <reference path="lib/fullcalendar/dist/lang/sv.js" />
/// <reference path="lib/fullcalendar/dist/lang/th.js" />
/// <reference path="lib/fullcalendar/dist/lang/tr.js" />
/// <reference path="lib/fullcalendar/dist/lang/uk.js" />
/// <reference path="lib/fullcalendar/dist/lang/vi.js" />
/// <reference path="lib/fullcalendar/dist/lang/zh-cn.js" />
/// <reference path="lib/fullcalendar/dist/lang/zh-tw.js" />
/// <reference path="lib/fullcalendar/dist/lang-all.js" />
/// <reference path="lib/jquery/dist/jquery.js" />
/// <reference path="lib/jquery-validation/dist/additional-methods.js" />
/// <reference path="lib/jquery-validation/dist/jquery.validate.js" />
/// <reference path="lib/jquery-validation-unobtrusive/jquery.validate.unobtrusive.js" />
/// <reference path="lib/moment/locale/af.js" />
/// <reference path="lib/moment/locale/ar.js" />
/// <reference path="lib/moment/locale/ar-ma.js" />
/// <reference path="lib/moment/locale/ar-sa.js" />
/// <reference path="lib/moment/locale/ar-tn.js" />
/// <reference path="lib/moment/locale/az.js" />
/// <reference path="lib/moment/locale/be.js" />
/// <reference path="lib/moment/locale/bg.js" />
/// <reference path="lib/moment/locale/bn.js" />
/// <reference path="lib/moment/locale/bo.js" />
/// <reference path="lib/moment/locale/br.js" />
/// <reference path="lib/moment/locale/bs.js" />
/// <reference path="lib/moment/locale/ca.js" />
/// <reference path="lib/moment/locale/cs.js" />
/// <reference path="lib/moment/locale/cv.js" />
/// <reference path="lib/moment/locale/cy.js" />
/// <reference path="lib/moment/locale/da.js" />
/// <reference path="lib/moment/locale/de.js" />
/// <reference path="lib/moment/locale/de-at.js" />
/// <reference path="lib/moment/locale/dv.js" />
/// <reference path="lib/moment/locale/el.js" />
/// <reference path="lib/moment/locale/en-au.js" />
/// <reference path="lib/moment/locale/en-ca.js" />
/// <reference path="lib/moment/locale/en-gb.js" />
/// <reference path="lib/moment/locale/en-ie.js" />
/// <reference path="lib/moment/locale/en-nz.js" />
/// <reference path="lib/moment/locale/eo.js" />
/// <reference path="lib/moment/locale/es.js" />
/// <reference path="lib/moment/locale/et.js" />
/// <reference path="lib/moment/locale/eu.js" />
/// <reference path="lib/moment/locale/fa.js" />
/// <reference path="lib/moment/locale/fi.js" />
/// <reference path="lib/moment/locale/fo.js" />
/// <reference path="lib/moment/locale/fr.js" />
/// <reference path="lib/moment/locale/fr-ca.js" />
/// <reference path="lib/moment/locale/fr-ch.js" />
/// <reference path="lib/moment/locale/fy.js" />
/// <reference path="lib/moment/locale/gd.js" />
/// <reference path="lib/moment/locale/gl.js" />
/// <reference path="lib/moment/locale/he.js" />
/// <reference path="lib/moment/locale/hi.js" />
/// <reference path="lib/moment/locale/hr.js" />
/// <reference path="lib/moment/locale/hu.js" />
/// <reference path="lib/moment/locale/hy-am.js" />
/// <reference path="lib/moment/locale/id.js" />
/// <reference path="lib/moment/locale/is.js" />
/// <reference path="lib/moment/locale/it.js" />
/// <reference path="lib/moment/locale/ja.js" />
/// <reference path="lib/moment/locale/jv.js" />
/// <reference path="lib/moment/locale/ka.js" />
/// <reference path="lib/moment/locale/kk.js" />
/// <reference path="lib/moment/locale/km.js" />
/// <reference path="lib/moment/locale/ko.js" />
/// <reference path="lib/moment/locale/lb.js" />
/// <reference path="lib/moment/locale/lo.js" />
/// <reference path="lib/moment/locale/lt.js" />
/// <reference path="lib/moment/locale/lv.js" />
/// <reference path="lib/moment/locale/me.js" />
/// <reference path="lib/moment/locale/mk.js" />
/// <reference path="lib/moment/locale/ml.js" />
/// <reference path="lib/moment/locale/mr.js" />
/// <reference path="lib/moment/locale/ms.js" />
/// <reference path="lib/moment/locale/ms-my.js" />
/// <reference path="lib/moment/locale/my.js" />
/// <reference path="lib/moment/locale/nb.js" />
/// <reference path="lib/moment/locale/ne.js" />
/// <reference path="lib/moment/locale/nl.js" />
/// <reference path="lib/moment/locale/nn.js" />
/// <reference path="lib/moment/locale/pl.js" />
/// <reference path="lib/moment/locale/pt.js" />
/// <reference path="lib/moment/locale/pt-br.js" />
/// <reference path="lib/moment/locale/ro.js" />
/// <reference path="lib/moment/locale/ru.js" />
/// <reference path="lib/moment/locale/se.js" />
/// <reference path="lib/moment/locale/si.js" />
/// <reference path="lib/moment/locale/sk.js" />
/// <reference path="lib/moment/locale/sl.js" />
/// <reference path="lib/moment/locale/sq.js" />
/// <reference path="lib/moment/locale/sr.js" />
/// <reference path="lib/moment/locale/sr-cyrl.js" />
/// <reference path="lib/moment/locale/sv.js" />
/// <reference path="lib/moment/locale/sw.js" />
/// <reference path="lib/moment/locale/ta.js" />
/// <reference path="lib/moment/locale/te.js" />
/// <reference path="lib/moment/locale/th.js" />
/// <reference path="lib/moment/locale/tlh.js" />
/// <reference path="lib/moment/locale/tl-ph.js" />
/// <reference path="lib/moment/locale/tr.js" />
/// <reference path="lib/moment/locale/tzl.js" />
/// <reference path="lib/moment/locale/tzm.js" />
/// <reference path="lib/moment/locale/tzm-latn.js" />
/// <reference path="lib/moment/locale/uk.js" />
/// <reference path="lib/moment/locale/uz.js" />
/// <reference path="lib/moment/locale/vi.js" />
/// <reference path="lib/moment/locale/zh-cn.js" />
/// <reference path="lib/moment/locale/zh-tw.js" />
/// <reference path="lib/moment/min/locales.js" />
/// <reference path="lib/moment/min/moment.min.js" />
/// <reference path="lib/moment/min/moment-with-locales.js" />
/// <reference path="lib/moment/min/tests.js" />
/// <reference path="lib/moment/moment.js" />
/// <reference path="lib/moment/src/lib/create/check-overflow.js" />
/// <reference path="lib/moment/src/lib/create/date-from-array.js" />
/// <reference path="lib/moment/src/lib/create/from-anything.js" />
/// <reference path="lib/moment/src/lib/create/from-array.js" />
/// <reference path="lib/moment/src/lib/create/from-object.js" />
/// <reference path="lib/moment/src/lib/create/from-string.js" />
/// <reference path="lib/moment/src/lib/create/from-string-and-array.js" />
/// <reference path="lib/moment/src/lib/create/from-string-and-format.js" />
/// <reference path="lib/moment/src/lib/create/local.js" />
/// <reference path="lib/moment/src/lib/create/parsing-flags.js" />
/// <reference path="lib/moment/src/lib/create/utc.js" />
/// <reference path="lib/moment/src/lib/create/valid.js" />
/// <reference path="lib/moment/src/lib/duration/abs.js" />
/// <reference path="lib/moment/src/lib/duration/add-subtract.js" />
/// <reference path="lib/moment/src/lib/duration/as.js" />
/// <reference path="lib/moment/src/lib/duration/bubble.js" />
/// <reference path="lib/moment/src/lib/duration/constructor.js" />
/// <reference path="lib/moment/src/lib/duration/create.js" />
/// <reference path="lib/moment/src/lib/duration/duration.js" />
/// <reference path="lib/moment/src/lib/duration/get.js" />
/// <reference path="lib/moment/src/lib/duration/humanize.js" />
/// <reference path="lib/moment/src/lib/duration/iso-string.js" />
/// <reference path="lib/moment/src/lib/duration/prototype.js" />
/// <reference path="lib/moment/src/lib/format/format.js" />
/// <reference path="lib/moment/src/lib/locale/calendar.js" />
/// <reference path="lib/moment/src/lib/locale/constructor.js" />
/// <reference path="lib/moment/src/lib/locale/en.js" />
/// <reference path="lib/moment/src/lib/locale/formats.js" />
/// <reference path="lib/moment/src/lib/locale/invalid.js" />
/// <reference path="lib/moment/src/lib/locale/lists.js" />
/// <reference path="lib/moment/src/lib/locale/locale.js" />
/// <reference path="lib/moment/src/lib/locale/locales.js" />
/// <reference path="lib/moment/src/lib/locale/ordinal.js" />
/// <reference path="lib/moment/src/lib/locale/pre-post-format.js" />
/// <reference path="lib/moment/src/lib/locale/prototype.js" />
/// <reference path="lib/moment/src/lib/locale/relative.js" />
/// <reference path="lib/moment/src/lib/locale/set.js" />
/// <reference path="lib/moment/src/lib/moment/add-subtract.js" />
/// <reference path="lib/moment/src/lib/moment/calendar.js" />
/// <reference path="lib/moment/src/lib/moment/clone.js" />
/// <reference path="lib/moment/src/lib/moment/compare.js" />
/// <reference path="lib/moment/src/lib/moment/constructor.js" />
/// <reference path="lib/moment/src/lib/moment/creation-data.js" />
/// <reference path="lib/moment/src/lib/moment/diff.js" />
/// <reference path="lib/moment/src/lib/moment/format.js" />
/// <reference path="lib/moment/src/lib/moment/from.js" />
/// <reference path="lib/moment/src/lib/moment/get-set.js" />
/// <reference path="lib/moment/src/lib/moment/locale.js" />
/// <reference path="lib/moment/src/lib/moment/min-max.js" />
/// <reference path="lib/moment/src/lib/moment/moment.js" />
/// <reference path="lib/moment/src/lib/moment/now.js" />
/// <reference path="lib/moment/src/lib/moment/prototype.js" />
/// <reference path="lib/moment/src/lib/moment/start-end-of.js" />
/// <reference path="lib/moment/src/lib/moment/to.js" />
/// <reference path="lib/moment/src/lib/moment/to-type.js" />
/// <reference path="lib/moment/src/lib/moment/valid.js" />
/// <reference path="lib/moment/src/lib/parse/regex.js" />
/// <reference path="lib/moment/src/lib/parse/token.js" />
/// <reference path="lib/moment/src/lib/units/aliases.js" />
/// <reference path="lib/moment/src/lib/units/constants.js" />
/// <reference path="lib/moment/src/lib/units/day-of-month.js" />
/// <reference path="lib/moment/src/lib/units/day-of-week.js" />
/// <reference path="lib/moment/src/lib/units/day-of-year.js" />
/// <reference path="lib/moment/src/lib/units/hour.js" />
/// <reference path="lib/moment/src/lib/units/millisecond.js" />
/// <reference path="lib/moment/src/lib/units/minute.js" />
/// <reference path="lib/moment/src/lib/units/month.js" />
/// <reference path="lib/moment/src/lib/units/offset.js" />
/// <reference path="lib/moment/src/lib/units/quarter.js" />
/// <reference path="lib/moment/src/lib/units/second.js" />
/// <reference path="lib/moment/src/lib/units/timestamp.js" />
/// <reference path="lib/moment/src/lib/units/timezone.js" />
/// <reference path="lib/moment/src/lib/units/units.js" />
/// <reference path="lib/moment/src/lib/units/week.js" />
/// <reference path="lib/moment/src/lib/units/week-calendar-utils.js" />
/// <reference path="lib/moment/src/lib/units/week-year.js" />
/// <reference path="lib/moment/src/lib/units/year.js" />
/// <reference path="lib/moment/src/lib/utils/abs-ceil.js" />
/// <reference path="lib/moment/src/lib/utils/abs-floor.js" />
/// <reference path="lib/moment/src/lib/utils/compare-arrays.js" />
/// <reference path="lib/moment/src/lib/utils/defaults.js" />
/// <reference path="lib/moment/src/lib/utils/deprecate.js" />
/// <reference path="lib/moment/src/lib/utils/extend.js" />
/// <reference path="lib/moment/src/lib/utils/has-own-prop.js" />
/// <reference path="lib/moment/src/lib/utils/hooks.js" />
/// <reference path="lib/moment/src/lib/utils/is-array.js" />
/// <reference path="lib/moment/src/lib/utils/is-date.js" />
/// <reference path="lib/moment/src/lib/utils/is-function.js" />
/// <reference path="lib/moment/src/lib/utils/is-undefined.js" />
/// <reference path="lib/moment/src/lib/utils/map.js" />
/// <reference path="lib/moment/src/lib/utils/to-int.js" />
/// <reference path="lib/moment/src/lib/utils/zero-fill.js" />
/// <reference path="lib/moment/src/locale/af.js" />
/// <reference path="lib/moment/src/locale/ar.js" />
/// <reference path="lib/moment/src/locale/ar-ma.js" />
/// <reference path="lib/moment/src/locale/ar-sa.js" />
/// <reference path="lib/moment/src/locale/ar-tn.js" />
/// <reference path="lib/moment/src/locale/az.js" />
/// <reference path="lib/moment/src/locale/be.js" />
/// <reference path="lib/moment/src/locale/bg.js" />
/// <reference path="lib/moment/src/locale/bn.js" />
/// <reference path="lib/moment/src/locale/bo.js" />
/// <reference path="lib/moment/src/locale/br.js" />
/// <reference path="lib/moment/src/locale/bs.js" />
/// <reference path="lib/moment/src/locale/ca.js" />
/// <reference path="lib/moment/src/locale/cs.js" />
/// <reference path="lib/moment/src/locale/cv.js" />
/// <reference path="lib/moment/src/locale/cy.js" />
/// <reference path="lib/moment/src/locale/da.js" />
/// <reference path="lib/moment/src/locale/de.js" />
/// <reference path="lib/moment/src/locale/de-at.js" />
/// <reference path="lib/moment/src/locale/dv.js" />
/// <reference path="lib/moment/src/locale/el.js" />
/// <reference path="lib/moment/src/locale/en-au.js" />
/// <reference path="lib/moment/src/locale/en-ca.js" />
/// <reference path="lib/moment/src/locale/en-gb.js" />
/// <reference path="lib/moment/src/locale/en-ie.js" />
/// <reference path="lib/moment/src/locale/en-nz.js" />
/// <reference path="lib/moment/src/locale/eo.js" />
/// <reference path="lib/moment/src/locale/es.js" />
/// <reference path="lib/moment/src/locale/et.js" />
/// <reference path="lib/moment/src/locale/eu.js" />
/// <reference path="lib/moment/src/locale/fa.js" />
/// <reference path="lib/moment/src/locale/fi.js" />
/// <reference path="lib/moment/src/locale/fo.js" />
/// <reference path="lib/moment/src/locale/fr.js" />
/// <reference path="lib/moment/src/locale/fr-ca.js" />
/// <reference path="lib/moment/src/locale/fr-ch.js" />
/// <reference path="lib/moment/src/locale/fy.js" />
/// <reference path="lib/moment/src/locale/gd.js" />
/// <reference path="lib/moment/src/locale/gl.js" />
/// <reference path="lib/moment/src/locale/he.js" />
/// <reference path="lib/moment/src/locale/hi.js" />
/// <reference path="lib/moment/src/locale/hr.js" />
/// <reference path="lib/moment/src/locale/hu.js" />
/// <reference path="lib/moment/src/locale/hy-am.js" />
/// <reference path="lib/moment/src/locale/id.js" />
/// <reference path="lib/moment/src/locale/is.js" />
/// <reference path="lib/moment/src/locale/it.js" />
/// <reference path="lib/moment/src/locale/ja.js" />
/// <reference path="lib/moment/src/locale/jv.js" />
/// <reference path="lib/moment/src/locale/ka.js" />
/// <reference path="lib/moment/src/locale/kk.js" />
/// <reference path="lib/moment/src/locale/km.js" />
/// <reference path="lib/moment/src/locale/ko.js" />
/// <reference path="lib/moment/src/locale/lb.js" />
/// <reference path="lib/moment/src/locale/lo.js" />
/// <reference path="lib/moment/src/locale/lt.js" />
/// <reference path="lib/moment/src/locale/lv.js" />
/// <reference path="lib/moment/src/locale/me.js" />
/// <reference path="lib/moment/src/locale/mk.js" />
/// <reference path="lib/moment/src/locale/ml.js" />
/// <reference path="lib/moment/src/locale/mr.js" />
/// <reference path="lib/moment/src/locale/ms.js" />
/// <reference path="lib/moment/src/locale/ms-my.js" />
/// <reference path="lib/moment/src/locale/my.js" />
/// <reference path="lib/moment/src/locale/nb.js" />
/// <reference path="lib/moment/src/locale/ne.js" />
/// <reference path="lib/moment/src/locale/nl.js" />
/// <reference path="lib/moment/src/locale/nn.js" />
/// <reference path="lib/moment/src/locale/pl.js" />
/// <reference path="lib/moment/src/locale/pt.js" />
/// <reference path="lib/moment/src/locale/pt-br.js" />
/// <reference path="lib/moment/src/locale/ro.js" />
/// <reference path="lib/moment/src/locale/ru.js" />
/// <reference path="lib/moment/src/locale/se.js" />
/// <reference path="lib/moment/src/locale/si.js" />
/// <reference path="lib/moment/src/locale/sk.js" />
/// <reference path="lib/moment/src/locale/sl.js" />
/// <reference path="lib/moment/src/locale/sq.js" />
/// <reference path="lib/moment/src/locale/sr.js" />
/// <reference path="lib/moment/src/locale/sr-cyrl.js" />
/// <reference path="lib/moment/src/locale/sv.js" />
/// <reference path="lib/moment/src/locale/sw.js" />
/// <reference path="lib/moment/src/locale/ta.js" />
/// <reference path="lib/moment/src/locale/te.js" />
/// <reference path="lib/moment/src/locale/th.js" />
/// <reference path="lib/moment/src/locale/tlh.js" />
/// <reference path="lib/moment/src/locale/tl-ph.js" />
/// <reference path="lib/moment/src/locale/tr.js" />
/// <reference path="lib/moment/src/locale/tzl.js" />
/// <reference path="lib/moment/src/locale/tzm.js" />
/// <reference path="lib/moment/src/locale/tzm-latn.js" />
/// <reference path="lib/moment/src/locale/uk.js" />
/// <reference path="lib/moment/src/locale/uz.js" />
/// <reference path="lib/moment/src/locale/vi.js" />
/// <reference path="lib/moment/src/locale/zh-cn.js" />
/// <reference path="lib/moment/src/locale/zh-tw.js" />
/// <reference path="lib/moment/src/moment.js" />
/// <reference path="lib/moment/templates/amd.js" />
/// <reference path="lib/moment/templates/amd-named.js" />
/// <reference path="lib/moment/templates/default.js" />
/// <reference path="lib/moment/templates/globals.js" />
/// <reference path="lib/moment/templates/locale-header.js" />
/// <reference path="lib/moment/templates/test-header.js" />
/// <reference path="lib/signalr/jquery.signalR.js" />