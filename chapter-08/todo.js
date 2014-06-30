$.widget( "tj.todo", {
	defaultElement: "<ul>",
	options: {
		name: "todo"
	},
	_create: function() {
		this.element.addClass( "tj-todo ui-widget ui-widget-content " +
			"ui-corner-all" );
		this._renderList();
		this._on( this.element, {
			"click input": function( event ) {
				// In case a user adds class="ui-state-disabled" in a list item's markup
				if ( $( event.target ).parents( ".ui-state-disabled" ).length > 0 ) {
					event.preventDefault();
					return;
				}
				this._renderList();
				this._trigger( event.target.checked ? "check" : "uncheck",
					event, { value: event.target.value } );
			}
		});
	},
	add: function( value ) {
		this.element.append( "<li>" + value + "</li>" );
		this._renderList();
		this._trigger( "add", null, { value: value } );
	},
	remove: function( value ) {
		this.element.find( "[value='" + value + "']" )
			.parents( "li:first" )
			.remove();
		this._trigger( "remove", null, { value: value } );
	},
	check: function( value ) {
		this._toggleCheckbox( value, true );
		this._trigger( "check", null, { value: value } );
	},
	uncheck: function( value ) {
		this._toggleCheckbox( value, false );
		this._trigger( "uncheck", null, { value: value } );
	},
	_toggleCheckbox: function( value, checked ) {
		this.element.find( "[value='" + value + "']" )
			.prop( "checked", checked );
		this._renderList();
	},
	_setOption: function( key, value ) {
		this._super( key, value );
		this._renderList();
		if ( key == "disabled" ) {
			this.element
				.find( "input" ).prop( "disabled", value );
			this.element
				.find( "li" ).toggleClass( "ui-state-disabled", value );
		}
	},
	_renderList: function() {
		var that = this;
		this.element.find( "li" ).each(function() {
			var li = $( this ).addClass( "tj-todo-item ui-state-default" ),
				active = li.find( ":checked" ).length === 1,
				label = $( "<label>" ),
				checkbox = $( "<input>", {
					type: "checkbox",
					name: that.options.name,
					value: li.text(),
					checked: active
				});

			li.toggleClass( "ui-state-active", active );
			label.append( checkbox ).append( li.text() );
			li.html( label );
			that._hoverable( li );
			that._focusable( li );
		});
	},
	_destroy: function() {
		this.element
			.removeClass( "tj-todo ui-widget ui-widget-content ui-corner-all" )
			.find( "li" ).each(function() {
				var li = $( this ).removeClass( "tj-todo-item ui-state-default" ),
					input = li.find( "input" ),
					text = li.text();
				if ( input.is( ":checked" ) ) {
					li.remove();
				} else {
					li.html( text );
				}
			});
	}
});
