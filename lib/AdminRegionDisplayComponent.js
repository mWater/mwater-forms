'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdminRegionDisplayComponent, AsyncLoadComponent, H, PropTypes, React, _;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Loads and displays an admin region
module.exports = AdminRegionDisplayComponent = function () {
  var AdminRegionDisplayComponent = function (_AsyncLoadComponent) {
    _inherits(AdminRegionDisplayComponent, _AsyncLoadComponent);

    function AdminRegionDisplayComponent() {
      _classCallCheck(this, AdminRegionDisplayComponent);

      return _possibleConstructorReturn(this, (AdminRegionDisplayComponent.__proto__ || Object.getPrototypeOf(AdminRegionDisplayComponent)).apply(this, arguments));
    }

    _createClass(AdminRegionDisplayComponent, [{
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
          return H.span({
            className: "text-muted"
          }, this.props.T("Loading..."));
        }
        if (this.state.error) {
          return H.span({
            className: "text-danger"
          }, this.props.T("Unable to connect to server"));
        }
        if (!this.state.path || this.state.path.length === 0) {
          return H.span(null, "None");
        }
        return H.span(null, _.last(this.state.path).full_name);
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