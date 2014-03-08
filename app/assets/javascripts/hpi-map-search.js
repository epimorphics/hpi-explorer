/** Search the England and Wales region using a map */
var HpiMapSearch = function() {
  var _selectedFeature = null;
  var _geojson;
  var _map;
  var _currentSearchId;

  var init = function() {
    if (!_map) {
      _map = L.map( 'map' ).setView( [53.0072, -2], 6 );

      $.getJSON( "european_region_region-s-100.0.json" )
       .done( function( json ) {
          _geojson = L.geoJson( json,
                                {style: featureStyle,
                                 onEachFeature: onEachFeature}
                              ).addTo( _map );

          // workaround for painting bug in Chrome
          if (L.Browser.chrome) {
            $("button.close").focus();
          }
       } );
    }
    else {
      resetSelection()
    }
  };

  var featureStyle = function( feature ) {
    return {
        fillColor: '#5A8006',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }

  var highlightFeature = function( layer, colour ) {
    layer.setStyle({
        weight: 5,
        color: colour || '#686',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
  };

  var unHighlightFeature = function( feature ) {
    if (feature) {
      _geojson.resetStyle( feature );
    }
    if (_selectedFeature) {
      highlightFeature( _selectedFeature, '#e5ea08' )
    }
  };

  var resetHighlight = function( e ) {
    geojson.resetStyle(e.target);
  };

  var onHighlightFeature = function( e ) {
    highlightFeature( e.target );
  };

  var onUnhighlightFeature = function( e ) {
    unHighlightFeature( e.target );
  };

  var onSelectFeature = function( e ) {
    var oldSelectedFeature = _selectedFeature;
    _selectedFeature = e.target;

    unHighlightFeature( oldSelectedFeature );
    highlightFeature( _selectedFeature, '#e5ea08' );

    renderFeature( _selectedFeature );
  };

  var onEachFeature = function( feature, layer ) {
    layer.on({
        mouseover: onHighlightFeature,
        mouseout: onUnhighlightFeature,
        click: onSelectFeature
    });
  }

  var showDialogue = function( searchId ) {
    _currentSearchId = searchId;
    $("#map-modal").modal('show');
    _.defer( init );
  };

  var renderFeature = function( feature ) {
    clearSelectionDetails();

    var location = featureLocation( feature );

    if (location) {
      renderCountry( location );
      renderRegion( location );
      renderCounties( location );
    }
    else {
      $("#map-modal .selected-region-options").html( "Location not recognised (this is likely a bug)")
    }
  };

  var renderRegion = function( location ) {
    $("#map-modal .selected-region").text( "Region" );
    renderSelectionButton( location, ".selected-region-options" )
  };

  var renderCountry = function( location ) {
    if (location.parent) {
      var country = HpiLocations.locations[location.parent];
      $("#map-modal .selected-country").text( "Country" );
      renderSelectionButton( country, ".selected-country-options" )
    }
  };

  var renderCounties = function( location ) {
    if (location.children) {
        $("#map-modal .selected-counties").text( "contains" );
        var prefix = "";

      _.each( location.children, function( uri, i ) {
        var county = HpiLocations.locations[uri];
        renderSelectionButton( county, ".selected-counties-options", prefix )
        prefix = ", "
      } );
    }
  };

  var renderSelectionButton = function( location, selector, prefix ) {
    var html = sprintf( "%s<a class='action button-default choose-location' data-uri='%s'>%s</a>",
                         prefix || "", location.uri, location.label );
    $("#map-modal " + selector ).append( html );
  };

  var featureLocation = function( feature ) {
    var gssCode = feature.feature.properties.CODE;
    var name = feature.feature.properties.NAME;
    var uri = HpiLocations.regionNameIndex[name];
    return HpiLocations.locations[uri];
  };

  var resetSelection = function() {
    var f = _selectedFeature;
    _selectedFeature = null;
    unHighlightFeature( f );
    clearSelectionDetails();
  };

  var clearSelectionDetails = function() {
    $(".selection-reset").empty();
  };

  return {
    init: init,
    showDialogue: showDialogue
  };
}();

// $( HpiMapSearch.init );
