import dateUtils from './date-utils';

// Calendar month class
class MdCalendarMonthDirective {

	constructor($mdTheming) {
        this.$mdTheming  = $mdTheming;
		this.templateUrl = 'src/calendar-month.html';
		this.restrict    = 'E';

		this.scope = {
			date	    : '=ngModel',
            min         : '@',
            max         : '@',
			month	    : '@',
			year	    : '@',
            startingDay : '@'
		};

		this.bindToController = true;
		this.controllerAs = 'ctrl';
        this.link = this.link.bind(this);
	}


	link(scope, element, attrs) {
        console.log('Link function was called');
        this.$mdTheming(element);
	}

    /*@ngInject*/
	controller(moment) {

        let ctrl = this;

		ctrl.date  = ctrl.date  || new Date();
		ctrl.month = ctrl.month || ctrl.date.getMonth();
        ctrl.months = moment.months();

        ctrl.minDate = ctrl.min ? moment(ctrl.min, ['YYYY']).toDate() : null;
        ctrl.maxDate = ctrl.max ? moment(ctrl.max, ['YYYY']).toDate() : null;

        ctrl.year    = ctrl.year  || ctrl.date.getFullYear();
        ctrl.minYear = ctrl.minDate ? ctrl.minDate.getFullYear() : 1970;
        ctrl.maxYear = ctrl.maxDate ? ctrl.maxDate.getFullYear() : new Date().getFullYear();
        ctrl.years = [];
        for (let y = ctrl.minYear; y <= ctrl.maxYear; ++y) {
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
            const date = new Date(ctrl.year, ctrl.month, 15);
            moveToDate(moment(date).subtract(1, 'months').toDate());
		}

		function next() {
            const date = new Date(ctrl.year, ctrl.month, 15);
            moveToDate(moment(date).add(1, 'months').toDate());
		}

        function moveToDate(date) {
            ctrl.year  = date.getFullYear();
            ctrl.month = date.getMonth();
            ctrl.refresh();
        }

        function refresh() {
            console.log(ctrl.year, ctrl.month);

            let firstDayOfMonth = new Date(ctrl.year, ctrl.month, 1);
            let difference = ctrl.startingDay - firstDayOfMonth.getDay();
            let numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference;
            let firstDate = new Date(firstDayOfMonth);

            if (numDisplayedFromPreviousMonth > 0) {
                firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }

            // 42 is the number of days on a six-month calendar
            let days = dateUtils.getDates(firstDate, 42);
            let today = new Date();
            for (let i = 0; i < 42; i++) {
                let day = days[i];
                days[i] = {
                    date: day,
                    label: moment(day).format('DD'),
                    classes: {
                        'md-date-picker-calendar-month-day-selected': dateUtils.equal(ctrl.date, day),
                        'md-date-picker-calendar-month-day-today': dateUtils.equal(today, day),
                        'md-date-picker-calendar-month-day-muted': day.getMonth() !== ctrl.month
                    }
                };
            }

            ctrl.rows = dateUtils.split(days, 7);
        }

        function select(date) {
            ctrl.date  = date;
            ctrl.month = date.getMonth();
            ctrl.year  = date.getFullYear();
            ctrl.refresh();
        }

	}

    /*@ngInject*/
    static create($mdTheming) {
        return new MdCalendarMonthDirective($mdTheming);
    }

}

export default MdCalendarMonthDirective;