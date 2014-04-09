/* General utilities */

var Util = function() {
  "use strict";

  var MONTHS = {January: 0,   Jan: 0,
                February: 1,  Feb: 1,
                March: 2,     Mar: 2,
                April: 3,     Apr: 3,
                May: 4,
                June: 5,      Jun: 5,
                July: 6,      Jul: 6,
                August: 7,    Aug: 7,
                September: 8, Sep: 8,
                October: 9,   Oct: 9,
                November: 10, Nov: 10,
                December: 11, Dec: 11
               };

  /** Parse a month year pair as a Date */
  var parseMonthYear = function( v ) {
    var my = v.split(" ");
    var month = my[0];
    var year = my[1];

    return new Date( parseInt( year ), parseMonth( month ) );
  };

  /** Return the month number, 0 .. 11, of a given month name */
  var parseMonth = function( month ) {
    return MONTHS[month];
  }

  /** Parse a formatted currency value into a numeric value */
  var parseCurrency = function( formatted ) {
    var v = (formatted === "") ? 0 : formatted.replace( /[^\d\-\.]/g, "" );
    return parseFloat( v );
  };

  /** Return a hash containing the URL query parameters */
  var urlQueryParams = function( s ) {
    var qs = s || window.location.search;
    qs = qs.split("+").join(" ");

    var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  };

  /** Add or remove a certain number of days to a date */
  var advanceDateByDays = function( date, nDays ) {
    return new Date( date.getTime() + nDays * 1000 * 60 * 60 * 24 );
  };

  return {
    advanceDateByDays: advanceDateByDays,
    parseCurrency: parseCurrency,
    parseFloat: parseFloat,
    parseMonth: parseMonth,
    parseMonthYear: parseMonthYear,
    urlQueryParams: urlQueryParams
  }
}();
