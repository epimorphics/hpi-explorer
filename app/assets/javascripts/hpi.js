var Hpi = function() {
  "use strict";

  /** Module variables */
  var _spinner;

  /** Module initialisation */
  var init = function() {
    initControls();
    bindEvents();
    drawPreview();
    setInitialFocus();
  };

  /** Event handling */
  var bindEvents = function() {
    $(".container").on( "click", ".action-disabled", onDisabledAction );
    $(".container").on( "click", "a.action-add-comparison", onAddComparison );
    $(".container").on( "click", "a.action-show-map", onShowMap );
    $(".container").on( "click", "a.action-remove-comparison", onRemoveComparison );
    $(".container").on( "click", "a.action-remove-selection", onRemoveSelection );

    $("form.search").on( "submit", onSearchSubmit );

    $("form.preview").on( "click", "input", onChangePreviewSettings );
    $("form.preview").on( "change", ".dates-filter select", drawPreview );
    $("form.preview").on( "click", "a.action-set-dates", onChangeDates );

    $(".container").on( "click", ".action-bookmark", onBookmark );
    $(".container").on( "click", ".action-help" , onHelp );

    $(document).on( "ajaxSend", onAjaxSend )
               .on( "ajaxComplete", onAjaxComplete );
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

    $(".js.hidden").removeClass("hidden");

    // ajax spinner
    if (!_spinner) {
      _spinner = new Spinner( {
        color:'#ACCD40',
        lines: 12,
        radius: 20,
        length: 10,
        width: 4
      } );
    }
  };

  /** User has submitted a search on the search form */
  var onSearchSubmit = function( e ) {
    if (checkDisabledAction(e)) {return false;}
    if (e) {e.preventDefault();}
  };

  /** User has selected one of the autocomplete options */
  var onAutocompleteSelect = function( searchId, e, ui ) {
    e.preventDefault();

    var locationName = ui.item.label;
    var locationURI = ui.item.value;

    selectLocation( locationName, locationURI, searchId, e.target );
  };

  /** User has clicked to change some of the preview settings */
  var onChangePreviewSettings = function( e ) {
    if (checkDisabledAction(e)) {return false;}
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
    var inputElem = $("input#" + searchId.sym);
    var elem = $(sourceElem).parents(".area-selection");

    inputElem.val( locationName );

    elem.find(".selected-search-term")
        .empty()
        .append( sprintf( "<input type='hidden' name='%s' value='%s' />",
                 attributeWithSearchId( "loc", searchId ), locationName ) )
        .append( sprintf( "<input type='hidden' name='%s' value='%s' />",
                 attributeWithSearchId( "loc_uri", searchId ), locationURI ) );

    elem.find( "a.action-remove-selection")
        .removeClass( "hidden" )

    if (compareAreas()) {
      elem.find(".selected-search-term")
          .append( "<input type='hidden' name='compare' value='1' />" );
    }
  };

  /** User wants to show the comparison region */
  var onAddComparison = function( e ) {
    if (checkDisabledAction(e)) {return false;}
    e.preventDefault();
    clearPreview();

    var interactionState = currentInteractionState( "search",
                                                    {compare: 1},
                                                    ['search_0', 'search_1'] );
    $.ajax({
            type: "POST",
            url: Routes.search_index_path(),
            data: interactionState,
            dataType: "html",
            global: false
           })
      .done( onAddComparisonDone )
      .fail( onAddComparisonFail );
  };

  var onAddComparisonDone = function( html ) {
    $(".search-form-container").empty().append( html );
    initControls();
    drawPreview();
    _.defer( function() {$("input#search_1").focus();} );
  };

  var onAddComparisonFail = function( jqXhr, error ) {
    console.log( "Comparison failure: " + error );
  };

  /** User wants to remove the comparison of two areas option */
  var onRemoveComparison = function( e ) {
    if (checkDisabledAction(e)) {return false;}
    e.preventDefault();
    clearPreview();
    resetPreviewFormElement( "compare", null );

    var interactionState = currentInteractionState( "search",
                                                    {},
                                                    ['compare', 'search_1', 'loc_1', 'loc_uri_1'] );
    $.ajax({
            type: "POST",
            url: Routes.search_index_path(),
            data: interactionState,
            dataType: "html",
            global: false
           })
      .done( onAddComparisonDone )
      .fail( onAddComparisonFail );
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
    if (checkDisabledAction(e)) {return false;}
    e.preventDefault();
    var button = $(e.currentTarget);
    var elem = button.parents(".area-selection");
    elem.find(".selected-search-term").empty();
    elem.find( "input" ).val( "" );
    elem.find( "a.action-remove-selection" ).addClass( "hidden" );
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
    if (checkDisabledAction(e)) {return false;}
    e.preventDefault();
    var button = $(e.currentTarget);
    var searchId = button.parents( "span[data-search-id]" ).data( "search-id" );

    HpiMapSearch.showDialogue( searchId, e.currentTarget );
  };

  /** User has selected an option to pick an alternative date range */
  var onChangeDates = function( e ) {
    if (checkDisabledAction(e)) {return false;}
    e.preventDefault();
    var a = $(e.currentTarget);
    $("select#from_m").val( a.data( "from-m" ));
    $("select#from_y").val( a.data( "from-y" ));
    $("select#to_m").val( a.data( "to-m" ));
    $("select#to_y").val( a.data( "to-y" )).change();

  };

  /** User wants to save the current location as a bookmark */
  var onBookmark = function( e ) {
    if (checkDisabledAction(e)) {return false;}
    e.preventDefault();

    var baseURL = "";

    if ($("form.preview").length) {
      var query = currentInteractionState( "preview", {}, ["utf8", "authenticity_token"] );
      var queryString = _.keys(query)
                         .reduce( function(a,k) {
                            a.push(k+'='+encodeURIComponent(query[k]));
                            return a
                          },[])
                         .join('&');
      baseURL = sprintf( "%s?%s", window.location.href.replace( /\?[^\?]*/, "" ), queryString );
    }
    else {
      baseURL = window.location.href;
    }

    $("#bookmark-modal").modal( 'show' );
    _.defer( function() {
      $(".fb-share-button").data( "href", baseURL );
      $(".twitter-share-button").data( "url", baseURL );
      gapi.plusone.render("plus-one", {"data-href": baseURL} );

      $(".bookmark-url").val( baseURL ).select();
    } );
  };

  /** User wants to see the help page */
  var onHelp = function( e ) {
    e.preventDefault();
    $("#help-modal").modal("show");
  };

  /* Ajax event handling */
  var onAjaxSend = function( e ) {
    $("a.btn").addClass( "action-disabled" );
    _spinner.spin( $(".container")[0] );
  };

  var onAjaxComplete = function( e ) {
    $("a.btn").removeClass( "action-disabled" );
    _spinner.stop();
  };

  var checkDisabledAction = function( e ) {
    if ($(e.currentTarget).is(".action-disabled")) {
      e.preventDefault();
      return true;
    }
    return false;
  };

  var onDisabledAction = function( e ) {
    if (checkDisabledAction(e)) {return false;}
  }

  /** Set the initial focus when the page loads */
  var setInitialFocus = function() {
    $("#search_0").focus();
  };

  return {
    init: init,
    currentInteractionState: currentInteractionState,
    selectLocation: selectLocation
  }
}();

$( Hpi.init );
