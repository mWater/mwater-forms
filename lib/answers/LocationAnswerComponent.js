var H, LocationAnswerComponent, LocationEditorComponent, PropTypes, R, React,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

LocationEditorComponent = require('../LocationEditorComponent');

module.exports = LocationAnswerComponent = (function(superClass) {
  extend(LocationAnswerComponent, superClass);

  LocationAnswerComponent.contextTypes = {
    displayMap: PropTypes.func,
    T: PropTypes.func.isRequired,
    locationFinder: PropTypes.object
  };

  LocationAnswerComponent.propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired
  };

  function LocationAnswerComponent(props) {
    this.handleUseMap = bind(this.handleUseMap, this);
    LocationAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  LocationAnswerComponent.prototype.focus = function() {
    return null;
  };

  LocationAnswerComponent.prototype.handleUseMap = function() {
    if (this.context.displayMap != null) {
      return this.context.displayMap(this.props.value, (function(_this) {
        return function(newLoc) {
          while (newLoc.longitude < -180) {
            newLoc.longitude += 360;
          }
          while (newLoc.longitude > 180) {
            newLoc.longitude -= 360;
          }
          if (newLoc.latitude > 85) {
            newLoc.latitude = 85;
          }
          if (newLoc.latitude < -85) {
            newLoc.latitude = -85;
          }
          return _this.props.onValueChange(newLoc);
        };
      })(this));
    }
  };

  LocationAnswerComponent.prototype.render = function() {
    return R(LocationEditorComponent, {
      location: this.props.value,
      onLocationChange: this.props.onValueChange,
      onUseMap: this.handleUseMap,
      locationFinder: this.context.locationFinder,
      T: this.context.T
    });
  };

  return LocationAnswerComponent;

})(React.Component);
