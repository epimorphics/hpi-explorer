/** Search the England and Wales region using a map */
var HpiMapSearch = function() {
  var _selectedFeature = null;
  var _geojson;
  var _map;
  var _currentSearchId;
  var _targetElem;

  var init = function() {
    if (!_map) {
      _map = L.map( 'map' ).setView( [53.0072, -2], 6 );
      _map.attributionControl.setPrefix( "Contains Ordnance Survey data &copy; Crown copyright 2014" );

      $.getJSON( Routes.root_path() + "european_region_region-s-100.0.json" )
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

       $("#map-modal").on( "click", "a.choose-location", onChooseLocation );
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

  var showDialogue = function( searchId, targetElem ) {
    _currentSearchId = searchId;
    _targetElem = targetElem;

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

  var renderCountry = function( location ) {
    if (isWales( location )) {
      // the data has Wales as a region; this does not amuse the Welsh
      renderSelectionButton( location, $("#map-modal .selected-country") );
      $(".show-region").addClass( "hidden" );
    }
    else {
      if (location.parent) {
        var country = HpiLocations.locations[location.parent];
        renderSelectionButton( country, $("#map-modal .selected-country") );
      }
    }
  };

  var renderRegion = function( location ) {
    renderSelectionButton( location, $("#map-modal .selected-region") );
  };

  var renderCounties = function( location ) {
    if (location.children) {
      var elem = $("#map-modal " + ".selected-counties" );
      var prefix = "";
      var boroughPrefix = "";

      _.each( location.children, function( uri, i ) {
        var county = HpiLocations.locations[uri];
        renderSelectionButton( county, elem, prefix );

        boroughPrefix = renderBoroughs( county, boroughPrefix );
        prefix = ", "
      } );
    }
  };

  var renderBoroughs = function( location, boroughPrefix ) {
    var prefix = "";
    if (location.children && location.children.length > 0) {
      var elem = $("#map-modal " + ".selected-boroughs" );
      $(".show-boroughs").removeClass("hidden");

      elem.append( sprintf( "%s<span class='borough-parent'>%s: </span>", boroughPrefix, location.label ))
      _.each( location.children, function( uri, i ) {
        var borough = HpiLocations.locations[uri];
        renderSelectionButton( borough, elem, prefix );
        prefix = ", "
      } );

      return "<br />"
    }
    else {
      return boroughPrefix;
    }
  };

  var renderSelectionButton = function( location, elem, prefix ) {
    if (!location) {
      console.log("Warning: undefined location (this is a bug)" );
    }
    else {
      var html = sprintf( "%s<a class='action button-default choose-location' data-uri='%s'>%s</a>",
                           prefix || "", location.uri, location.label );
      elem.append( html );
    }
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
    $(".show-counties").addClass("hidden");
    $(".selected-region").append( "Select a region from the map" );
    $(".selected-country").html( "<a class='action button-default choose-location' data-uri='http://landregistry.data.gov.uk/id/region/england-and-wales'>England and Wales</a>" );
  };

  var clearSelectionDetails = function() {
    $(".selection-reset").empty();
    $(".show-region").removeClass("hidden");
    $(".show-counties").removeClass("hidden");
    $(".show-boroughs").addClass("hidden");
  };

  var onChooseLocation = function( e ) {
    e.preventDefault();
    var elem = $(e.currentTarget);
    var uri = elem.data( "uri" );
    var name = $.trim( elem.text() );

    $("#map-modal").modal( "hide" );

    Hpi.selectLocation( name, uri, _currentSearchId, _targetElem );
  }

  var isWales = function( location ) {
    return location.uri === "http://landregistry.data.gov.uk/id/region/wales";
  }


  return {
    init: init,
    showDialogue: showDialogue
  };
}();

// $( HpiMapSearch.init );
