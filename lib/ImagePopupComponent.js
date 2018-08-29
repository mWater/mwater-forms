'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AsyncLoadComponent, H, ImagePopupComponent, ModalPopupComponent, PropTypes, React, RotationAwareImageComponent;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

RotationAwareImageComponent = require('./RotationAwareImageComponent');

// Displays an image in a popup and allows removing or setting as cover image
module.exports = ImagePopupComponent = function () {
  var ImagePopupComponent = function (_AsyncLoadComponent) {
    _inherits(ImagePopupComponent, _AsyncLoadComponent);

    function ImagePopupComponent() {
      _classCallCheck(this, ImagePopupComponent);

      return _possibleConstructorReturn(this, (ImagePopupComponent.__proto__ || Object.getPrototypeOf(ImagePopupComponent)).apply(this, arguments));
    }

    _createClass(ImagePopupComponent, [{
      key: 'isLoadNeeded',


      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.id !== oldProps.id;
      }

      // Call callback with state changes

    }, {
      key: 'load',
      value: function load(props, prevProps, callback) {
        return this.props.imageManager.getImageUrl(props.image.id, function (url) {
          return callback({
            url: url,
            error: false
          });
        }, function () {
          return callback({
            error: true
          });
        });
      }
    }, {
      key: 'render',
      value: function render() {
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

          // Add button links
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
          // Render image
        }, this.props.T("Rotate")) : void 0), React.createElement(RotationAwareImageComponent, {
          key: this.props.image.id,
          imageManager: this.props.imageManager,
          image: this.props.image,
          onClick: this.handleClickImage
        })));
      }
    }]);

    return ImagePopupComponent;
  }(AsyncLoadComponent);

  ;

  ImagePopupComponent.propTypes = {
    imageManager: PropTypes.object.isRequired,
    image: PropTypes.object.isRequired, // The image object
    onRemove: PropTypes.func,
    onSetCover: PropTypes.func,
    onRotate: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired // Localizer to use
  };

  return ImagePopupComponent;
}.call(undefined);