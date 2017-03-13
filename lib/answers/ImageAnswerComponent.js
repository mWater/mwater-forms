var H, ImageAnswerComponent, ImagePopupComponent, ImageThumbnailComponent, React,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

ImageThumbnailComponent = require('../ImageThumbnailComponent');

ImagePopupComponent = require('../ImagePopupComponent');

module.exports = ImageAnswerComponent = (function(superClass) {
  extend(ImageAnswerComponent, superClass);

  ImageAnswerComponent.contextTypes = {
    imageManager: React.PropTypes.object.isRequired,
    imageAcquirer: React.PropTypes.object,
    T: React.PropTypes.func.isRequired
  };

  ImageAnswerComponent.propTypes = {
    image: React.PropTypes.object,
    onImageChange: React.PropTypes.func,
    consentPrompt: React.PropTypes.string
  };

  function ImageAnswerComponent() {
    this.handleAdd = bind(this.handleAdd, this);
    this.handleClickImage = bind(this.handleClickImage, this);
    ImageAnswerComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      modal: null
    };
  }

  ImageAnswerComponent.prototype.focus = function() {
    return null;
  };

  ImageAnswerComponent.prototype.handleClickImage = function() {
    var modal;
    modal = React.createElement(ImagePopupComponent, {
      imageManager: this.context.imageManager,
      id: this.props.image.id,
      T: this.context.T,
      onRemove: (function(_this) {
        return function() {
          _this.setState({
            modal: null
          });
          return _this.props.onImageChange(null);
        };
      })(this),
      onClose: (function(_this) {
        return function() {
          return _this.setState({
            modal: null
          });
        };
      })(this),
      onRotate: (function(_this) {
        return function() {
          var image;
          _this.setState({
            modal: null
          });
          image = _.extend({}, _this.props.image, {
            rotation: ((_this.props.image.rotation || 0) + 90) % 360
          });
          return _this.props.onImageChange(image);
        };
      })(this)
    });
    return this.setState({
      modal: modal
    });
  };

  ImageAnswerComponent.prototype.handleAdd = function() {
    if (this.props.consentPrompt) {
      if (!confirm(this.props.consentPrompt)) {
        return;
      }
    }
    return this.context.imageAcquirer.acquire((function(_this) {
      return function(id, rotation) {
        if (rotation == null) {
          rotation = 0;
        }
        return _this.props.onImageChange({
          id: id,
          rotation: rotation
        });
      };
    })(this), (function(_this) {
      return function(err) {
        return alert(err);
      };
    })(this));
  };

  ImageAnswerComponent.prototype.render = function() {
    return H.div(null, this.state.modal, this.props.image ? React.createElement(RotationAwareImageComponent, {
      key: this.props.image.id,
      imageManager: this.context.imageManager,
      image: this.props.image,
      thumbnail: true,
      onClick: this.handleClickImage
    }) : this.props.onImageChange && this.context.imageAcquirer ? H.img({
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
      className: "img-rounded",
      onClick: this.handleAdd,
      style: {
        maxHeight: 100
      }
    }) : H.div({
      className: "text-muted"
    }, this.context.T("No images present")));
  };

  return ImageAnswerComponent;

})(React.Component);
