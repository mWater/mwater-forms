"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __importDefault(require("events"));
var utils_1 = require("./utils");
var initialDelay = 10;
var goodDelay = 5;
/** Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event.
 * Only call start once and be sure to call stop after */
var CurrentPositionFinder = /** @class */ (function () {
    function CurrentPositionFinder(options) {
        var _this = this;
        this.locationFinderFound = function (pos) {
            // Calculate strength of new position
            var newStrength = utils_1.calculateGPSStrength(pos);
            // If none, do nothing
            if (newStrength === "none") {
                return;
            }
            // Replace position if better
            if (!_this.pos || (pos.coords.accuracy <= _this.pos.coords.accuracy)) {
                _this.pos = pos;
            }
            // Update status
            _this.updateStatus();
            // Start good delay if needed
            if (!_this.goodDelayInterval && (_this.strength === "good")) {
                _this.goodDelayLeft = goodDelay;
                // Start good delay countdown
                _this.goodDelayInterval = window.setInterval(function () {
                    if (_this.goodDelayLeft == null) {
                        return;
                    }
                    _this.goodDelayLeft -= 1;
                    _this.updateStatus();
                    if (_this.goodDelayLeft <= 0) {
                        if (_this.running) {
                            _this.stop();
                            _this.eventEmitter.emit('found', _this.pos);
                        }
                    }
                }, 1000);
            }
            // Set position if excellent
            if (_this.strength === "excellent") {
                _this.stop();
                _this.eventEmitter.emit('found', _this.pos);
            }
        };
        this.locationFinderError = function (err) {
            _this.stop();
            _this.error = err;
            return _this.eventEmitter.emit('error', err);
        };
        this.running = false;
        // Add events
        this.eventEmitter = new events_1.default();
        // "error" messages are handled specially and will crash if not handled!
        this.eventEmitter.on('error', function () { });
        this.locationFinder = options.locationFinder;
        this._reset();
    }
    /** Start looking for position */
    CurrentPositionFinder.prototype.start = function () {
        var _this = this;
        if (this.running) {
            this.stop();
        }
        this._reset();
        this.running = true;
        this.locationFinder.on("found", this.locationFinderFound);
        this.locationFinder.on("error", this.locationFinderError);
        this.locationFinder.startWatch();
        // Update status
        this.updateStatus();
        // Start initial delay countdown
        this.initialDelayInterval = window.setInterval(function () {
            if (_this.initialDelayLeft) {
                _this.initialDelayLeft -= 1;
                _this.updateStatus();
            }
        }, 1000);
    };
    /** Stop looking for position */
    CurrentPositionFinder.prototype.stop = function () {
        if (!this.running) {
            return;
        }
        this.running = false;
        this.locationFinder.stopWatch();
        this.locationFinder.off("found", this.locationFinderFound);
        this.locationFinder.off("error", this.locationFinderError);
        if (this.initialDelayInterval) {
            window.clearInterval(this.initialDelayInterval);
        }
        if (this.goodDelayInterval) {
            window.clearInterval(this.goodDelayInterval);
        }
        this.initialDelayInterval = null;
    };
    CurrentPositionFinder.prototype.on = function (event, callback) {
        this.eventEmitter.on(event, callback);
    };
    CurrentPositionFinder.prototype.off = function (event, callback) {
        this.eventEmitter.removeListener(event, callback);
    };
    CurrentPositionFinder.prototype._reset = function () {
        this.running = false;
        this.initialDelayLeft = initialDelay;
        this.goodDelayLeft = null;
        this.strength = 'none';
        this.pos = null;
    };
    CurrentPositionFinder.prototype.updateStatus = function () {
        this.strength = utils_1.calculateGPSStrength(this.pos);
        var useable = (this.initialDelayLeft <= 0 && ["fair", "poor"].includes(this.strength)) || (this.strength === "good");
        // Trigger status
        this.eventEmitter.emit('status', {
            strength: this.strength,
            pos: this.pos,
            useable: useable,
            accuracy: (this.pos != null ? this.pos.coords.accuracy : undefined),
            initialDelayLeft: this.initialDelayLeft,
            goodDelayLeft: this.goodDelayLeft
        });
    };
    return CurrentPositionFinder;
}());
exports.default = CurrentPositionFinder;
