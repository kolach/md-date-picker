(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/md-date-picker.js":[function(require,module,exports){
"use strict";

var _interopRequire = function _interopRequire(obj) {
  return obj && obj.__esModule ? obj["default"] : obj;
};

require("../tmp/templates");

var MdCalendarMonthDirective = _interopRequire(require("./calendar-month"));

angular.module("ngDatePicker", ["ngAnimate", "ngAria", "ngMaterial", "angularMoment", "templates"]).directive("mdCalendarMonth", MdCalendarMonthDirective.create);

},{"../tmp/templates":"/Users/nick/Projects/md-date-picker/tmp/templates.js","./calendar-month":"/Users/nick/Projects/md-date-picker/src/calendar-month.js"}],"/Users/nick/Projects/md-date-picker/src/calendar-month.js":[function(require,module,exports){
"use strict";

var _interopRequire = function _interopRequire(obj) {
	return obj && obj.__esModule ? obj["default"] : obj;
};

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var key in props) {
			var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
		}Object.defineProperties(target, props);
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

var _classCallCheck = function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
};

var dateUtils = _interopRequire(require("./date-utils"));

// Calendar month class

var MdCalendarMonthDirective = (function () {
	function MdCalendarMonthDirective($mdTheming) {
		_classCallCheck(this, MdCalendarMonthDirective);

		this.$mdTheming = $mdTheming;
		this.templateUrl = "src/calendar-month.html";
		this.restrict = "E";

		this.scope = {
			date: "=ngModel",
			min: "@",
			max: "@",
			month: "@",
			year: "@",
			startingDay: "@"
		};

		this.bindToController = true;
		this.controllerAs = "ctrl";
		this.link = this.link.bind(this);
	}

	_createClass(MdCalendarMonthDirective, {
		link: {
			value: function link(scope, element, attrs) {
				console.log("Link function was called");
				this.$mdTheming(element);
			}
		},
		controller: {

			/*@ngInject*/

			value: ["moment", function controller(moment) {

				var ctrl = this;

				ctrl.date = ctrl.date || new Date();
				ctrl.month = ctrl.month || ctrl.date.getMonth();
				ctrl.months = moment.months();

				ctrl.minDate = ctrl.min ? moment(ctrl.min, ["YYYY"]).toDate() : null;
				ctrl.maxDate = ctrl.max ? moment(ctrl.max, ["YYYY"]).toDate() : null;

				ctrl.year = ctrl.year || ctrl.date.getFullYear();
				ctrl.minYear = ctrl.minDate ? ctrl.minDate.getFullYear() : 1970;
				ctrl.maxYear = ctrl.maxDate ? ctrl.maxDate.getFullYear() : new Date().getFullYear();
				ctrl.years = [];
				for (var y = ctrl.minYear; y <= ctrl.maxYear; ++y) {
					ctrl.years.push(y);
				}

				ctrl.startingDay = ctrl.startingDay || 1;
				ctrl.weekdays = moment.weekdaysMin();
				if (ctrl.startingDay) {
					ctrl.weekdays.push(ctrl.weekdays.shift());
				}

				ctrl.prev = prev;
				ctrl.next = next;
				ctrl.select = select;
				ctrl.refresh = refresh;

				ctrl.refresh();

				function prev() {
					var date = new Date(ctrl.year, ctrl.month, 15);
					moveToDate(moment(date).subtract(1, "months").toDate());
				}

				function next() {
					var date = new Date(ctrl.year, ctrl.month, 15);
					moveToDate(moment(date).add(1, "months").toDate());
				}

				function moveToDate(date) {
					ctrl.year = date.getFullYear();
					ctrl.month = date.getMonth();
					ctrl.refresh();
				}

				function refresh() {
					console.log(ctrl.year, ctrl.month);

					var firstDayOfMonth = new Date(ctrl.year, ctrl.month, 1);
					var difference = ctrl.startingDay - firstDayOfMonth.getDay();
					var numDisplayedFromPreviousMonth = difference > 0 ? 7 - difference : -difference;
					var firstDate = new Date(firstDayOfMonth);

					if (numDisplayedFromPreviousMonth > 0) {
						firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
					}

					// 42 is the number of days on a six-month calendar
					var days = dateUtils.getDates(firstDate, 42);
					var today = new Date();
					for (var i = 0; i < 42; i++) {
						var day = days[i];
						days[i] = {
							date: day,
							label: moment(day).format("DD"),
							classes: {
								"md-date-picker-calendar-month-day-selected": dateUtils.equal(ctrl.date, day),
								"md-date-picker-calendar-month-day-today": dateUtils.equal(today, day),
								"md-date-picker-calendar-month-day-muted": day.getMonth() !== ctrl.month
							}
						};
					}

					ctrl.rows = dateUtils.split(days, 7);
				}

				function select(date) {
					ctrl.date = date;
					ctrl.month = date.getMonth();
					ctrl.year = date.getFullYear();
					ctrl.refresh();
				}
			}]
		}
	}, {
		create: {

			/*@ngInject*/

			value: ["$mdTheming", function create($mdTheming) {
				return new MdCalendarMonthDirective($mdTheming);
			}]
		}
	});

	return MdCalendarMonthDirective;
})();

