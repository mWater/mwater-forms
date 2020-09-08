"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var AsyncLoadComponent, ImagePopupComponent, ModalPopupComponent, PropTypes, R, React, RotationAwareImageComponent;
PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
ModalPopupComponent = require('react-library/lib/ModalPopupComponent');
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');
RotationAwareImageComponent = require('./RotationAwareImageComponent'); // Displays an image in a popup and allows removing or setting as cover image

module.exports = ImagePopupComponent = function () {
  var ImagePopupComponent = /*#__PURE__*/function (_AsyncLoadComponent) {
    (0, _inherits2["default"])(ImagePopupComponent, _AsyncLoadComponent);

    var _super = _createSuper(ImagePopupComponent);

    function ImagePopupComponent() {
      (0, _classCallCheck2["default"])(this, ImagePopupComponent);
      return _super.apply(this, arguments);
    }

    (0, _createClass2["default"])(ImagePopupComponent, [{
      key: "isLoadNeeded",
      // Override to determine if a load is needed. Not called on mounting
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.id !== oldProps.id;
      } // Call callback with state changes

    }, {
      key: "load",
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
      key: "render",
      value: function render() {
        if (this.state.loading) {
          return R('div', {
            className: "alert alert-info"
          }, this.props.T("Loading..."));
        }

        if (this.state.error) {
          return R('div', {
            className: "alert alert-danger"
          }, this.props.T("Error"));
        }

        return React.createElement(ModalPopupComponent, {
          footer: R('button', {
            type: "button",
            className: "btn btn-default",
            onClick: this.props.onClose
          }, this.props.T("Close"))
        }, R('div', null, R('button', {
          type: "button",
          className: "close",
          onClick: this.props.onClose // Add button links

        }, "×"), R('div', null, this.props.onSetCover ? R('button', {
          type: "button",
          className: "btn btn-link",
          onClick: this.props.onSetCover
        }, this.props.T("Set as Cover Image")) : void 0, " ", this.props.onRemove ? R('button', {
          type: "button",
          className: "btn btn-link",
          onClick: this.props.onRemove
        }, this.props.T("Remove")) : void 0, " ", this.props.onRotate ? R('button', {
          type: "button",
          className: "btn btn-link",
          onClick: this.props.onRotate // Render image

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
    image: PropTypes.object.isRequired,
    // The image object
    onRemove: PropTypes.func,
    onSetCover: PropTypes.func,
    onRotate: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired // Localizer to use

  };
  return ImagePopupComponent;
}.call(void 0);