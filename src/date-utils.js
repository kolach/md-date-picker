const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

class DateUtils {

	static getDaysInMonth( year, month ) {
		return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
	}

	static getDates(startDate, n) {
		let dates   = new Array(n);
		let	current = new Date(startDate);
		let	i = 0;
		current.setHours(12); // Prevent repeated dates because of timezone bug
		while ( i < n ) {
			dates[i++] = new Date(current);
			current.setDate( current.getDate() + 1 );
		}
		return dates;
	}

	static asDate(d) {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}

	static compare(d1, d2) {
		return (DateUtils.asDate(d1) - DateUtils.asDate(d2));
	}

	static equal(d1, d2) {
		if (d1 && d2) {
			return DateUtils.compare(d1, d2) === 0;
		} else {
			return d1 === d2;
		}
	}

	// Split array into smaller arrays
	static split(arr, size) {
		let arrays = [];
		while (arr.length > 0) {
			arrays.push(arr.splice(0, size));
		}
		return arrays;
	}

	static yearsRange(d1, d2) {
		let minYear = d1 ? d1.getFullYear() : 1970;
		let maxYear = d2 ? d2.getFullYear() : new Date().getFullYear();
		var result  = [];
		for (let y = minYear; y <= maxYear; ++y) {
			result.push(y);
		}
		return result;
	}

}

export default DateUtils;