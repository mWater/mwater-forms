'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H, ImageAnswerComponent, ImageEditorComponent, PropTypes, R, React;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

ImageAnswerComponent = require('./answers/ImageAnswerComponent');

// Edit an image 
module.exports = ImageEditorComponent = function () {
  var ImageEditorComponent = function (_React$Component) {
    _inherits(ImageEditorComponent, _React$Component);

    function ImageEditorComponent() {
      _classCallCheck(this, ImageEditorComponent);

      return _possibleConstructorReturn(this, (ImageEditorComponent.__proto__ || Object.getPrototypeOf(ImageEditorComponent)).apply(this, arguments));
    }

    _createClass(ImageEditorComponent, [{
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