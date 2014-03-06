var HpiPreview = function() {
  "use strict";

  /** Module initializer */
  var init = function() {

  };

  /** Update the preview, based on the current form */
  var updatePreview = function( options ) {
    var interactionState = Hpi.currentInteractionState( "preview", options );
    $.post( Routes.preview_index_path(),
            interactionState, null, "json" )
      .done( onPreviewDone )
      .fail( onPreviewFail );
  };

  var onPreviewDone = function( json ) {
    $("#results-header").empty().html( json.header );
    $("#results-preview").empty().html( json.preview );
    HpiChart.drawCharts( "table.preview", "chart", false );
  };

  var onPreviewFail = function( jqXhr, error ) {

  };

  return {
    init: init,
    updatePreview: updatePreview
  };
}();

$( HpiPreview.init );
