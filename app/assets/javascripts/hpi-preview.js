var HpiPreview = function() {
  "use strict";

  /** Module initializer */
  var init = function() {

  };

  /** Update the preview, based on the current form */
  var updatePreview = function( options ) {
    var interactionState = Hpi.currentInteractionState( "preview", options );
    clearPreview();

    $.post( Routes.preview_index_path(),
            interactionState, null, "json" )
      .done( onPreviewDone )
      .fail( onPreviewFail );
  };

  var onPreviewDone = function( json ) {
    clearPreview();
    $("#results-header").html( json.header );
    $("#results-preview").html( json.preview );
    HpiChart.drawCharts( "table.preview", "#chart", true );
  };

  var onPreviewFail = function( jqXhr, error ) {
    console.log( "Preview failed: " + error )
  };

  var clearPreview = function() {
    $("#results-header").empty();
    $("#results-preview").empty();
  };

  return {
    init: init,
    updatePreview: updatePreview
  };
}();

$( HpiPreview.init );
