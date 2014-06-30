require([ "text", "jquery", "underscore", "jquery-ui/autocomplete", "jquery-ui/button", "jquery-ui/datepicker", "jquery-ui/dialog", "jquery-ui/progressbar", "jquery-ui/selectmenu", "jquery-ui/spinner", "jquery-ui/tooltip", "text!../template/flight-list.html" ],
	function( text, $, _, autocomplete, button, datepicker, dialog, progressbar, selectmenu, spinner, tooltip, flightListTemplate ) {

	var fromAirport = $( "#from-airport" ),
		toAirport = $( "#to-airport" ),
		date = $( "#date" ),
		hops = $( "#hops" ).buttonset(),
		results = $( "#results" ),
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

		if ( !isTypeSupported( "date" ) ) {
			date.datepicker({ dateFormat: "yy-mm-dd" });
		}
		if ( !isTypeSupported( "number" ) ) {
			results.spinner();
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

	function isTypeSupported( type ) {
		var input = document.createElement( "input" );
		input.setAttribute( "type", type );
		return input.type === type;
	};

	function lookupAirports() {
		return $.getJSON( "json/airports.json" );
	};

	function lookupFlights() {
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

	function parseFlights( data ) {
		var flights = []
		$( data ).find( "route" ).each(function() {
			var route = $( this ),
				flight = {
					from: route.attr( "ActualFrom.1" ),
					to: route.attr( "ActualTo.1" ),
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
		return flights;
	};

	function templateFlights( flights ) {
		var html = _.template( flightListTemplate, { flights: flights });
		$( "#flights-container" ).html( html );
	};

	function setupValidation() {
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
		var invalidFields,
			form = $( "form" );

		form.find( ".ui-state-error-text" )
			.removeClass( "ui-state-error-text" )
		form.find( "[aria-invalid]" ).attr( "aria-invalid", false )
		form.find( ":ui-tooltip" ).tooltip( "destroy" );

		invalidFields = form.find( ":invalid" ).each(function() {
			form.find( "label[for=" + this.id + "]" )
				.addClass( "ui-state-error-text" )
			$( this ).attr( "aria-invalid", true )
				.attr( "title", this.validationMessage )
				.tooltip({ tooltipClass: "ui-state-error" });
		}).first().focus();

		return invalidFields.length === 0;
	};

	function setupEvents() {
		$( "form" ).on( "submit", function( event ) {
			event.preventDefault();
			if ( validateForm() ) {
				processingDialog.dialog( "open" );
				lookupFlights().then(function( data ) {
					var flights = parseFlights( data );
					templateFlights( flights );
					processingDialog.dialog( "close" );
				});
			}
		});
	};

	init();
});