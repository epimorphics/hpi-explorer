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
            $("button.btn-default").focus();
          }
       } );
    }
    else {
      unHighlightFeature( _selectedFeature );
      _selectedFeature = null;
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
    highlightFeature( e.target, '#e5ea08' );
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

  return {
    init: init,
    showDialogue: showDialogue
  };
}();

// $( HpiMapSearch.init );
