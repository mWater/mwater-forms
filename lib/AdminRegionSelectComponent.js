'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdminRegionSelectComponent,
    AsyncLoadComponent,
    H,
    PropTypes,
    R,
    React,
    _,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Allows selecting an admin region via cascading dropdowns
module.exports = AdminRegionSelectComponent = function () {
  var AdminRegionSelectComponent = function (_AsyncLoadComponent) {
    _inherits(AdminRegionSelectComponent, _AsyncLoadComponent);

    function AdminRegionSelectComponent() {
      _classCallCheck(this, AdminRegionSelectComponent);

      // props.imageManager.getImageUrl(props.imageId, (url) =>
      //   callback(url: url, error: false)
      // , => callback(error: true))
      var _this = _possibleConstructorReturn(this, (AdminRegionSelectComponent.__proto__ || Object.getPrototypeOf(AdminRegionSelectComponent)).apply(this, arguments));

      _this.handleChange = _this.handleChange.bind(_this);
      return _this;
    }

    _createClass(AdminRegionSelectComponent, [{
      key: 'componentWillMount',
      value: function componentWillMount(props) {
        var _this2 = this;

        _get(AdminRegionSelectComponent.prototype.__proto__ || Object.getPrototypeOf(AdminRegionSelectComponent.prototype), 'componentWillMount', this).call(this, props);
        // Get countries initially
        return this.props.getSubAdminRegions(null, 0, function (error, level0s) {
          return _this2.setState({
            level0s: level0s
          });
        });
      }

      // Override to determine if a load is needed. Not called on mounting

    }, {
      key: 'isLoadNeeded',
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.value !== oldProps.value;
      }

      // Call callback with state changes

    }, {
      key: 'load',
      value: function load(props, prevProps, callback) {
        // Leave current state alone while loading
        callback({
          busy: true // loading is reserved
        });

        // Get path
        if (props.value) {
          return props.getAdminRegionPath(props.value, function (error, path) {
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
            // Get subadmins
            results = [];
            for (i = 0, len = path.length; i < len; i++) {
              pathElem = path[i];
              results.push(function (pathElem) {
                return props.getSubAdminRegions(pathElem.id, pathElem.level + 1, function (error, subRegions) {
                  var val;
                  if (error) {
                    return callback({
                      error: error
                    });
                  }
                  // Set levelNs to be list of values
                  val = {};
                  val['level' + (pathElem.level + 1) + 's'] = subRegions;
                  return callback(val);
                });
              }(pathElem));
            }
            return results;
          });
        } else {
          return callback({
            error: null,
            path: [],
            busy: false
          });
        }
      }
    }, {
      key: 'handleChange',
      value: function handleChange(level, ev) {
        boundMethodCheck(this, AdminRegionSelectComponent);
        if (ev.target.value) {
          return this.props.onChange(ev.target.value);
        } else if (level > 0) {
          // Use level above
          return this.props.onChange(this.state.path[level - 1].id);
        } else {
          return this.props.onChange(null);
        }
      }
    }, {
      key: 'renderLevel',
      value: function renderLevel(level) {
        if (!this.state.path[level] && (!this.state['level' + level + 's'] || this.state['level' + level + 's'].length === 0)) {
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
          key: 'level' + level,
          className: "form-control",
          value: this.state.path[level] ? this.state.path[level].id : "",
          onChange: this.handleChange.bind(null, level)
        }, H.option({
          key: "none",
          value: ""
        }, this.state.path[level] ? this.props.T("None") : this.props.T("Select...")), this.state['level' + level + 's'] ? _.map(this.state['level' + level + 's'], function (subRegion) {
          return H.option({
            key: subRegion.id,
            value: subRegion.id
          }, subRegion.name);
        }) : this.state.path[level] ? H.option({
          key: this.state.path[level].id,
          value: this.state.path[level].id
        }, this.state.path[level].name) : void 0)));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        if (this.state.loading || !this.state.path && this.props.value || !this.props.value && !this.state.level0s) {
          return H.div(null, this.props.T("Loading..."));
        }
        return H.table({
          style: {
            opacity: this.state.busy ? 0.5 : void 0
          }
        }, H.tbody(null, _.map(_.range(0, this.state.path.length + 1), function (level) {
          return _this3.renderLevel(level);
        })));
      }
    }]);

    return AdminRegionSelectComponent;
  }(AsyncLoadComponent);

  ;

  AdminRegionSelectComponent.propTypes = {
    getAdminRegionPath: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: PropTypes.func.isRequired, // Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    value: PropTypes.string, // id of admin region
    onChange: PropTypes.func.isRequired, // Called with new id
    T: PropTypes.func.isRequired // Localizer to use
  };

  return AdminRegionSelectComponent;
}.call(undefined);

// if @state.loading
//   # TODO better as font-awesome or suchlike
//   url = "img/image-loading.png"
// else if @state.error
//   # TODO better as font-awesome or suchlike
//   url = "img/no-image-icon.jpg"
// else if @state.url
//   url = @state.url

// return H.img(src: url, style: { maxHeight: 100 }, className: "img-thumbnail", onClick: @props.onClick, onError: @handleError)