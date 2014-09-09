$(function() {
	//Show the app
	$('#fc_app').show();
	// Setup page
	setup();
})

function fc_select(){
	$.each(data.applications, function(i, application) {
		if(0 == $('#fc_appnSel :selected').val()){
			// First element in the dropdown has been selected, setup the form again
			setup();
			return false;
		}else if(application.id == $('#fc_appnSel :selected').val()){
			//Pick the panel based on value (V, RV, N)
			if(application.value == 'V'){
				// The application has a fee based on the property transaction value
				$('#fc_app_fieldset').hide();
				$('#fc_furtherDetailsPanel').hide();
				$('#fc_rentPanel').hide();
				$('#fc_voluntaryPanel').hide();
				$('#fc_feePanel').hide();
				if(application.eFee != null){
					$("#fc_appnElectronicRow").show();
					$("#fc_appnElectronicMsg").show();
				}
				$("#fc_chosen_appdesc").text(application.appdesc);
				$('#fc_capturePanel').show();
				$('#fc_valuePanel').show();
				showVoluntary(application.voluntrycanapply);
				$('#fc_furtherDetailsPanel').show();
				$('#fc_valueTxt').focus();
			}else if(application.value == 'RV'){
				// The application has a fee based on the property rental value
				$('#fc_app_fieldset').hide();
				$('#fc_furtherDetailsPanel').hide();
				$('#fc_feePanel').hide();
				if(application.eFee != null){
					$("#fc_appnElectronicRow").show();
					$("#fc_appnElectronicMsg").show();
				}
				$('#fc_voluntaryPanel').hide();
				$("#fc_chosen_appdesc").text(application.appdesc);
				$('#fc_capturePanel').show();
				$('#fc_rentPanel').show();
				$('#fc_valuePanel').show();
				showVoluntary(application.voluntrycanapply);
				$('#fc_furtherDetailsPanel').show();
				$('#fc_valueTxt').focus();
			}else{
				// The appliaction has a static fee not based on any calculations
				$('#fc_app_fieldset').hide();
				$('#fc_valuePanel').hide();
				$('#fc_rentPanel').hide();
				$('#fc_voluntaryPanel').hide();
				if(application.eFee != null){
					$("#fc_appnElectronicRow").show();
					$("#fc_appnElectronicMsg").show();
				}
				displayInfo(application,'N',0,0,0);
			}
			return false;
		}
	});
}

function showVoluntary(voluntary){
	if(voluntary == 'TRUE'){
		$('#fc_voluntaryPanel').show();
	}
}

function displayInfo(application,voluntrySel, scale, value,rent){
	$('#fc_appnValueRentDetailsInfo').hide();
	$('#fc_notes').hide();
	$('#fc_voluntrySel').hide();
	$('#fc_capturePanel').hide();
	$("#fc_appnValueWarn").hide();
	$("#fc_appnValueRentWarn").hide();
	$("#fc_appnRentWarn").hide();
	$("#fc_appnValue").hide();
	$("#fc_appnValue").hide();
	if (value == ""){
		value = 0;
	}else{
		value = parseInt(value,10);
	}
	if (rent == ""){
		rent = 0;
	}else{
		rent = parseInt(rent,10);
	}
	var total = value+rent;
	$("#fc_appdesc").text(application.appdesc);
	if (application.scale == 1){
		$("#fc_appnScale").text("Scale 1");
	}else if (application.scale == 2){
		$("#fc_appnScale").text("Scale 2");
	}else if (application.scale == 4){
		$("#fc_appnScale").text("N/A - Fixed Fee applications");
	}else if (application.scale == "Article 2"){
		$("#fc_appnScale").text("Article 2");
	}else{
		$("#fc_appnScale").text("N/A");
	}
	if (application.value == 'N'){
		$("#fc_appnValue").show();
		$("#fc_appnValue").text("N/A");
		$("#fc_appnFee").html(application.fee);
		if(application.eFee != null){
			$("#fc_appnFeeElectronic").html(application.eFee);
		}
	}else{
		if (application.value == 'V'){
			if (total == 0){
				$("#fc_appnValueWarn").show();
			}else {
				$("#fc_appnValue").show();
				$("#fc_appnValue").text("\u00A3"+total);
			}
		}
		if (application.value == 'RV'){
			$('#fc_appnValueRentDetailsInfo').show();
			if (total == 0){
				$("#fc_appnValueRentWarn").show();
			}else if (rent == 0){ //Make sure rent is 0 here see line 68
				$("#fc_appnValue").show();
				$("#fc_appnValue").text("\u00A3"+total);
				$("#fc_appnRentWarn").show();
			}else if (value == 0){ //Make sure rent is 0 here see line 68
				$("#fc_appnValue").show();
				$("#fc_appnValue").text("\u00A3"+total);
				$("#fc_appnValueWarn").show();
			}else {
				$("#fc_appnValue").show();
				$("#fc_appnValue").text("\u00A3"+total);
			}
		}
		//Use matrix to get fee
		var calcFee = 0;
		$.each(data.fees, function(i, fee) {
			if(fee.scale == application.scale && fee.voluntary == voluntrySel){
				if (fee.lower == fee.upper) {
					if (total >= fee.lower) {
						calcFee = fee.fee;
					}
				}else if (total >= fee.lower && total <= fee.upper) {
					calcFee = fee.fee;
				}
			}
		});
		
		$("#fc_appnFee").text("\u00A3"+calcFee);

		if(application.eFee != null){
			var appID = application.id;
			if (appID == 206 || appID == 207 || appID == 9 || appID == 7 || appID == 14 || appID == 16 || appID == 30 || appID == 43 || appID == 44 || appID == 46 || appID == 49 || appID == 50){
				$("#fc_appnFeeElectronic").text("\u00A3"+(calcFee/2));		
			} else {		
				$("#fc_appnFeeElectronic").text("\u00A3"+calcFee);
			}
		}
	}
	if (voluntrySel == 'TRUE'){
		$('#fc_voluntrySel').show();
	}
	if (application.notes != '-') {
		$('#fc_notes').show();
		$("#fc_appnNotes").html(application.notes);
	}
	$('#fc_feePanel').show();
}

