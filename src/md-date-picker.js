import '../tmp/templates';

import MdCalendarMonthDirective from './calendar-month';

angular
	.module('ngDatePicker', ['ngAnimate', 'ngAria', 'ngMaterial', 'angularMoment', 'templates'])
	.directive('mdCalendarMonth', MdCalendarMonthDirective.create )
;

