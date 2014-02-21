var Hpi = function() {
  "use strict";

  var _currentSelection = {};

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
    $("form.search input").each( function( i, elem ) {
      var searchId = ($(elem).attr( "name" ) == "search1") ? "loc" : "loc_compare";

      $(elem).autocomplete({
        source: HpiSearch.regionNames,
        select: function( e, ui ) {
          onAutocompleteSelect( searchId, e, ui );
        }
      });
    } );

  };

  /** User has submitted a search on the search form */
  var onSearchSubmit = function( e ) {
    if (e) {e.preventDefault();}
    if (_.keys(_currentSelection).length > 0) {
      drawPreview();
    }
  };

  /** User has selected one of the autocomplete options */
  var onAutocompleteSelect = function( searchId, e, ui ) {
    _currentSelection[searchId] = ui.item.label;
    drawPreview();
  };

  /** User has started typing into an input field */
  var onSeachInput = function( e ) {
    delete _currentSelection[$(e.currentTarget).attr( "name" )];
  };

  /** User has clicked to change some of the preview settings */
  var onChangePreviewSettings = function( e ) {
    drawPreview();
  };

  var drawPreview = function() {
    HpiPreview.updatePreview( _currentSelection );
  };

  return {
    init: init
  }
}();

$( Hpi.init );
