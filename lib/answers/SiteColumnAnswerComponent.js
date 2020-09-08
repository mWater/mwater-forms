"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EntityDisplayComponent,
    PropTypes,
    R,
    React,
    SiteColumnAnswerComponent,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
EntityDisplayComponent = require('../EntityDisplayComponent');
formUtils = require('../formUtils'); // Displays a site answer in a cell. No direct code entering, but stores answer as a code.

module.exports = SiteColumnAnswerComponent = function () {
  var SiteColumnAnswerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(SiteColumnAnswerComponent, _React$Component);

    var _super = _createSuper(SiteColumnAnswerComponent);

    function SiteColumnAnswerComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, SiteColumnAnswerComponent);
      _this = _super.apply(this, arguments);
      _this.handleSelectClick = _this.handleSelectClick.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleClearClick = _this.handleClearClick.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(SiteColumnAnswerComponent, [{
      key: "handleSelectClick",
      value: function handleSelectClick() {
        var _this2 = this;

        boundMethodCheck(this, SiteColumnAnswerComponent);
        return this.context.selectEntity({
          entityType: this.props.siteType,
          callback: function callback(entityId) {
            // Get entity
            return _this2.context.getEntityById(_this2.props.siteType, entityId, function (entity) {
              return _this2.props.onValueChange({
                code: entity.code
              });
            });
          }
        });
      }
    }, {
      key: "handleClearClick",
      value: function handleClearClick() {
        boundMethodCheck(this, SiteColumnAnswerComponent);
        return this.props.onValueChange(null);
      }
    }, {
      key: "render",
      value: function render() {
        var ref, ref1;

        if ((ref = this.props.value) != null ? ref.code : void 0) {
          return R('div', null, R('button', {
            className: "btn btn-link btn-sm pull-right",
            onClick: this.handleClearClick
          }, R('span', {
            className: "glyphicon glyphicon-remove"
          })), R(EntityDisplayComponent, {
            entityType: this.props.siteType,
            entityCode: (ref1 = this.props.value) != null ? ref1.code : void 0,
            getEntityByCode: this.context.getEntityByCode,
            renderEntityView: this.context.renderEntityListItemView,
            T: this.context.T
          }));
        } else {
          return R('button', {
            className: "btn btn-link",
            onClick: this.handleSelectClick
          }, this.context.T("Select..."));
        }
      }
    }]);
    return SiteColumnAnswerComponent;
  }(React.Component);

  ;
  SiteColumnAnswerComponent.contextTypes = {
    selectEntity: PropTypes.func,
    getEntityById: PropTypes.func.isRequired,
    getEntityByCode: PropTypes.func.isRequired,
    renderEntityListItemView: PropTypes.func.isRequired,
    T: PropTypes.func.isRequired // Localizer to use

  };
  SiteColumnAnswerComponent.propTypes = {
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    siteType: PropTypes.string.isRequired
  };
  return SiteColumnAnswerComponent;
}.call(void 0);