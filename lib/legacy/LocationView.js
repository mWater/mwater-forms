var Backbone, CurrentPositionFinder, LocationFinder, LocationView, _, ezlocalize, utils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Backbone = require('backbone');

Backbone.$ = require('jquery');

LocationFinder = require('../LocationFinder');

_ = require('lodash');

ezlocalize = require('ez-localize');

CurrentPositionFinder = require('../CurrentPositionFinder');

utils = require('../utils');

module.exports = LocationView = (function(superClass) {
  extend(LocationView, superClass);

  function LocationView(options) {
    this.mapClicked = bind(this.mapClicked, this);
    this.locationError = bind(this.locationError, this);
    this.locationFound = bind(this.locationFound, this);
    LocationView.__super__.constructor.call(this);
    this.loc = options.loc;
    this.readonly = options.readonly;
    this.hideMap = options.hideMap;
    this.disableMap = options.disableMap;
    this.settingLocation = false;
    this.locationFinder = options.locationFinder || new LocationFinder({
      storage: options.storage
    });
    this.currentPositionFinder = options.currentPositionFinder || new CurrentPositionFinder({
      storage: options.storage
    });
    this.T = options.T || ezlocalize.defaultT;
    this.listenTo(this.locationFinder, 'found', this.locationFound);
    this.listenTo(this.locationFinder, 'error', this.locationError);
    this.listenTo(this.currentPositionFinder, 'found', this.currentPositionFound);
    this.listenTo(this.currentPositionFinder, 'error', this.currentPositionError);
    this.listenTo(this.currentPositionFinder, 'status', this.render);
    this.locationFinder.startWatch();
    this.$el.html(require('./templates/LocationView.hbs')({}, {
      helpers: {
        T: this.T
      }
    }));
    this.render();
  }

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

  LocationView.prototype.remove = function() {
    this.settingLocation = false;
    this.locationFinder.stopWatch();
    this.currentPositionFinder.stop();
    return LocationView.__super__.remove.call(this);
  };

  LocationView.prototype.render = function() {
    var msg, relativeLocation, strength;
    if (this.errorFindingLocation) {
      this.$("#location_relative").text(this.T("GPS not available"));
    } else if (!this.loc && !this.currentPositionFinder.running) {
      this.$("#location_relative").text(this.T("Unspecified location"));
    } else if (this.currentPositionFinder.running) {
      this.$("#location_relative").text(this.T("Setting location..."));
    } else if (this.loc && this.currentPos) {
      relativeLocation = utils.getRelativeLocation(this.currentPos.coords, this.loc);
      this.$("#location_relative").text(utils.formatRelativeLocation(relativeLocation, this.T));
    } else {
      this.$("#location_relative").text("");
    }
    if (this.loc && (this.loc.latitude != null) && (this.loc.longitude != null) && !this.currentPositionFinder.running) {
      this.$("#location_absolute").text(this.T("Latitude") + (": " + (this.loc.latitude.toFixed(6)) + ", ") + this.T("Longitude") + (": " + (this.loc.longitude.toFixed(6))));
    } else {
      this.$("#location_absolute").text("");
    }
    if (this.hideMap) {
      this.$("#location_map").hide();
    }
    this.$("#location_map").attr("disabled", this.disableMap || this.readonly);
    this.$("#location_clear").attr("disabled", !this.loc || this.readonly);
    this.$("#location_set").attr("disabled", this.settingLocation || this.readonly);
    this.$("#location_edit").attr("disabled", this.readonly);
    if (this.loc && !this.currentPositionFinder.running) {
      strength = utils.formatGPSStrength(this.currentPos, this.T);
      this.$("#gps_strength").attr("class", strength["class"]);
      this.$("#gps_strength").text(strength.text);
    } else {
      this.$("#gps_strength").text("");
    }
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
  };

  LocationView.prototype.displayNotification = function(message, className, shouldFadeOut) {
    var $notification, timeout;
    timeout = timeout || 0;
    clearTimeout(timeout);
    $notification = this.$("#notification");
    $notification.attr("class", "alert");
    return $notification.addClass(className).html(message).fadeIn(200, function() {
      if (shouldFadeOut) {
        return timeout = setTimeout(function() {
          $notification.fadeOut(500);
        }, 3000);
      }
    });
  };

  LocationView.prototype.clearNotification = function() {
    var $notification;
    return $notification = this.$("#notification").empty().removeClass("alert");
  };

  LocationView.prototype.clearLocation = function() {
    this.loc = null;
    this.trigger('locationset', null);
    return this.render();
  };

  LocationView.prototype.convertPosToLoc = function(pos) {
    if (pos == null) {
      return pos;
    }
    return _.pick(pos.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy");
  };

  LocationView.prototype.setLocation = function() {
    return this.currentPositionFinder.start();
  };

  LocationView.prototype.currentPositionFound = function(pos) {
    this.loc = this.convertPosToLoc(pos);
    this.currentPos = pos;
    this.displayNotification(this.T("Location Set Successfully"), "alert-success", true);
    this.trigger('locationset', this.loc);
    return this.render();
  };

  LocationView.prototype.currentPositionError = function(err) {
    return this.displayNotification(this.T("Cannot set location"), "alert-danger", true);
  };

  LocationView.prototype.cancelSet = function() {
    this.currentPositionFinder.stop();
    return this.render();
  };

  LocationView.prototype.useAnyway = function() {
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
  };

  LocationView.prototype.locationFound = function(pos) {
    this.currentPos = pos;
    this.errorFindingLocation = false;
    return this.render();
  };

  LocationView.prototype.locationError = function() {
    this.errorFindingLocation = true;
    return this.render();
  };

  LocationView.prototype.mapClicked = function() {
    return this.trigger('map', this.loc);
  };

  LocationView.prototype.editLocation = function() {
    this.$("#latitude").val(this.loc ? this.loc.latitude : "");
    this.$("#longitude").val(this.loc ? this.loc.longitude : "");
    return this.$("#location_edit_controls").slideDown();
  };

  LocationView.prototype.saveEditLocation = function() {
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
    }
    this.loc = {
      latitude: latitude,
      longitude: longitude,
      accuracy: 0
    };
    this.trigger('locationset', this.loc);
    this.$("#location_edit_controls").slideUp();
    return this.render();
  };

  LocationView.prototype.cancelEditLocation = function() {
    return this.$("#location_edit_controls").slideUp();
  };

  return LocationView;

})(Backbone.View);
