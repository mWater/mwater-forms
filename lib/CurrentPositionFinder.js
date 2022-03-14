"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils_1 = require("./utils");
const initialDelay = 10;
const goodDelay = 5;
/** Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event.
 * Only call start once and be sure to call stop after */
class CurrentPositionFinder {
    constructor(options) {
        this.locationFinderFound = (pos) => {
            // Calculate strength of new position
            const newStrength = utils_1.calculateGPSStrength(pos);
            // If none, do nothing
            if (newStrength === "none") {
                return;
            }
            // Replace position if better
            if (!this.pos || pos.coords.accuracy <= this.pos.coords.accuracy) {
                this.pos = pos;
            }
            // Start good delay if needed
            if (!this.goodDelayInterval && utils_1.calculateGPSStrength(this.pos) === "good") {
                this.goodDelayLeft = goodDelay;
                // Start good delay countdown
                this.goodDelayInterval = window.setInterval(() => {
                    if (this.goodDelayLeft == null) {
                        return;
                    }
                    this.goodDelayLeft -= 1;
                    this.updateStatus();
                    if (this.goodDelayLeft <= 0) {
                        if (this.running) {
                            this.stop();
                            this.eventEmitter.emit("found", this.pos);
                        }
                    }
                }, 1000);
            }
            // Update status
            this.updateStatus();
            // Set position if excellent
            if (this.strength === "excellent") {
                this.stop();
                this.eventEmitter.emit("found", this.pos);
            }
        };
        this.locationFinderError = (err) => {
            this.stop();
            this.error = err;
            return this.eventEmitter.emit("error", err);
        };
        this.running = false;
        // Add events
        this.eventEmitter = new events_1.EventEmitter();
        // "error" messages are handled specially and will crash if not handled!
        this.eventEmitter.on("error", () => { });
        this.locationFinder = options.locationFinder;
        this._reset();
    }
    /** Start looking for position */
    start() {
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
        this.initialDelayInterval = window.setInterval(() => {
            if (this.initialDelayLeft) {
                this.initialDelayLeft -= 1;
                this.updateStatus();
            }
        }, 1000);
    }
    /** Stop looking for position */
    stop() {
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
    }
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    off(event, callback) {
        this.eventEmitter.removeListener(event, callback);
    }
    _reset() {
        this.running = false;
        this.initialDelayLeft = initialDelay;
        this.goodDelayLeft = null;
        this.strength = "none";
        this.pos = null;
    }
    updateStatus() {
        this.strength = utils_1.calculateGPSStrength(this.pos);
        const useable = (this.initialDelayLeft <= 0 && ["fair", "poor"].includes(this.strength)) || this.strength === "good";
        // Trigger status
        this.eventEmitter.emit("status", {
            strength: this.strength,
            pos: this.pos,
            useable: useable,
            accuracy: this.pos != null ? this.pos.coords.accuracy : undefined,
            initialDelayLeft: this.initialDelayLeft,
            goodDelayLeft: this.goodDelayLeft
        });
    }
}
exports.default = CurrentPositionFinder;
