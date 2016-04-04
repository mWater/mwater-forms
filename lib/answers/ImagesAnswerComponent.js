var H, ImagePopupComponent, ImageThumbnailComponent, ImagesAnswerComponent, React, _,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

ImageThumbnailComponent = require('../ImageThumbnailComponent');

ImagePopupComponent = require('../ImagePopupComponent');

module.exports = ImagesAnswerComponent = (function(superClass) {
  extend(ImagesAnswerComponent, superClass);

  ImagesAnswerComponent.contextTypes = {
    imageManager: React.PropTypes.object.isRequired,
    imageAcquirer: React.PropTypes.object
  };

  ImagesAnswerComponent.propTypes = {
    imagelist: React.PropTypes.array,
    onImagelistChange: React.PropTypes.func
  };

  function ImagesAnswerComponent() {
    this.handleClickImage = bind(this.handleClickImage, this);
    this.handleAdd = bind(this.handleAdd, this);
    ImagesAnswerComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      modal: null
    };
  }

  ImagesAnswerComponent.prototype.focus = function() {
    return null;
  };

  ImagesAnswerComponent.prototype.handleAdd = function() {
    return this.context.imageAcquirer.acquire((function(_this) {
      return function(id) {
        var imagelist;
        imagelist = _this.props.imagelist || [];
        imagelist = imagelist.slice();
        imagelist.push({
          id: id,
          cover: imagelist.length === 0
        });
        return _this.props.onImagelistChange(imagelist);
      };
    })(this), (function(_this) {
      return function(err) {
        throw err;
      };
    })(this));
  };

  ImagesAnswerComponent.prototype.handleClickImage = function(id) {
    var modal, onRemove, onSetCover;
    if (this.props.onImagelistChange) {
      onRemove = (function(_this) {
        return function() {
          var imagelist;
          _this.setState({
            modal: null
          });
          imagelist = _.filter(_this.props.imagelist || [], function(image) {
            return image.id !== id;
          });
          return _this.props.onImagelistChange(imagelist);
        };
      })(this);
      onSetCover = (function(_this) {
        return function() {
          var imagelist;
          _this.setState({
            modal: null
          });
          imagelist = _.map(_this.props.imagelist || [], function(image) {
            return _.extend({}, image, {
              cover: image.id === id
            });
          });
          return _this.props.onImagelistChange(imagelist);
        };
      })(this);
    }
    modal = React.createElement(ImagePopupComponent, {
      imageManager: this.context.imageManager,
      id: id,
      onRemove: onRemove,
      onSetCover: onSetCover,
      onClose: (function(_this) {
        return function() {
          return _this.setState({
            modal: null
          });
        };
      })(this)
    });
    return this.setState({
      modal: modal
    });
  };

  ImagesAnswerComponent.prototype.render = function() {
    return H.div(null, this.state.modal, _.map(this.props.imagelist, (function(_this) {
      return function(image) {
        return React.createElement(ImageThumbnailComponent, {
          key: image.id,
          imageManager: _this.context.imageManager,
          imageId: image.id,
          onClick: _this.handleClickImage.bind(null, image.id)
        });
      };
    })(this)), this.props.onImagelistChange && this.context.imageAcquirer ? H.img({
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
      className: "img-rounded",
      onClick: this.handleAdd,
      style: {
        maxHeight: 100
      }
    }) : void 0);
  };

  return ImagesAnswerComponent;

})(React.Component);
