var AdminRegionSelectComponent, AsyncLoadComponent, H, R, React, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = AdminRegionSelectComponent = (function(superClass) {
  extend(AdminRegionSelectComponent, superClass);

  function AdminRegionSelectComponent() {
    this.handleChange = bind(this.handleChange, this);
    return AdminRegionSelectComponent.__super__.constructor.apply(this, arguments);
  }

  AdminRegionSelectComponent.propTypes = {
    getAdminRegionPath: React.PropTypes.func.isRequired,
    getSubAdminRegions: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  };

  AdminRegionSelectComponent.prototype.componentWillMount = function() {
    AdminRegionSelectComponent.__super__.componentWillMount.apply(this, arguments);
    return this.props.getSubAdminRegions(null, 0, (function(_this) {
      return function(error, level0s) {
        return _this.setState({
          level0s: level0s
        });
      };
    })(this));
  };

  AdminRegionSelectComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.value !== oldProps.value;
  };

  AdminRegionSelectComponent.prototype.load = function(props, prevProps, callback) {
    callback({
      busy: true
    });
    if (props.value) {
      return props.getAdminRegionPath(props.value, (function(_this) {
        return function(error, path) {
          var i, len, pathElem, results;
          if (error) {
            return callback({
              error: error,
              busy: false
            });
          }
          callback({
            error: null,
            path: path,
            busy: false,
            level1s: null,
            level2s: null,
            level3s: null,
            level4s: null,
            level5s: null
          });
          results = [];
          for (i = 0, len = path.length; i < len; i++) {
            pathElem = path[i];
            results.push((function(pathElem) {
              return props.getSubAdminRegions(pathElem.id, pathElem.level + 1, function(error, subRegions) {
                var val;
                if (error) {
                  return callback({
                    error: error
                  });
                }
                val = {};
                val["level" + (pathElem.level + 1) + "s"] = subRegions;
                return callback(val);
              });
            })(pathElem));
          }
          return results;
        };
      })(this));
    } else {
      return callback({
        error: null,
        path: [],
        busy: false
      });
    }
  };

  AdminRegionSelectComponent.prototype.handleChange = function(level, ev) {
    if (ev.target.value) {
      return this.props.onChange(ev.target.value);
    } else if (level > 0) {
      return this.props.onChange(this.state.path[level - 1].id);
    } else {
      return this.props.onChange(null);
    }
  };

  AdminRegionSelectComponent.prototype.renderLevel = function(level) {
    if (!this.state.path[level] && (!this.state["level" + level + "s"] || this.state["level" + level + "s"].length === 0)) {
      return null;
    }
    return H.tr({
      key: level
    }, H.td({
      style: {
        paddingLeft: 10,
        paddingRight: 10
      },
      className: "text-muted"
    }, this.state.path[level] ? this.state.path[level].type : void 0), H.td(null, H.select({
      key: "level" + level,
      className: "form-control",
      value: (this.state.path[level] ? this.state.path[level].id : ""),
      onChange: this.handleChange.bind(null, level)
    }, H.option({
      key: "none",
      value: ""
    }, this.state.path[level] ? "None" : "Select..."), this.state["level" + level + "s"] ? _.map(this.state["level" + level + "s"], (function(_this) {
      return function(subRegion) {
        return H.option({
          key: subRegion.id,
          value: subRegion.id
        }, subRegion.name);
      };
    })(this)) : this.state.path[level] ? H.option({
      key: this.state.path[level].id,
      value: this.state.path[level].id
    }, this.state.path[level].name) : void 0)));
  };

  AdminRegionSelectComponent.prototype.render = function() {
    if (this.state.loading || (!this.state.path && this.props.value) || (!this.props.value && !this.state.level0s)) {
      return H.div(null, T("Loading..."));
    }
    return H.table({
      style: {
        opacity: (this.state.busy ? 0.5 : void 0)
      }
    }, H.tbody(null, _.map(_.range(0, this.state.path.length + 1), (function(_this) {
      return function(level) {
        return _this.renderLevel(level);
      };
    })(this))));
  };

  return AdminRegionSelectComponent;

})(AsyncLoadComponent);
