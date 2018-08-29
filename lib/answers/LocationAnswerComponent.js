'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(LocationAnswerComponent, _React$Component);

    function LocationAnswerComponent() {
      _classCallCheck(this, LocationAnswerComponent);

      var _this = _possibleConstructorReturn(this, (LocationAnswerComponent.__proto__ || Object.getPrototypeOf(LocationAnswerComponent)).apply(this, arguments));

      _this.handleUseMap = _this.handleUseMap.bind(_this);
      return _this;
    }

    _createClass(LocationAnswerComponent, [{
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