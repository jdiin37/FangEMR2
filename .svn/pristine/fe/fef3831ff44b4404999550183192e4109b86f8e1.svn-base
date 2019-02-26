/**
 * 
 */
$(document).ready(function() {
	alert('ready');
	// Stops the submit request
	$("#myAjaxRequestForm").submit(function(e) {
		e.preventDefault();
	});
	// checks for the button click event
	$("#loginButton").click(function(e) {
		alert('loginButton preshed');
		// get the form data using element id method
		var userName = $("input#userName").val();
		var passWord = $("input#passWord").val();
		dataString = "userName="	+ userName+"&"+"passWord="	+ passWord;
		alert('dataString:'+dataString);
		// make the AJAX request, dataType is set to json meaning we are expecting JSON data in response from the server
		$.ajax({
			type : "POST",
			url : "/servlets/ServletAgent",
			data : dataString,
			dataType : "json",
			// if received a response from the server
			success : function(data, textStatus, jqXHR) {
				// our country code was correct so we have some information to display
				if (data.success) {
					$("#ajaxResponse").html("");
					$("#ajaxResponse").append(
							"<b>Country Code:</b> "	+ data.countryInfo.code	+ "<br/>");
					$("#ajaxResponse").append(
							"<b>Country Name:</b> "	+ data.countryInfo.name	+ "<br/>");
					$("#ajaxResponse").append(
							"<b>Continent:</b> "	+ data.countryInfo.continent + "<br/>");
					$("#ajaxResponse").append(
							"<b>Region:</b> "   	+ data.countryInfo.region + "<br/>");
					$("#ajaxResponse").append(
							"<b>Life Expectancy:</b> "+ data.countryInfo.lifeExpectancy+ "<br/>");
					$("#ajaxResponse").append(
							"<b>GNP:</b> " 			+ data.countryInfo.gnp	+ "<br/>");
				}
				// display error message
				else {
					$("#ajaxResponse").html("<div><b>Country code in Invalid!</b></div>");
				}
			},
			// If there was no resonse from the server
			error : function(jqXHR, textStatus,	errorThrown) {
				console.log("Something really bad happened "+ textStatus);
				$("#ajaxResponse").html(jqXHR.responseText);
			},
			// capture the request before it was sent to server
			beforeSend : function(jqXHR, settings) {
				// adding some Dummy data to the request
				settings.data += "&dummyData=whatever";
				// disable the button until we get the response
				$('#loginButton').attr("disabled",	true);
			},
			// this is called after the response or error functions are finsihed so that we can take some action
			complete : function(jqXHR,textStatus) {
				// enable the button
				$('#loginButton').attr("disabled",	false);
			}
		});
	});
});