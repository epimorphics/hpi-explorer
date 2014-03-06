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
      return Util.parseCurrency( a );
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
      return Util.parseMonthYear( a );
    },

    "monthyear-asc": function( a, b ) {
      return (a === b) ? 0 : (a < b ? -1 : 1);
    },

    "monthyear-desc": function( a, b ) {
      return (a === b) ? 0 : (a < b ? 1 : -1);
    }

} );
