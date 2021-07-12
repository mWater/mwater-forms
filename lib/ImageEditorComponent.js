"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ImageAnswerComponent, ImageEditorComponent, PropTypes, R, React;
PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
ImageAnswerComponent = require('./answers/ImageAnswerComponent'); // Edit an image 

module.exports = ImageEditorComponent = function () {
  var ImageEditorComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(ImageEditorComponent, _React$Component);

    var _super = _createSuper(ImageEditorComponent);

    function ImageEditorComponent() {
      (0, _classCallCheck2["default"])(this, ImageEditorComponent);
      return _super.apply(this, arguments);
    }

    (0, _createClass2["default"])(ImageEditorComponent, [{
      key: "getChildContext",
      value: function getChildContext() {
        return {
          imageManager: this.props.imageManager,
          imageAcquirer: this.props.imageAcquirer,
          T: this.props.T
        };
      }
    }, {
      key: "render",
      value: function render() {
        return R(ImageAnswerComponent, {
          image: this.props.image,
          onImageChange: this.props.onImageChange,
          consentPrompt: this.props.consentPrompt
        });
      }
    }]);
    return ImageEditorComponent;
  }(React.Component);

  ;
  ImageEditorComponent.propTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    image: PropTypes.object,
    // e.g. { id: someid, caption: caption }
    onImageChange: PropTypes.func,
    // Called when image changed
    T: PropTypes.func.isRequired,
    // Localizer to use
    consentPrompt: PropTypes.string // Question to prompt for consent

  };
  ImageEditorComponent.childContextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use

  };
  return ImageEditorComponent;
}.call(void 0);