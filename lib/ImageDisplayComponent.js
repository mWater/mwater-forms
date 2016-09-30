var H, ImageDisplayComponent, ImagePopupComponent, React,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

ImagePopupComponent = require('./ImagePopupComponent');

module.exports = ImageDisplayComponent = (function(superClass) {
  extend(ImageDisplayComponent, superClass);

  ImageDisplayComponent.propTypes = {
    id: React.PropTypes.string.isRequired,
    imageManager: React.PropTypes.object.isRequired,
    T: React.PropTypes.func.isRequired
  };

  function ImageDisplayComponent() {
    this.handleImgClick = bind(this.handleImgClick, this);
    this.handleImgError = bind(this.handleImgError, this);
    ImageDisplayComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      error: false,
      url: null,
      popup: false
    };
  }

  ImageDisplayComponent.prototype.componentDidMount = function() {
    return this.update(this.props);
  };

  ImageDisplayComponent.prototype.componentWillReceiveProps = function(newProps) {
    return this.update(newProps);
  };

  ImageDisplayComponent.prototype.update = function(props) {
    return this.props.imageManager.getImageThumbnailUrl(props.id, (function(_this) {
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
    return this.setState({
      popup: true
    });
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
    return H.span(null, H.img({
      className: "img-thumbnail",
      src: src,
      onError: this.handleImgError,
      onClick: this.handleImgClick,
      style: {
        maxHeight: 100
      }
    }), this.state.popup ? React.createElement(ImagePopupComponent, {
      imageManager: this.props.imageManager,
      id: this.props.id,
      onClose: (function(_this) {
        return function() {
          return _this.setState({
            popup: false
          });
        };
      })(this),
      T: this.props.T
    }) : void 0);
  };

  return ImageDisplayComponent;

})(React.Component);
