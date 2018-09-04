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

var H, ImagelistEditorComponent, ImagesAnswerComponent, PropTypes, R, React;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

ImagesAnswerComponent = require('./answers/ImagesAnswerComponent');

// Edit an image list
module.exports = ImagelistEditorComponent = function () {
  var ImagelistEditorComponent = function (_React$Component) {
    (0, _inherits3.default)(ImagelistEditorComponent, _React$Component);

    function ImagelistEditorComponent() {
      (0, _classCallCheck3.default)(this, ImagelistEditorComponent);
      return (0, _possibleConstructorReturn3.default)(this, (ImagelistEditorComponent.__proto__ || (0, _getPrototypeOf2.default)(ImagelistEditorComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(ImagelistEditorComponent, [{
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