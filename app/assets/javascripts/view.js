// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var HpiView = function() {
  var init = function() {
    initComponents();
  };

  var initComponents = function() {
  };

  return {
    init: init
  }
}();

// jQuery initialisation
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "currency-pre": function ( a ) {
      a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
      return parseFloat( a );
    },

    "currency-asc": function ( a, b ) {
      return a - b;
    },

    "currency-desc": function ( a, b ) {
      return b - a;
    },

    "yearmonth-pre": function( a ) {
      var ym = a.split("-");
      return new Date( parseInt( ym[0] ), parseInt( ym[1] ) - 1, 1 );
    },

    "yearmonth-asc": function( a, b ) {
      return (a === b) ? 0 : (a < b ? -1 : 1);
    },

    "yearmonth-desc": function( a, b ) {
      return (a === b) ? 0 : (a < b ? 1 : -1);
    },

    "monthyear-pre": function( a ) {
      var my = a.split(" ");
      var month = my[0];
      var year = my[1];

      var m = {January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
               July: 6, August: 7, September: 8, October: 9, November: 10, December: 11}[month];

      return new Date( parseInt( year ), m, 1 );
    },

    "monthyear-asc": function( a, b ) {
      return (a === b) ? 0 : (a < b ? -1 : 1);
    },

    "monthyear-desc": function( a, b ) {
      return (a === b) ? 0 : (a < b ? 1 : -1);
    }

} );
