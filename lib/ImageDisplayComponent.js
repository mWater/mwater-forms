var H, ImageDisplayComponent, React,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

module.exports = ImageDisplayComponent = (function(superClass) {
  extend(ImageDisplayComponent, superClass);

  ImageDisplayComponent.propTypes = {
    id: React.PropTypes.string.isRequired,
    formCtx: React.PropTypes.object.isRequired
  };

  function ImageDisplayComponent() {
    this.handleImgClick = bind(this.handleImgClick, this);
    this.handleImgError = bind(this.handleImgError, this);
    ImageDisplayComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      error: false,
      url: null
    };
  }

  ImageDisplayComponent.prototype.componentDidMount = function() {
    return this.update(this.props);
  };

  ImageDisplayComponent.prototype.componentWillReceiveProps = function(newProps) {
    return this.update(newProps);
  };

  ImageDisplayComponent.prototype.update = function(props) {
    return props.formCtx.imageManager.getImageThumbnailUrl(props.id, (function(_this) {
      return function(url) {
        return _this.setState({
          url: url,
          error: false
        });
      };
    })(this), (function(_this) {
      return function() {
        return _this.setState({
          error: true
        });
      };
    })(this));
  };

  ImageDisplayComponent.prototype.handleImgError = function() {
    return this.setState({
      error: true
    });
  };

  ImageDisplayComponent.prototype.handleImgClick = function() {
    if (this.props.formCtx.displayImage) {
      return this.props.formCtx.displayImage({
        id: this.props.id
      });
    }
  };

  ImageDisplayComponent.prototype.render = function() {
    var src;
    if (this.state.error) {
      src = "img/no-image-icon.jpg";
    } else if (this.state.url) {
      src = this.state.url;
    } else {
      src = "img/image-loading.png";
    }
    return H.img({
      className: "img-thumbnail",
      src: src,
      onError: this.handleImgError,
      onClick: this.handleImgClick,
      style: {
        maxHeight: 100
      }
    });
  };

  return ImageDisplayComponent;

})(React.Component);
