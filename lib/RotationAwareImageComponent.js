"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var AsyncLoadComponent, PropTypes, R, React, RotationAwareImageComponent, classNames;
PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');
classNames = require('classnames');

module.exports = RotationAwareImageComponent = function () {
  var RotationAwareImageComponent =
  /*#__PURE__*/
  function (_AsyncLoadComponent) {
    (0, _inherits2["default"])(RotationAwareImageComponent, _AsyncLoadComponent);

    function RotationAwareImageComponent() {
      (0, _classCallCheck2["default"])(this, RotationAwareImageComponent);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(RotationAwareImageComponent).apply(this, arguments));
    }

    (0, _createClass2["default"])(RotationAwareImageComponent, [{
      key: "isLoadNeeded",
      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.image.id !== oldProps.image.id || newProps.thumbnail !== oldProps.thumbnail;
      } // Call callback with state changes

    }, {
      key: "load",
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
      key: "render",
      value: function render() {
        var _this = this;

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
          return R('span', {
            ref: function ref(c) {
              return _this.parent = c;
            },
            className: containerClasses,
            style: containerStyle
          }, R('img', {
            ref: function ref(c) {
              return _this.image = c;
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
}.call(void 0);