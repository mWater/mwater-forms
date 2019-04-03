"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

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
AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent'); // Displays a thumbnail of an image

module.exports = ImageThumbnailComponent = function () {
  var ImageThumbnailComponent =
  /*#__PURE__*/
  function (_AsyncLoadComponent) {
    (0, _inherits2["default"])(ImageThumbnailComponent, _AsyncLoadComponent);

    function ImageThumbnailComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, ImageThumbnailComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ImageThumbnailComponent).apply(this, arguments));
      _this.handleError = _this.handleError.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    } // Override to determine if a load is needed. Not called on mounting


    (0, _createClass2["default"])(ImageThumbnailComponent, [{
      key: "isLoadNeeded",
      value: function isLoadNeeded(newProps, oldProps) {
        return newProps.imageId !== oldProps.imageId;
      } // Call callback with state changes

    }, {
      key: "load",
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
      key: "handleError",
      value: function handleError() {
        boundMethodCheck(this, ImageThumbnailComponent);
        return this.setState({
          error: true
        });
      }
    }, {
      key: "render",
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
}.call(void 0);