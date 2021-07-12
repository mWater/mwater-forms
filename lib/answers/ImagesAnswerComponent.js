"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ImagePopupComponent,
    ImagesAnswerComponent,
    PropTypes,
    R,
    React,
    RotationAwareImageComponent,
    _,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
RotationAwareImageComponent = require('../RotationAwareImageComponent');
ImagePopupComponent = require('../ImagePopupComponent'); // Edit an image 

module.exports = ImagesAnswerComponent = function () {
  var ImagesAnswerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(ImagesAnswerComponent, _React$Component);

    var _super = _createSuper(ImagesAnswerComponent);

    function ImagesAnswerComponent(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, ImagesAnswerComponent);
      _this = _super.call(this, props);
      _this.handleAdd = _this.handleAdd.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleClickImage = _this.handleClickImage.bind((0, _assertThisInitialized2["default"])(_this));
      _this.state = {
        modalImageId: null // Image id of modal. null if not open

      };
      return _this;
    }

    (0, _createClass2["default"])(ImagesAnswerComponent, [{
      key: "focus",
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: "handleAdd",
      value: function handleAdd() {
        var _this2 = this;

        boundMethodCheck(this, ImagesAnswerComponent); // Check consent

        if (this.props.consentPrompt) {
          if (!confirm(this.props.consentPrompt)) {
            return;
          }
        } // Call imageAcquirer


        return this.context.imageAcquirer.acquire(function (id) {
          var rotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var imagelist; // Add to image list

          imagelist = _this2.props.imagelist || [];
          imagelist = imagelist.slice();
          imagelist.push({
            id: id,
            cover: imagelist.length === 0,
            rotation: rotation
          });
          return _this2.props.onImagelistChange(imagelist);
        }, function (err) {
          return alert(err);
        });
      }
    }, {
      key: "handleClickImage",
      value: function handleClickImage(id) {
        boundMethodCheck(this, ImagesAnswerComponent);
        return this.setState({
          modalImageId: id
        });
      }
    }, {
      key: "renderModal",
      value: function renderModal() {
        var _this3 = this;

        var id, onRemove, onRotate, onSetCover;

        if (!this.state.modalImageId) {
          return null;
        }

        id = this.state.modalImageId;

        if (this.props.onImagelistChange) {
          onRemove = function onRemove() {
            var imagelist;

            _this3.setState({
              modalImageId: null
            }); // Remove from list


            imagelist = _.filter(_this3.props.imagelist || [], function (image) {
              return image.id !== id;
            });
            return _this3.props.onImagelistChange(imagelist);
          }; // TODO: SurveyorPro: only onSetCover if not already cover


          onSetCover = function onSetCover() {
            var imagelist;

            _this3.setState({
              modalImageId: null
            }); // Remove from list


            imagelist = _.map(_this3.props.imagelist || [], function (image) {
              return _.extend({}, image, {
                cover: image.id === id
              });
            });
            return _this3.props.onImagelistChange(imagelist);
          };

          onRotate = function onRotate() {
            var imagelist;
            imagelist = _.map(_this3.props.imagelist || [], function (image) {
              if (image.id === id) {
                return _.extend({}, image, {
                  rotation: ((image.rotation || 0) + 90) % 360
                });
              } else {
                return image;
              }
            });
            return _this3.props.onImagelistChange(imagelist);
          };
        }

        return React.createElement(ImagePopupComponent, {
          imageManager: this.context.imageManager,
          image: _.find(this.props.imagelist, {
            id: id
          }),
          T: this.context.T,
          onRemove: onRemove,
          onSetCover: onSetCover,
          onRotate: onRotate,
          onClose: function onClose() {
            return _this3.setState({
              modalImageId: null
            });
          }
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this4 = this;

        return R('div', null, this.renderModal(), _.map(this.props.imagelist, function (image) {
          return React.createElement(RotationAwareImageComponent, {
            key: image.id,
            imageManager: _this4.context.imageManager,
            image: image,
            thumbnail: true,
            onClick: _this4.handleClickImage.bind(null, image.id)
          });
        }), this.props.onImagelistChange && this.context.imageAcquirer ? R('img', {
          // If can add
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
          className: "img-rounded",
          onClick: this.handleAdd,
          style: {
            maxHeight: 100,
            verticalAlign: "top"
          }
        }) : void 0);
      }
    }]);
    return ImagesAnswerComponent;
  }(React.Component);

  ;
  ImagesAnswerComponent.contextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use

  };
  ImagesAnswerComponent.propTypes = {
    imagelist: PropTypes.array,
    // array of { id: someid, caption: caption, cover: true/false }
    onImagelistChange: PropTypes.func,
    // Called when image list changed
    consentPrompt: PropTypes.string // Question to prompt for consent

  };
  return ImagesAnswerComponent;
}.call(void 0);