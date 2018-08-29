'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdminRegionAnswerComponent,
    AdminRegionSelectComponent,
    H,
    PropTypes,
    React,
    _,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

AdminRegionSelectComponent = require('../AdminRegionSelectComponent');

// Displays a gps, map and manual select
module.exports = AdminRegionAnswerComponent = function () {
  var AdminRegionAnswerComponent = function (_React$Component) {
    _inherits(AdminRegionAnswerComponent, _React$Component);

    function AdminRegionAnswerComponent(props) {
      _classCallCheck(this, AdminRegionAnswerComponent);

      var _this = _possibleConstructorReturn(this, (AdminRegionAnswerComponent.__proto__ || Object.getPrototypeOf(AdminRegionAnswerComponent)).call(this, props));

      _this.handleUseGPS = _this.handleUseGPS.bind(_this);
      _this.handleCancelUseGPS = _this.handleCancelUseGPS.bind(_this);
      _this.handleUseMap = _this.handleUseMap.bind(_this);
      _this.handleChange = _this.handleChange.bind(_this);
      _this.state = {
        waiting: false, // True when waiting for gps
        error: null
      };
      return _this;
    }

    _createClass(AdminRegionAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: 'handleUseGPS',
      value: function handleUseGPS() {
        var _this2 = this;

        boundMethodCheck(this, AdminRegionAnswerComponent);
        return this.setState({
          error: null,
          waiting: true
        }, function () {
          return _this2.context.locationFinder.getLocation(function (location) {
            // If no longer waiting, ignore
            if (!_this2.state.waiting) {
              return;
            }
            // Lookup location
            return _this2.context.findAdminRegionByLatLng(location.coords.latitude, location.coords.longitude, function (error, id) {
              if (error) {
                _this2.setState({
                  error: _this2.context.T("Unable to lookup location"),
                  waiting: false
                });
                return;
              }
              _this2.setState({
                waiting: false
              });
              return _this2.props.onChange(id);
            });
          }, function (error) {
            // If no longer waiting, ignore
            if (!_this2.state.waiting) {
              return;
            }
            return _this2.setState({
              error: _this2.context.T("Unable to get location"),
              waiting: false
            });
          });
        });
      }
    }, {
      key: 'handleCancelUseGPS',
      value: function handleCancelUseGPS() {
        boundMethodCheck(this, AdminRegionAnswerComponent);
        return this.setState({
          waiting: false
        });
      }
    }, {
      key: 'handleUseMap',
      value: function handleUseMap() {
        var _this3 = this;

        boundMethodCheck(this, AdminRegionAnswerComponent);
        this.setState({
          error: null,
          waiting: false
        });
        return this.context.displayMap(null, function (location) {
          // Cancel if no location
          if (!location) {
            return;
          }
          // Lookup location
          return _this3.context.findAdminRegionByLatLng(location.latitude, location.longitude, function (error, id) {
            if (error) {
              _this3.setState({
                error: _this3.context.T("Unable to lookup location")
              });
              return;
            }
            return _this3.props.onChange(id);
          });
        });
      }
    }, {
      key: 'handleChange',
      value: function handleChange(id) {
        boundMethodCheck(this, AdminRegionAnswerComponent);
        this.setState({
          error: null,
          waiting: false
        });
        return this.props.onChange(id);
      }
    }, {
      key: 'renderEntityButtons',
      value: function renderEntityButtons() {
        return H.div(null, !this.state.waiting ? H.button({
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleUseGPS,
          disabled: this.context.locationFinder == null
        }, H.span({
          className: "glyphicon glyphicon-screenshot"
        }), " ", this.context.T("Set Using GPS")) : H.button({
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleCancelUseGPS,
          disabled: this.context.locationFinder == null
        }, H.span({
          className: "glyphicon glyphicon-remove"
        }), " ", this.context.T("Cancel GPS")), H.button({
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleUseMap,
          disabled: this.context.displayMap == null
        }, H.span({
          className: "glyphicon glyphicon-map-marker"
        }), " ", this.context.T("Set Using Map")));
      }
    }, {
      key: 'render',
      value: function render() {
        return H.div(null, this.renderEntityButtons(), this.state.waiting ? H.div({
          className: "text-info"
        }, this.context.T("Waiting for GPS...")) : void 0, this.state.error ? H.div({
          className: "text-danger"
        }, this.state.error) : void 0, React.createElement(AdminRegionSelectComponent, {
          getAdminRegionPath: this.context.getAdminRegionPath,
          getSubAdminRegions: this.context.getSubAdminRegions,
          value: this.props.value,
          onChange: this.handleChange,
          T: this.context.T
        }));
      }
    }]);

    return AdminRegionAnswerComponent;
  }(React.Component);

  ;

  AdminRegionAnswerComponent.contextTypes = {
    locationFinder: PropTypes.object,
    displayMap: PropTypes.func, // Takes location ({ latitude, etc.}) and callback (called back with new location)
    getAdminRegionPath: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    findAdminRegionByLatLng: PropTypes.func.isRequired, // Call with (lat, lng, callback). Callback (error, id)
    T: PropTypes.func.isRequired // Localizer to use
  };

  AdminRegionAnswerComponent.propTypes = {
    value: PropTypes.string, // id of admin region
    onChange: PropTypes.func.isRequired // Called with new id
  };

  return AdminRegionAnswerComponent;
}.call(undefined);