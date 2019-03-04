"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var AdminRegionDisplayComponent, AsyncLoadComponent, PropTypes, R, React, _;

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent'); // Loads and displays an admin region

module.exports = AdminRegionDisplayComponent = function () {
  var AdminRegionDisplayComponent =
  /*#__PURE__*/
  function (_AsyncLoadComponent) {
    (0, _inherits2.default)(AdminRegionDisplayComponent, _AsyncLoadComponent);

    function AdminRegionDisplayComponent() {
      (0, _classCallCheck2.default)(this, AdminRegionDisplayComponent);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AdminRegionDisplayComponent).apply(this, arguments));
    }

    (0, _createClass2.default)(AdminRegionDisplayComponent, [{
      key: "isLoadNeeded",
      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.value !== oldProps.value;
      } // Call callback with state changes

    }, {
      key: "load",
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
      key: "render",
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
    getAdminRegionPath: PropTypes.func.isRequired,
    // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    value: PropTypes.string,
    // _id of entity
    T: PropTypes.func.isRequired // Localizer to use

  };
  return AdminRegionDisplayComponent;
}.call(void 0);