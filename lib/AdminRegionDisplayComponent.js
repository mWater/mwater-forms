var AdminRegionDisplayComponent, AsyncLoadComponent, H, React, _,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = AdminRegionDisplayComponent = (function(superClass) {
  extend(AdminRegionDisplayComponent, superClass);

  function AdminRegionDisplayComponent() {
    return AdminRegionDisplayComponent.__super__.constructor.apply(this, arguments);
  }

  AdminRegionDisplayComponent.propTypes = {
    getAdminRegionPath: React.PropTypes.func.isRequired,
    value: React.PropTypes.string
  };

  AdminRegionDisplayComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.value !== oldProps.value;
  };

  AdminRegionDisplayComponent.prototype.load = function(props, prevProps, callback) {
    if (!props.value) {
      callback({
        error: null,
        path: []
      });
      return;
    }
    return props.getAdminRegionPath(props.value, (function(_this) {
      return function(error, path) {
        return callback({
          error: error,
          path: path
        });
      };
    })(this));
  };

  AdminRegionDisplayComponent.prototype.render = function() {
    if (this.state.loading) {
      return H.span({
        className: "text-muted"
      }, T("Loading..."));
    }
    if (this.state.error) {
      return H.span({
        className: "text-danger"
      }, T("Unable to connect to server"));
    }
    if (!this.state.path || this.state.path.length === 0) {
      return H.span(null, "None");
    }
    return H.span(null, _.last(this.state.path).full_name);
  };

  return AdminRegionDisplayComponent;

})(AsyncLoadComponent);
