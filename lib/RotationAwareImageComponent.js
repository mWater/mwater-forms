'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AsyncLoadComponent, H, PropTypes, R, React, RotationAwareImageComponent, classNames;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

classNames = require('classnames');

module.exports = RotationAwareImageComponent = function () {
  var RotationAwareImageComponent = function (_AsyncLoadComponent) {
    _inherits(RotationAwareImageComponent, _AsyncLoadComponent);

    function RotationAwareImageComponent() {
      _classCallCheck(this, RotationAwareImageComponent);

      return _possibleConstructorReturn(this, (RotationAwareImageComponent.__proto__ || Object.getPrototypeOf(RotationAwareImageComponent)).apply(this, arguments));
    }

    _createClass(RotationAwareImageComponent, [{
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