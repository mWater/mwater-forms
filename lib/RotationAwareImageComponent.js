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

var AsyncLoadComponent, H, PropTypes, R, React, RotationAwareImageComponent, classNames;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

classNames = require('classnames');

module.exports = RotationAwareImageComponent = function () {
  var RotationAwareImageComponent = function (_AsyncLoadComponent) {
    (0, _inherits3.default)(RotationAwareImageComponent, _AsyncLoadComponent);

    function RotationAwareImageComponent() {
      (0, _classCallCheck3.default)(this, RotationAwareImageComponent);
      return (0, _possibleConstructorReturn3.default)(this, (RotationAwareImageComponent.__proto__ || (0, _getPrototypeOf2.default)(RotationAwareImageComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(RotationAwareImageComponent, [{
      key: 'isLoadNeeded',

      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.image.id !== oldProps.image.id || newProps.thumbnail !== oldProps.thumbnail;
      }

      // Call callback with state changes

    }, {
      key: 'load',
      value: function load(props, prevProps, callback) {
        if (props.thumbnail) {
          return props.imageManager.getImageThumbnailUrl(props.image.id, function (url) {
            return callback({
              url: url,
              error: false
            });
          }, function () {
            return callback({
              error: true
            });
          });
        } else {
          return props.imageManager.getImageUrl(props.image.id, function (url) {
            return callback({
              url: url,
              error: false
            });
          }, function () {
            return callback({
              error: true
            });
          });
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var classes, containerClasses, containerStyle, imageStyle;
        imageStyle = {};
        containerStyle = {};
        classes = classNames({
          "img-thumbnail": this.props.thumbnail,
          "rotated": this.props.image.rotation,
          "rotate-90": this.props.image.rotation && this.props.image.rotation === 90,
          "rotate-180": this.props.image.rotation && this.props.image.rotation === 180,
          "rotate-270": this.props.image.rotation && this.props.image.rotation === 270
        });
        containerClasses = classNames({
          "rotated-image-container": true,
          "rotated-thumbnail": this.props.thumbnail
        });
        if (this.props.thumbnail) {
          if (this.props.image.rotation === 90 || this.props.image.rotation === 270) {
            imageStyle.maxHeight = this.props.width || 160;
            imageStyle.maxWidth = this.props.height || 160;
          } else {
            imageStyle.maxHeight = this.props.height || 160;
            imageStyle.maxWidth = this.props.width || 160;
          }
          containerStyle.height = this.props.height || 160;
        } else {
          imageStyle.maxWidth = "100%";
        }
        if (this.state.url) {
          return H.span({
            ref: function ref(c) {
              return _this2.parent = c;
            },
            className: containerClasses,
            style: containerStyle
          }, H.img({
            ref: function ref(c) {
              return _this2.image = c;
            },
            src: this.state.url,
            style: imageStyle,
            className: classes,
            onClick: this.props.onClick,
            alt: this.props.image.caption || ""
          }));
        } else {
          return null;
        }
      }
    }]);
    return RotationAwareImageComponent;
  }(AsyncLoadComponent);

  ;

  RotationAwareImageComponent.propTypes = {
    image: PropTypes.object.isRequired,
    imageManager: PropTypes.object.isRequired,
    thumbnail: PropTypes.bool,
    height: PropTypes.number,
    onClick: PropTypes.func
  };

  return RotationAwareImageComponent;
}.call(undefined);