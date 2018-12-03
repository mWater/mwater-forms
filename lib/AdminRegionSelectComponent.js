'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdminRegionSelectComponent,
    AsyncLoadComponent,
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

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Allows selecting an admin region via cascading dropdowns
module.exports = AdminRegionSelectComponent = function () {
  var AdminRegionSelectComponent = function (_AsyncLoadComponent) {
    (0, _inherits3.default)(AdminRegionSelectComponent, _AsyncLoadComponent);

    function AdminRegionSelectComponent() {
      (0, _classCallCheck3.default)(this, AdminRegionSelectComponent);

      // props.imageManager.getImageUrl(props.imageId, (url) =>
      //   callback(url: url, error: false)
      // , => callback(error: true))
      var _this = (0, _possibleConstructorReturn3.default)(this, (AdminRegionSelectComponent.__proto__ || (0, _getPrototypeOf2.default)(AdminRegionSelectComponent)).apply(this, arguments));

      _this.handleChange = _this.handleChange.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(AdminRegionSelectComponent, [{
      key: 'componentWillMount',
      value: function componentWillMount(props) {
        var _this2 = this;

        (0, _get3.default)(AdminRegionSelectComponent.prototype.__proto__ || (0, _getPrototypeOf2.default)(AdminRegionSelectComponent.prototype), 'componentWillMount', this).call(this, props);
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
        return R('tr', {
          key: level
        }, R('td', {
          style: {
            paddingLeft: 10,
            paddingRight: 10
          },
          className: "text-muted"
        }, this.state.path[level] ? this.state.path[level].type : void 0), R('td', null, R('select', {
          key: 'level' + level,
          className: "form-control",
          value: this.state.path[level] ? this.state.path[level].id : "",
          onChange: this.handleChange.bind(null, level)
        }, R('option', {
          key: "none",
          value: ""
        }, this.state.path[level] ? this.props.T("None") : this.props.T("Select...")), this.state['level' + level + 's'] ? _.map(this.state['level' + level + 's'], function (subRegion) {
          return R('option', {
            key: subRegion.id,
            value: subRegion.id
          }, subRegion.name);
        }) : this.state.path[level] ? R('option', {
          key: this.state.path[level].id,
          value: this.state.path[level].id
        }, this.state.path[level].name) : void 0)));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        if (this.state.loading || !this.state.path && this.props.value || !this.props.value && !this.state.level0s) {
          return R('div', null, this.props.T("Loading..."));
        }
        return R('table', {
          style: {
            opacity: this.state.busy ? 0.5 : void 0
          }
        }, R('tbody', null, _.map(_.range(0, this.state.path.length + 1), function (level) {
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

// return R('img', src: url, style: { maxHeight: 100 }, className: "img-thumbnail", onClick: @props.onClick, onError: @handleError)