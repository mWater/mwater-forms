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

var AquagenxCBTAnswerComponent,
    AquagenxCBTDisplayComponent,
    AquagenxCBTPopupComponent,
    H,
    ImagePopupComponent,
    ImageThumbnailComponent,
    PropTypes,
    R,
    React,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

ImageThumbnailComponent = require('../ImageThumbnailComponent');

ImagePopupComponent = require('../ImagePopupComponent');

AquagenxCBTPopupComponent = require('./AquagenxCBTPopupComponent');

AquagenxCBTDisplayComponent = require('./AquagenxCBTDisplayComponent');

// Based on https://www.aquagenx.com/wp-content/uploads/2013/12/Aquagenx-CBT-Instructions-v3.pdf
module.exports = AquagenxCBTAnswerComponent = function () {
  var AquagenxCBTAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(AquagenxCBTAnswerComponent, _React$Component);

    function AquagenxCBTAnswerComponent(props) {
      (0, _classCallCheck3.default)(this, AquagenxCBTAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (AquagenxCBTAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(AquagenxCBTAnswerComponent)).call(this, props));

      _this.handleClickImage = _this.handleClickImage.bind(_this);
      _this.handleAdd = _this.handleAdd.bind(_this);
      _this.handleEditClick = _this.handleEditClick.bind(_this);
      _this.handleClearClick = _this.handleClearClick.bind(_this);
      _this.state = {
        imageModal: null,
        aquagenxModal: null
      };
      return _this;
    }

    (0, _createClass3.default)(AquagenxCBTAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        return null;
      }
    }, {
      key: 'handleClickImage',
      value: function handleClickImage() {
        var _this2 = this;

        var modal;
        boundMethodCheck(this, AquagenxCBTAnswerComponent);
        modal = React.createElement(ImagePopupComponent, {
          imageManager: this.context.imageManager,
          image: this.props.value.image,
          T: this.context.T,
          onRemove: function onRemove() {
            var value;
            _this2.setState({
              imageModal: null
            });
            value = _.clone(_this2.props.value);
            value.image = null;
            return _this2.props.onValueChange(value);
          },
          onClose: function onClose() {
            return _this2.setState({
              imageModal: null
            });
          },
          onRotate: function onRotate() {
            var value;
            value = _.clone(_this2.props.value);
            value.image = _.extend({}, value.image, {
              rotation: ((value.image.rotation || 0) + 90) % 360
            });
            return _this2.props.onValueChange(value);
          }
        });
        return this.setState({
          imageModal: modal
        });
      }
    }, {
      key: 'handleAdd',
      value: function handleAdd() {
        var _this3 = this;

        boundMethodCheck(this, AquagenxCBTAnswerComponent);
        // Call imageAcquirer
        return this.context.imageAcquirer.acquire(function (id) {
          var value;
          // Add to model
          value = _.clone(_this3.props.value);
          value.image = {
            id: id
          };
          return _this3.props.onValueChange(value);
        }, function (err) {
          throw err;
        });
      }
    }, {
      key: 'handleEditClick',
      value: function handleEditClick() {
        var _this4 = this;

        var modal;
        boundMethodCheck(this, AquagenxCBTAnswerComponent);
        modal = React.createElement(AquagenxCBTPopupComponent, {
          value: this.props.value,
          questionId: this.props.questionId,
          onSave: function onSave(value) {
            _this4.setState({
              aquagenxModal: null
            });
            return _this4.props.onValueChange(value);
          },
          onClose: function onClose() {
            return _this4.setState({
              aquagenxModal: null
            });
          }
        });
        return this.setState({
          aquagenxModal: modal
        });
      }
    }, {
      key: 'handleClearClick',
      value: function handleClearClick() {
        var value;
        boundMethodCheck(this, AquagenxCBTAnswerComponent);
        value = _.clone(this.props.value);
        value.cbt = null;
        return this.props.onValueChange(value);
      }
    }, {
      key: 'renderImage',
      value: function renderImage() {
        var ref;
        return H.div(null, this.state.imageModal, ((ref = this.props.value) != null ? ref.image : void 0) ? React.createElement(ImageThumbnailComponent, {
          imageId: this.props.value.image.id,
          onClick: this.handleClickImage,
          imageManager: this.context.imageManager
        }) : this.props.onValueChange && this.context.imageAcquirer ? H.img({
          src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFzAgMAAABtAbdzAAAACVBMVEUAAQBsbmz7//tn1+0/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3woHEjIHlG2SjgAAAxhJREFUeNrt3Mt1pjAMBWA2U8J0NnjhEtyPS/DCrjKbnDn/AUt+cK0AuSxD4APkBCwktt1g2YgQIUKEiCXyb9v+EiFChAgRIkSIECFC5JHIdlz+ECFC5L0I/0ESIUKECBEivxYJ5WNJRIgQeT5ynFAQIfISpICXWEE8GskVpMCXM+LwSDwhHo/kFyOhrIw8ESJEiBAhQoQIkXsiqX8KMI2MzGZmkf+b+XXIx7zGr0KiOInFIYfp8BrkMG/2K5DTvH4FckoBeDxSSVDgkUo2w6ORaqYFjVQTMx6L5CrisIiQl8IiQiLLI5EsIA6JiFk8JCIm/jwOySLicIiS88QhUUYCDFGysR6F5MP1yX1BGUPS6cC7gjKGxPNx9wRlDKkcdu4IyhCSa0ed2kEZQur7awdlDgnVn2KQWL8wzcgPIUKIUyvyU4gwHhwCEXeGRJJ07VMj8iNIlPaVG5GfQJy4FwQiD6KoD68JRB4SACQrY0gfXgNIUg5XH14gJKKQqPxCUjceR7R4XUfU4KrDaxjx2mleRnIH4kBI0IYeClHXXkZSB7JjkMaN6SoS7RCvrw5rkQRBukLm1yIZiJTnI7lrzuYeg/jGU9kTkNSF7I9Bms/8RAyR2IcEAFJ+GMlEiBAhQmQ1svh+wnv8XZH3PKYuRt420zJBWrPfi4jlPD78KJKeg9wh34VBunKQGMQkm7oY6clwoxCTXP1axPL9yT5xmjd9pxVG1828AnQKUlDIPhqvmdeyyrtfh0OCeLUAiFKlsONelVtWFsg1EggkNao9IIUY2bJu5RjgiETKrtcSYcp8ol4VFSCIbX3Xykq1rNbcgZCya9WDoMK+z6pRd9weVqKYjhWvfRWwF8pG+2t5b1gAa1PKa1KUbFJeXWau1j1L3k2K903aEGwaKkxaQ0yaXGzadUwaj2qnEuBItmgGs2lrM2nQs2k1NGmatGn/tGlktWnJ/f5zGTxtNnwTIULkyQi/RNb3SLDuE3QmyH5GTL7YZ/LtwaULESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiNwS+QJpMQICAeI7BAAAAABJRU5ErkJggg==",
          className: "img-rounded",
          onClick: this.handleAdd,
          style: {
            maxHeight: 100,
            verticalAlign: "top"
          }
        }) : H.div({
          className: "text-muted"
        }, this.context.T("No images present")));
      }
    }, {
      key: 'renderAquagenxCBT',
      value: function renderAquagenxCBT() {
        var ref;
        return H.div(null, this.state.aquagenxModal, ((ref = this.props.value) != null ? ref.cbt : void 0) == null ? H.div(null, H.button({
          className: 'btn btn-default',
          onClick: this.handleEditClick
        }, this.context.T('Record'))) : H.div(null, R(AquagenxCBTDisplayComponent, {
          value: this.props.value,
          questionId: this.props.questionId,
          onEdit: this.handleEditClick
        }), H.div(null, H.button({
          className: 'btn btn-default',
          onClick: this.handleEditClick
        }, H.span({
          className: "glyphicon glyphicon-edit"
        }), " ", this.context.T('Edit')), H.button({
          className: 'btn btn-default',
          onClick: this.handleClearClick,
          style: {
            marginLeft: '12px'
          }
        }, H.span({
          className: "glyphicon glyphicon-remove"
        }), " ", this.context.T('Clear')))));
      }
    }, {
      key: 'render',
      value: function render() {
        return H.div(null, this.renderAquagenxCBT(), H.br(), this.renderImage());
      }
    }]);
    return AquagenxCBTAnswerComponent;
  }(React.Component);

  ;

  AquagenxCBTAnswerComponent.contextTypes = {
    imageManager: PropTypes.object.isRequired,
    imageAcquirer: PropTypes.object,
    T: PropTypes.func.isRequired // Localizer to use
  };

  AquagenxCBTAnswerComponent.propTypes = {
    // Value contains two entries: image and cbt
    // The cbt data contain c1,c2,c3,c4,c5 (All booleans) + healthRisk(String) + mpn (Number) + confidence(Number)
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    questionId: PropTypes.string.isRequired
  };

  AquagenxCBTAnswerComponent.defaultProps = {
    value: {
      image: null,
      cbt: null
    }
  };

  return AquagenxCBTAnswerComponent;
}.call(undefined);