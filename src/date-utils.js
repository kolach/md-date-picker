const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

class DateUtils {

    getDaysInMonth( year, month ) {
        return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
    }

    getDates(startDate, n) {
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

    compare(date1, date2) {
        return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()) );
    }

    equal(date1, date2) {
        if (date1 && date2) {
            return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()) === 0 );
        } else {
            return date1 === date2;
        }
    }

    // Split array into smaller arrays
    split(arr, size) {
        let arrays = [];
        while (arr.length > 0) {
            arrays.push(arr.splice(0, size));
        }
        return arrays;
    }

}

const dateUtils = new DateUtils();

export default dateUtils;