/* Generate charts of HPI data */

var HpiChart = function() {
  var FORMATTERS = {
    numeric: function( v )   {return parseFloat( v );},
    string: function( v )    {return v;},
    yearmonth: function( v ) {return Util.parseMonthYear( v );},
    currency: function( v )  {return Util.parseCurrency( v );}
  };

  /* Chart options indexed by aspect property */
  var ASPECT_OPTIONS = {
     "hpi:indicesSASM":                     {yaxis: "yaxis"},
     "hpi:monthlyChange":                   {yaxis: "y2axis"},
     "hpi:annualChange":                    {yaxis: "y2axis"},
     "hpi:salesVolume":                     {yaxis: "y4axis",
                                             renderer: $.jqplot.BarRenderer,
                                             rendererOptions: {
                                              barWidth: 10
                                             }},
     "hpi:averagePricesSASM":               {yaxis: "y3axis"},
     "hpi:averagePricesDetachedSASM":       {yaxis: "y3axis"},
     "hpi:averagePricesSemiDetachedSASM":   {yaxis: "y3axis"},
     "hpi:averagePricesTerracedSASM":       {yaxis: "y3axis"},
     "hpi:averagePricesFlatMaisonetteSASM": {yaxis: "y3axis"}
  };

  /** Module initialisation */
  var init = function() {

  };

  /** Extract the chart data series from the given data table */
  var chartDataSeries = function( selector ) {
    var table = $(selector);
    var series = {_keys: defaultKeys()};

    table.find( "th[data-location]" ).each( function( i, cell ) {
      var th = $(cell);
      var indexName = $.trim( th.text() );
      var location = th.data( "location" );

      var sKey = sprintf( "%s %s", location, indexName );

      var key = {
        location: location,
        name: sKey,
        type: th.data( "type" ),
        aspect: th.data( "aspect" )
      };

      series._keys.push( key );
      series[key.name] = [];
    } );

    table.find( "tbody tr" ).each( function( i, row ) {
      var date;

      $(row).find( "td" ).each( function( j, cell ) {
        var td = $(cell);
        var key = series._keys[j];

        if (j == 0) {
          date = FORMATTERS[key.type]( $.trim( td.text() ) );
        }
        else {
          var raw = $.trim( td.text() );

          if (raw) {
            var value = FORMATTERS[key.type]( raw );
            series[key.name].push( [date, value] );
          }
        }
      } );
    } );

    return series;
  };

  var defaultKeys = function() {
    return [{location: '', name: "Date", type: 'yearmonth'}];
  };

  /** Draw the charts for the current data series */
  var drawCharts = function( tableSelector, chartSelector, separate ) {
    var chartData = chartDataSeries( tableSelector );
    var keys = chartData._keys.slice( 1 );
    var series = _.map( keys, function( key ){return chartData[key.name]} );
    var options = chartOptions( keys );

    $.jqplot( chartSelector, series, options );
  };

  var chartOptions = function( keys, options ) {
    var seriesOptions = _.map( keys, function( key ) {
      return _.extend( {label: key.name},
                       ASPECT_OPTIONS[key.aspect] )
    } );

    return {
      axes:{
        xaxis:{
          renderer:$.jqplot.DateAxisRenderer,
          tickOptions: {formatString: "%b %Y"},
          autoformat: true,
          numberTicks: option( options, "numberXAxisTicks", 5)
        },
        // main y-axis is the house price index
        yaxis: {
          min: 100,
          label: "index",
          autoformat: true
        },
        // axis y2 is for relative change
        y2axis: {
          min: -10,
          max: 10,
          numberTicks: 5,
          autoformat: true,
          label: "relative change"
        },
        // axis y3 is currency
        y3axis: {
          min: 0,
          autoformat: true,
          label: "price (&pound;)"
        },
        // axis y4 is volume
        y4axis: {
          min: 0,
          autoformat: true,
          label: "no. of sales"
        }
      },
      legend: {
        show: true,
        location: "se"
      },
      seriesDefaults: {
        shadow: false
      },
      grid: {
        shadow: false
      },
      series: seriesOptions
    };
  };

  /** Return an option value, or a default */
  var option = function( options, key, def ) {
    return (options && options[key]) ? options[key] : def;
  };

  // module exports
  return {
    chartDataSeries: chartDataSeries,
    drawCharts: drawCharts,
    init: init
  };
}();

$( HpiChart.init );
