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

var MulticheckAnswerComponent,
    PropTypes,
    R,
    React,
    _,
    conditionUtils,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
},
    indexOf = [].indexOf;

_ = require('lodash');

PropTypes = require('prop-types');

React = require('react');

R = React.createElement;

formUtils = require('../formUtils');

conditionUtils = require('../conditionUtils');

// Multiple checkboxes where more than one can be checked
module.exports = MulticheckAnswerComponent = function () {
  var MulticheckAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(MulticheckAnswerComponent, _React$Component);

    function MulticheckAnswerComponent() {
      (0, _classCallCheck3.default)(this, MulticheckAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (MulticheckAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(MulticheckAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      _this.handleSpecifyChange = _this.handleSpecifyChange.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(MulticheckAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: 'handleValueChange',
      value: function handleValueChange(choice) {
        var ids, ref, specify;
        boundMethodCheck(this, MulticheckAnswerComponent);
        ids = this.props.answer.value || [];
        if (ref = choice.id, indexOf.call(ids, ref) >= 0) {
          if (this.props.answer.specify != null) {
            specify = _.clone(this.props.answer.specify);
            if (specify[choice.id] != null) {
              delete specify[choice.id];
            }
          } else {
            specify = null;
          }
          return this.props.onAnswerChange({
            value: _.difference(ids, [choice.id]),
            specify: specify
          });
        } else {
          return this.props.onAnswerChange({
            value: _.union(ids, [choice.id]),
            specify: this.props.answer.specify
          });
        }
      }
    }, {
      key: 'handleSpecifyChange',
      value: function handleSpecifyChange(id, ev) {
        var change, specify;
        boundMethodCheck(this, MulticheckAnswerComponent);
        change = {};
        change[id] = ev.target.value;
        specify = _.extend({}, this.props.answer.specify, change);
        return this.props.onAnswerChange({
          value: this.props.answer.value,
          specify: specify
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
        return R('input', {
          className: "form-control specify-input",
          type: "text",
          value: value,
          onChange: this.handleSpecifyChange.bind(null, choice.id)
        });
      }
    }, {
      key: 'renderChoice',
      value: function renderChoice(choice) {
        var ref, selected;
        if (!this.areConditionsValid(choice)) {
          return null;
        }
        selected = _.isArray(this.props.answer.value) && (ref = choice.id, indexOf.call(this.props.answer.value, ref) >= 0);
        return R('div', {
          key: choice.id
          // id is used for testing
        }, R('div', {
          className: 'choice touch-checkbox ' + (selected ? "checked" : ""),
          id: choice.id,
          onClick: this.handleValueChange.bind(null, choice)
        }, formUtils.localizeString(choice.label, this.context.locale), choice.hint ? R('span', {
          className: "checkbox-choice-hint"
        }, formUtils.localizeString(choice.hint, this.context.locale)) : void 0), choice.specify && selected ? this.renderSpecify(choice) : void 0);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return R('div', null, _.map(this.props.choices, function (choice) {
          return _this2.renderChoice(choice);
        }));
      }
    }]);
    return MulticheckAnswerComponent;
  }(React.Component);

  ;

  MulticheckAnswerComponent.contextTypes = {
    locale: PropTypes.string // Current locale (e.g. "en")
  };

  MulticheckAnswerComponent.propTypes = {
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
    answer: PropTypes.object.isRequired, // See answer format
    onAnswerChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

  return MulticheckAnswerComponent;
}.call(undefined);