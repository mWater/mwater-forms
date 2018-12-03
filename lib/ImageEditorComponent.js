'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageAnswerComponent, ImageEditorComponent, PropTypes, R, React;

PropTypes = require('prop-types');

React = require('react');

R = React.createElement;

ImageAnswerComponent = require('./answers/ImageAnswerComponent');

// Edit an image 
module.exports = ImageEditorComponent = function () {
  var ImageEditorComponent = function (_React$Component) {
    (0, _inherits3.default)(ImageEditorComponent, _React$Component);

    function ImageEditorComponent() {
      (0, _classCallCheck3.default)(this, ImageEditorComponent);
      return (0, _possibleConstructorReturn3.default)(this, (ImageEditorComponent.__proto__ || (0, _getPrototypeOf2.default)(ImageEditorComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(ImageEditorComponent, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          imageManager: this.props.imageManager,
          imageAcquirer: this.props.imageAcquirer,
          T: this.props.T
        };
      }
    }, {
      key: 'render',
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
    image: PropTypes.object, // e.g. { id: someid, caption: caption }
    onImageChange: PropTypes.func, // Called when image changed
    T: PropTypes.func.isRequired, // Localizer to use
    consentPrompt: PropTypes.string // Question to prompt for consent
  };

  ImageEditorComponent.childContextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use
  };

  return ImageEditorComponent;
}.call(undefined);