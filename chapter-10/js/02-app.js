require([ "todo" ], function( todo ) {
	todo( {}, "<ul><li>One</li><li>Two</li><li>Three</li>" )
		.element
		.appendTo( "body" );
});