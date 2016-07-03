var Backbone, CurrentPositionFinder, LocationFinder, _, goodDelay, initialDelay, utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

Backbone = require('backbone');

LocationFinder = require('../LocationFinder');

utils = require('../utils');

initialDelay = 10000;

goodDelay = 5000;

module.exports = CurrentPositionFinder = (function() {
  function CurrentPositionFinder(options) {
    if (options == null) {
      options = {};
    }
    this.afterGoodDelay = bind(this.afterGoodDelay, this);
    this.afterInitialDelay = bind(this.afterInitialDelay, this);
    this.locationFinderError = bind(this.locationFinderError, this);
    this.locationFinderFound = bind(this.locationFinderFound, this);
    _.extend(this, Backbone.Events);
    this.locationFinder = options.locationFinder || new LocationFinder();
    this._reset();
  }

  CurrentPositionFinder.prototype._reset = function() {
    this.running = false;
    this.initialDelayComplete = false;
    this.goodDelayRunning = false;
    this.strength = 'none';
    this.pos = null;
    return this.useable = false;
  };

  CurrentPositionFinder.prototype.start = function() {
    this._reset();
    this.running = true;
    this.listenTo(this.locationFinder, "found", this.locationFinderFound);
    this.listenTo(this.locationFinder, "error", this.locationFinderError);
    this.locationFinder.startWatch();
    this.updateStatus();
    return setTimeout(this.afterInitialDelay, initialDelay);
  };

  CurrentPositionFinder.prototype.stop = function() {
    if (!this.running) {
      return;
    }
    this.running = false;
    this.locationFinder.stopWatch();
    return this.stopListening();
  };

  CurrentPositionFinder.prototype.locationFinderFound = function(pos) {
    var newStrength;
    newStrength = utils.calculateGPSStrength(pos);
    if (newStrength === "none") {
      return;
    }
    if (!this.pos || pos.coords.accuracy <= this.pos.coords.accuracy) {
      this.pos = pos;
    }
    this.updateStatus();
    if (!this.goodDelayRunning && this.strength === "good") {
      setTimeout(this.afterGoodDelay, goodDelay);
    }
    if (this.strength === "excellent") {
      this.stop();
      return this.trigger('found', this.pos);
    }
  };

  CurrentPositionFinder.prototype.locationFinderError = function(err) {
    this.stop();
    this.error = err;
    return this.trigger('error', err);
  };

  CurrentPositionFinder.prototype.updateStatus = function() {
    var ref;
    this.strength = utils.calculateGPSStrength(this.pos);
    this.useable = (this.initialDelayComplete && ((ref = this.strength) === "fair" || ref === "poor")) || this.strength === "good";
    return this.trigger('status', {
      strength: this.strength,
      pos: this.pos,
      useable: this.useable
    });
  };

  CurrentPositionFinder.prototype.afterInitialDelay = function() {
    this.initialDelayComplete = true;
    if (this.running) {
      return this.updateStatus();
    }
  };

  CurrentPositionFinder.prototype.afterGoodDelay = function() {
    if (this.running) {
      this.stop();
      return this.trigger('found', this.pos);
    }
  };

  return CurrentPositionFinder;

})();
