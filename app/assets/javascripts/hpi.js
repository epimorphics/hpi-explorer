var Hpi = function() {
  "use strict";

  /** Module initialisation */
  var init = function() {
    initControls();
    bindEvents();
    drawPreview();
  };

  /** Event handling */
  var bindEvents = function() {
    $(".container").on( "click", "a.action-add-comparison", onAddComparison );
    $(".container").on( "click", "a.action-show-map", onShowMap );
    $(".container").on( "click", "a.action-remove-comparison", onRemoveComparison );
    $(".container").on( "click", "a.action-remove-selection", onRemoveSelection );

    $("form.search").on( "submit", onSearchSubmit );

    $("form.preview").on( "click", "input", onChangePreviewSettings );
    $("form.preview").on( "change", ".dates-filter select", drawPreview );
    $("form.preview").on( "click", "a.action-set-dates", onChangeDates );
  };

  /** Widget and control initialisation */
  var initControls = function() {
    $("button#action_search").hide();
    $("form.preview input[type=submit]").hide();

    // ensure we know which input field the user is entering text into
    $("form.search input:not([type=hidden])").each( function( i, elem ) {
      var sId = searchIdFromElement( elem );

      $(elem).autocomplete({
        source: HpiLocations.locationNames,
        autoFocus: true,
        minLength: 3,
        select: function( e, ui ) {
          onAutocompleteSelect( sId, e, ui );
        },
        focus: function (event, ui) {
           event.preventDefault();
        }
      });
    } );

    // add show map buttons
    $(".js.map-button").each( function( i, elem ) {
      showMapButton( elem );
    } );
  };

  /** User has submitted a search on the search form */
  var onSearchSubmit = function( e ) {
    if (e) {e.preventDefault();}
  };

  /** User has selected one of the autocomplete options */
  var onAutocompleteSelect = function( searchId, e, ui ) {
    e.preventDefault();

    var locationName = ui.item.label;
    var locationURI = ui.item.value;

    $("input#" + searchId.sym).val( "" );
    selectLocation( locationName, locationURI, searchId, e.target );
  };

  /** User has clicked to change some of the preview settings */
  var onChangePreviewSettings = function( e ) {
    drawPreview();
  };

  /** Show that a location has been selected by the user */
  var selectLocation = function( locationName, locationURI, sId, targetElem ) {
    var searchId = asSearchId( sId );
    showSelectedLocation( targetElem, searchId, locationName, locationURI );
    drawPreview();
  };

  var drawPreview = function() {
    // TODO this really refactoring to DRY it up
    if (locationComplete()) {
      resetPreviewFormElement( "loc_0", selectedLocationName( 0 ) );
      resetPreviewFormElement( "loc_uri_0", selectedLocationURI( 0 ) );

      resetPreviewFormElement( "loc_1", compareAreas() ? selectedLocationName( 1 ) : null );
      resetPreviewFormElement( "loc_uri_1", compareAreas() ? selectedLocationURI( 1 ) : null );

      if (compareAreas()) {
        resetPreviewFormElement( "compare", 1 );
      }

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
                            .append( sprintf( "<p>Selected: %s " +
                                              "<a href='#' class='action action-remove-selection btn'>" +
                                              "<i class='fa fa-times-circle'></i></a></p>",
                                              locationName ) )
                            .append( sprintf( "<input type='hidden' name='%s' value='%s' />",
                                     attributeWithSearchId( "loc", searchId ), locationName ) )
                            .append( sprintf( "<input type='hidden' name='%s' value='%s' />",
                                     attributeWithSearchId( "loc_uri", searchId ), locationURI ) );

    if (compareAreas()) {
      elem.append( "<input type='hidden' name='compare' value='1' />" );
    }
  };

  /** User wants to show the comparison region */
  var onAddComparison = function( e ) {
    e.preventDefault();
    clearPreview();

    var interactionState = currentInteractionState( "search",
                                                    {compare: 1},
                                                    ['search_0', 'search_1'] );
    $.post( Routes.search_index_path(),
            interactionState, null, "html" )
      .done( onComparisonDone )
      .fail( onComparisonFail );
  };

  var onComparisonDone = function( html ) {
    $(".search-form-container").empty().append( html );
    initControls();
    drawPreview();
  };

  var onComparisonFail = function( jqXhr, error ) {
    console.log( "Comparison failure: " + error );
  };

  /** User wants to remove the comparison of two areas option */
  var onRemoveComparison = function( e ) {
    e.preventDefault();
    clearPreview();
    resetPreviewFormElement( "compare", null );

    var interactionState = currentInteractionState( "search",
                                                    {},
                                                    ['compare', 'search_1', 'loc_1', 'loc_uri_1'] );
    $.post( Routes.search_index_path(),
            interactionState, null, "html" )
      .done( onComparisonDone )
      .fail( onComparisonFail );
  };


  /** Return the current interaction state as a hash */
  var currentInteractionState = function( formClass, options, deletes ) {
    var state = $(sprintf( "form.%s", formClass) ).serializeHash();
    state = _.extend( state, options || {} );

    _.each( (deletes || []), function( d ) {
      delete state[d];
    } );

    return state;
  };

  /** Remove a selection */
  var onRemoveSelection = function( e ) {
    e.preventDefault();
    var button = $(e.currentTarget);
    var elem = button.parents(".area-selection").find(".selected-search-term");
    var input = elem.find( "input" );
    var searchId = input.attr("name");

    elem.empty();
    clearPreview();
  }

  var clearPreview = function() {
    $("#results-preview").empty();
    $("#results-header").empty();
  };

  /** Ensure a show-map button is present for the element */
  var showMapButton = function( elem ) {
    if ($(elem).find( "button" ).length === 0) {
      var alt = 'find a location on the map';
      $(elem).append( sprintf( "<a class='action action-show-map btn-default btn map-button' alt='%s' title='%s' >" +
                               "</a>",
                               alt, alt ) );
    }
  };

  /** User has clicked to show the map */
  var onShowMap = function( e ) {
    e.preventDefault();
    var button = $(e.currentTarget);
    var searchId = button.parents( "span[data-search-id]" ).data( "search-id" );

    HpiMapSearch.showDialogue( searchId, e.currentTarget );
  };

  /** User has selected an option to pick an alternative date range */
  var onChangeDates = function( e ) {
    e.preventDefault();
    var a = $(e.currentTarget);
    $("select#from_m").val( a.data( "from-m" ));
    $("select#from_y").val( a.data( "from-y" ));
    $("select#to_m").val( a.data( "to-m" ));
    $("select#to_y").val( a.data( "to-y" )).change();

  };

  return {
    init: init,
    currentInteractionState: currentInteractionState,
    selectLocation: selectLocation
  }
}();

$( Hpi.init );
