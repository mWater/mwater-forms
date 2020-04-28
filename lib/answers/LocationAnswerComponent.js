"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var LocationAnswerComponent,
    LocationEditorComponent,
    LocationFinder,
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
R = React.createElement;
LocationEditorComponent = require('../LocationEditorComponent')["default"];
LocationFinder = require('../LocationFinder');

module.exports = LocationAnswerComponent = function () {
  var LocationAnswerComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(LocationAnswerComponent, _React$Component);

    function LocationAnswerComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, LocationAnswerComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(LocationAnswerComponent).apply(this, arguments));
      _this.handleUseMap = _this.handleUseMap.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(LocationAnswerComponent, [{
      key: "focus",
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: "handleUseMap",
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
            } // Clip to -85, 85 (for Webmercator)


            if (newLoc.latitude > 85) {
              newLoc.latitude = 85;
            }

            if (newLoc.latitude < -85) {
              newLoc.latitude = -85;
            } // Record that done via map


            newLoc.method = "map";
            return _this2.props.onValueChange(newLoc);
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        return R(LocationEditorComponent, {
          location: this.props.value,
          onLocationChange: this.props.onValueChange,
          onUseMap: !this.props.disableSetByMap && this.context.displayMap != null ? this.handleUseMap : void 0,
          locationFinder: this.context.locationFinder || new LocationFinder(),
          T: this.context.T
        });
      }
    }]);
    return LocationAnswerComponent;
  }(React.Component);

  ;
  LocationAnswerComponent.contextTypes = {
    displayMap: PropTypes.func,
    T: PropTypes.func.isRequired,
    // Localizer to use
    locationFinder: PropTypes.object
  };
  LocationAnswerComponent.propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    disableSetByMap: PropTypes.bool
  };
  return LocationAnswerComponent;
}.call(void 0);