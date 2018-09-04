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

var H,
    LocationAnswerComponent,
    LocationEditorComponent,
    PropTypes,
    R,
    React,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

LocationEditorComponent = require('../LocationEditorComponent');

// Functional??
module.exports = LocationAnswerComponent = function () {
  var LocationAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(LocationAnswerComponent, _React$Component);

    function LocationAnswerComponent() {
      (0, _classCallCheck3.default)(this, LocationAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (LocationAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(LocationAnswerComponent)).apply(this, arguments));

      _this.handleUseMap = _this.handleUseMap.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(LocationAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: 'handleUseMap',
      value: function handleUseMap() {
        var _this2 = this;

        boundMethodCheck(this, LocationAnswerComponent);
        if (this.context.displayMap != null) {
          return this.context.displayMap(this.props.value, function (newLoc) {
            // Wrap to -180, 180
            while (newLoc.longitude < -180) {
              newLoc.longitude += 360;
            }
            while (newLoc.longitude > 180) {
              newLoc.longitude -= 360;
            }
            // Clip to -85, 85 (for Webmercator)
            if (newLoc.latitude > 85) {
              newLoc.latitude = 85;
            }
            if (newLoc.latitude < -85) {
              newLoc.latitude = -85;
            }
            return _this2.props.onValueChange(newLoc);
          });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        return R(LocationEditorComponent, {
          location: this.props.value,
          onLocationChange: this.props.onValueChange,
          onUseMap: this.handleUseMap,
          locationFinder: this.context.locationFinder,
          T: this.context.T
        });
      }
    }]);
    return LocationAnswerComponent;
  }(React.Component);

  ;

  LocationAnswerComponent.contextTypes = {
    displayMap: PropTypes.func,
    T: PropTypes.func.isRequired, // Localizer to use
    locationFinder: PropTypes.object
  };

  LocationAnswerComponent.propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired
  };

  return LocationAnswerComponent;
}.call(undefined);