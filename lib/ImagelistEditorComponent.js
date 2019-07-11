"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var ImagelistEditorComponent, ImagesAnswerComponent, PropTypes, R, React;
PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
ImagesAnswerComponent = require('./answers/ImagesAnswerComponent'); // Edit an image list

module.exports = ImagelistEditorComponent = function () {
  var ImagelistEditorComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(ImagelistEditorComponent, _React$Component);

    function ImagelistEditorComponent() {
      (0, _classCallCheck2["default"])(this, ImagelistEditorComponent);
      return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ImagelistEditorComponent).apply(this, arguments));
    }

    (0, _createClass2["default"])(ImagelistEditorComponent, [{
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
        return R(ImagesAnswerComponent, {
          imagelist: this.props.imagelist,
          onImagelistChange: this.props.onImagelistChange,
          consentPrompt: this.props.consentPrompt
        });
      }
    }]);
    return ImagelistEditorComponent;
  }(React.Component);

  ;
  ImagelistEditorComponent.propTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    imagelist: PropTypes.array,
    // e.g. [{ id: someid, caption: caption }]
    onImagelistChange: PropTypes.func,
    // Called when image list changed
    T: PropTypes.func.isRequired,
    // Localizer to use
    consentPrompt: PropTypes.string // Question to prompt for consent

  };
  ImagelistEditorComponent.childContextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use

  };
  return ImagelistEditorComponent;
}.call(void 0);