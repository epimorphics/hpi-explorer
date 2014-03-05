var Hpi = function() {
  "use strict";

  /** Module initialisation */
  var init = function() {
    initControls();
    bindEvents();
  };

  /** Event handling */
  var bindEvents = function() {
    $("form.search").on( "submit", onSearchSubmit );
    $("form.search").on( "keydown", "input", onSeachInput );
    $("form.preview").on( "click", "input", onChangePreviewSettings );
  };

  /** Widget and control initialisation */
  var initControls = function() {
    $("button#action_search").hide();
    $("form.preview input[type=submit]").hide();

    // ensure we know which input field the user is entering text into
    $("form.search input:not([type=hidden])").each( function( i, elem ) {
      var sId = searchIdFromElement( elem );

      $(elem).autocomplete({
        source: HpiSearch.regionNames,
        select: function( e, ui ) {
          onAutocompleteSelect( sId, e, ui );
        },
        focus: function (event, ui) {
           event.preventDefault();
        }
      });
    } );

  };

  /** User has submitted a search on the search form */
  var onSearchSubmit = function( e ) {
    if (e) {e.preventDefault();}
    // if (_.keys(_currentSelection).length > 0) {
    //   drawPreview();
    // }
  };

  /** User has selected one of the autocomplete options */
  var onAutocompleteSelect = function( searchId, e, ui ) {
    e.preventDefault();

    var locationName = ui.item.label;
    var locationURI = ui.item.value;

    showSelectedLocation( e.target, searchId, locationName, locationURI );

    drawPreview();
    $(e.currentTarget).val( "" );
  };

  /** User has started typing into an input field */
  var onSeachInput = function( e ) {
    // var searchId = searchIdFromElement( e.currentTarget );
    // forgetSelectedLocation( searchId );
  };

  /** User has clicked to change some of the preview settings */
  var onChangePreviewSettings = function( e ) {
    drawPreview();
  };

  var drawPreview = function() {
    // TODO this really refactoring to DRY it up
    if (locationComplete()) {
      resetPreviewFormElement( "loc_0", selectedLocationName( 0 ) );
      resetPreviewFormElement( "loc_uri_0", selectedLocationURI( 0 ) );

      resetPreviewFormElement( "loc_1", compareAreas() ? selectedLocationName( 1 ) : null );
      resetPreviewFormElement( "loc_uri_1", compareAreas() ? selectedLocationURI( 1 ) : null );

      HpiPreview.updatePreview();
    }
  };

  var resetPreviewFormElement = function( elemName, val ) {
    var elem = $(sprintf("form.preview input[type=hidden][name=%s]", elemName ) );
    if (elem.length) {
      // input element exists
      if (val) {
        elem.val( val );
      }
      else {
        elem.remove();
      }
    }
    else {
      // element does not yet exist
      if (val) {
        $("form.preview").append(sprintf( "<input type='hidden' name='%s' value='%s' />", elemName, val ) );
      }
    }
  };

  var forgetSelectedLocation = function( sid ) {
    console.log( "Forgetting selected location " + sid );
    locationFormElement( sid, "loc" ).remove();
    locationFormElement( sid, "loc_uri" ).remove();
  };

  var selectedLocationName = function( sid ) {
    return locationFormElement( sid, "loc" ).val();
  };

  var selectedLocationURI = function( sid ) {
    return locationFormElement( sid, "loc_uri" ).val();
  };

  var locationFormElement = function( sid, l ) {
    var li = attributeWithSearchId( l, asSearchId( sid ) );
    return $( sprintf( "form.search input[type=hidden][name=%s]", li ) );
  };

  /** Return true if we have all necessary locations that we can begin query */
  var locationComplete = function() {
    var location0 = selectedLocationURI( 0 );
    var location1 = selectedLocationURI( 1 );

    return compareAreas() ? (location0 && location1) : location0;
  };

  /** Return true if we are performing a comparison */
  var compareAreas = function() {
    return $("form.search input[type=hidden][name=compare]").length;
  };

  /* Return loc or loc_compare as the identity of the search the user is conducting */
  var searchIdFromElement = function( elem ) {
    var sId = $(elem).attr( "name" );
    return asSearchId( parseInt( sId.replace( /[^\d]*/, "" ) ) );
  };

  /** Return a search ID object for search N */
  var asSearchId = function( i ) {
    return _.isNumber( i ) ? {n: i, sym: "search_" + i } : i;
  };

  /** Return a symbol tagged with the search ID */
  var attributeWithSearchId = function( sym, searchId ) {
    return sprintf( "%s_%d", sym, searchId.n );
  };

  /** User has selected a location */
  var showSelectedLocation = function( sourceElem, searchId, locationName, locationURI ) {
    var elem = $(sourceElem).parents(".area-selection")
                            .find(".selected-search-term")
                            .empty()
                            .append( sprintf( "<p>Selected: %s</p>", locationName ) )
                            .append( sprintf( "<input type='hidden' name='%s' value='%s' />",
                                     attributeWithSearchId( "loc", searchId ), locationName ) )
                            .append( sprintf( "<input type='hidden' name='%s' value='%s' />",
                                     attributeWithSearchId( "loc_uri", searchId ), locationURI ) );

    if (compareAreas()) {
      elem.append( "<input type='hidden' name='compare' value='1' />" );
    }
  };

  return {
    init: init
  }
}();

$( Hpi.init );
