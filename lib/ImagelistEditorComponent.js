'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H, ImagelistEditorComponent, ImagesAnswerComponent, PropTypes, R, React;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

ImagesAnswerComponent = require('./answers/ImagesAnswerComponent');

// Edit an image list
module.exports = ImagelistEditorComponent = function () {
  var ImagelistEditorComponent = function (_React$Component) {
    _inherits(ImagelistEditorComponent, _React$Component);

    function ImagelistEditorComponent() {
      _classCallCheck(this, ImagelistEditorComponent);

      return _possibleConstructorReturn(this, (ImagelistEditorComponent.__proto__ || Object.getPrototypeOf(ImagelistEditorComponent)).apply(this, arguments));
    }

    _createClass(ImagelistEditorComponent, [{
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
        return R(ImagesAnswerComponent, {
          imagelist: this.props.imagelist,
          onImagelistChange: this.props.onImagelistChange
        });
      }
    }]);

    return ImagelistEditorComponent;
  }(React.Component);

  ;

  ImagelistEditorComponent.propTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    imagelist: PropTypes.array, // e.g. [{ id: someid, caption: caption }]
    onImagelistChange: PropTypes.func, // Called when image list changed
    T: PropTypes.func.isRequired // Localizer to use
  };

  ImagelistEditorComponent.childContextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use
  };

  return ImagelistEditorComponent;
}.call(undefined);