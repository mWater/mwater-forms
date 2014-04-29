  //http://mobiforge.com/design-development/html5-mobile-web-device-orientation-events
  (function(window, $) {
    window.OrientationPublisher = {
      active: false
    };

    //Setup listener
    OrientationPublisher.init = function() {
      if (window.DeviceOrientationEvent && !OrientationPublisher.active) {
        window.addEventListener("deviceorientation", OrientationPublisher.orientationChange, false);
        window.addEventListener("compassneedscalibration", function() {
          alert("fired Compass needs calibration event");
        }, false);
        OrientationPublisher.active = true;

        //window.addEventListener("orientationchange", function() {
          //alert("You flipped your phone: orientation " + window.orientation);
        //});
      }
    };

    OrientationPublisher.getMode = function() {
      var elem = document.documentElement;
      return elem && elem.clientWidth / elem.clientHeight < 1.1 ? "portrait" : "landscape";
    };

    OrientationPublisher.cloneEvent = function(e) {
      return {
        alpha: e.alpha.toFixed(3),
        beta: e.beta.toFixed(3),
        gamma: e.gamma.toFixed(3),
        absolute: e.absolute
      };
    };
    //Normalize starting values based on OS and browser
    OrientationPublisher.normalizers = {
      //Firefox rotates counter clockwise
      firefox: function(e) {
        var normalized = OrientationPublisher.cloneEvent(e);
        normalized.alpha = normalized.alpha * -1;
        normalized.alpha = normalized.alpha - window.orientation;
        return normalized;
      },
      //Android stock starts facing West
      android_stock: function(e) {
        var normalized = OrientationPublisher.cloneEvent(e);
        normalized.alpha = (normalized.alpha + 270) % 360;
        normalized.alpha = normalized.alpha - window.orientation;
        return normalized;
      },
      //Android Chrome is good to go
      android_chrome: function(e) {
        var normalized = OrientationPublisher.cloneEvent(e);
        normalized.alpha = normalized.alpha - window.orientation;
        return normalized;
      },
      //Opera Mobile is good to go
      opera: function(e) {
        var normalized = OrientationPublisher.cloneEvent(e);
        normalized.alpha = normalized.alpha - window.orientation;
        return normalized;
      },
      //IOS uses a custom property and rotates counter clockwise
      ios: function(e) {
        var normalized = OrientationPublisher.cloneEvent(e);
        if (e.webkitCompassHeading) {
          //use the custom IOS property otherwise it will be relative
          normalized.alpha = normalized.webkitCompassHeading;
        }
        //IOS is counter clockwise
        normalized.alpha = normalized.alpha * -1;
        normalized.alpha = normalized.alpha - window.orientation;
        return normalized;
      },
      //for now treat is like Chrome desktop which rotates counter clockwise
      unknown: function(e) {
        var normalized = OrientationPublisher.cloneEvent(e);
        normalized.alpha = normalized.alpha * -1;
        return normalized;
      }
    };

    //Parse the user agent to get OS and browser so we know how to normalize values
    OrientationPublisher.getNormalizerKey = function(ua) {
      var userAgent = ua || window.navigator.userAgent;
      //IOS uses a special property 
      if (userAgent.match(/(iPad|iPhone|iPod)/i)) {
        return "ios";
      } else if (userAgent.match(/Firefox/i)) {
        return "firefox";
      } else if (userAgent.match(/Opera/i)) {
        return "opera";
      } else if (userAgent.match(/Android/i)) {
        if (window.chrome) {
          return "android_chrome";
        } else {
          return "android_stock";
        }
      } else {
        return "unknown";
      }
    };

    //Handler for default deviceorientation event that broadcasts a custom "orientationChange" event passing along normalized values
    OrientationPublisher.orientationChange = function(e) {

      var normalizerKey = OrientationPublisher.getNormalizerKey();
      var normalizedValues = OrientationPublisher.normalizers[normalizerKey](e);

      //If 'absolute' property is null compass will not work because alpha will be relative to orientation at page load!!
      normalizedValues.absolute = normalizedValues.absolute || false;
      //Broadcast custom event and normalized values for any subscribers
      $(document).trigger("orientationChange", {
        orientation: window.orientation,
        normalizerKey: normalizerKey,
        raw: OrientationPublisher.cloneEvent(e),
        normalized: normalizedValues
      });
    };
  })(window, jQuery);