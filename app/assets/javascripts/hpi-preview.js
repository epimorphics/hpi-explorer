var HpiPreview = function() {
  "use strict";

  /** Module initializer */
  var init = function() {

  };

  /** Update the preview, based on the current form */
  var updatePreview = function( options ) {
    var interactionState = currentInteractionState( options );
    $.post( Routes.preview_index_path(),
            interactionState, null, "json" )
      .done( onPreviewDone )
      .fail( onPreviewFail );
  };

  /** Return the current interaction state as a hash */
  var currentInteractionState = function( options ) {
    var previewPreferences = $("form.preview").serializeHash();
    return _.extend( previewPreferences, options || {} );
  };

  var onPreviewDone = function( json ) {
    $("#results-header").empty().html( json.header );
    $("#results-preview").empty().html( json.preview );
  };

  var onPreviewFail = function( jqXhr, error ) {

  };

  return {
    init: init,
    updatePreview: updatePreview
  };
}();

$( HpiPreview.init );
