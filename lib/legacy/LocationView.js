"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var Backbone,
    CurrentPositionFinder,
    LocationFinder,
    LocationView,
    _,
    ezlocalize,
    utils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

Backbone = require('backbone');
Backbone.$ = require('jquery');
LocationFinder = require('../LocationFinder');
_ = require('lodash');
ezlocalize = require('ez-localize');
CurrentPositionFinder = require('./CurrentPositionFinder');
utils = require('../utils'); // Shows the relative location of a point and allows setting it
// Fires events locationset, map, both with 
// options loc is initial location. (latitude, longitude, accuracy, etc.)
// options readonly makes it non-editable
// options hideMap is true to hide map
// options disableMap is true to disable map
// options locationFinder overrides default LocationFinder
// options currentPositionFinder overrides default CurrentPositionFinder
// options T is the localizer to use
// Location is stored format { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }

module.exports = LocationView = function () {
  var LocationView =
  /*#__PURE__*/
  function (_Backbone$View) {
    (0, _inherits2["default"])(LocationView, _Backbone$View);

    function LocationView(options) {
      var _this;

      (0, _classCallCheck2["default"])(this, LocationView);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LocationView).call(this));
      _this.locationFound = _this.locationFound.bind((0, _assertThisInitialized2["default"])(_this));
      _this.locationError = _this.locationError.bind((0, _assertThisInitialized2["default"])(_this));
      _this.mapClicked = _this.mapClicked.bind((0, _assertThisInitialized2["default"])(_this));
      _this.loc = options.loc;
      _this.readonly = options.readonly;
      _this.hideMap = options.hideMap;
      _this.disableMap = options.disableMap;
      _this.settingLocation = false;
      _this.locationFinder = options.locationFinder || new LocationFinder();
      _this.currentPositionFinder = options.currentPositionFinder || new CurrentPositionFinder({
        locationFinder: _this.locationFinder
      });
      _this.T = options.T || ezlocalize.defaultT; // Listen to location events

      _this.listenTo(_this.locationFinder, 'found', _this.locationFound);

      _this.listenTo(_this.locationFinder, 'error', _this.locationError); // Listen to current position events (for setting location)


      _this.listenTo(_this.currentPositionFinder, 'found', _this.currentPositionFound);

      _this.listenTo(_this.currentPositionFinder, 'error', _this.currentPositionError);

      _this.listenTo(_this.currentPositionFinder, 'status', _this.render); // Start tracking location so that we get an accurate location quickly


      _this.locationFinder.startWatch(); // Do not re-render template as it would destroy input fields


      _this.$el.html(require('./templates/LocationView.hbs')({}, {
        helpers: {
          T: _this.T
        }
      }));

      _this.render();

      return _this;
    }

    (0, _createClass2["default"])(LocationView, [{
      key: "remove",
      value: function remove() {
        this.settingLocation = false;
        this.locationFinder.stopWatch();
        this.currentPositionFinder.stop();
        return (0, _get2["default"])((0, _getPrototypeOf2["default"])(LocationView.prototype), "remove", this).call(this);
      }
    }, {
      key: "render",
      value: function render() {
        var msg, relativeLocation, strength; // Set location string

        if (this.errorFindingLocation) {
          this.$("#location_relative").text(this.T("GPS not available"));
        } else if (!this.loc && !this.currentPositionFinder.running) {
          this.$("#location_relative").text(this.T("Unspecified location"));
        } else if (this.currentPositionFinder.running) {
          this.$("#location_relative").text(this.T("Setting location..."));
        } else if (this.loc && this.currentPos) {
          // Calculate relative location
          relativeLocation = utils.getRelativeLocation(this.currentPos.coords, this.loc);
          this.$("#location_relative").text(utils.formatRelativeLocation(relativeLocation, this.T));
        } else {
          this.$("#location_relative").text("");
        }

        if (this.loc && this.loc.latitude != null && this.loc.longitude != null && !this.currentPositionFinder.running) {
          this.$("#location_absolute").text(this.T("Latitude") + ": ".concat(this.loc.latitude.toFixed(6), ", ") + this.T("Longitude") + ": ".concat(this.loc.longitude.toFixed(6)));
        } else {
          this.$("#location_absolute").text("");
        } // Hide map if hidden


        if (this.hideMap) {
          this.$("#location_map").hide();
        } // Disable map if location not set


        this.$("#location_map").attr("disabled", this.disableMap || this.readonly); // Disable clear if location not set or readonly

        this.$("#location_clear").attr("disabled", !this.loc || this.readonly); // Disable set if setting location or readonly

        this.$("#location_set").attr("disabled", this.settingLocation || this.readonly); // Disable edit if readonly

        this.$("#location_edit").attr("disabled", this.readonly);

        if (this.loc && !this.currentPositionFinder.running) {
          strength = utils.formatGPSStrength(this.currentPos, this.T);
          this.$("#gps_strength").attr("class", strength["class"]);
          this.$("#gps_strength").text(strength.text);
        } else {
          this.$("#gps_strength").text("");
        } // Display set location controls


        if (this.currentPositionFinder.running) {
          this.$("#location_setter").show();
          this.$("#use_anyway").toggle(this.currentPositionFinder.useable && this.currentPositionFinder.strength !== "good");

          switch (this.currentPositionFinder.strength) {
            case "none":
              msg = this.T('Waiting for GPS...');
              break;

            case "poor":
              msg = this.T('Very weak GPS signal (±{0}m)...', this.currentPositionFinder.pos.coords.accuracy.toFixed(0));
              break;

            case "fair":
              msg = this.T('Weak GPS signal (±{0}m)...', this.currentPositionFinder.pos.coords.accuracy.toFixed(0));
              break;

            case "good":
              msg = this.T('Setting location...');
          }

          return this.$("#location_setter_msg").text(msg);
        } else {
          return this.$("#location_setter").hide();
        }
      }
    }, {
      key: "displayNotification",
      value: function displayNotification(message, className, shouldFadeOut) {
        var $notification, timeout; // Cancel the fadeout if timer on any preexisting alerts

        timeout = timeout || 0;
        clearTimeout(timeout);
        $notification = this.$("#notification");
        $notification.attr("class", "alert"); // If it is a temporary notification setup a fadeout timer

        return $notification.addClass(className).html(message).fadeIn(200, function () {
          if (shouldFadeOut) {
            return timeout = setTimeout(function () {
              $notification.fadeOut(500);
            }, 3000);
          }
        });
      }
    }, {
      key: "clearNotification",
      value: function clearNotification() {
        var $notification;
        return $notification = this.$("#notification").empty().removeClass("alert");
      }
    }, {
      key: "clearLocation",
      value: function clearLocation() {
        this.loc = null;
        this.trigger('locationset', null);
        return this.render();
      } // Takes out relevant coords from html5 position

    }, {
      key: "convertPosToLoc",
      value: function convertPosToLoc(pos) {
        if (pos == null) {
          return pos;
        }

        return _.pick(pos.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy");
      }
    }, {
      key: "setLocation",
      value: function setLocation() {
        return this.currentPositionFinder.start();
      }
    }, {
      key: "currentPositionFound",
      value: function currentPositionFound(pos) {
        // Extract location
        this.loc = this.convertPosToLoc(pos); // Set current position

        this.currentPos = pos;
        this.displayNotification(this.T("Location Set Successfully"), "alert-success", true);
        this.trigger('locationset', this.loc);
        return this.render();
      }
    }, {
      key: "currentPositionError",
      value: function currentPositionError(err) {
        this.displayNotification(this.T("Cannot set location"), "alert-danger", true);
        return this.render();
      }
    }, {
      key: "cancelSet",
      value: function cancelSet() {
        this.currentPositionFinder.stop();
        return this.render();
      }
    }, {
      key: "useAnyway",
      value: function useAnyway() {
        if (this.currentPositionFinder.running) {
          if (this.currentPositionFinder.strength === "poor") {
            if (confirm(this.T("Use location with very low accuracy (±{0}m)?", this.currentPositionFinder.pos.coords.accuracy.toFixed(0)))) {
              this.currentPositionFinder.stop();
              return this.currentPositionFound(this.currentPositionFinder.pos);
            }
          } else {
            this.currentPositionFinder.stop();
            return this.currentPositionFound(this.currentPositionFinder.pos);
          }
        }
      }
    }, {
      key: "locationFound",
      value: function locationFound(pos) {
        boundMethodCheck(this, LocationView);
        this.currentPos = pos;
        this.errorFindingLocation = false;
        return this.render();
      }
    }, {
      key: "locationError",
      value: function locationError() {
        boundMethodCheck(this, LocationView);
        this.errorFindingLocation = true;
        return this.render();
      }
    }, {
      key: "mapClicked",
      value: function mapClicked() {
        boundMethodCheck(this, LocationView); // If we use the map, then stop the currentPositionFinder (or else it might overwrite the value)

        if (this.currentPositionFinder.running) {
          this.currentPositionFinder.stop();
        }

        return this.trigger('map', this.loc);
      }
    }, {
      key: "editLocation",
      value: function editLocation() {
        // Set values
        this.$("#latitude").val(this.loc ? this.loc.latitude : "");
        this.$("#longitude").val(this.loc ? this.loc.longitude : "");
        return this.$("#location_edit_controls").slideDown();
      }
    }, {
      key: "saveEditLocation",
      value: function saveEditLocation() {
        var latitude, longitude;
        latitude = parseFloat(this.$("#latitude").val());
        longitude = parseFloat(this.$("#longitude").val());

        if (isNaN(latitude) || latitude < -85 || latitude > 85) {
          alert("Invalid latitude. Must be a value between -85 and 85.");
          return;
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
          alert("Invalid longitude. Must be a value between -180 and 180.");
          return;
        } // If we save a value, then stop the currentPositionFinder (or else it might overwrite the value)


        if (this.currentPositionFinder.running) {
          this.currentPositionFinder.stop();
        } // Set location


        this.loc = {
          latitude: latitude,
          longitude: longitude,
          accuracy: 0 // Perfectly accurate when entered

        };
        this.trigger('locationset', this.loc); // Hide editing controls and re-render

        this.$("#location_edit_controls").slideUp();
        return this.render();
      }
    }, {
      key: "cancelEditLocation",
      value: function cancelEditLocation() {
        return this.$("#location_edit_controls").slideUp();
      }
    }]);
    return LocationView;
  }(Backbone.View);

  ;
  LocationView.prototype.events = {
    'click #location_map': 'mapClicked',
    'click #location_set': 'setLocation',
    'click #location_clear': 'clearLocation',
    'click #location_edit': 'editLocation',
    'click #save_edit_button': 'saveEditLocation',
    'click #cancel_edit_button': 'cancelEditLocation',
    'click #cancel_set': "cancelSet",
    'click #use_anyway': "useAnyway"
  };
  return LocationView;
}.call(void 0);