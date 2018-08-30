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

var $, H, LocationEditorComponent, LocationView, PropTypes, React, _;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

$ = require('jquery');

// TODO: Make a React LoactionView
LocationView = require('./legacy/LocationView');

// Component that allows setting of location
// TODO reimplement in pure react
module.exports = LocationEditorComponent = function () {
  var LocationEditorComponent = function (_React$Component) {
    (0, _inherits3.default)(LocationEditorComponent, _React$Component);

    function LocationEditorComponent() {
      (0, _classCallCheck3.default)(this, LocationEditorComponent);
      return (0, _possibleConstructorReturn3.default)(this, (LocationEditorComponent.__proto__ || (0, _getPrototypeOf2.default)(LocationEditorComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(LocationEditorComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        this.locationView = new LocationView({
          loc: this.props.location,
          hideMap: this.props.onUseMap == null,
          locationFinder: this.props.locationFinder,
          T: this.props.T
        });
        this.locationView.on('locationset', function (location) {
          return _this2.props.onLocationChange(location);
        });
        this.locationView.on('map', function () {
          return _this2.props.onUseMap();
        });
        return $(this.main).append(this.locationView.el);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.location, this.props.location)) {
          this.locationView.loc = nextProps.location;
          return this.locationView.render();
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        return this.locationView.remove();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        return H.div({
          ref: function ref(c) {
            return _this3.main = c;
          }
        });
      }
    }]);
    return LocationEditorComponent;
  }(React.Component);

  ;

  LocationEditorComponent.propTypes = {
    location: PropTypes.object, // { latitude, longitude, accuracy, altitude?, altitudeAccuracy? }
    locationFinder: PropTypes.object, // Location finder to use
    onLocationChange: PropTypes.func,
    onUseMap: PropTypes.func, // Called if map use is requested
    T: PropTypes.func // Localizer
  };

  return LocationEditorComponent;
}.call(undefined);