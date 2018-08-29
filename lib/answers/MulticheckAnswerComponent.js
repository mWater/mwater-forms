'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    MulticheckAnswerComponent,
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

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

conditionUtils = require('../conditionUtils');

// Multiple checkboxes where more than one can be checked
module.exports = MulticheckAnswerComponent = function () {
  var MulticheckAnswerComponent = function (_React$Component) {
    _inherits(MulticheckAnswerComponent, _React$Component);

    function MulticheckAnswerComponent() {
      _classCallCheck(this, MulticheckAnswerComponent);

      var _this = _possibleConstructorReturn(this, (MulticheckAnswerComponent.__proto__ || Object.getPrototypeOf(MulticheckAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      _this.handleSpecifyChange = _this.handleSpecifyChange.bind(_this);
      return _this;
    }

    _createClass(MulticheckAnswerComponent, [{
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
        return H.input({
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
        return H.div({
          key: choice.id
          // id is used for testing
        }, H.div({
          className: 'choice touch-checkbox ' + (selected ? "checked" : ""),
          id: choice.id,
          onClick: this.handleValueChange.bind(null, choice)
        }, formUtils.localizeString(choice.label, this.context.locale), choice.hint ? H.span({
          className: "checkbox-choice-hint"
        }, formUtils.localizeString(choice.hint, this.context.locale)) : void 0), choice.specify && selected ? this.renderSpecify(choice) : void 0);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return H.div(null, _.map(this.props.choices, function (choice) {
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