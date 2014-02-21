var Hpi = function() {
  "use strict";

  /** Module initialisation */
  var init = function() {
    initControls();
  };

  /** Event handling */
  var bindEvents = function() {

  };

  /** Widget and control initialisation */
  var initControls = function() {
    $("button#action_search").hide();
    $("#search1").autocomplete({ source: HpiSearch.regionNames });

  };

  return {
    init: init
  }
}();

$( Hpi.init );
