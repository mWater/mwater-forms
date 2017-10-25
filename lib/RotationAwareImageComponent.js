var AsyncLoadComponent, H, PropTypes, R, React, RotationAwareImageComponent, classNames,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

classNames = require('classnames');

module.exports = RotationAwareImageComponent = (function(superClass) {
  extend(RotationAwareImageComponent, superClass);

  function RotationAwareImageComponent() {
    return RotationAwareImageComponent.__super__.constructor.apply(this, arguments);
  }

  RotationAwareImageComponent.propTypes = {
    image: PropTypes.object.isRequired,
    imageManager: PropTypes.object.isRequired,
    thumbnail: PropTypes.bool,
    height: PropTypes.number,
    onClick: PropTypes.func
  };

  RotationAwareImageComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.image.id !== oldProps.image.id || newProps.thumbnail !== oldProps.thumbnail;
  };

  RotationAwareImageComponent.prototype.load = function(props, prevProps, callback) {
    if (props.thumbnail) {
      return props.imageManager.getImageThumbnailUrl(props.image.id, (function(_this) {
        return function(url) {
          return callback({
            url: url,
            error: false
          });
        };
      })(this), (function(_this) {
        return function() {
          return callback({
            error: true
          });
        };
      })(this));
    } else {
      return props.imageManager.getImageUrl(props.image.id, (function(_this) {
        return function(url) {
          return callback({
            url: url,
            error: false
          });
        };
      })(this), (function(_this) {
        return function() {
          return callback({
            error: true
          });
        };
      })(this));
    }
  };

  RotationAwareImageComponent.prototype.render = function() {
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
    console.log(containerClasses);
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
        ref: (function(_this) {
          return function(c) {
            return _this.parent = c;
          };
        })(this),
        className: containerClasses,
        style: containerStyle
      }, H.img({
        ref: (function(_this) {
          return function(c) {
            return _this.image = c;
          };
        })(this),
        src: this.state.url,
        style: imageStyle,
        className: classes,
        onClick: this.props.onClick,
        alt: this.props.image.caption || ""
      }));
    } else {
      return null;
    }
  };

  return RotationAwareImageComponent;

})(AsyncLoadComponent);
