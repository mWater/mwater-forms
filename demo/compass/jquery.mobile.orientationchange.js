(function( $, window ) {
  // "Cowboy" Ben Alman

  var win = $( window ),
    special_event,
    get_orientation,
    last_orientation;

  $.event.special.orientationchange = special_event = {
    setup: function() {
      // If the event is supported natively, return false so that jQuery
      // will bind to the event using DOM methods.
      if ( $.support.orientation ) {
        return false;
      }

      // Get the current orientation to avoid initial double-triggering.
      last_orientation = get_orientation();

      // Because the orientationchange event doesn't exist, simulate the
      // event by testing window dimensions on resize.
      win.bind( "throttledresize", handler );
    },
    teardown: function(){
      // If the event is not supported natively, return false so that
      // jQuery will unbind the event using DOM methods.
      if ( $.support.orientation ) {
        return false;
      }

      // Because the orientationchange event doesn't exist, unbind the
      // resize event handler.
      win.unbind( "throttledresize", handler );
    },
    add: function( handleObj ) {
      // Save a reference to the bound event handler.
      var old_handler = handleObj.handler;

      handleObj.handler = function( event ) {
        // Modify event object, adding the .orientation property.
        event.orientation = get_orientation();

        // Call the originally-bound event handler and return its result.
        return old_handler.apply( this, arguments );
      };
    }
  };

  // If the event is not supported natively, this handler will be bound to
  // the window resize event to simulate the orientationchange event.
  function handler() {
    // Get the current orientation.
    var orientation = get_orientation();

    if ( orientation !== last_orientation ) {
      // The orientation has changed, so trigger the orientationchange event.
      last_orientation = orientation;
      win.trigger( "orientationchange" );
    }
  };

  // Get the current page orientation. This method is exposed publicly, should it
  // be needed, as jQuery.event.special.orientationchange.orientation()
  $.event.special.orientationchange.orientation = get_orientation = function() {
    var elem = document.documentElement;
    return elem && elem.clientWidth / elem.clientHeight < 1.1 ? "portrait" : "landscape";
  };

})( jQuery, window );