module.exports = MdCalendarMonthDirective;

},{"./date-utils":"/Users/nick/Projects/md-date-picker/src/date-utils.js"}],"/Users/nick/Projects/md-date-picker/src/date-utils.js":[function(require,module,exports){
"use strict";

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var key in props) {
			var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
		}Object.defineProperties(target, props);
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

var _classCallCheck = function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
};

var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var DateUtils = (function () {
	function DateUtils() {
		_classCallCheck(this, DateUtils);
	}

	_createClass(DateUtils, {
		getDaysInMonth: {
			value: function getDaysInMonth(year, month) {
				return month === 1 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
			}
		},
		getDates: {
			value: function getDates(startDate, n) {
				var dates = new Array(n);
				var current = new Date(startDate);
				var i = 0;
				current.setHours(12); // Prevent repeated dates because of timezone bug
				while (i < n) {
					dates[i++] = new Date(current);
					current.setDate(current.getDate() + 1);
				}
				return dates;
			}
		},
		compare: {
			value: function compare(date1, date2) {
				return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
			}
		},
		equal: {
			value: function equal(date1, date2) {
				if (date1 && date2) {
					return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()) === 0;
				} else {
					return date1 === date2;
				}
			}
		},
		split: {

			// Split array into smaller arrays

			value: function split(arr, size) {
				var arrays = [];
				while (arr.length > 0) {
					arrays.push(arr.splice(0, size));
				}
				return arrays;
			}
		}
	});

	return DateUtils;
})();

var dateUtils = new DateUtils();

