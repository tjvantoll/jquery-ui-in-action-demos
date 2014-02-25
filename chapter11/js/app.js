require([ "text", "jquery", "underscore", "jquery-ui/autocomplete", "jquery-ui/button", "jquery-ui/datepicker", "jquery-ui/dialog", "jquery-ui/progressbar", "jquery-ui/selectmenu", "jquery-ui/spinner", "jquery-ui/tooltip", "text!../template/flight-list.html" ],
	function( text, $, _, autocomplete, button, datepicker, dialog, progressbar, selectmenu, spinner, tooltip, flightListTemplate ) {

	var fromAirport = $( "#from-airport" ),
		toAirport = $( "#to-airport" ),
		date = $( "#date" ),
		hops = $( "#hops" ).buttonset(),
		results = $( "#results" ).spinner(),
		orderBy = $( "#order-by" ).selectmenu(),
		processingDialog = $( "<div>" ).dialog({
			autoOpen: false,
			modal: true,
			title: "Looking up flights..."
		}),
		progressbar = $( "<div>" ).progressbar({ value: false });

	function init() {
		processingDialog.append( progressbar );
		$( "#lookup" ).button();

		if ( !isNativeDateTypeAvailable() ) {
			date.datepicker({ dateFormat: "yy-mm-dd" });
		}

		lookupAirports().then(function( data ) {
			fromAirport.add( toAirport )
				.autocomplete({
					source: data.airports,
					minLength: 2
				});
		});

		setupValidation();
		setupEvents();
	};

	function isNativeDateTypeAvailable() {
		var input = document.createElement( "input" );
		input.setAttribute( "type", "date" );
		return input.type === "date";
	};

	function lookupAirports() {
		return $.getJSON( "json/airports.json" );
	};

	function lookupFlights() {
		return;
		var selectedDate = $.datepicker.parseDate( "yy-mm-dd", date.val() );
		return $.ajax({
			headers: { "X-Mashape-Authorization": "CJOMaM8W7JgCCyHV5LO7wGzaHBo1jNfR" },
			url: "https://flightlookup-timetable-rest.p.mashape.com/TimeTable/" +
				fromAirport.val() + "/" +
				toAirport.val() + "/" +
				$.datepicker.formatDate( "mm/dd/yy", selectedDate ) + "/",
			data: {
				Hops: hops.find( ":checked" ).val(),
				Count: results.val(),
				SortOrder: orderBy.val()
			}
		});
	};

	function buildFlights( data ) {
		var html,
			flights = []

		$( data ).find( "route" ).each(function() {
			var route = $( this ),
				flight = {
					from: route.attr( "actualfrom.1" ),
					to: route.attr( "actualto.1" ),
					departureDate: route.attr( "DepartureDate.3" ),
					departureTime: route.attr( "DepartureTime.1" ),
					arrivalDate: route.attr( "ArrivalDate.3" ),
					arrivalTime: route.attr( "ArrivalTime.1" ),
					duration: route.attr( "Duration" ),
					flights: route.attr( "FlightCount" ),
					flightNumbers: route.attr( "FlightNumbers" )
				};
			flights.push( flight );
		});

		html = _.template( flightListTemplate, { flights: flights });
		$( "#flights-container" ).html( html );
	};

	function setupValidation() {
		results.on( "change", function() {
			if ( results.spinner( "isValid" ) ) {
				results[ 0 ].setCustomValidity( "" );
			} else {
				results[ 0 ].setCustomValidity( "Please enter a multiple of 10." );
			}
		});
		date.on( "change", function() {
			var value;
			try {
				value = $.datepicker.parseDate( "yy-mm-dd", date.val() );
			} catch ( error ) { }
			if ( value ) {
				date[ 0 ].setCustomValidity( "" );
			} else {
				date[ 0 ].setCustomValidity( "Please provide a valid date." );
			}
		});
	};

	// Handle for browsers without HTML5 constraint validation turned on.
	function validateForm() {
		var form = $( "form" );
		form.find( ".ui-state-error-text" ).removeClass( "ui-state-error-text" );
		form.find( ":invalid" ).each(function() {
			form.find( "label[for=" + this.id + "]" )
				.addClass( "ui-state-error-text" )
			$( this ).attr( "aria-invalid", true )
				.attr( "title", this.validationMessage )
				.tooltip({ tooltipClass: "ui-state-error" });
		}).first().focus();
	};

	function setupEvents() {
		$( "form" ).on( "submit", function( event ) {
			event.preventDefault();
			if ( validateForm() ) {
				processingDialog.dialog( "open" );
				lookupFlights().then(function( data ) {
					buildFlights( data );
					processingDialog.dialog( "close" );
				});
			}
		});
	};

	init();
});