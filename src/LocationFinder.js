"use strict";
exports.__esModule = true;
var events_1 = require("events");
var lodash_1 = require("lodash");
/** Improved location finder. Triggers found event with HTML5 position object (containing coords, etc).
 * Pass storage as option (implementing localStorage API) to get caching of position */
var LocationFinder = /** @class */ (function () {
    function LocationFinder(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.pause = function () {
            if (_this.locationWatchId != null) {
                navigator.geolocation.clearWatch(_this.locationWatchId);
                _this.locationWatchId = undefined;
            }
        };
        this.resume = function () {
            var highAccuracy = function (pos) {
                _this.cacheLocation(pos);
                _this.eventEmitter.emit("found", pos);
            };
            var highAccuracyError = function (err) {
                console.error("High accuracy watch location error: " + err.message);
                // No longer watching since there was an error
                _this.stopWatch();
                // Send error message
                _this.eventEmitter.emit("error");
            };
            if (_this.locationWatchId == null) {
                _this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
                    enableHighAccuracy: true
                });
            }
        };
        this.eventEmitter = new events_1.EventEmitter();
        // "error" messages are handled specially and will crash if not handled!
        this.eventEmitter.on("error", function () { });
        this.storage = (options || {}).storage;
        // Keep count of watches
        this.watchCount = 0;
    }
    LocationFinder.prototype.on = function (event, callback) {
        return this.eventEmitter.on(event, callback);
    };
    LocationFinder.prototype.off = function (event, callback) {
        return this.eventEmitter.removeListener(event, callback);
    };
    LocationFinder.prototype.cacheLocation = function (pos) {
        if (this.storage != null) {
            this.storage.set("LocationFinder.lastPosition", JSON.stringify(pos));
        }
    };
    LocationFinder.prototype.getCachedLocation = function () {
        if (this.storage != null && this.storage.get("LocationFinder.lastPosition")) {
            var pos = JSON.parse(this.storage.get("LocationFinder.lastPosition"));
            // Check that valid position (unreproducible bug)
            if (!pos.coords) {
                return;
            }
            // Accuracy is down since cached
            pos.coords.accuracy = 10000; // 10 km
            return pos;
        }
    };
    LocationFinder.prototype.getLocation = function (success, error) {
        var _this = this;
        navigator.geolocation;
        // If no geolocation, send error immediately
        if (!navigator.geolocation) {
            if (error) {
                error("No geolocation available");
            }
            return;
        }
        console.log("Getting location");
        // Both failures are required to trigger error
        var triggerLocationError = lodash_1["default"].after(2, function (err) {
            if (error) {
                return error(err);
            }
        });
        var lowAccuracyError = function (err) {
            console.error("Low accuracy location error: " + err.message);
            return triggerLocationError(err);
        };
        var highAccuracyError = function (err) {
            console.error("High accuracy location error: " + err.message);
            return triggerLocationError(err);
        };
        var lowAccuracyFired = false;
        var highAccuracyFired = false;
        var lowAccuracy = function (pos) {
            if (!highAccuracyFired) {
                lowAccuracyFired = true;
                _this.cacheLocation(pos);
                return success(pos);
            }
        };
        var highAccuracy = function (pos) {
            highAccuracyFired = true;
            _this.cacheLocation(pos);
            return success(pos);
        };
        // Get both high and low accuracy, as low is sufficient for initial display
        navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
            maximumAge: 1000 * 30,
            timeout: 30000,
            enableHighAccuracy: false
        });
        navigator.geolocation.getCurrentPosition(highAccuracy, highAccuracyError, {
            timeout: 60 * 1000 * 3,
            enableHighAccuracy: true
        });
        // Fire stored one within short time
        setTimeout(function () {
            var cachedLocation = _this.getCachedLocation();
            if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
                return success(cachedLocation);
            }
        }, 250);
    };
    /** Start watching current location */
    LocationFinder.prototype.startWatch = function () {
        var _this = this;
        // If no geolocation, trigger error
        if (!navigator.geolocation) {
            console.error("No geolocation available");
            this.eventEmitter.emit("error");
            return;
        }
        var highAccuracyFired = false;
        var lowAccuracyFired = false;
        var cachedFired = false;
        var lowAccuracy = function (pos) {
            if (!highAccuracyFired) {
                lowAccuracyFired = true;
                _this.cacheLocation(pos);
                _this.eventEmitter.emit("found", pos);
            }
        };
        var lowAccuracyError = function (err) {
            // Low accuracy errors are not enough to trigger final error
            console.error("Low accuracy watch location error: " + err.message);
            // if failed due to PERMISSION_DENIED emit error, or should we always emit error?
            if (err.code === 1) {
                _this.eventEmitter.emit("error", err);
                return;
            }
        };
        var highAccuracy = function (pos) {
            highAccuracyFired = true;
            _this.cacheLocation(pos);
            return _this.eventEmitter.emit("found", pos);
        };
        var highAccuracyError = function (err) {
            // High accuracy error is not final (https://w3c.github.io/geolocation-api/#position_options_interface)
            console.error("High accuracy watch location error: " + err.message);
            // if failed due to PERMISSION_DENIED emit error, or should we always emit error?
            if (err.code === 1) {
                _this.eventEmitter.emit("error", err);
                return;
            }
        };
        // Fire initial low-accuracy one
        navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
            maximumAge: 30 * 1000,
            timeout: 30000,
            enableHighAccuracy: false
        });
        // Increment watch count
        this.watchCount += 1;
        // If already watching, continue without doubling up watchPosition
        if (this.locationWatchId != null) {
            return;
        }
        this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
            enableHighAccuracy: true,
            maximumAge: 0
        });
        // Listen for pause events to stop watching
        document.addEventListener("pause", this.pause);
        document.addEventListener("resume", this.resume);
        console.log("Starting location watch " + this.locationWatchId);
        // Fire stored one within short time
        return setTimeout(function () {
            var cachedLocation = _this.getCachedLocation();
            if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
                cachedFired = true;
                _this.eventEmitter.emit("found", cachedLocation);
            }
        }, 500);
    };
    /** Stop watching current location */
    LocationFinder.prototype.stopWatch = function () {
        // Decrement watch count if watching
        if (this.watchCount === 0) {
            return;
        }
        this.watchCount -= 1;
        // Do nothing if still watching
        if (this.watchCount > 0) {
            return;
        }
        if (this.locationWatchId != null) {
            console.log("Stopping location watch " + this.locationWatchId);
            navigator.geolocation.clearWatch(this.locationWatchId);
            this.locationWatchId = undefined;
        }
        // Listen for pause events to stop watching
        document.removeEventListener("pause", this.pause);
        return document.removeEventListener("resume", this.resume);
    };
    return LocationFinder;
}());
exports["default"] = LocationFinder;
