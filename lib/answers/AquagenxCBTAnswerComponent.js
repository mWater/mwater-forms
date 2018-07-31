var AquagenxCBTAnswerComponent, AquagenxCBTDisplayComponent, AquagenxCBTPopupComponent, H, ImagePopupComponent, ImageThumbnailComponent, PropTypes, R, React, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

ImageThumbnailComponent = require('../ImageThumbnailComponent');

ImagePopupComponent = require('../ImagePopupComponent');

AquagenxCBTPopupComponent = require('./AquagenxCBTPopupComponent');

AquagenxCBTDisplayComponent = require('./AquagenxCBTDisplayComponent');

module.exports = AquagenxCBTAnswerComponent = (function(superClass) {
  extend(AquagenxCBTAnswerComponent, superClass);

  AquagenxCBTAnswerComponent.contextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired
  };

  AquagenxCBTAnswerComponent.propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    questionId: PropTypes.string.isRequired
  };

  AquagenxCBTAnswerComponent.defaultProps = {
    value: {
      image: null,
      cbt: null
    }
  };

  function AquagenxCBTAnswerComponent(props) {
    this.handleClearClick = bind(this.handleClearClick, this);
    this.handleEditClick = bind(this.handleEditClick, this);
    this.handleAdd = bind(this.handleAdd, this);
    this.handleClickImage = bind(this.handleClickImage, this);
    AquagenxCBTAnswerComponent.__super__.constructor.call(this, props);
    this.state = {
      imageModal: null,
      aquagenxModal: null
    };
  }

  AquagenxCBTAnswerComponent.prototype.focus = function() {
    return null;
  };

  AquagenxCBTAnswerComponent.prototype.handleClickImage = function() {
    var modal;
    modal = React.createElement(ImagePopupComponent, {
      imageManager: this.context.imageManager,
      image: this.props.value.image,
      T: this.context.T,
      onRemove: (function(_this) {
        return function() {
          var value;
          _this.setState({
            imageModal: null
          });
          value = _.clone(_this.props.value);
          value.image = null;
          return _this.props.onValueChange(value);
        };
      })(this),
      onClose: (function(_this) {
        return function() {
          return _this.setState({
            imageModal: null
          });
        };
      })(this),
      onRotate: (function(_this) {
        return function() {
          var value;
          value = _.clone(_this.props.value);
          value.image = _.extend({}, value.image, {
            rotation: ((value.image.rotation || 0) + 90) % 360
          });
          return _this.props.onValueChange(value);
        };
      })(this)
    });
    return this.setState({
      imageModal: modal
    });
  };

  AquagenxCBTAnswerComponent.prototype.handleAdd = function() {
    return this.context.imageAcquirer.acquire((function(_this) {
      return function(id) {
        var value;
        value = _.clone(_this.props.value);
        value.image = {
          id: id
        };
        return _this.props.onValueChange(value);
      };
    })(this), (function(_this) {
      return function(err) {
        throw err;
      };
    })(this));
  };

  AquagenxCBTAnswerComponent.prototype.handleEditClick = function() {
    var modal;
    modal = React.createElement(AquagenxCBTPopupComponent, {
      value: this.props.value,
      questionId: this.props.questionId,
      onSave: (function(_this) {
        return function(value) {
          _this.setState({
            aquagenxModal: null
          });
          return _this.props.onValueChange(value);
        };
      })(this),
      onClose: (function(_this) {
        return function() {
          return _this.setState({
            aquagenxModal: null
          });
        };
      })(this)
    });
    return this.setState({
      aquagenxModal: modal
    });
  };

  AquagenxCBTAnswerComponent.prototype.handleClearClick = function() {
    var value;
    value = _.clone(this.props.value);
    value.cbt = null;
    return this.props.onValueChange(value);
  };

  AquagenxCBTAnswerComponent.prototype.renderImage = function() {
    var ref;
    return H.div(null, this.state.imageModal, ((ref = this.props.value) != null ? ref.image : void 0) ? React.createElement(ImageThumbnailComponent, {
      imageId: this.props.value.image.id,
      onClick: this.handleClickImage,
      imageManager: this.context.imageManager
    }) : this.props.onValueChange && this.context.imageAcquirer ? H.img({
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
      className: "img-rounded",
      onClick: this.handleAdd,
      style: {
        maxHeight: 100,
        verticalAlign: "top"
      }
    }) : H.div({
      className: "text-muted"
    }, this.context.T("No images present")));
  };

  AquagenxCBTAnswerComponent.prototype.renderAquagenxCBT = function() {
    var ref;
    return H.div(null, this.state.aquagenxModal, ((ref = this.props.value) != null ? ref.cbt : void 0) == null ? H.div(null, H.button({
      className: 'btn btn-default',
      onClick: this.handleEditClick
    }, this.context.T('Record'))) : H.div(null, R(AquagenxCBTDisplayComponent, {
      value: this.props.value,
      questionId: this.props.questionId,
      onEdit: this.handleEditClick
    }), H.div(null, H.button({
      className: 'btn btn-default',
      onClick: this.handleEditClick
    }, H.span({
      className: "glyphicon glyphicon-edit"
    }), " ", this.context.T('Edit')), H.button({
      className: 'btn btn-default',
      onClick: this.handleClearClick,
      style: {
        marginLeft: '12px'
      }
    }, H.span({
      className: "glyphicon glyphicon-remove"
    }), " ", this.context.T('Clear')))));
  };

  AquagenxCBTAnswerComponent.prototype.render = function() {
    return H.div(null, this.renderAquagenxCBT(), H.br(), this.renderImage());
  };

  return AquagenxCBTAnswerComponent;

})(React.Component);
