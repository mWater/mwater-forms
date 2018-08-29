'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AsyncLoadComponent,
    H,
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

H = React.DOM;

R = React.createElement;

AsyncLoadComponent = require('react-library/lib/AsyncLoadComponent');

// Displays a thumbnail of an image
module.exports = ImageThumbnailComponent = function () {
  var ImageThumbnailComponent = function (_AsyncLoadComponent) {
    _inherits(ImageThumbnailComponent, _AsyncLoadComponent);

    function ImageThumbnailComponent() {
      _classCallCheck(this, ImageThumbnailComponent);

      var _this = _possibleConstructorReturn(this, (ImageThumbnailComponent.__proto__ || Object.getPrototypeOf(ImageThumbnailComponent)).apply(this, arguments));

      _this.handleError = _this.handleError.bind(_this);
      return _this;
    }

    // Override to determine if a load is needed. Not called on mounting


    _createClass(ImageThumbnailComponent, [{
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
        return H.img({
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