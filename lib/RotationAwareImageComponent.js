var AsyncLoadComponent, H, R, React, RotationAwareImageComponent, classNames,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    image: React.PropTypes.object.isRequired,
    imageManager: React.PropTypes.object.isRequired,
    thumbnail: React.PropTypes.bool,
    height: React.PropTypes.number,
    onClick: React.PropTypes.func
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
    var classes, imageStyle;
    imageStyle = {};
    classes = classNames({
      "img-thumbnail": this.props.thumbnail
    });
    if (this.props.thumbnail) {
      imageStyle.maxHeight = this.props.height || 160;
      imageStyle.width = 160;
    }
    if (this.props.image.rotation > 0) {
      imageStyle.transform = "rotate(" + this.props.image.rotation + "deg)";
      imageStyle.WebkitTransform = "rotate(" + this.props.image.rotation + "deg)";
      imageStyle.MsTransform = "rotate(" + this.props.image.rotation + "deg)";
    }
    if (this.state.url) {
      return H.img({
        src: this.state.url,
        style: imageStyle,
        className: classes,
        onClick: this.props.onClick
      });
    } else {
      return null;
    }
  };

  return RotationAwareImageComponent;

})(AsyncLoadComponent);