function setup(){
	$('#fc_capturePanel').hide();
	$('#fc_valuePanel').hide();
	$('#fc_furtherDetailsPanel').hide();
	$('#fc_rentPanel').hide();
	$('#fc_voluntaryPanel').hide();
	$('#fc_feePanel').hide();
	$("#fc_appnElectronicRow").hide();
	$("#fc_appnElectronicMsg").hide();
	$('#fc_appnSel').append($('<option/>').attr("value", 0).text("Choose an application type"));
	// Load the dropdown list of applications
	$.each(sortByKey(data.applications,"appdesc"), function(i, option) {
		//NOTE: Date checking (pubdate) would go here
		$('#fc_appnSel').append($('<option/>').attr("value", option.id).text(option.appdesc));
	});
}

function fc_calculate(){
	//Chrome Bug: White out
	white_out();
	if(fc_validate()){
		$.each(data.applications, function(i, application) {
			if(application.id == $('#fc_appnSel :selected').val()){
				displayInfo(application,$('input:radio[name=fc_voluntryRadio]:checked').val(),application.scale, $('#fc_valueTxt').val(),$('#fc_rentTxt').val());
				return false;
			}
		});
	}
}

function fc_reset(){
	$('#fc_appnSel').val("0");
	$('#fc_valueTxt').val("");
	$('#fc_rentTxt').val("");
	$('input:radio[name=fc_voluntryRadio]').filter('[value=FALSE]').attr('checked', true);
	$('#fc_capturePanel').hide();
	$('#fc_feePanel').hide();
	$("#fc_appnElectronicRow").hide();
	$("#fc_appnElectronicMsg").hide();
	$('#fc_furtherDetailsPanel').hide();
	$('#fc_valuePanel').hide();
	$('#fc_rentPanel').hide();
	$('#fc_voluntaryPanel').hide();
	$('#fc_app_fieldset').show();
	//Chrome Bug: White out
	white_out();
	
}

function isNumericKey(e){
	if (window.event) { var charCode = window.event.keyCode; }
	else if (e) { var charCode = e.which; }
	else { return true; }
	if (charCode > 31 && (charCode < 48 || charCode > 57)) { return false; }
	return true;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function fc_validate(){
	$('#fc_valueTxt_error').hide();
	$('#fc_rentTxt_error').hide();
	var noErrors = new Boolean(true);
	var x = $('#fc_valueTxt').val();
	var y = $('#fc_rentTxt').val();
	x = $.trim(x);
	y = $.trim(y);
	if ( x != ""){ //blanks are treated as 0
		if(!x.match(/^(0|[1-9][0-9]*)$/)){ 
			$('#fc_valueTxt').val("");
			$('#fc_valueTxt_error').show();
			noErrors = false;
		}
	}
	if ( y != ""){ //blanks are treated as 0
		if(!y.match(/^(0|[1-9][0-9]*)$/)){ 
			$('#fc_rentTxt').val("");
			$('#fc_rentTxt_error').show();
			noErrors = false;
		}
	}
	return noErrors;
}

function white_out(){
	//Chrome Bug: White out. 
	//This is to clear the buttons background images from the browser cache
	//by flashing an empty div with a white background over everything forcing
	//the browser to empty the cache for that placeholder area.
	$('#fc_white_out').show();
	$('#fc_white_out').hide();
}