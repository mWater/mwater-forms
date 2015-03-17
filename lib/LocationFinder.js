var Backbone, LocationFinder, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Backbone = require('backbone');

_ = require('underscore');

LocationFinder = (function() {
  function LocationFinder(options) {
    if (options == null) {
      options = {};
    }
    this.resume = __bind(this.resume, this);
    this.pause = __bind(this.pause, this);
    _.extend(this, Backbone.Events);
    this.storage = options.storage;
  }

  LocationFinder.prototype.cacheLocation = function(pos) {
    if (this.storage != null) {
      return this.storage.set('LocationFinder.lastPosition', JSON.stringify(pos));
    }
  };

  LocationFinder.prototype.getCachedLocation = function() {
    var pos;
    if ((this.storage != null) && this.storage.get('LocationFinder.lastPosition')) {
      pos = JSON.parse(this.storage.get('LocationFinder.lastPosition'));
      if (!pos.coords) {
        return;
      }
      pos.coords.accuracy = 10000;
      return pos;
    }
  };

  LocationFinder.prototype.getLocation = function(success, error) {
    var highAccuracy, highAccuracyError, highAccuracyFired, lowAccuracy, lowAccuracyError, lowAccuracyFired, triggerLocationError;
    if (!navigator.geolocation) {
      if (error) {
        error("No geolocation available");
      }
      return;
    }
    console.log("Getting location");
    triggerLocationError = _.after(2, (function(_this) {
      return function() {
        if (error) {
          return error();
        }
      };
    })(this));
    lowAccuracyError = (function(_this) {
      return function(err) {
        console.error("Low accuracy location error: " + err);
        return triggerLocationError();
      };
    })(this);
    highAccuracyError = (function(_this) {
      return function(err) {
        console.error("High accuracy location error: " + err);
        return triggerLocationError();
      };
    })(this);
    lowAccuracyFired = false;
    highAccuracyFired = false;
    lowAccuracy = (function(_this) {
      return function(pos) {
        if (!highAccuracyFired) {
          lowAccuracyFired = true;
          _this.cacheLocation(pos);
          return success(pos);
        }
      };
    })(this);
    highAccuracy = (function(_this) {
      return function(pos) {
        highAccuracyFired = true;
        _this.cacheLocation(pos);
        return success(pos);
      };
    })(this);
    navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
      maximumAge: 3600,
      timeout: 30000,
      enableHighAccuracy: false
    });
    navigator.geolocation.getCurrentPosition(highAccuracy, highAccuracyError, {
      timeout: 60000,
      enableHighAccuracy: true
    });
    return setTimeout((function(_this) {
      return function() {
        var cachedLocation;
        cachedLocation = _this.getCachedLocation();
        if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
          return success(cachedLocation);
        }
      };
    })(this), 250);
  };

  LocationFinder.prototype.startWatch = function() {
    var cachedFired, highAccuracy, highAccuracyError, highAccuracyFired, lowAccuracy, lowAccuracyError, lowAccuracyFired;
    if (this.locationWatchId != null) {
      return;
    }
    if (!navigator.geolocation) {
      console.error("No geolocation available");
      this.trigger('error');
      return;
    }
    highAccuracyFired = false;
    lowAccuracyFired = false;
    cachedFired = false;
    lowAccuracy = (function(_this) {
      return function(pos) {
        if (!highAccuracyFired) {
          lowAccuracyFired = true;
          _this.cacheLocation(pos);
          return _this.trigger('found', pos);
        }
      };
    })(this);
    lowAccuracyError = (function(_this) {
      return function(err) {
        return console.error("Low accuracy watch location error: " + err);
      };
    })(this);
    highAccuracy = (function(_this) {
      return function(pos) {
        highAccuracyFired = true;
        _this.cacheLocation(pos);
        return _this.trigger('found', pos);
      };
    })(this);
    highAccuracyError = (function(_this) {
      return function(err) {
        console.error("High accuracy watch location error: " + err);
        return _this.trigger('error');
      };
    })(this);
    navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
      maximumAge: 3600,
      timeout: 30000,
      enableHighAccuracy: false
    });
    this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
      enableHighAccuracy: true
    });
    document.addEventListener("pause", this.pause);
    document.addEventListener("resume", this.resume);
    console.log("Starting location watch " + this.locationWatchId);
    return setTimeout((function(_this) {
      return function() {
        var cachedLocation;
        cachedLocation = _this.getCachedLocation();
        if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
          cachedFired = true;
          return _this.trigger('found', cachedLocation);
        }
      };
    })(this), 500);
  };

  LocationFinder.prototype.stopWatch = function() {
    if (this.locationWatchId != null) {
      console.log("Stopping location watch " + this.locationWatchId);
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = void 0;
    }
    document.removeEventListener("pause", this.pause);
    return document.removeEventListener("resume", this.resume);
  };

  LocationFinder.prototype.pause = function() {
    if (this.locationWatchId != null) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      return this.locationWatchId = void 0;
    }
  };

  LocationFinder.prototype.resume = function() {
    var highAccuracy, highAccuracyError;
    highAccuracy = (function(_this) {
      return function(pos) {
        _this.cacheLocation(pos);
        return _this.trigger('found', pos);
      };
    })(this);
    highAccuracyError = (function(_this) {
      return function(err) {
        console.error("High accuracy watch location error: " + err);
        return _this.trigger('error');
      };
    })(this);
    if (this.locationWatchId == null) {
      return this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
        enableHighAccuracy: true
      });
    }
  };

  return LocationFinder;

})();

module.exports = LocationFinder;
