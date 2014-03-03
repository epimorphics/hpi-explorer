// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var HpiView = function() {
  var init = function() {
    initComponents();
  };

  var initComponents = function() {
    $("#hpi-data table").dataTable();
  };

  return {
    init: init
  }
}();

$( HpiView.init );
