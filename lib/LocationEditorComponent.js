'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(LocationEditorComponent, _React$Component);

    function LocationEditorComponent() {
      _classCallCheck(this, LocationEditorComponent);

      return _possibleConstructorReturn(this, (LocationEditorComponent.__proto__ || Object.getPrototypeOf(LocationEditorComponent)).apply(this, arguments));
    }

    _createClass(LocationEditorComponent, [{
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
        return $(this.refs.main).append(this.locationView.el);
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
        return H.div({
          ref: "main"
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