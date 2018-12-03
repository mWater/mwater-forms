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

var AsyncLoadComponent,
    ImageThumbnailComponent,
    PropTypes,
    R,
    React,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Displays a thumbnail of an image
module.exports = ImageThumbnailComponent = function () {
  var ImageThumbnailComponent = function (_AsyncLoadComponent) {
    (0, _inherits3.default)(ImageThumbnailComponent, _AsyncLoadComponent);

    function ImageThumbnailComponent() {
      (0, _classCallCheck3.default)(this, ImageThumbnailComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (ImageThumbnailComponent.__proto__ || (0, _getPrototypeOf2.default)(ImageThumbnailComponent)).apply(this, arguments));

      _this.handleError = _this.handleError.bind(_this);
      return _this;
    }

    // Override to determine if a load is needed. Not called on mounting


    (0, _createClass3.default)(ImageThumbnailComponent, [{
      key: 'isLoadNeeded',
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.imageId !== oldProps.imageId;
      }

      // Call callback with state changes

    }, {
      key: 'load',
      value: function load(props, prevProps, callback) {
        return props.imageManager.getImageUrl(props.imageId, function (url) {
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
      key: 'handleError',
      value: function handleError() {
        boundMethodCheck(this, ImageThumbnailComponent);
        return this.setState({
          error: true
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var url;
        if (this.state.loading) {
          // TODO better as font-awesome or suchlike
          url = "img/image-loading.png";
        } else if (this.state.error) {
          // TODO better as font-awesome or suchlike
          url = "img/no-image-icon.jpg";
        } else if (this.state.url) {
          url = this.state.url;
        }
        return R('img', {
          src: url,
          style: {
            maxHeight: 100
          },
          className: "img-thumbnail",
          onClick: this.props.onClick,
          onError: this.handleError
        });
      }
    }]);
    return ImageThumbnailComponent;
  }(AsyncLoadComponent);

  ;

  ImageThumbnailComponent.propTypes = {
    imageManager: PropTypes.object.isRequired,
    imageId: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  return ImageThumbnailComponent;
}.call(undefined);