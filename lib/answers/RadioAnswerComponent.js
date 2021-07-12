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

var PropTypes,
    R,
    RadioAnswerComponent,
    React,
    _,
    conditionUtils,
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
conditionUtils = require('../conditionUtils');

module.exports = RadioAnswerComponent = function () {
  var RadioAnswerComponent = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2["default"])(RadioAnswerComponent, _React$Component);

    var _super = _createSuper(RadioAnswerComponent);

    function RadioAnswerComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, RadioAnswerComponent);
      _this = _super.apply(this, arguments);
      _this.handleValueChange = _this.handleValueChange.bind((0, _assertThisInitialized2["default"])(_this));
      _this.handleSpecifyChange = _this.handleSpecifyChange.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(RadioAnswerComponent, [{
      key: "focus",
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: "handleValueChange",
      value: function handleValueChange(choice) {
        boundMethodCheck(this, RadioAnswerComponent);

        if (choice.id === this.props.answer.value) {
          return this.props.onAnswerChange({
            value: null,
            specify: null
          });
        } else {
          return this.props.onAnswerChange({
            value: choice.id,
            specify: null
          });
        }
      }
    }, {
      key: "handleSpecifyChange",
      value: function handleSpecifyChange(id, ev) {
        var change, specify;
        boundMethodCheck(this, RadioAnswerComponent);
        change = {};
        change[id] = ev.target.value;
        specify = _.extend({}, this.props.answer.specify, change);
        return this.props.onAnswerChange({
          value: this.props.answer.value,
          specify: specify
        });
      } // Render specify input box

    }, {
      key: "renderSpecify",
      value: function renderSpecify(choice) {
        var value;

        if (this.props.answer.specify != null) {
          value = this.props.answer.specify[choice.id];
        } else {
          value = '';
        }

        return R('input', {
          className: "form-control specify-input",
          type: "text",
          value: value,
          onChange: this.handleSpecifyChange.bind(null, choice.id)
        });
      }
    }, {
      key: "areConditionsValid",
      value: function areConditionsValid(choice) {
        if (choice.conditions == null) {
          return true;
        }

        return conditionUtils.compileConditions(choice.conditions)(this.props.data);
      } // Render general specify input box (without choice specified)

    }, {
      key: "renderGeneralSpecify",
      value: function renderGeneralSpecify() {
        var choice, value;
        choice = _.findWhere(this.props.choices, {
          id: this.props.answer.value
        });

        if (choice && choice.specify && this.props.answer.specify != null) {
          value = this.props.answer.specify[choice.id];
        } else {
          value = '';
        }

        if (choice && choice.specify) {
          return R('input', {
            className: "form-control specify-input",
            type: "text",
            value: value,
            onChange: this.handleSpecifyChange.bind(null, choice.id)
          });
        }
      }
    }, {
      key: "renderVerticalChoice",
      value: function renderVerticalChoice(choice) {
        if (this.areConditionsValid(choice)) {
          return R('div', {
            key: choice.id // id is used for testing

          }, R('div', {
            className: "touch-radio ".concat(this.props.answer.value === choice.id ? "checked" : ""),
            id: choice.id,
            onClick: this.handleValueChange.bind(null, choice)
          }, formUtils.localizeString(choice.label, this.context.locale), choice.hint ? R('span', {
            className: "radio-choice-hint"
          }, " " + formUtils.localizeString(choice.hint, this.context.locale)) : void 0), choice.specify && this.props.answer.value === choice.id ? this.renderSpecify(choice) : void 0);
        }
      }
    }, {
      key: "renderAsVertical",
      value: function renderAsVertical() {
        var _this2 = this;

        return R('div', {
          className: "touch-radio-group"
        }, _.map(this.props.choices, function (choice) {
          return _this2.renderVerticalChoice(choice);
        }));
      } // Render as toggle

    }, {
      key: "renderAsToggle",
      value: function renderAsToggle() {
        var _this3 = this;

        return R('div', null, R('div', {
          className: 'btn-group',
          key: "toggle"
        }, _.map(this.props.choices, function (choice) {
          var text;

          if (_this3.areConditionsValid(choice)) {
            text = formUtils.localizeString(choice.label, _this3.context.locale);

            if (choice.hint) {
              text += " (" + formUtils.localizeString(choice.hint, _this3.context.locale) + ")";
            }

            return R('button', {
              key: choice.id,
              type: "button",
              onClick: function onClick() {
                return _this3.props.onAnswerChange({
                  value: choice.id === _this3.props.answer.value ? null : choice.id,
                  specify: null
                });
              },
              className: _this3.props.answer.value === choice.id ? "btn btn-primary active" : "btn btn-default"
            }, text);
          }
        })), this.renderGeneralSpecify());
      }
    }, {
      key: "render",
      value: function render() {
        if ((this.props.displayMode || "vertical") === "vertical") {
          return this.renderAsVertical();
        } else if (this.props.displayMode === "toggle") {
          return this.renderAsToggle();
        }

        return null;
      }
    }]);
    return RadioAnswerComponent;
  }(React.Component);

  ;
  RadioAnswerComponent.contextTypes = {
    locale: PropTypes.string // Current locale (e.g. "en")

  };
  RadioAnswerComponent.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.shape({
      // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: PropTypes.string.isRequired,
      // Label of the choice, localized
      label: PropTypes.object.isRequired,
      // Hint associated with a choice
      hint: PropTypes.object,
      // True to require a text field to specify the value when selected
      // Usually used for "Other" options.
      // Value is stored in specify[id]
      specify: PropTypes.bool
    })).isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    answer: PropTypes.object.isRequired,
    // See answer format
    data: PropTypes.object.isRequired
  };
  return RadioAnswerComponent;
}.call(void 0);