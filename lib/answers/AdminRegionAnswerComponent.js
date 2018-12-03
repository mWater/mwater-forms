'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdminRegionAnswerComponent,
    AdminRegionSelectComponent,
    PropTypes,
    R,
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

R = React.createElement;

AdminRegionSelectComponent = require('../AdminRegionSelectComponent');

// Displays a gps, map and manual select
module.exports = AdminRegionAnswerComponent = function () {
  var AdminRegionAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(AdminRegionAnswerComponent, _React$Component);

    function AdminRegionAnswerComponent(props) {
      (0, _classCallCheck3.default)(this, AdminRegionAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (AdminRegionAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(AdminRegionAnswerComponent)).call(this, props));

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

    (0, _createClass3.default)(AdminRegionAnswerComponent, [{
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
        return R('div', null, !this.state.waiting ? R('button', {
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleUseGPS,
          disabled: this.context.locationFinder == null
        }, R('span', {
          className: "glyphicon glyphicon-screenshot"
        }), " ", this.context.T("Set Using GPS")) : R('button', {
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleCancelUseGPS,
          disabled: this.context.locationFinder == null
        }, R('span', {
          className: "glyphicon glyphicon-remove"
        }), " ", this.context.T("Cancel GPS")), R('button', {
          type: "button",
          className: "btn btn-link btn-sm",
          onClick: this.handleUseMap,
          disabled: this.context.displayMap == null
        }, R('span', {
          className: "glyphicon glyphicon-map-marker"
        }), " ", this.context.T("Set Using Map")));
      }
    }, {
      key: 'render',
      value: function render() {
        return R('div', null, this.renderEntityButtons(), this.state.waiting ? R('div', {
          className: "text-info"
        }, this.context.T("Waiting for GPS...")) : void 0, this.state.error ? R('div', {
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