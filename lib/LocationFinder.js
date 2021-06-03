"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EventEmiiter, LocationFinder, _;

EventEmiiter = require('events');
_ = require('lodash'); // Improved location finder. Triggers found event with HTML5 position object (containing coords, etc).
// Pass storage as option (implementing localStorage API) to get caching of position

LocationFinder = /*#__PURE__*/function () {
  function LocationFinder(options) {
    (0, _classCallCheck2["default"])(this, LocationFinder);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.eventEmitter = new EventEmiiter(); // "error" messages are handled specially and will crash if not handled!

    this.eventEmitter.on('error', function () {});
    this.storage = (options || {}).storage; // Keep count of watches

    this.watchCount = 0;
  }

  (0, _createClass2["default"])(LocationFinder, [{
    key: "on",
    value: function on(event, callback) {
      return this.eventEmitter.on(event, callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      return this.eventEmitter.removeListener(event, callback);
    }
  }, {
    key: "cacheLocation",
    value: function cacheLocation(pos) {
      if (this.storage != null) {
        return this.storage.set('LocationFinder.lastPosition', JSON.stringify(pos));
      }
    }
  }, {
    key: "getCachedLocation",
    value: function getCachedLocation() {
      var pos;

      if (this.storage != null && this.storage.get('LocationFinder.lastPosition')) {
        pos = JSON.parse(this.storage.get('LocationFinder.lastPosition')); // Check that valid position (unreproducible bug)

        if (!pos.coords) {
          return;
        } // Accuracy is down since cached


        pos.coords.accuracy = 10000; // 10 km

        return pos;
      }
    }
  }, {
    key: "getLocation",
    value: function getLocation(success, error) {
      var _this = this;

      var highAccuracy, highAccuracyError, highAccuracyFired, lowAccuracy, lowAccuracyError, lowAccuracyFired, triggerLocationError; // If no geolocation, send error immediately

      if (!navigator.geolocation) {
        if (error) {
          error("No geolocation available");
        }

        return;
      }

      console.log("Getting location"); // Both failures are required to trigger error

      triggerLocationError = _.after(2, function (err) {
        if (error) {
          return error(err);
        }
      });

      lowAccuracyError = function lowAccuracyError(err) {
        console.error("Low accuracy location error: ".concat(err.message));
        return triggerLocationError(err);
      };

      highAccuracyError = function highAccuracyError(err) {
        console.error("High accuracy location error: ".concat(err.message));
        return triggerLocationError(err);
      };

      lowAccuracyFired = false;
      highAccuracyFired = false;

      lowAccuracy = function lowAccuracy(pos) {
        if (!highAccuracyFired) {
          lowAccuracyFired = true;

          _this.cacheLocation(pos);

          return success(pos);
        }
      };

      highAccuracy = function highAccuracy(pos) {
        highAccuracyFired = true;

        _this.cacheLocation(pos);

        return success(pos);
      }; // Get both high and low accuracy, as low is sufficient for initial display


      navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
        maximumAge: 1000 * 30,
        // 30 seconds ok for low accuracy
        timeout: 30000,
        enableHighAccuracy: false
      });
      navigator.geolocation.getCurrentPosition(highAccuracy, highAccuracyError, {
        timeout: 60 * 1000 * 3,
        // Up to 3 minutes wait
        enableHighAccuracy: true
      }); // Fire stored one within short time

      return setTimeout(function () {
        var cachedLocation;
        cachedLocation = _this.getCachedLocation();

        if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
          return success(cachedLocation);
        }
      }, 250);
    }
  }, {
    key: "startWatch",
    value: function startWatch() {
      var _this2 = this;

      var cachedFired, highAccuracy, highAccuracyError, highAccuracyFired, lowAccuracy, lowAccuracyError, lowAccuracyFired; // If no geolocation, trigger error

      if (!navigator.geolocation) {
        console.error("No geolocation available");
        this.eventEmitter.emit('error');
        return;
      }

      highAccuracyFired = false;
      lowAccuracyFired = false;
      cachedFired = false;

      lowAccuracy = function lowAccuracy(pos) {
        if (!highAccuracyFired) {
          lowAccuracyFired = true;

          _this2.cacheLocation(pos);

          return _this2.eventEmitter.emit('found', pos);
        }
      };

      lowAccuracyError = function lowAccuracyError(err) {
        // Low accuracy errors are not enough to trigger final error
        console.error("Low accuracy watch location error: ".concat(err.message)); // if failed due to PERMISSION_DENIED emit error, or should we always emit error?

        if (err.code === 1) {
          return _this2.eventEmitter.emit('error', err);
        }
      };

      highAccuracy = function highAccuracy(pos) {
        highAccuracyFired = true;

        _this2.cacheLocation(pos);

        return _this2.eventEmitter.emit('found', pos);
      };

      highAccuracyError = function highAccuracyError(err) {
        // High accuracy error is not final (https://w3c.github.io/geolocation-api/#position_options_interface)
        console.error("High accuracy watch location error: ".concat(err.message)); // if failed due to PERMISSION_DENIED emit error, or should we always emit error?

        if (err.code === 1) {
          return _this2.eventEmitter.emit('error', err);
        }
      }; // Fire initial low-accuracy one


      navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
        maximumAge: 30 * 1000,
        timeout: 30000,
        enableHighAccuracy: false
      }); // Increment watch count

      this.watchCount += 1; // If already watching, continue without doubling up watchPosition

      if (this.locationWatchId != null) {
        return;
      }

      this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
        enableHighAccuracy: true,
        maximumAge: 0
      }); // Listen for pause events to stop watching

      document.addEventListener("pause", this.pause);
      document.addEventListener("resume", this.resume);
      console.log("Starting location watch ".concat(this.locationWatchId)); // Fire stored one within short time

      return setTimeout(function () {
        var cachedLocation;
        cachedLocation = _this2.getCachedLocation();

        if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
          cachedFired = true;
          return _this2.eventEmitter.emit('found', cachedLocation);
        }
      }, 500);
    }
  }, {
    key: "stopWatch",
    value: function stopWatch() {
      // Decrement watch count if watching
      if (this.watchCount === 0) {
        return;
      }

      this.watchCount -= 1; // Do nothing if still watching

      if (this.watchCount > 0) {
        return;
      }

      if (this.locationWatchId != null) {
        console.log("Stopping location watch ".concat(this.locationWatchId));
        navigator.geolocation.clearWatch(this.locationWatchId);
        this.locationWatchId = void 0;
      } // Listen for pause events to stop watching


      document.removeEventListener("pause", this.pause);
      return document.removeEventListener("resume", this.resume);
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.locationWatchId != null) {
        navigator.geolocation.clearWatch(this.locationWatchId);
        return this.locationWatchId = void 0;
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      var _this3 = this;

      var highAccuracy, highAccuracyError;

      highAccuracy = function highAccuracy(pos) {
        _this3.cacheLocation(pos);

        return _this3.eventEmitter.emit('found', pos);
      };

      highAccuracyError = function highAccuracyError(err) {
        console.error("High accuracy watch location error: ".concat(err.message)); // No longer watching since there was an error

        _this3.stopWatch(); // Send error message


        return _this3.eventEmitter.emit('error');
      };

      if (this.locationWatchId == null) {
        return this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
          enableHighAccuracy: true
        });
      }
    }
  }]);
  return LocationFinder;
}();

module.exports = LocationFinder;