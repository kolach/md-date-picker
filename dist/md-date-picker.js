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

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmljay9Qcm9qZWN0cy9tZC1kYXRlLXBpY2tlci9zcmMvbWQtZGF0ZS1waWNrZXIuanMiLCIvVXNlcnMvbmljay9Qcm9qZWN0cy9tZC1kYXRlLXBpY2tlci9zcmMvY2FsZW5kYXItbW9udGguanMiLCIvVXNlcnMvbmljay9Qcm9qZWN0cy9tZC1kYXRlLXBpY2tlci9zcmMvZGF0ZS11dGlscy5qcyIsIi9Vc2Vycy9uaWNrL1Byb2plY3RzL21kLWRhdGUtcGlja2VyL3RtcC90ZW1wbGF0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBLElBQUksZUFBZSxHQUFHLFNBQUEsZUFBQSxDQUFVLEdBQUcsRUFBRTtBQUFFLFNBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztDQUFFLENBQUM7O0FBRTlGLE9BQU8sQ0FKQSxrQkFBa0IsQ0FBQSxDQUFBOztBQU16QixJQUpPLHdCQUF3QixHQUFBLGVBQUEsQ0FBQSxPQUFBLENBQU0sa0JBQWtCLENBQUEsQ0FBQSxDQUFBOztBQUV2RCxPQUFPLENBQ0YsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUMzRixTQUFTLENBQUMsaUJBQWlCLEVBQUUsd0JBQXdCLENBQUMsTUFBTSxDQUFFLENBQ2xFOzs7OztBQ0xELElBQUksZUFBZSxHQUFHLFNBQUEsZUFBQSxDQUFVLEdBQUcsRUFBRTtBQUFFLFdBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztDQUFFLENBQUM7O0FBRTlGLElBQUksWUFBWSxHQUFHLENBQUMsWUFBWTtB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NEJBQTRCLEdBQzVCLElBQUksR0FDSixxRkFBcUYsR0FDckYsSUFBSSxHQUNKLHVJQUF1SSxHQUN2SSxpS0FBaUssR0FDakssNEJBQTRCLEdBQzVCLElBQUksR0FDSixJQUFJLEdBQ0osNElBQTRJLEdBQzVJLDZJQUE2SSxHQUM3SSw0QkFBNEIsR0FDNUIsSUFBSSxHQUNKLGlHQUFpRyxHQUNqRywwSUFBMEksR0FDMUksNENBQTRDLEdBQzVDLGtCQUFrQixHQUNsQixJQUFJLEdBQ0osNEJBQTRCLEdBQzVCLElBQUksR0FDSixvRUFBb0UsR0FDcEUsNkRBQTZELEdBQzdELHdCQUF3QixHQUN4QixJQUFJLEdBQ0osY0FBYyxHQUNkLElBQUksR0FDSiw2RUFBNkUsR0FDN0UsSUFBSSxHQUNKLDhDQUE4QyxHQUM5QywySEFBMkgsR0FDM0gsa0JBQWtCLEdBQ2xCLElBQUksR0FDSiw4REFBOEQsR0FDOUQsaUZBQWlGLEdBQ2pGLElBQUksR0FDSixxRUFBcUUsR0FDckUsa0dBQWtHLEdBQ2xHLDJFQUEyRSxHQUMzRSxJQUFJLEdBQ0osc0JBQXNCLEdBQ3RCLGtCQUFrQixHQUNsQixJQUFJLEdBQ0osY0FBYyxHQUNkLElBQUksR0FDSixRQUFRLENBQUMsQ0FBQztHQUNiLENBQUMsQ0FBQyxDQUFDO0NBQ0gsQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICcuLi90bXAvdGVtcGxhdGVzJztcblxuaW1wb3J0IE1kQ2FsZW5kYXJNb250aERpcmVjdGl2ZSBmcm9tICcuL2NhbGVuZGFyLW1vbnRoJztcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ25nRGF0ZVBpY2tlcicsIFsnbmdBbmltYXRlJywgJ25nQXJpYScsICduZ01hdGVyaWFsJywgJ2FuZ3VsYXJNb21lbnQnLCAndGVtcGxhdGVzJ10pXG4gICAgLmRpcmVjdGl2ZSgnbWRDYWxlbmRhck1vbnRoJywgTWRDYWxlbmRhck1vbnRoRGlyZWN0aXZlLmNyZWF0ZSApXG47XG5cbiIsImltcG9ydCBkYXRlVXRpbHMgZnJvbSAnLi9kYXRlLXV0aWxzJztcblxuLy8gQ2FsZW5kYXIgbW9udGggY2xhc3NcbmNsYXNzIE1kQ2FsZW5kYXJNb250aERpcmVjdGl2ZSB7XG5cblx0Y29uc3RydWN0b3IoJG1kVGhlbWluZykge1xuICAgICAgICB0aGlzLiRtZFRoZW1pbmcgID0gJG1kVGhlbWluZztcblx0XHR0aGlzLnRlbXBsYXRlVXJsID0gJ3NyYy9jYWxlbmRhci1tb250aC5odG1sJztcblx0XHR0aGlzLnJlc3RyaWN0ICAgID0gJ0UnO1xuXG5cdFx0dGhpcy5zY29wZSA9IHtcblx0XHRcdGRhdGVcdCAgICA6ICc9bmdNb2RlbCcsXG4gICAgICAgICAgICBtaW4gICAgICAgICA6ICdAJyxcbiAgICAgICAgICAgIG1heCAgICAgICAgIDogJ0AnLFxuXHRcdFx0bW9udGhcdCAgICA6ICdAJyxcblx0XHRcdHllYXJcdCAgICA6ICdAJyxcbiAgICAgICAgICAgIHN0YXJ0aW5nRGF5IDogJ0AnXG5cdFx0fTtcblxuXHRcdHRoaXMuYmluZFRvQ29udHJvbGxlciA9IHRydWU7XG5cdFx0dGhpcy5jb250cm9sbGVyQXMgPSAnY3RybCc7XG4gICAgICAgIHRoaXMubGluayA9IHRoaXMubGluay5iaW5kKHRoaXMpO1xuXHR9XG5cblxuXHRsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBjb25zb2xlLmxvZygnTGluayBmdW5jdGlvbiB3YXMgY2FsbGVkJyk7XG4gICAgICAgIHRoaXMuJG1kVGhlbWluZyhlbGVtZW50KTtcblx0fVxuXG4gICAgLypAbmdJbmplY3QqL1xuXHRjb250cm9sbGVyKG1vbWVudCkge1xuXG4gICAgICAgIGxldCBjdHJsID0gdGhpcztcblxuXHRcdGN0cmwuZGF0ZSAgPSBjdHJsLmRhdGUgIHx8IG5ldyBEYXRlKCk7XG5cdFx0Y3RybC5tb250aCA9IGN0cmwubW9udGggfHwgY3RybC5kYXRlLmdldE1vbnRoKCk7XG4gICAgICAgIGN0cmwubW9udGhzID0gbW9tZW50Lm1vbnRocygpO1xuXG4gICAgICAgIGN0cmwubWluRGF0ZSA9IGN0cmwubWluID8gbW9tZW50KGN0cmwubWluLCBbJ1lZWVknXSkudG9EYXRlKCkgOiBudWxsO1xuICAgICAgICBjdHJsLm1heERhdGUgPSBjdHJsLm1heCA/IG1vbWVudChjdHJsLm1heCwgWydZWVlZJ10pLnRvRGF0ZSgpIDogbnVsbDtcblxuICAgICAgICBjdHJsLnllYXIgICAgPSBjdHJsLnllYXIgIHx8IGN0cmwuZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBjdHJsLm1pblllYXIgPSBjdHJsLm1pbkRhdGUgPyBjdHJsLm1pbkRhdGUuZ2V0RnVsbFllYXIoKSA6IDE5NzA7XG4gICAgICAgIGN0cmwubWF4WWVhciA9IGN0cmwubWF4RGF0ZSA/IGN0cmwubWF4RGF0ZS5nZXRGdWxsWWVhcigpIDogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBjdHJsLnllYXJzID0gW107XG4gICAgICAgIGZvciAobGV0IHkgPSBjdHJsLm1pblllYXI7IHkgPD0gY3RybC5tYXhZZWFyOyArK3kpIHtcbiAgICAgICAgICAgIGN0cmwueWVhcnMucHVzaCh5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN0cmwuc3RhcnRpbmdEYXkgPSBjdHJsLnN0YXJ0aW5nRGF5IHx8IDE7XG5cdFx0Y3RybC53ZWVrZGF5cyA9IG1vbWVudC53ZWVrZGF5c01pbigpO1xuICAgICAgICBpZiAoY3RybC5zdGFydGluZ0RheSkge1xuICAgICAgICAgICAgY3RybC53ZWVrZGF5cy5wdXNoKGN0cmwud2Vla2RheXMuc2hpZnQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdHJsLnByZXYgPSBwcmV2O1xuICAgICAgICBjdHJsLm5leHQgPSBuZXh0O1xuICAgICAgICBjdHJsLnNlbGVjdCA9IHNlbGVjdDtcbiAgICAgICAgY3RybC5yZWZyZXNoID0gcmVmcmVzaDtcblxuICAgICAgICBjdHJsLnJlZnJlc2goKTtcblxuXHRcdGZ1bmN0aW9uIHByZXYoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoY3RybC55ZWFyLCBjdHJsLm1vbnRoLCAxNSk7XG4gICAgICAgICAgICBtb3ZlVG9EYXRlKG1vbWVudChkYXRlKS5zdWJ0cmFjdCgxLCAnbW9udGhzJykudG9EYXRlKCkpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoY3RybC55ZWFyLCBjdHJsLm1vbnRoLCAxNSk7XG4gICAgICAgICAgICBtb3ZlVG9EYXRlKG1vbWVudChkYXRlKS5hZGQoMSwgJ21vbnRocycpLnRvRGF0ZSgpKTtcblx0XHR9XG5cbiAgICAgICAgZnVuY3Rpb24gbW92ZVRvRGF0ZShkYXRlKSB7XG4gICAgICAgICAgICBjdHJsLnllYXIgID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgY3RybC5tb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIGN0cmwucmVmcmVzaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGN0cmwueWVhciwgY3RybC5tb250aCk7XG5cbiAgICAgICAgICAgIGxldCBmaXJzdERheU9mTW9udGggPSBuZXcgRGF0ZShjdHJsLnllYXIsIGN0cmwubW9udGgsIDEpO1xuICAgICAgICAgICAgbGV0IGRpZmZlcmVuY2UgPSBjdHJsLnN0YXJ0aW5nRGF5IC0gZmlyc3REYXlPZk1vbnRoLmdldERheSgpO1xuICAgICAgICAgICAgbGV0IG51bURpc3BsYXllZEZyb21QcmV2aW91c01vbnRoID0gKGRpZmZlcmVuY2UgPiAwKSA/IDcgLSBkaWZmZXJlbmNlIDogLWRpZmZlcmVuY2U7XG4gICAgICAgICAgICBsZXQgZmlyc3REYXRlID0gbmV3IERhdGUoZmlyc3REYXlPZk1vbnRoKTtcblxuICAgICAgICAgICAgaWYgKG51bURpc3BsYXllZEZyb21QcmV2aW91c01vbnRoID4gMCkge1xuICAgICAgICAgICAgICAgIGZpcnN0RGF0ZS5zZXREYXRlKC1udW1EaXNwbGF5ZWRGcm9tUHJldmlvdXNNb250aCArIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyA0MiBpcyB0aGUgbnVtYmVyIG9mIGRheXMgb24gYSBzaXgtbW9udGggY2FsZW5kYXJcbiAgICAgICAgICAgIGxldCBkYXlzID0gZGF0ZVV0aWxzLmdldERhdGVzKGZpcnN0RGF0ZSwgNDIpO1xuICAgICAgICAgICAgbGV0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDI7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBkYXkgPSBkYXlzW2ldO1xuICAgICAgICAgICAgICAgIGRheXNbaV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGRheSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IG1vbWVudChkYXkpLmZvcm1hdCgnREQnKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ21kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWRheS1zZWxlY3RlZCc6IGRhdGVVdGlscy5lcXVhbChjdHJsLmRhdGUsIGRheSksXG4gICAgICAgICAgICAgICAgICAgICAgICAnbWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtZGF5LXRvZGF5JzogZGF0ZVV0aWxzLmVxdWFsKHRvZGF5LCBkYXkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ21kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWRheS1tdXRlZCc6IGRheS5nZXRNb250aCgpICE9PSBjdHJsLm1vbnRoXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHJsLnJvd3MgPSBkYXRlVXRpbHMuc3BsaXQoZGF5cywgNyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3QoZGF0ZSkge1xuICAgICAgICAgICAgY3RybC5kYXRlICA9IGRhdGU7XG4gICAgICAgICAgICBjdHJsLm1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xuICAgICAgICAgICAgY3RybC55ZWFyICA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgIGN0cmwucmVmcmVzaCgpO1xuICAgICAgICB9XG5cblx0fVxuXG4gICAgLypAbmdJbmplY3QqL1xuICAgIHN0YXRpYyBjcmVhdGUoJG1kVGhlbWluZykge1xuICAgICAgICByZXR1cm4gbmV3IE1kQ2FsZW5kYXJNb250aERpcmVjdGl2ZSgkbWRUaGVtaW5nKTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWRDYWxlbmRhck1vbnRoRGlyZWN0aXZlOyIsImNvbnN0IERBWVNfSU5fTU9OVEggPSBbMzEsIDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XG5cbmNsYXNzIERhdGVVdGlscyB7XG5cbiAgICBnZXREYXlzSW5Nb250aCggeWVhciwgbW9udGggKSB7XG4gICAgICAgIHJldHVybiAoKG1vbnRoID09PSAxKSAmJiAoeWVhciAlIDQgPT09IDApICYmICgoeWVhciAlIDEwMCAhPT0gMCkgfHwgKHllYXIgJSA0MDAgPT09IDApKSkgPyAyOSA6IERBWVNfSU5fTU9OVEhbbW9udGhdO1xuICAgIH1cblxuICAgIGdldERhdGVzKHN0YXJ0RGF0ZSwgbikge1xuICAgICAgICBsZXQgZGF0ZXMgICA9IG5ldyBBcnJheShuKTtcbiAgICAgICAgbGV0XHRjdXJyZW50ID0gbmV3IERhdGUoc3RhcnREYXRlKTtcbiAgICAgICAgbGV0XHRpID0gMDtcbiAgICAgICAgY3VycmVudC5zZXRIb3VycygxMik7IC8vIFByZXZlbnQgcmVwZWF0ZWQgZGF0ZXMgYmVjYXVzZSBvZiB0aW1lem9uZSBidWdcbiAgICAgICAgd2hpbGUgKCBpIDwgbiApIHtcbiAgICAgICAgICAgIGRhdGVzW2krK10gPSBuZXcgRGF0ZShjdXJyZW50KTtcbiAgICAgICAgICAgIGN1cnJlbnQuc2V0RGF0ZSggY3VycmVudC5nZXREYXRlKCkgKyAxICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGVzO1xuICAgIH1cblxuICAgIGNvbXBhcmUoZGF0ZTEsIGRhdGUyKSB7XG4gICAgICAgIHJldHVybiAobmV3IERhdGUoZGF0ZTEuZ2V0RnVsbFllYXIoKSwgZGF0ZTEuZ2V0TW9udGgoKSwgZGF0ZTEuZ2V0RGF0ZSgpKSAtIG5ldyBEYXRlKGRhdGUyLmdldEZ1bGxZZWFyKCksIGRhdGUyLmdldE1vbnRoKCksIGRhdGUyLmdldERhdGUoKSkgKTtcbiAgICB9XG5cbiAgICBlcXVhbChkYXRlMSwgZGF0ZTIpIHtcbiAgICAgICAgaWYgKGRhdGUxICYmIGRhdGUyKSB7XG4gICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKGRhdGUxLmdldEZ1bGxZZWFyKCksIGRhdGUxLmdldE1vbnRoKCksIGRhdGUxLmdldERhdGUoKSkgLSBuZXcgRGF0ZShkYXRlMi5nZXRGdWxsWWVhcigpLCBkYXRlMi5nZXRNb250aCgpLCBkYXRlMi5nZXREYXRlKCkpID09PSAwICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZTEgPT09IGRhdGUyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3BsaXQgYXJyYXkgaW50byBzbWFsbGVyIGFycmF5c1xuICAgIHNwbGl0KGFyciwgc2l6ZSkge1xuICAgICAgICBsZXQgYXJyYXlzID0gW107XG4gICAgICAgIHdoaWxlIChhcnIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXJyYXlzLnB1c2goYXJyLnNwbGljZSgwLCBzaXplKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5cztcbiAgICB9XG5cbn1cblxuY29uc3QgZGF0ZVV0aWxzID0gbmV3IERhdGVVdGlscygpO1xuXG5leHBvcnQgZGVmYXVsdCBkYXRlVXRpbHM7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHsgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoXCJ0ZW1wbGF0ZXNcIik7IH1cbmNhdGNoKGVycikgeyBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShcInRlbXBsYXRlc1wiLCBbXSk7IH1cbm1vZHVsZS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInNyYy9jYWxlbmRhci1tb250aC5odG1sXCIsXG4gICAgXCI8ZGl2IGxheW91dD1cXFwiY29sdW1uXFxcIiBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGhcXFwiPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcInNwYWNlLWJldHdlZW4gY2VudGVyXFxcIiBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtY29udHJvbHNcXFwiPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPG1kLWJ1dHRvbiBuZy1jbGljaz1cXFwiY3RybC5wcmV2KClcXFwiIGFyaWEtbGFiZWw9XFxcInByZXZcXFwiPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgIDxtZC1pY29uIG1kLXN2Zy1zcmM9XFxcInByZXYtbW9udGhcXFwiPjwvbWQtaWNvbj5cXG5cIiArXG4gICAgXCIgICAgICAgIDwvbWQtYnV0dG9uPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPGRpdiBmbGV4PjwvZGl2PlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzcGFjZS1iZXR3ZWVuIGNlbnRlclxcXCIgbGF5b3V0LXBhZGRpbmc+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPG1kLXNlbGVjdCBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtY29udHJvbHMtbW9udGhcXFwiIG5nLW1vZGVsPVxcXCJjdHJsLm1vbnRoXFxcIiBuZy1jaGFuZ2U9XFxcImN0cmwucmVmcmVzaCgpXFxcIj5cXG5cIiArXG4gICAgXCIgICAgICAgICAgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XFxcIm1vbnRoIGluIGN0cmwubW9udGhzXFxcIiBuZy1zZWxlY3RlZD1cXFwie3skaW5kZXggPT09IGN0cmwubW9udGh9fVxcXCIgbmctdmFsdWU9XFxcIiRpbmRleFxcXCI+e3ttb250aCB8IHVwcGVyY2FzZX19PC9tZC1vcHRpb24+XFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPC9tZC1zZWxlY3Q+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPG1kLXNlbGVjdCBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtY29udHJvbHMteWVhci1zZWxlY3RcXFwiIG5nLW1vZGVsPVxcXCJjdHJsLnllYXJcXFwiIG5nLWNoYW5nZT1cXFwiY3RybC5yZWZyZXNoKClcXFwiPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cXFwieWVhciBpbiBjdHJsLnllYXJzXFxcIiBuZy1zZWxlY3RlZD1cXFwie3t5ZWFyID09PSBjdHJsLnllYXJ9fVxcXCIgbmctdmFsdWU9XFxcInllYXJcXFwiPnt7eWVhcn19PC9tZC1vcHRpb24+XFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPC9tZC1zZWxlY3Q+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPCEtLTxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XFxcIm1kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWNvbnRyb2xzLXllYXJcXFwiPi0tPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICA8IS0tPGlucHV0IHJlcXVpcmVkIHR5cGU9XFxcIm51bWJlclxcXCIgc3RlcD1cXFwiYW55XFxcIiBuYW1lPVxcXCJ5ZWFyXFxcIiBuZy1tb2RlbD1cXFwiY3RybC55ZWFyXFxcIiBuZy1jaGFuZ2U9XFxcImN0cmwucmVmcmVzaCgpXFxcIj4tLT5cXG5cIiArXG4gICAgXCIgICAgICAgICAgICA8IS0tPC9tZC1pbnB1dC1jb250YWluZXI+LS0+XFxuXCIgK1xuICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXG4gICAgXCJcXG5cIiArXG4gICAgXCIgICAgICAgIDxkaXYgZmxleD48L2Rpdj5cXG5cIiArXG4gICAgXCJcXG5cIiArXG4gICAgXCIgICAgICAgIDxtZC1idXR0b24gbmctY2xpY2s9XFxcImN0cmwubmV4dCgpXFxcIiBhcmlhLWxhYmVsPVxcXCJuZXh0XFxcIj5cXG5cIiArXG4gICAgXCIgICAgICAgICAgICA8bWQtaWNvbiBtZC1zdmctc3JjPVxcXCJuZXh0LW1vbnRoXFxcIj48L21kLWljb24+XFxuXCIgK1xuICAgIFwiICAgICAgICA8L21kLWJ1dHRvbj5cXG5cIiArXG4gICAgXCJcXG5cIiArXG4gICAgXCIgICAgPC9kaXY+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgIDxkaXYgbGF5b3V0PVxcXCJjb2x1bW5cXFwiIGNsYXNzPVxcXCJtZC1kYXRlLXBpY2tlci1jYWxlbmRhci1tb250aC13ZGF5c1xcXCI+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgICAgICA8ZGl2IGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtbWFyZ2luPlxcblwiICtcbiAgICBcIiAgICAgICAgICAgIDxzcGFuIGZsZXggbmctcmVwZWF0PVxcXCJ3ZGF5IGluIGN0cmwud2Vla2RheXNcXFwiIGNsYXNzPVxcXCJtZC1kYXRlLXBpY2tlci1jYWxlbmRhci1tb250aC13ZGF5XFxcIj57e3dkYXl9fTwvc3Bhbj5cXG5cIiArXG4gICAgXCIgICAgICAgIDwvZGl2PlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtZGF0ZS1waWNrZXItY2FsZW5kYXItbW9udGgtZGF5c1xcXCI+XFxuXCIgK1xuICAgIFwiICAgICAgICAgICAgPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LW1hcmdpbiBuZy1yZXBlYXQ9XFxcInJvdyBpbiBjdHJsLnJvd3NcXFwiPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZmxleCBuZy1jbGljaz1cXFwiY3RybC5zZWxlY3QoZGF5LmRhdGUpXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIm1kLWRhdGUtcGlja2VyLWNhbGVuZGFyLW1vbnRoLWRheVxcXCIgbmctY2xhc3M9XFxcImRheS5jbGFzc2VzXFxcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgbmctcmVwZWF0PVxcXCJkYXkgaW4gcm93XFxcIj57e2RheS5sYWJlbH19PC9zcGFuPlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIiAgICAgICAgICAgIDwvZGl2PlxcblwiICtcbiAgICBcIiAgICAgICAgPC9kaXY+XFxuXCIgK1xuICAgIFwiXFxuXCIgK1xuICAgIFwiICAgIDwvZGl2PlxcblwiICtcbiAgICBcIlxcblwiICtcbiAgICBcIjwvZGl2PlwiKTtcbn1dKTtcbn0pKCk7XG4iXX0=
