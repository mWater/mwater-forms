"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var $, LocationEditorComponent, LocationView, PropTypes, R, React, _;

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
$ = require('jquery'); // TODO: Make a React LoactionView

LocationView = require('./legacy/LocationView'); // Component that allows setting of location
// TODO reimplement in pure react

module.exports = LocationEditorComponent = function () {
  var LocationEditorComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(LocationEditorComponent, _React$Component);

    function LocationEditorComponent() {
      (0, _classCallCheck2["default"])(this, LocationEditorComponent);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LocationEditorComponent).apply(this, arguments));
    }

    (0, _createClass2["default"])(LocationEditorComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this = this;

        this.locationView = new LocationView({
          loc: this.props.location,
          hideMap: this.props.onUseMap == null,
          locationFinder: this.props.locationFinder,
          T: this.props.T
        });
        this.locationView.on('locationset', function (location) {
          return _this.props.onLocationChange(location);
        });
        this.locationView.on('map', function () {
          return _this.props.onUseMap();
        });
        return $(this.main).append(this.locationView.el);
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.location, this.props.location)) {
          this.locationView.loc = nextProps.location;
          return this.locationView.render();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        return this.locationView.remove();
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        return R('div', {
          ref: function ref(c) {
            return _this2.main = c;
          }
        });
      }
    }]);
    return LocationEditorComponent;
  }(React.Component);

  ;
  LocationEditorComponent.propTypes = {
    location: PropTypes.object,
    // { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
    locationFinder: PropTypes.object,
    // Location finder to use
    onLocationChange: PropTypes.func,
    onUseMap: PropTypes.func,
    // Called if map use is requested
    T: PropTypes.func // Localizer

  };
  return LocationEditorComponent;
}.call(void 0);