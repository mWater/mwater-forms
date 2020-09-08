"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var LikertAnswerComponent,
    PropTypes,
    R,
    React,
    _,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

_ = require('lodash');
PropTypes = require('prop-types');
React = require('react');
R = React.createElement;
formUtils = require('../formUtils');

module.exports = LikertAnswerComponent = function () {
  var _LikertAnswerComponen;

  var LikertAnswerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(LikertAnswerComponent, _React$Component);

    var _super = _createSuper(LikertAnswerComponent);

    function LikertAnswerComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, LikertAnswerComponent);
      _this = _super.apply(this, arguments);
      _this.handleValueChange = _this.handleValueChange.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(LikertAnswerComponent, [{
      key: "focus",
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: "handleValueChange",
      value: function handleValueChange(choice, item) {
        var newValue;
        boundMethodCheck(this, LikertAnswerComponent);

        if (this.props.answer.value != null) {
          newValue = _.clone(this.props.answer.value);
        } else {
          newValue = {};
        }

        if (newValue[item.id] === choice.id) {
          delete newValue[item.id];
        } else {
          newValue[item.id] = choice.id;
        }

        return this.props.onAnswerChange(_.extend({}, this.props.answer, {
          value: newValue
        }));
      }
    }, {
      key: "renderChoice",
      value: function renderChoice(item, choice) {
        var id, value;
        id = "".concat(item.id, ":").concat(choice.id);

        if (this.props.answer.value != null) {
          value = this.props.answer.value[item.id];
        } else {
          value = null;
        }

        return R('td', {
          key: id // id is used for testing

        }, R('div', {
          className: "touch-radio ".concat(value === choice.id ? "checked" : ""),
          id: id,
          onClick: this.handleValueChange.bind(null, choice, item)
        }, formUtils.localizeString(choice.label, this.context.locale)));
      } // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
      //renderChoiceLabel: (choice) ->
      //  R 'td', key: "label#{choice.id}",
      //    formUtils.localizeString(choice.label, @context.locale)

    }, {
      key: "renderItem",
      value: function renderItem(item) {
        var _this2 = this;

        return R('tr', null, R('td', null, R('b', null, formUtils.localizeString(item.label, this.context.locale)), item.hint ? R('div', null, R('span', {
          className: "",
          style: {
            color: '#888'
          }
        }, formUtils.localizeString(item.hint, this.context.locale))) : void 0), _.map(this.props.choices, function (choice) {
          return _this2.renderChoice(item, choice);
        }));
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        return R('table', {
          className: "",
          style: {
            width: '100%'
          } // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
          //R 'thead', null,
          //  R 'tr', null,
          //    R('td'),
          //    _.map @props.choices, (choice) =>
          //      @renderChoiceLabel(choice)

        }, R('tbody', null, _.map(this.props.items, function (item) {
          return _this3.renderItem(item);
        })));
      }
    }]);
    return LikertAnswerComponent;
  }(React.Component);

  ;
  LikertAnswerComponent.contextTypes = {
    locale: PropTypes.string // Current locale (e.g. "en")

  };
  LikertAnswerComponent.propTypes = (_LikertAnswerComponen = {
    choices: PropTypes.arrayOf(PropTypes.shape({
      // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: PropTypes.string.isRequired,
      // Label of the choice, localized
      label: PropTypes.object.isRequired,
      // Hint associated with a choice
      hint: PropTypes.object
    })).isRequired
  }, (0, _defineProperty2["default"])(_LikertAnswerComponen, "choices", PropTypes.arrayOf(PropTypes.shape({
    // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
    id: PropTypes.string.isRequired,
    // Label of the choice, localized
    label: PropTypes.object.isRequired,
    // Hint associated with a choice
    hint: PropTypes.object
  })).isRequired), (0, _defineProperty2["default"])(_LikertAnswerComponen, "onAnswerChange", PropTypes.func.isRequired), (0, _defineProperty2["default"])(_LikertAnswerComponen, "answer", PropTypes.object.isRequired), (0, _defineProperty2["default"])(_LikertAnswerComponen, "data", PropTypes.object.isRequired), _LikertAnswerComponen);
  return LikertAnswerComponent;
}.call(void 0);