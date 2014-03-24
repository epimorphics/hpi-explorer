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
     "hpi:indicesSASM":                     {axes: {
                                               yaxis: {
                                                 label: "index",
                                                 autoformat: true,
                                                 min: 50,
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90
                                               }
                                             },
                                             partition: "index"
                                            },
     "hpi:monthlyChange":                   {renderer: $.jqplot.BarRenderer,
                                             axes: {
                                               yaxis: {
                                                 label: "change %",
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90
                                               }
                                             },
                                             rendererOptions: {
                                               barWidth: 4,
                                               barPadding: 10,
                                               fillToZero: true
                                             },
                                             partition: "change"
                                            },
     "hpi:annualChange":                    {renderer: $.jqplot.BarRenderer,
                                             axes: {
                                               yaxis: {
                                                 label: "change %",
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90
                                               }
                                             },
                                             renderer: $.jqplot.BarRenderer,
                                             rendererOptions: {
                                               barWidth: 4,
                                               barPadding: 10,
                                               fillToZero: true,
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                             },
                                             partition: "change"
                                            },
     "hpi:salesVolume":                     {axes: {
                                              yaxis: {
                                                min: 0,
                                                autoformat: true,
                                                label: "no. of sales",
                                                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                angle: -90
                                              }
                                             },
                                             renderer: $.jqplot.BarRenderer,
                                             rendererOptions: {
                                               barWidth: 4,
                                               barPadding: 10
                                             },
                                             partition: "volume"
                                            },
     "hpi:averagePricesSASM":               {axes: {
                                               yaxis: {
                                                 min: 0,
                                                 autoformat: true,
                                                 label: "avg. price (GBP)",
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90,
                                               }
                                             },
                                             partition: "average-price"
                                            },
     "hpi:averagePricesDetachedSASM":       {axes: {
                                               yaxis: {
                                                 min: 0,
                                                 autoformat: true,
                                                 label: "avg. price (GBP)",
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90
                                               }
                                             },
                                             partition: "average-price"
                                            },
     "hpi:averagePricesSemiDetachedSASM":   {axes: {
                                               yaxis: {
                                                 min: 0,
                                                 autoformat: true,
                                                 label: "avg. price (GBP)",
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90
                                               }
                                             },
                                             partition: "average-price"
                                            },
     "hpi:averagePricesTerracedSASM":       {axes: {
                                               yaxis: {
                                                 min: 0,
                                                 autoformat: true,
                                                 label: "avg. price (GBP)",
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90
                                               }
                                             },
                                             partition: "average-price"
                                            },
     "hpi:averagePricesFlatMaisonetteSASM": {axes: {
                                               yaxis: {
                                                 min: 0,
                                                 autoformat: true,
                                                 label: "avg. price (GBP)",
                                                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                                                 angle: -90
                                               }
                                             },
                                             partition: "average-price"
                                            }
  };

  /** Labels for different groups of charts */
  var CHART_TYPE_LABELS = {
    index: "House price indices",
    change: "Relative change",
    "average-price": "Average prices",
    volume: "Sales volume"
  };

  /** List of the chart types we want to display, in display order */
  var CHART_TYPES = [
    "index", "change", "volume", "average-price"
  ];

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
    var chartSets = partitionChartsByType( chartData );
    var chartKinds = _.filter( CHART_TYPES, function( c ) {return _.has( chartSets, c );} );
    var elem = $(chartSelector);

    elem.empty();
    var nav = $("<ul id='charts-nav' class='nav nav-tabs'></ul>").appendTo( elem );
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

  /** Draw printable charts for the current data series */
  var drawChartsNoTabs = function( tableSelector, chartSelector ) {
    var chartData = chartDataSeries( tableSelector );
    var chartSets = partitionChartsByType( chartData );
    var chartKinds = _.filter( CHART_TYPES, function( c ) {return _.has( chartSets, c );} );
    var elem = $(chartSelector);

    elem.empty();
    var charts = $("<ul id='charts-nav' class='list-unstyled'></ul>").appendTo( elem );

    _.each( chartKinds, function( chartKind, i ) {
      charts.append( sprintf( "<li class=''><h3>%s</h3><div id='%s-chart'></div></li>",
                           CHART_TYPE_LABELS[chartKind], chartKind ) );
    } );

    _.each( chartSets, function( keys, kind ) {
      var series = _.map( keys, function( key ) {return chartData[key.name];} );
      var options = chartOptions( keys );

      $.jqplot( kind + "-chart", series, options );
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
    return ASPECT_OPTIONS[seriesKey.aspect].partition;
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
          // autoformat: true,
          numberTicks: option( options, "numberXAxisTicks", 5),
          max: selectedMaxDate()
        },
        yaxis: seriesOptions[0].axes.yaxis
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

  /** Return the user's selected maximum date, as a Date object */
  var selectedMaxDate = function() {
    var params = Util.urlQueryParams();
    var toM = $("select#to_m").val() || params["to_m"];
    var toY = $("select#to_y").val() || params["to_y"];
    return new Date( toY, toM );
  };

  // module exports
  return {
    chartDataSeries: chartDataSeries,
    drawCharts: drawCharts,
    drawChartsNoTabs: drawChartsNoTabs,
    init: init
  };
}();

$( HpiChart.init );
