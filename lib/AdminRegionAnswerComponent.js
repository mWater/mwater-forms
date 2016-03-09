var AdminRegionAnswerComponent, AdminRegionSelectComponent, H, Question, React, ReactDOM, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = require('./Question');

_ = require('lodash');

React = require('react');

ReactDOM = require('react-dom');

H = React.DOM;

AdminRegionSelectComponent = require('./AdminRegionSelectComponent');

module.exports = AdminRegionAnswerComponent = (function(superClass) {
  extend(AdminRegionAnswerComponent, superClass);

  AdminRegionAnswerComponent.propTypes = {
    locationFinder: React.PropTypes.object,
    displayMap: React.PropTypes.func,
    getAdminRegionPath: React.PropTypes.func.isRequired,
    getSubAdminRegions: React.PropTypes.func.isRequired,
    findAdminRegionByLatLng: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  };

  function AdminRegionAnswerComponent() {
    this.handleChange = bind(this.handleChange, this);
    this.handleUseMap = bind(this.handleUseMap, this);
    this.handleUseGPS = bind(this.handleUseGPS, this);
    AdminRegionAnswerComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      working: false,
      error: null
    };
  }

  AdminRegionAnswerComponent.prototype.handleUseGPS = function() {
    this.setState({
      error: null,
      working: true
    });
    return this.props.locationFinder.getLocation((function(_this) {
      return function(location) {
        if (location.coords.accuracy > 500) {
          return;
        }
        return _this.props.findAdminRegionByLatLng(location.coords.latitude, location.coords.longitude, function(error, id) {
          if (error) {
            _this.setState({
              error: T("Unable to lookup location"),
              working: false
            });
            return;
          }
          _this.setState({
            working: false
          });
          return _this.props.onChange(id);
        });
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.setState({
          error: T("Unable to get location"),
          working: false
        });
      };
    })(this));
  };

  AdminRegionAnswerComponent.prototype.handleUseMap = function() {
    this.setState({
      error: null,
      working: true
    });
    return this.props.displayMap(null, (function(_this) {
      return function(location) {
        if (!location) {
          _this.setState({
            error: null,
            working: false
          });
          return;
        }
        return _this.props.findAdminRegionByLatLng(location.latitude, location.longitude, function(error, id) {
          if (error) {
            _this.setState({
              error: T("Unable to lookup location"),
              working: false
            });
            return;
          }
          return _this.props.onChange(id);
        });
      };
    })(this));
  };

  AdminRegionAnswerComponent.prototype.handleChange = function(id) {
    this.setState({
      error: null
    });
    return this.props.onChange(id);
  };

  AdminRegionAnswerComponent.prototype.renderEntityButtons = function() {
    return H.div(null, H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleUseGPS,
      disabled: this.props.locationFinder == null
    }, H.span({
      className: "glyphicon glyphicon-screenshot"
    }), " ", T("Set Using GPS")), H.button({
      type: "button",
      className: "btn btn-link btn-sm",
      onClick: this.handleUseMap,
      disabled: this.props.displayMap == null
    }, H.span({
      className: "glyphicon glyphicon-map-marker"
    }), " ", T("Set Using Map")));
  };

  AdminRegionAnswerComponent.prototype.render = function() {
    return H.div(null, this.renderEntityButtons(), this.state.working ? H.div({
      className: "text-info"
    }, T("Working...")) : void 0, this.state.error ? H.div({
      className: "text-danger"
    }, this.state.error) : void 0, React.createElement(AdminRegionSelectComponent, {
      getAdminRegionPath: this.props.getAdminRegionPath,
      getSubAdminRegions: this.props.getSubAdminRegions,
      value: this.props.value,
      onChange: this.handleChange
    }));
  };

  return AdminRegionAnswerComponent;

})(React.Component);
