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

var H,
    PropTypes,
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

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

conditionUtils = require('../conditionUtils');

module.exports = RadioAnswerComponent = function () {
  var RadioAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(RadioAnswerComponent, _React$Component);

    function RadioAnswerComponent() {
      (0, _classCallCheck3.default)(this, RadioAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (RadioAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(RadioAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      _this.handleSpecifyChange = _this.handleSpecifyChange.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(RadioAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: 'handleValueChange',
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
      key: 'handleSpecifyChange',
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
      }

      // Render specify input box

    }, {
      key: 'renderSpecify',
      value: function renderSpecify(choice) {
        var value;
        if (this.props.answer.specify != null) {
          value = this.props.answer.specify[choice.id];
        } else {
          value = '';
        }
        return H.input({
          className: "form-control specify-input",
          type: "text",
          value: value,
          onChange: this.handleSpecifyChange.bind(null, choice.id)
        });
      }
    }, {
      key: 'areConditionsValid',
      value: function areConditionsValid(choice) {
        if (choice.conditions == null) {
          return true;
        }
        return conditionUtils.compileConditions(choice.conditions)(this.props.data);
      }
    }, {
      key: 'renderChoice',
      value: function renderChoice(choice) {
        if (this.areConditionsValid(choice)) {
          return H.div({
            key: choice.id
            // id is used for testing
          }, H.div({
            className: 'touch-radio ' + (this.props.answer.value === choice.id ? "checked" : ""),
            id: choice.id,
            onClick: this.handleValueChange.bind(null, choice)
          }, formUtils.localizeString(choice.label, this.context.locale), choice.hint ? H.span({
            className: "radio-choice-hint"
          }, " " + formUtils.localizeString(choice.hint, this.context.locale)) : void 0), choice.specify && this.props.answer.value === choice.id ? this.renderSpecify(choice) : void 0);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return H.div({
          className: "touch-radio-group"
        }, _.map(this.props.choices, function (choice) {
          return _this2.renderChoice(choice);
        }));
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
    answer: PropTypes.object.isRequired, // See answer format
    data: PropTypes.object.isRequired
  };

  return RadioAnswerComponent;
}.call(undefined);