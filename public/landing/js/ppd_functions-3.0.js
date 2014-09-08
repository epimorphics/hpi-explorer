	//-- Google analytics--
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-21165003-4']);
	_gaq.push(['_trackPageview', '/downloads']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	//-- Specific analytics for each file download
	function analytics(string) {
	_gaq.push(['_trackEvent', 'PPD Downloads']);
	_gaq.push(['_trackPageview','/download/' + string + '' ]);
	return true;
	}

	//Functions for property price data
	var fileurl = "";
	var yearslist = [];
	var monthbeingpublished = "";
	var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
	var welshmonthNames = [ "Ionawr","Chwefror","Mawrth","Ebrill","Mai","Mehefin","Gorffennaf","Awst","Medi","Hydref","Tachwedd","Rhagfyr" ];

function createLinks() {
	var quickLinks = "";
	 yearslist.sort(function (a, b) {
		return a - b; });
	  for (var i in yearslist) {
		quickLinks += '<a style="float:none !important" href=\'#years' + yearslist[i] + '\' title=\'Jump to Year ' + yearslist[i] + '\'>' + yearslist[i] + '</a> ';

	  }
	  document.getElementById('links').innerHTML = replaceWithwelsh(quickLinks);
	}
	//Generates a Year HTML table
	function generateYearTable(data) {
		var html = '', startyear = "", endyear = "", rowi,yeari;

			startyear =  + data.years[0].startyear - 1;
			endyear =  + data.years[0].endyear ;
			html += '<thead><tr><th>Year</th><th>Text Version</th><th>CSV (Full)</th><th style="background-color: #FFF"></th><th>CSV (Part1)</th><th>CSV (Part2)</th></tr></thead><tbody>';
			for (rowi = endyear; rowi > startyear; rowi-- ) {
			yeari=rowi%5;
			if (yeari === 0){
			yearslist.push(rowi);
		    html += '<tr id=\'years'+ rowi + '\'>\r\n';
			 }
			html += '<td>' + rowi + '</td>\r\n';

			html += '<td><a onclick="analytics(\'pp-' + rowi + '.txt\')"';
			html += ' href=' + fileurl + rowi + '.txt>.txt </a></td>\r\n';
			html += '<td><a onclick="analytics(\'pp-' + rowi + '.csv\')"';
			html += ' href=' + fileurl + rowi +'.csv>.csv </a></td>\r\n';
			html += '<td style="border-bottom: #FFF"></td>\r\n';
			html += '<td><a onclick="analytics(\'pp-' + rowi + '-part1.csv\')"';
			html += ' href=' + fileurl + rowi +'-part1.csv>.csv </a></td>\r\n';
			html += '<td><a onclick="analytics(\'pp-' + rowi + '-part2.csv\')"';
			html += ' href=' + fileurl + rowi +'-part2.csv>.csv </a></td>\r\n';
			html += '</tr>\r\n';
			}
		html += '</tbody>';
		return html;
	}

	//Generates other tables
	function generateMonthlyTable(name) {
		var html = '';
		html += '<thead><tr><th>Text Version</th><th>CSV</th></tr></thead><tbody>';
			html += '<td><a onclick="analytics(\'pp-' + name + '.txt\')"';
			html += ' href =' + fileurl + name + '.txt>.txt </td>\r\n';
			html += '<td><a onclick="analytics(\'pp-' + name + '-new-version.csv\')"';
			html += ' href =' + fileurl + name + '-new-version.csv>.csv </td>\r\n';
			html += '</tr>\r\n';

		html += '</tbody>';
		return html;
	}

	function generateSingleTable(name) {
		var html = '';
		html += '<thead><tr><th>Text Version</th><th>CSV</th></tr></thead><tbody>';
			html += '<td><a onclick="analytics(\'pp-' + name + '.txt\')"';
			html += ' href =' + fileurl + name + '.txt>.txt </td>\r\n';
			html += '<td><a onclick="analytics(\'pp-' + name + '.csv\')"';
			html += ' href =' + fileurl + name + '.csv>.csv </td>\r\n';
			html += '</tr>\r\n';

		html += '</tbody>';
		return html;
	}

//set url of files according to dates and location urls
function setFolder() {
 var today = new Date();
	$.ajax({
    type: 'GET',
    dataType: "jsonp",
    url: "http://www.timeapi.org/utc/now.json?callback=?",
    success: function(data) {
	 //Got date from timeapi.org
    today= Date(data.dateString);
	},
    error: function(data) {
      //"Unable to get date. Using machine date"
	}
});
		$.each(data.pubdates, function(i, info) {
			var nmonth = + info.month -1;
			var ntime = info.time.split(":");
			var x = new Date(info.year, nmonth, info.day, ntime[0],ntime[1],ntime[2],0);

		if (x > today) {
		return false;
		}
		fileurl = data.urloffiles[0].location + info.location + data.urloffiles[0].prefix ;
		// Change month to published month (previous month)
		x.setMonth(x.getMonth()-1);

		var loc = location.href;
        if (loc.indexOf("cofrestrfatir") !== -1) {
            monthbeingpublished="Mis cyfredol (" +welshmonthNames[x.getMonth()] + " " + x.getFullYear()+ " Data)";
		} else {
			monthbeingpublished="Current Month (" + monthNames[x.getMonth()] + " " + x.getFullYear() + " Data)";
			}

		});


		}
	//
function replaceWithwelsh(htmlstring){
var loc = location.href;
if (loc.indexOf("cofrestrfatir") !== -1) {
		htmlstring = htmlstring.replace("Text Version", "Fersiwn testun");
		htmlstring = htmlstring.replace("no columns","heb golofnau");
		htmlstring = htmlstring.replace("new version","fersiwn newydd");
		htmlstring = htmlstring.replace("Jump to","Neidio i flwyddyn");
		htmlstring = htmlstring.replace("Year","Blwyddyn");
}
return htmlstring;
}


//
	$(document).ready(function() {
	// find out what folder we should look in
		setFolder();
		$('#ppdmonthheader').empty();
		$('#ppdmonthheader').html(monthbeingpublished);
	//Create table and tag
		var html = generateSingleTable("complete");
		//single file
		$('#ppdcompletedata').empty();
		$('#ppdcompletedata').html(replaceWithwelsh(html));
		//monthly file
		html = generateMonthlyTable("monthly-update");
		$('#ppdmonthedata').empty();
		$('#ppdmonthdata').html(replaceWithwelsh(html));
		//yearly file
		html = generateYearTable(data);
		createLinks();
		$('#ppdyeardata').empty();
		$('#ppdyeardata').html(replaceWithwelsh(html));
	});


