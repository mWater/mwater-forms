var AsyncLoadComponent, H, ImagePopupComponent, ModalPopupComponent, PropTypes, React, RotationAwareImageComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

RotationAwareImageComponent = require('./RotationAwareImageComponent');

module.exports = ImagePopupComponent = (function(superClass) {
  extend(ImagePopupComponent, superClass);

  function ImagePopupComponent() {
    return ImagePopupComponent.__super__.constructor.apply(this, arguments);
  }

  ImagePopupComponent.propTypes = {
    imageManager: PropTypes.object.isRequired,
    image: PropTypes.object.isRequired,
    onRemove: PropTypes.func,
    onSetCover: PropTypes.func,
    onRotate: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired
  };

  ImagePopupComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.id !== oldProps.id;
  };

  ImagePopupComponent.prototype.load = function(props, prevProps, callback) {
    return this.props.imageManager.getImageUrl(props.image.id, (function(_this) {
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

  ImagePopupComponent.prototype.render = function() {
    if (this.state.loading) {
      return H.div({
        className: "alert alert-info"
      }, this.props.T("Loading..."));
    }
    if (this.state.error) {
      return H.div({
        className: "alert alert-danger"
      }, this.props.T("Error"));
    }
    return React.createElement(ModalPopupComponent, {
      footer: H.button({
        type: "button",
        className: "btn btn-default",
        onClick: this.props.onClose
      }, this.props.T("Close"))
    }, H.div(null, H.button({
      type: "button",
      className: "close",
      onClick: this.props.onClose
    }, "×"), H.div(null, this.props.onSetCover ? H.button({
      type: "button",
      className: "btn btn-link",
      onClick: this.props.onSetCover
    }, this.props.T("Set as Cover Image")) : void 0, " ", this.props.onRemove ? H.button({
      type: "button",
      className: "btn btn-link",
      onClick: this.props.onRemove
    }, this.props.T("Remove")) : void 0, " ", this.props.onRotate ? H.button({
      type: "button",
      className: "btn btn-link",
      onClick: this.props.onRotate
    }, this.props.T("Rotate")) : void 0), React.createElement(RotationAwareImageComponent, {
      key: this.props.image.id,
      imageManager: this.props.imageManager,
      image: this.props.image,
      onClick: this.handleClickImage
    })));
  };

  return ImagePopupComponent;

})(AsyncLoadComponent);
