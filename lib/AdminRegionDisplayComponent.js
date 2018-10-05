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

var AdminRegionDisplayComponent, AsyncLoadComponent, PropTypes, R, React, _;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Loads and displays an admin region
module.exports = AdminRegionDisplayComponent = function () {
  var AdminRegionDisplayComponent = function (_AsyncLoadComponent) {
    (0, _inherits3.default)(AdminRegionDisplayComponent, _AsyncLoadComponent);

    function AdminRegionDisplayComponent() {
      (0, _classCallCheck3.default)(this, AdminRegionDisplayComponent);
      return (0, _possibleConstructorReturn3.default)(this, (AdminRegionDisplayComponent.__proto__ || (0, _getPrototypeOf2.default)(AdminRegionDisplayComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(AdminRegionDisplayComponent, [{
      key: 'isLoadNeeded',


      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.value !== oldProps.value;
      }

      // Call callback with state changes

    }, {
      key: 'load',
      value: function load(props, prevProps, callback) {
        if (!props.value) {
          callback({
            error: null,
            path: []
          });
          return;
        }
        return props.getAdminRegionPath(props.value, function (error, path) {
          return callback({
            error: error,
            path: path
          });
        });
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.state.loading) {
          return R('span', {
            className: "text-muted"
          }, this.props.T("Loading..."));
        }
        if (this.state.error) {
          return R('span', {
            className: "text-danger"
          }, this.props.T("Unable to connect to server"));
        }
        if (!this.state.path || this.state.path.length === 0) {
          return R('span', null, "None");
        }
        return R('span', null, _.last(this.state.path).full_name);
      }
    }]);
    return AdminRegionDisplayComponent;
  }(AsyncLoadComponent);

  ;

  AdminRegionDisplayComponent.propTypes = {
    getAdminRegionPath: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    value: PropTypes.string, // _id of entity
    T: PropTypes.func.isRequired // Localizer to use
  };

  return AdminRegionDisplayComponent;
}.call(undefined);