var AsyncLoadComponent, H, ImagePopupComponent, ModalPopupComponent, React,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

module.exports = ImagePopupComponent = (function(superClass) {
  extend(ImagePopupComponent, superClass);

  function ImagePopupComponent() {
    return ImagePopupComponent.__super__.constructor.apply(this, arguments);
  }

  ImagePopupComponent.propTypes = {
    imageManager: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired,
    onRemove: React.PropTypes.func,
    onSetCover: React.PropTypes.func,
    onClose: React.PropTypes.func.isRequired
  };

  ImagePopupComponent.prototype.isLoadNeeded = function(newProps, oldProps) {
    return newProps.id !== oldProps.id;
  };

  ImagePopupComponent.prototype.load = function(props, prevProps, callback) {
    return this.props.imageManager.getImageUrl(props.id, (function(_this) {
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
      }, T("Loading..."));
    }
    if (this.state.error) {
      return H.div({
        className: "alert alert-danger"
      }, T("Error"));
    }
    return React.createElement(ModalPopupComponent, {
      footer: H.button({
        type: "button",
        className: "btn btn-default",
        onClick: this.props.onClose
      }, T("Close"))
    }, H.div(null, H.button({
      type: "button",
      className: "close",
      onClick: this.props.onClose
    }, "×"), H.div(null, this.props.onSetCover ? H.button({
      type: "button",
      className: "btn btn-link",
      onClick: this.props.onSetCover
    }, T("Set as Cover Image")) : void 0, " ", this.props.onRemove ? H.button({
      type: "button",
      className: "btn btn-link",
      onClick: this.props.onRemove
    }, T("Remove")) : void 0), H.img({
      src: this.state.url,
      style: {
        width: "100%"
      }
    })));
  };

  return ImagePopupComponent;

})(AsyncLoadComponent);
