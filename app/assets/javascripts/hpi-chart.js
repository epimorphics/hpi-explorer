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
     "hpi:monthlyChange":                   {yaxis: "y2axis",
                                             renderer: $.jqplot.BarRenderer,
                                             rendererOptions: {
                                               barWidth: 4,
                                               barPadding: 10,
                                               fillToZero: true
                                             }},
     "hpi:annualChange":                    {yaxis: "y2axis",
                                             renderer: $.jqplot.BarRenderer,
                                             rendererOptions: {
                                               barWidth: 4,
                                               barPadding: 10,
                                               fillToZero: true
                                             }},
     "hpi:salesVolume":                     {yaxis: "y4axis",
                                             renderer: $.jqplot.BarRenderer,
                                             rendererOptions: {
                                               barWidth: 4,
                                               barPadding: 10
                                             }},
     "hpi:averagePricesSASM":               {yaxis: "y3axis"},
     "hpi:averagePricesDetachedSASM":       {yaxis: "y3axis"},
     "hpi:averagePricesSemiDetachedSASM":   {yaxis: "y3axis"},
     "hpi:averagePricesTerracedSASM":       {yaxis: "y3axis"},
     "hpi:averagePricesFlatMaisonetteSASM": {yaxis: "y3axis"}
  };

  /** Labels for different groups of charts */
  var CHART_TYPE_LABELS = {
    yaxis: "House price indices",
    y2axis: "Relative change",
    y3axis: "Average prices",
    y4axis: "Sales volume"
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
    if (separate) {
      drawMultipleCharts( tableSelector, chartSelector );
    }
    else {
      drawSingleChart( tableSelector, chartSelector );
    }
  };

  var drawSingleChart = function( tableSelector, chartSelector ) {
    var chartData = chartDataSeries( tableSelector );
    var keys = chartData._keys.slice( 1 );
    var series = _.map( keys, function( key ){return chartData[key.name]} );
    var options = chartOptions( keys );

    $.jqplot( chartSelector, series, options );
  };

  var drawMultipleCharts = function( tableSelector, chartSelector ) {
    var chartData = chartDataSeries( tableSelector );
    var chartSets = partitionChartsByType( chartData );
    var chartKinds = _.keys( chartSets ).sort();
    var elem = $(chartSelector);

    elem.empty();
    var nav = $("<ul id='charts-nav' class='nav nav-pills'></ul>").appendTo( elem );
    var charts = $( "<div class='tab-content'></div>" ).appendTo( elem );

    _.each( chartKinds, function( chartKind, i ) {
      var active = (i === 0) ? 'active' : '';

      nav.append( sprintf( "<li class='%s'><a data-toggle='tab' href='#%s'>%s</a></li>",
                           active, chartKind, CHART_TYPE_LABELS[chartKind] ) );
      $( sprintf( "<div id='%s' class='%s tab-pane'><div id='%s-chart' class='chart view'></div></div>",
                  chartKind, active, chartKind ) ).appendTo( charts );
    } );

    _.each( chartSets, function( keys, kind ) {
      var series = _.map( keys, function( key ) {return chartData[key.name];} );
      var options = chartOptions( keys );
      var ref = "a[href=#" + kind + "]";

      if ($(ref).parent().is(".active")) {
        // this tab currently visible
        $.jqplot( kind + "-chart", series, options );
      }
      else {
        $(ref).on( "shown.bs.tab", function( e ) {
          if (!$(e.currentTarget).data('charted')) {
            $.jqplot( kind + "-chart", series, options );
            $(e.currentTarget).data( 'charted', true );
          }
        } );
      }
    } );
  };

  /** Partition the selected graphs according to the type of data being displayed,
   * which we determine from the y-axis type */
  var partitionChartsByType = function( chartData ) {
    var partition = {};

    _.each( chartData._keys.slice( 1 ), function( seriesKey ) {
      var kind = dataKind( seriesKey );
      if (!partition[kind]) {
        partition[kind] = [];
      }
      partition[kind].push( seriesKey );
    } );

    return partition;
  };

  /** Return the type of data in the given series, determined by y-axis */
  var dataKind = function( seriesKey ) {
    return ASPECT_OPTIONS[seriesKey.aspect].yaxis;
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
          numberTicks: option( options, "numberXAxisTicks", 5),
          max: new Date()
        },
        // main y-axis is the house price index
        yaxis: {
          min: 100,
          label: "index",
          autoformat: true
        },
        // axis y2 is for relative change
        y2axis: {
          autoscale: true,
          label: "change %"
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
        shadow: false,
        markerOptions: { size: 3, style:"x" }
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
