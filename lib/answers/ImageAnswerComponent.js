"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var ImageAnswerComponent,
    ImagePopupComponent,
    ImageThumbnailComponent,
    PropTypes,
    R,
    React,
    RotationAwareImageComponent,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
ImageThumbnailComponent = require('../ImageThumbnailComponent');
ImagePopupComponent = require('../ImagePopupComponent');
RotationAwareImageComponent = require('../RotationAwareImageComponent'); // Edit an image 

module.exports = ImageAnswerComponent = function () {
  var ImageAnswerComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2.default)(ImageAnswerComponent, _React$Component);

    function ImageAnswerComponent(props) {
      var _this;

      (0, _classCallCheck2.default)(this, ImageAnswerComponent);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ImageAnswerComponent).call(this, props));
      _this.handleClickImage = _this.handleClickImage.bind((0, _assertThisInitialized2.default)(_this));
      _this.handleAdd = _this.handleAdd.bind((0, _assertThisInitialized2.default)(_this));
      _this.state = {
        modalOpen: false
      };
      return _this;
    }

    (0, _createClass2.default)(ImageAnswerComponent, [{
      key: "focus",
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: "handleClickImage",
      value: function handleClickImage() {
        boundMethodCheck(this, ImageAnswerComponent);
        return this.setState({
          modalOpen: true
        });
      }
    }, {
      key: "handleAdd",
      value: function handleAdd() {
        var _this2 = this;

        boundMethodCheck(this, ImageAnswerComponent); // Check consent

        if (this.props.consentPrompt) {
          if (!confirm(this.props.consentPrompt)) {
            return;
          }
        } // Call imageAcquirer


        return this.context.imageAcquirer.acquire(function (id) {
          var rotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          // Add to model
          return _this2.props.onImageChange({
            id: id,
            rotation: rotation
          });
        }, function (err) {
          return alert(err);
        });
      }
    }, {
      key: "renderModal",
      value: function renderModal() {
        var _this3 = this;

        if (!this.state.modalOpen) {
          return null;
        }

        return React.createElement(ImagePopupComponent, {
          imageManager: this.context.imageManager,
          image: this.props.image,
          T: this.context.T,
          onRemove: function onRemove() {
            _this3.setState({
              modalOpen: false
            });

            return _this3.props.onImageChange(null);
          },
          onClose: function onClose() {
            return _this3.setState({
              modalOpen: false
            });
          },
          onRotate: function onRotate() {
            var image;
            image = _.extend({}, _this3.props.image, {
              rotation: ((_this3.props.image.rotation || 0) + 90) % 360
            });
            return _this3.props.onImageChange(image);
          }
        });
      }
    }, {
      key: "render",
      value: function render() {
        return R('div', null, this.renderModal(), this.props.image ? React.createElement(RotationAwareImageComponent, {
          key: this.props.image.id,
          imageManager: this.context.imageManager,
          image: this.props.image,
          thumbnail: true,
          onClick: this.handleClickImage
        }) : this.props.onImageChange && this.context.imageAcquirer ? R('img', {
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
          className: "img-rounded",
          onClick: this.handleAdd,
          style: {
            maxHeight: 100,
            verticalAlign: "top"
          }
        }) : R('div', {
          className: "text-muted"
        }, this.context.T("No images present")));
      }
    }]);
    return ImageAnswerComponent;
  }(React.Component);

  ;
  ImageAnswerComponent.contextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use

  };
  ImageAnswerComponent.propTypes = {
    image: PropTypes.object,
    // e.g. { id: someid, caption: caption }
    onImageChange: PropTypes.func,
    // Called when image changed
    consentPrompt: PropTypes.string // Question to prompt for consent

  };
  return ImageAnswerComponent;
}.call(void 0);