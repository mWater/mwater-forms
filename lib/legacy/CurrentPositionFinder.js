'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Backbone, CurrentPositionFinder, LocationFinder, _, goodDelay, initialDelay, utils;

_ = require('lodash');

Backbone = require('backbone');

LocationFinder = require('../LocationFinder');

utils = require('../utils');

initialDelay = 10000;

goodDelay = 5000;

// Uses an algorithm to accurately find current position (coords + timestamp). Fires status events and found event. 
// Only call start once and be sure to call stop after
module.exports = CurrentPositionFinder = function () {
  function CurrentPositionFinder() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, CurrentPositionFinder);

    this.locationFinderFound = this.locationFinderFound.bind(this);
    this.locationFinderError = this.locationFinderError.bind(this);
    this.afterInitialDelay = this.afterInitialDelay.bind(this);
    this.afterGoodDelay = this.afterGoodDelay.bind(this);
    // Add events
    _.extend(this, Backbone.Events);
    this.locationFinder = options.locationFinder || new LocationFinder();
    this._reset();
  }

  (0, _createClass3.default)(CurrentPositionFinder, [{
    key: '_reset',
    value: function _reset() {
      this.running = false;
      this.initialDelayComplete = false;
      this.goodDelayRunning = false;
      this.strength = 'none';
      this.pos = null;
      return this.useable = false;
    }
  }, {
    key: 'start',
    value: function start() {
      if (this.running) {
        this.stop();
      }
      this._reset();
      this.running = true;
      this.listenTo(this.locationFinder, "found", this.locationFinderFound);
      this.listenTo(this.locationFinder, "error", this.locationFinderError);
      this.locationFinder.startWatch();
      // Update status
      this.updateStatus();
      return setTimeout(this.afterInitialDelay, initialDelay);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (!this.running) {
        return;
      }
      this.running = false;
      this.locationFinder.stopWatch();
      return this.stopListening();
    }
  }, {
    key: 'locationFinderFound',
    value: function locationFinderFound(pos) {
      var newStrength;
      // Calculate strength of new position
      newStrength = utils.calculateGPSStrength(pos);
      // If none, do nothing
      if (newStrength === "none") {
        return;
      }
      // Replace position if better
      if (!this.pos || pos.coords.accuracy <= this.pos.coords.accuracy) {
        this.pos = pos;
      }
      // Update status
      this.updateStatus();
      // Start good delay if needed
      if (!this.goodDelayRunning && this.strength === "good") {
        setTimeout(this.afterGoodDelay, goodDelay);
      }
      // Set position if excellent
      if (this.strength === "excellent") {
        this.stop();
        return this.trigger('found', this.pos);
      }
    }
  }, {
    key: 'locationFinderError',
    value: function locationFinderError(err) {
      this.stop();
      this.error = err;
      return this.trigger('error', err);
    }
  }, {
    key: 'updateStatus',
    value: function updateStatus() {
      var ref;
      this.strength = utils.calculateGPSStrength(this.pos);
      this.useable = this.initialDelayComplete && ((ref = this.strength) === "fair" || ref === "poor") || this.strength === "good";

      // Trigger status
      return this.trigger('status', {
        strength: this.strength,
        pos: this.pos,
        useable: this.useable
      });
    }
  }, {
    key: 'afterInitialDelay',
    value: function afterInitialDelay() {
      // Set useable if strength is not none
      this.initialDelayComplete = true;
      if (this.running) {
        return this.updateStatus();
      }
    }
  }, {
    key: 'afterGoodDelay',
    value: function afterGoodDelay() {
      if (this.running) {
        this.stop();
        return this.trigger('found', this.pos);
      }
    }
  }]);
  return CurrentPositionFinder;
}();