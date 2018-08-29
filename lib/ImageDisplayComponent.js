'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    ImageDisplayComponent,
    ImagePopupComponent,
    PropTypes,
    React,
    RotationAwareImageComponent,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

ImagePopupComponent = require('./ImagePopupComponent');

RotationAwareImageComponent = require('./RotationAwareImageComponent');

// Displays an image
module.exports = ImageDisplayComponent = function () {
  var ImageDisplayComponent = function (_React$Component) {
    _inherits(ImageDisplayComponent, _React$Component);

    function ImageDisplayComponent(props) {
      _classCallCheck(this, ImageDisplayComponent);

      var _this = _possibleConstructorReturn(this, (ImageDisplayComponent.__proto__ || Object.getPrototypeOf(ImageDisplayComponent)).call(this, props));

      _this.handleImgError = _this.handleImgError.bind(_this);
      _this.handleImgClick = _this.handleImgClick.bind(_this);
      _this.state = {
        error: false,
        url: null,
        popup: false
      };
      return _this;
    }

    _createClass(ImageDisplayComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        return this.update(this.props);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(newProps) {
        return this.update(newProps);
      }
    }, {
      key: 'update',
      value: function update(props) {
        var _this2 = this;

        // Get URL of thumbnail
        return props.imageManager.getImageThumbnailUrl(props.image.id, function (url) {
          return _this2.setState({
            url: url,
            error: false
          });
        }, function () {
          return _this2.setState({
            error: true
          });
        });
      }
    }, {
      key: 'handleImgError',
      value: function handleImgError() {
        boundMethodCheck(this, ImageDisplayComponent);
        return this.setState({
          error: true
        });
      }
    }, {
      key: 'handleImgClick',
      value: function handleImgClick() {
        boundMethodCheck(this, ImageDisplayComponent);
        return this.setState({
          popup: true
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var src;
        if (this.state.error) {
          src = "img/no-image-icon.jpg";
        } else if (this.state.url) {
          src = this.state.url;
        } else {
          src = "img/image-loading.png";
        }
        return H.span(null, React.createElement(RotationAwareImageComponent, {
          image: this.props.image,
          imageManager: this.props.imageManager,
          onClick: this.handleImgClick,
          height: 100,
          thumbnail: true
        }), this.state.popup ? React.createElement(ImagePopupComponent, {
          imageManager: this.props.imageManager,
          image: this.props.image,
          onClose: function onClose() {
            return _this3.setState({
              popup: false
            });
          },
          T: this.props.T
        }) : void 0);
      }
    }]);

    return ImageDisplayComponent;
  }(React.Component);

  ;

  ImageDisplayComponent.propTypes = {
    image: PropTypes.object.isRequired, // Image object to display
    imageManager: PropTypes.object.isRequired,
    T: PropTypes.func.isRequired
  };

  return ImageDisplayComponent;
}.call(undefined);