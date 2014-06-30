require([ "jquery-ui/spinner" ], function( spinner ) {
	spinner({ min: 0, max: 10 }, "<input>" )
		.widget()
		.appendTo( "body" );
});
