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
    (0, _inherits3.default)(ImagePopupComponent, _AsyncLoadComponent);

    function ImagePopupComponent() {
      (0, _classCallCheck3.default)(this, ImagePopupComponent);
      return (0, _possibleConstructorReturn3.default)(this, (ImagePopupComponent.__proto__ || (0, _getPrototypeOf2.default)(ImagePopupComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(ImagePopupComponent, [{
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