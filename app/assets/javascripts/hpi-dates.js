var HpiDates = function() {
  "use strict";

  var _min = new Date( 1995, 0, 1 );
  var _max = new Date();
  var _initialised = false;
  var _start_at;
  var _end_at;
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  var init = function() {
    initComponents();
  };

  var initComponents = function() {
    $(".filter-selection .no-js").hide();
    initDateRangeSlider();
  };

  var initDateRangeSlider = function() {
    if (!_initialised && _start_at) {
      var options = {
        bounds: {
          min: _min,
          max: _max,
        },
        step: {months: 1},
        formatter: function(val) {
          var month = val.getMonth(),
              year = val.getFullYear().toString().substr(2,2);
          return months[month] + " '" + year;
        },
        defaultValues: {
          min: _start_at,
          max: _end_at
        }
      };

      $("#date-slider").dateRangeSlider( options )
                       .bind( "userValuesChanged", onDatesChanged );

      _initialised = true;
    }
  };

  var setDateRange = function( start_at, end_at ) {
    _max = end_at;
    _end_at = end_at;
    _start_at = start_at;
    initDateRangeSlider();
  };

  var onDatesChanged = function( e ) {
    var values = $("#date-slider").dateRangeSlider( "values" );
    $("select[name=from_y]").val( values.min.getFullYear().toString() );
    $("select[name=from_m]").val( (values.min.getMonth() + 1).toString() );
    $("select[name=to_y]").val( values.max.getFullYear().toString() );
    $("select[name=to_m]").val( (values.max.getMonth() + 1).toString() );

    HpiPreview.updatePreview();
  };

  return {
    init: init,
    setDateRange: setDateRange
  };
}();

$( HpiDates.init );