module.exports = dateUtils;

},{}],"/Users/nick/Projects/md-date-picker/tmp/templates.js":[function(require,module,exports){
"use strict";

(function (module) {
  try {
    module = angular.module("templates");
  } catch (err) {
    module = angular.module("templates", []);
  }
  module.run(["$templateCache", function ($templateCache) {
    "use strict";
    $templateCache.put("src/calendar-month.html", "<div layout=\"column\" class=\"md-date-picker-calendar-month\">\n" + "\n" + "    <div layout=\"row\" layout-align=\"space-between center\" class=\"md-date-picker-calendar-month-controls\">\n" + "\n" + "        <md-button ng-click=\"ctrl.prev()\" aria-label=\"prev\">\n" + "            <md-icon md-svg-src=\"prev-month\"></md-icon>\n" + "        </md-button>\n" + "\n" + "        <div flex></div>\n" + "\n" + "        <div layout=\"row\" layout-align=\"space-between center\" layout-padding>\n" + "\n" + "            <md-select class=\"md-date-picker-calendar-month-controls-month\" ng-model=\"ctrl.month\" ng-change=\"ctrl.refresh()\">\n" + "                <md-option ng-repeat=\"month in ctrl.months\" ng-selected=\"{{$index === ctrl.month}}\" ng-value=\"$index\">{{month | uppercase}}</md-option>\n" + "            </md-select>\n" + "\n" + "\n" + "            <md-select class=\"md-date-picker-calendar-month-controls-year-select\" ng-model=\"ctrl.year\" ng-change=\"ctrl.refresh()\">\n" + "                <md-option ng-repeat=\"year in ctrl.years\" ng-selected=\"{{year === ctrl.year}}\" ng-value=\"year\">{{year}}</md-option>\n" + "            </md-select>\n" + "\n" + "            <!--<md-input-container class=\"md-date-picker-calendar-month-controls-year\">-->\n" + "                <!--<input required type=\"number\" step=\"any\" name=\"year\" ng-model=\"ctrl.year\" ng-change=\"ctrl.refresh()\">-->\n" + "            <!--</md-input-container>-->\n" + "        </div>\n" + "\n" + "        <div flex></div>\n" + "\n" + "        <md-button ng-click=\"ctrl.next()\" aria-label=\"next\">\n" + "            <md-icon md-svg-src=\"next-month\"></md-icon>\n" + "        </md-button>\n" + "\n" + "    </div>\n" + "\n" + "    <div layout=\"column\" class=\"md-date-picker-calendar-month-wdays\">\n" + "\n" + "        <div layout=\"row\" layout-margin>\n" + "            <span flex ng-repeat=\"wday in ctrl.weekdays\" class=\"md-date-picker-calendar-month-wday\">{{wday}}</span>\n" + "        </div>\n" + "\n" + "        <div class=\"md-date-picker-calendar-month-days\">\n" + "            <div layout=\"row\" layout-margin ng-repeat=\"row in ctrl.rows\">\n" + "\n" + "                    <span flex ng-click=\"ctrl.select(day.date)\"\n" + "                          class=\"md-date-picker-calendar-month-day\" ng-class=\"day.classes\"\n" + "                          ng-repeat=\"day in row\">{{day.label}}</span>\n" + "\n" + "            </div>\n" + "        </div>\n" + "\n" + "    </div>\n" + "\n" + "</div>");
  }]);
})();

},{}]},{},["./src/md-date-picker.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmljay9Qcm9qZWN0cy9tZC1kYXRlLXBpY2tlci9zcmMvbWQtZGF0ZS1waWNrZXIuanMiLCIvVXNlcnMvbmljay9Qcm9qZWN0cy9tZC1kYXRlLXBpY2tlci9zcmMvY2FsZW5kYXItbW9udGguanMiLCIvVXNlcnMvbmljay9Qcm9qZWN0cy9tZC1kYXRlLXBpY2tlci9zcmMvZGF0ZS11dGlscy5qcyIsIi9Vc2Vycy9uaWNrL1Byb2plY3RzL21kLWRhdGUtcGlja2VyL3RtcC90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBLElBQUksZUFBZSxHQUFHLFNBQUEsZUFBQSxDQUFVLEdBQUcsRUFBRTtBQUFFLFNBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztDQUFFLENBQUM7O0FBRTlGLE9BQU8sQ0FKQSxrQkFBa0IsQ0FBQSxDQUFBOztBQU16QixJQUpPLHdCQUF3QixHQUFBLGVBQUEsQ0FBQSxPQUFBLENBQU0sa0JBQWtCLENBQUEsQ0FBQSxDQUFBOztBQUV2RCxPQUFPLENBQ0wsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUMzRixTQUFTLENBQUMsaUJBQWlCLEVBQUUsd0JBQXdCLENBQUMsTUFBTSxDQUFFLENBQy9EOzs7OztBQ0xELElBQUksZUFBZSxHQUFHLFNBQUEsZUFBQSxDQUFVLEdBQUcsRUFBRTtBQUFFLFFBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztDQUFFLENBQUM7O0FBRTlGLElBQUksWUFBWSxHQUFHLENBQUMsWUFBWTtB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QUFJLEdBQ0osSUFBSSxHQUNKLDRJQUE0SSxHQUM1SSw2SUFBNkksR0FDN0ksNEJBQTRCLEdBQzVCLElBQUksR0FDSixpR0FBaUcsR0FDakcsMElBQTBJLEdBQzFJLDRDQUE0QyxHQUM1QyxrQkFBa0IsR0FDbEIsSUFBSSxHQUNKLDRCQUE0QixHQUM1QixJQUFJLEdBQ0osb0VBQW9FLEdBQ3BFLDZEQUE2RCxHQUM3RCx3QkFBd0IsR0FDeEIsSUFBSSxHQUNKLGNBQWMsR0FDZCxJQUFJLEdBQ0osNkVBQTZFLEdBQzdFLElBQUksR0FDSiw4Q0FBOEMsR0FDOUMsMkhBQTJILEdBQzNILGtCQUFrQixHQUNsQixJQUFJLEdBQ0osOERBQThELEdBQzlELGlGQUFpRixHQUNqRixJQUFJLEdBQ0oscUVBQXFFLEdBQ3JFLGtHQUFrRyxHQUNsRywyRUFBMkUsR0FDM0UsSUFBSSxHQUNKLHNCQUFzQixHQUN0QixrQkFBa0IsR0FDbEIsSUFBSSxHQUNKLGNBQWMsR0FDZCxJQUFJLEdBQ0osUUFBUSxDQUFDLENBQUM7R0FDYixDQUFDLENBQUMsQ0FBQztDQUNILENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnLi4vdG1wL3RlbXBsYXRlcyc7XG5cbmltcG9ydCBNZENhbGVuZGFyTW9udGhEaXJlY3RpdmUgZnJvbSAnLi9jYWxlbmRhci1tb250aCc7XG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbmdEYXRlUGlja2VyJywgWyduZ0FuaW1hdGUnLCAnbmdBcmlhJywgJ25nTWF0ZXJpYWwnLCAnYW5ndWxhck1vbWVudCcsICd0ZW1wbGF0ZXMnXSlcblx0LmRpcmVjdGl2ZSgnbWRDYWxlbmRhck1vbnRoJywgTWRDYWxlbmRhck1vbnRoRGlyZWN0aXZlLmNyZWF0ZSApXG47XG5cbiIsImltcG9ydCBkYXRlVXRpbHMgZnJvbSAnLi9kYXRlLXV0aWxzJztcblxuLy8gQ2FsZW5kYXIgbW9udGggY2xhc3NcbmNsYXNzIE1kQ2FsZW5kYXJNb250aERpcmVjdGl2ZSB7XG5cblx0Y29uc3RydWN0b3IoJG1kVGhlbWluZykge1xuXHRcdHRoaXMuJG1kVGhlbWluZyAgPSAkbWRUaGVtaW5nO1xuXHRcdHRoaXMudGVtcGxhdGVVcmwgPSAnc3JjL2NhbGVuZGFyLW1vbnRoLmh0bWwnO1xuXHRcdHRoaXMucmVzdHJpY3QgICAgPSAnRSc7XG5cblx0XHR0aGlzLnNjb3BlID0ge1xuXHRcdFx0ZGF0ZVx0ICAgIDogJz1uZ01vZGVsJyxcblx0XHRcdG1pbiAgICAgICAgIDogJ0AnLFxuXHRcdFx0bWF4ICAgICAgICAgOiAnQCcsXG5cdFx0XHRtb250aFx0ICAgIDogJ0AnLFxuXHRcdFx0eWVhclx0ICAgIDogJ0AnLFxuXHRcdFx0c3RhcnRpbmdEYXkgOiAnQCdcblx0XHR9O1xuXG5cdFx0dGhpcy5iaW5kVG9Db250cm9sbGVyID0gdHJ1ZTtcblx0XHR0aGlzLmNvbnRyb2xsZXJBcyA9ICdjdHJsJztcblx0XHR0aGlzLmxpbmsgPSB0aGlzLmxpbmsuYmluZCh0aGlzKTtcblx0fVxuXG5cblx0bGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblx0XHRjb25zb2xlLmxvZygnTGluayBmdW5jdGlvbiB3YXMgY2FsbGVkJyk7XG5cdFx0dGhpcy4kbWRUaGVtaW5nKGVsZW1lbnQpO1xuXHR9XG5cblx0LypAbmdJbmplY3QqL1xuXHRjb250cm9sbGVyKG1vbWVudCkge1xuXG5cdFx0bGV0IGN0cmwgPSB0aGlzO1xuXG5cdFx0Y3RybC5kYXRlICA9IGN0cmwuZGF0ZSAgfHwgbmV3IERhdGUoKTtcblx0XHRjdHJsLm1vbnRoID0gY3RybC5tb250aCB8fCBjdHJsLmRhdGUuZ2V0TW9udGgoKTtcblx0XHRjdHJsLm1vbnRocyA9IG1vbWVudC5tb250aHMoKTtcblxuXHRcdGN0cmwubWluRGF0ZSA9IGN0cmwubWluID8gbW9tZW50KGN0cmwubWluLCBbJ1lZWVknXSkudG9EYXRlKCkgOiBudWxsO1xuXHRcdGN0cmwubWF4RGF0ZSA9IGN0cmwubWF4ID8gbW9tZW50KGN0cmwubWF4LCBbJ1lZWVknXSkudG9EYXRlKCkgOiBudWxsO1xuXG5cdFx0Y3RybC55ZWFyICAgID0gY3RybC55ZWFyICB8fCBjdHJsLmRhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHRjdHJsLm1pblllYXIgPSBjdHJsLm1pbkRhdGUgPyBjdHJsLm1pbkRhdGUuZ2V0RnVsbFllYXIoKSA6IDE5NzA7XG5cdFx0Y3RybC5tYXhZZWFyID0gY3RybC5tYXhEYXRlID8gY3RybC5tYXhEYXRlLmdldEZ1bGxZZWFyKCkgOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG5cdFx0Y3RybC55ZWFycyA9IFtdO1xuXHRcdGZvciAobGV0IHkgPSBjdHJsLm1pblllYXI7IHkgPD0gY3RybC5tYXhZZWFyOyArK3kpIHtcblx0XHRcdGN0cmwueWVhcnMucHVzaCh5KTtcblx0XHR9XG5cblx0XHRjdHJsLnN0YXJ0aW5nRGF5ID0gY3RybC5zdGFydGluZ0RheSB8fCAxO1xuXHRcdGN0cmwud2Vla2RheXMgPSBtb21lbnQud2Vla2RheXNNaW4oKTtcblx0XHRpZiAoY3RybC5zdGFydGluZ0RheSkge1xuXHRcdFx0Y3RybC53ZWVrZGF5cy5wdXNoKGN0cmwud2Vla2RheXMuc2hpZnQoKSk7XG5cdFx0fVxuXG5cdFx0Y3RybC5wcmV2ID0gcHJldjtcblx0XHRjdHJsLm5leHQgPSBuZXh0O1xuXHRcdGN0cmwuc2VsZWN0ID0gc2VsZWN0O1xuXHRcdGN0cmwucmVmcmVzaCA9IHJlZnJlc2g7XG5cblx0XHRjdHJsLnJlZnJlc2goKTtcblxuXHRcdGZ1bmN0aW9uIHByZXYoKSB7XG5cdFx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoY3RybC55ZWFyLCBjdHJsLm1vbnRoLCAxNSk7XG5cdFx0XHRtb3ZlVG9EYXRlKG1vbWVudChkYXRlKS5zdWJ0cmFjdCgxLCAnbW9udGhzJykudG9EYXRlKCkpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHQoKSB7XG5cdFx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoY3RybC55ZWFyLCBjdHJsLm1vbnRoLCAxNSk7XG5cdFx0XHRtb3ZlVG9EYXRlKG1vbWVudChkYXRlKS5hZGQoMSwgJ21vbnRocycpLnRvRGF0ZSgpKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBtb3ZlVG9EYXRlKGRhdGUpIHtcblx0XHRcdGN0cmwueWVhciAgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHRjdHJsLm1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xuXHRcdFx0Y3RybC5yZWZyZXNoKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0XHRcdGNvbnNvbGUubG9nKGN0cmwueWVhciwgY3RybC5tb250aCk7XG5cblx0XHRcdGxldCBmaXJzdERheU9mTW9udGggPSBuZXcgRGF0ZShjdHJsLnllYXIsIGN0cmwubW9udGgsIDEpO1xuXHRcdFx0bGV0IGRpZmZlcmVuY2UgPSBjdHJsLnN0YXJ0aW5nRGF5IC0gZmlyc3REYXlPZk1vbnRoLmdldERheSgpO1xuXHRcdFx0bGV0IG51bURpc3BsYXllZEZyb21QcmV2aW91c01vbnRoID0gKGRpZmZlcmVuY2UgPiAwKSA/IDcgLSBkaWZmZXJlbmNlIDogLWRpZmZlcmVuY2U7XG5cdFx0XHRsZXQgZmlyc3REYXRlID0gbmV3IERhdGUoZmlyc3REYXlPZk1vbnRoKTtcblxuXHRcdFx0aWYgKG51bURpc3BsYXllZEZyb21QcmV2aW91c01vbnRoID4gMCkge1xuXHRcdFx0XHRmaXJzdERhdGUuc2V0RGF0ZSgtbnVtRGlzcGxheWVkRnJvbVByZXZpb3VzTW9udGggKyAxKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gNDIgaXMgdGhlIG51bWJlciBvZiBkYXlzIG9uIGEgc2l4LW1vbnRoIGNhbGVuZGFyXG5cdFx0XHRsZXQgZGF5cyA9IGRhdGVVdGlscy5nZXREYXRlcyhmaXJzdERhdGUsIDQyKTtcblx0XHRcdGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDQyOyBpKyspIHtcblx0XHRcdFx0bGV0IGRheSA9IGRheXNbaV07XG5cdFx0XHRcdGRheXNbaV0gPSB7XG5cdFx0XHRcdFx0ZGF0ZTogZGF5LFxuXHRcdFx0XHRcdGxhYmVsOiBtb21lbnQoZGF5KS5mb3JtYXQoJ0REJyksXG5cdFx0XHRcdFx0Y2xhc3Nlczoge1xuXHRcdFx0XHRcdFx0J21kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWRheS1zZWxlY3RlZCc6IGRhdGVVdGlscy5lcXVhbChjdHJsLmRhdGUsIGRheSksXG5cdFx0XHRcdFx0XHQnbWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtZGF5LXRvZGF5JzogZGF0ZVV0aWxzLmVxdWFsKHRvZGF5LCBkYXkpLFxuXHRcdFx0XHRcdFx0J21kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWRheS1tdXRlZCc6IGRheS5nZXRNb250aCgpICE9PSBjdHJsLm1vbnRoXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRjdHJsLnJvd3MgPSBkYXRlVXRpbHMuc3BsaXQoZGF5cywgNyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2VsZWN0KGRhdGUpIHtcblx0XHRcdGN0cmwuZGF0ZSAgPSBkYXRlO1xuXHRcdFx0Y3RybC5tb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcblx0XHRcdGN0cmwueWVhciAgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHRjdHJsLnJlZnJlc2goKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qQG5nSW5qZWN0Ki9cblx0c3RhdGljIGNyZWF0ZSgkbWRUaGVtaW5nKSB7XG5cdFx0cmV0dXJuIG5ldyBNZENhbGVuZGFyTW9udGhEaXJlY3RpdmUoJG1kVGhlbWluZyk7XG5cdH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBNZENhbGVuZGFyTW9udGhEaXJlY3RpdmU7IiwiY29uc3QgREFZU19JTl9NT05USCA9IFszMSwgMjgsIDMxLCAzMCwgMzEsIDMwLCAzMSwgMzEsIDMwLCAzMSwgMzAsIDMxXTtcblxuY2xhc3MgRGF0ZVV0aWxzIHtcblxuXHRnZXREYXlzSW5Nb250aCggeWVhciwgbW9udGggKSB7XG5cdFx0cmV0dXJuICgobW9udGggPT09IDEpICYmICh5ZWFyICUgNCA9PT0gMCkgJiYgKCh5ZWFyICUgMTAwICE9PSAwKSB8fCAoeWVhciAlIDQwMCA9PT0gMCkpKSA/IDI5IDogREFZU19JTl9NT05USFttb250aF07XG5cdH1cblxuXHRnZXREYXRlcyhzdGFydERhdGUsIG4pIHtcblx0XHRsZXQgZGF0ZXMgICA9IG5ldyBBcnJheShuKTtcblx0XHRsZXRcdGN1cnJlbnQgPSBuZXcgRGF0ZShzdGFydERhdGUpO1xuXHRcdGxldFx0aSA9IDA7XG5cdFx0Y3VycmVudC5zZXRIb3VycygxMik7IC8vIFByZXZlbnQgcmVwZWF0ZWQgZGF0ZXMgYmVjYXVzZSBvZiB0aW1lem9uZSBidWdcblx0XHR3aGlsZSAoIGkgPCBuICkge1xuXHRcdFx0ZGF0ZXNbaSsrXSA9IG5ldyBEYXRlKGN1cnJlbnQpO1xuXHRcdFx0Y3VycmVudC5zZXREYXRlKCBjdXJyZW50LmdldERhdGUoKSArIDEgKTtcblx0XHR9XG5cdFx0cmV0dXJuIGRhdGVzO1xuXHR9XG5cblx0Y29tcGFyZShkYXRlMSwgZGF0ZTIpIHtcblx0XHRyZXR1cm4gKG5ldyBEYXRlKGRhdGUxLmdldEZ1bGxZZWFyKCksIGRhdGUxLmdldE1vbnRoKCksIGRhdGUxLmdldERhdGUoKSkgLSBuZXcgRGF0ZShkYXRlMi5nZXRGdWxsWWVhcigpLCBkYXRlMi5nZXRNb250aCgpLCBkYXRlMi5nZXREYXRlKCkpICk7XG5cdH1cblxuXHRlcXVhbChkYXRlMSwgZGF0ZTIpIHtcblx0XHRpZiAoZGF0ZTEgJiYgZGF0ZTIpIHtcblx0XHRcdHJldHVybiAobmV3IERhdGUoZGF0ZTEuZ2V0RnVsbFllYXIoKSwgZGF0ZTEuZ2V0TW9udGgoKSwgZGF0ZTEuZ2V0RGF0ZSgpKSAtIG5ldyBEYXRlKGRhdGUyLmdldEZ1bGxZZWFyKCksIGRhdGUyLmdldE1vbnRoKCksIGRhdGUyLmdldERhdGUoKSkgPT09IDAgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGRhdGUxID09PSBkYXRlMjtcblx0XHR9XG5cdH1cblxuXHQvLyBTcGxpdCBhcnJheSBpbnRvIHNtYWxsZXIgYXJyYXlzXG5cdHNwbGl0KGFyciwgc2l6ZSkge1xuXHRcdGxldCBhcnJheXMgPSBbXTtcblx0XHR3aGlsZSAoYXJyLmxlbmd0aCA+IDApIHtcblx0XHRcdGFycmF5cy5wdXNoKGFyci5zcGxpY2UoMCwgc2l6ZSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJyYXlzO1xuXHR9XG5cbn1cblxuY29uc3QgZGF0ZVV0aWxzID0gbmV3IERhdGVVdGlscygpO1xuXG5leHBvcnQgZGVmYXVsdCBkYXRlVXRpbHM7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHsgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoXCJ0ZW1wbGF0ZXNcIik7IH1cbmNhdGNoKGVycikgeyBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShcInRlbXBsYXRlc1wiLCBbXSk7IH1cbm1vZHVsZS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInNyYy9jYWxlbmRhci1tb250aC5odG1sXCIsXG4gICAgXCI8ZGl2IGxheW91dD1cXFwiY29sdW1uXFxcIiBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGhcXFwiPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcInNwYWNlLWJldHdlZW4gY2VudGVyXFxcIiBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtY29udHJvbHNcXFwiPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPG1kLWJ1dHRvbiBuZy1jbGljaz1cXFwiY3RybC5wcmV2KClcXFwiIGFyaWEtbGFiZWw9XFxcInByZXZcXFwiPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgIDxtZC1pY29uIG1kLXN2Zy1zcmM9XFxcInByZXYtbW9udGhcXFwiPjwvbWQtaWNvbj5cXG5cIiArXG4gICAgXCIgICAgICAgIDwvbWQtYnV0dG9uPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPGRpdiBmbGV4PjwvZGl2PlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzcGFjZS1iZXR3ZWVuIGNlbnRlclxcXCIgbGF5b3V0LXBhZGRpbmc+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPG1kLXNlbGVjdCBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtY29udHJvbHMtbW9udGhcXFwiIG5nLW1vZGVsPVxcXCJjdHJsLm1vbnRoXFxcIiBuZy1jaGFuZ2U9XFxcImN0cmwucmVmcmVzaCgpXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICAgICAgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XFxcIm1vbnRoIGluIGN0cmwubW9udGhzXFxcIiBuZy1zZWxlY3RlZD1cXFwie3skaW5kZXggPT09IGN0cmwubW9udGh9fVxcXCIgbmctdmFsdWU9XFxcIiRpbmRleFxcXCI+e3ttb250aCB8IHVwcGVyY2FzZX19PC9tZC1vcHRpb24+XFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPC9tZC1zZWxlY3Q+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPG1kLXNlbGVjdCBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtY29udHJvbHMteWVhci1zZWxlY3RcXFwiIG5nLW1vZGVsPVxcXCJjdHJsLnllYXJcXFwiIG5nLWNoYW5nZT1cXFwiY3RybC5yZWZyZXNoKClcXFwiPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cXFwieWVhciBpbiBjdHJsLnllYXJzXFxcIiBuZy1zZWxlY3RlZD1cXFwie3t5ZWFyID09PSBjdHJsLnllYXJ9fVxcXCIgbmctdmFsdWU9XFxcInllYXJcXFwiPnt7eWVhcn19PC9tZC1vcHRpb24+XFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPC9tZC1zZWxlY3Q+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPCEtLTxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XFxcIm1kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWNvbnRyb2xzLXllYXJcXFwiPi0tPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICA8IS0tPGlucHV0IHJlcXVpcmVkIHR5cGU9XFxcIm51bWJlclxcXCIgc3RlcD1cXFwiYW55XFxcIiBuYW1lPVxcXCJ5ZWFyXFxcIiBuZy1tb2RlbD1cXFwiY3RybC55ZWFyXFxcIiBuZy1jaGFuZ2U9XFxcImN0cmwucmVmcmVzaCgpXFxcIj4tLT5cXG5cIiArXG4gICAgXCIgICAgICAgICAgICA8IS0tPC9tZC1pbnB1dC1jb250YWluZXI+LS0+XFxuXCIgK1xuICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXG4gICAgXCJcXG5cIiArXG4gICAgXCIgICAgICAgIDxkaXYgZmxleD48L2Rpdj5cXG5cIiArXG4gICAgXCJcXG5cIiArXG4gICAgXCIgICAgICAgIDxtZC1idXR0b24gbmctY2xpY2s9XFxcImN0cmwubmV4dCgpXFxcIiBhcmlhLWxhYmVsPVxcXCJuZXh0XFxcIj5cXG5cIiArXG4gICAgXCIgICAgICAgICAgICA8bWQtaWNvbiBtZC1zdmctc3JjPVxcXCJuZXh0LW1vbnRoXFxcIj48L21kLWljb24+XFxuXCIgK1xuICAgIFwiICAgICAgICA8L21kLWJ1dHRvbj5cXG5cIiArXG4gICAgXCJcXG5cIiArXG4gICAgXCIgICAgPC9kaXY+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgIDxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiIGNsYXNzPVxcXCJtZC1kYXRlLXBpY2tlci1jYWxlbmRhci1tb250aC13ZGF5c1xcXCI+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtbWFyZ2luPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgIDxzcGFuIGZsZXggbmctcmVwZWF0PVxcXCJ3ZGF5IGluIGN0cmwud2Vla2RheXNcXFwiIGNsYXNzPVxcXCJtZC1kYXRlLXBpY2tlci1jYWxlbmRhci1tb250aC13ZGF5XFxcIj57e3dkYXl9fTwvc3Bhbj5cXG5cIiArXG4gICAgXCIgICAgICAgIDwvZGl2PlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtZGF5c1xcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LW1hcmdpbiBuZy1yZXBlYXQ9XFxcInJvdyBpbiBjdHJsLnJvd3NcXFwiPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZmxleCBuZy1jbGljaz1cXFwiY3RybC5zZWxlY3QoZGF5LmRhdGUpXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIm1kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWRheVxcXCIgbmctY2xhc3M9XFxcImRheS5jbGFzc2VzXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgbmctcmVwZWF0PVxcXCJkYXkgaW4gcm93XFxcIj57e2RheS5sYWJlbH19PC9zcGFuPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcblwiICtcbiAgICBcIiAgICAgICAgPC9kaXY+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgIDwvZGl2PlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIjwvZGl2PlwiKTtcbn1dKTtcbn0pKCk7XG4iXX0=
