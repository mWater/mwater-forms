var AsyncLoadComponent, H, ImageThumbnailComponent, R, React,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = ImageThumbnailComponent = (function(superClass) {
  extend(ImageThumbnailComponent, superClass);

  function ImageThumbnailComponent() {
    this.handleError = bind(this.handleError, this);
    return ImageThumbnailComponent.__super__.constructor.apply(this, arguments);
  }

  ImageThumbnailComponent.propTypes = {
    imageManager: React.PropTypes.object.isRequired,
    imageId: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  };

  ImageThumbnailComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.imageId !== oldProps.imageId;
  };

  ImageThumbnailComponent.prototype.load = function(props, prevProps, callback) {
    return props.imageManager.getImageUrl(props.imageId, (function(_this) {
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
  };

  ImageThumbnailComponent.prototype.handleError = function() {
    return this.setState({
      error: true
    });
  };

  ImageThumbnailComponent.prototype.render = function() {
    var url;
    if (this.state.loading) {
      url = "img/image-loading.png";
    } else if (this.state.error) {
      url = "img/no-image-icon.jpg";
    } else if (this.state.url) {
      url = this.state.url;
    }
    return H.img({
      src: url,
      style: {
        maxHeight: 100
      },
      className: "img-thumbnail",
      onClick: this.props.onClick,
      onError: this.handleError
    });
  };

  return ImageThumbnailComponent;

})(AsyncLoadComponent);
