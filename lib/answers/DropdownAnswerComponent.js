'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DropdownAnswerComponent,
    H,
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
};

_ = require('lodash');

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

conditionUtils = require('../conditionUtils');

module.exports = DropdownAnswerComponent = function () {
  var DropdownAnswerComponent = function (_React$Component) {
    _inherits(DropdownAnswerComponent, _React$Component);

    function DropdownAnswerComponent() {
      _classCallCheck(this, DropdownAnswerComponent);

      var _this = _possibleConstructorReturn(this, (DropdownAnswerComponent.__proto__ || Object.getPrototypeOf(DropdownAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      _this.handleSpecifyChange = _this.handleSpecifyChange.bind(_this);
      return _this;
    }

    _createClass(DropdownAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        var ref;
        return (ref = this.refs.select) != null ? ref.focus() : void 0;
      }
    }, {
      key: 'handleValueChange',
      value: function handleValueChange(ev) {
        boundMethodCheck(this, DropdownAnswerComponent);
        if (ev.target.value != null && ev.target.value !== '') {
          return this.props.onAnswerChange({
            value: ev.target.value,
            specify: null
          });
        } else {
          return this.props.onAnswerChange({
            value: null,
            specify: null
          });
        }
      }
    }, {
      key: 'handleSpecifyChange',
      value: function handleSpecifyChange(id, ev) {
        var change, specify;
        boundMethodCheck(this, DropdownAnswerComponent);
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
      value: function renderSpecify() {
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
          return H.input({
            className: "form-control specify-input",
            type: "text",
            value: value,
            onChange: this.handleSpecifyChange.bind(null, choice.id)
          });
        }
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
      key: 'render',
      value: function render() {
        var _this2 = this;

        return H.div(null, H.select({
          className: "form-control",
          style: {
            width: "auto"
          },
          value: this.props.answer.value,
          onChange: this.handleValueChange,
          ref: 'select'
        }, H.option({
          key: "__none__",
          value: ""
        }), _.map(this.props.choices, function (choice) {
          var text;
          if (_this2.areConditionsValid(choice)) {
            text = formUtils.localizeString(choice.label, _this2.context.locale);
            if (choice.hint) {
              text += " (" + formUtils.localizeString(choice.hint, _this2.context.locale) + ")";
            }
            return H.option({
              key: choice.id,
              value: choice.id
            }, text);
          }
        })), this.renderSpecify());
      }
    }]);

    return DropdownAnswerComponent;
  }(React.Component);

  ;

  DropdownAnswerComponent.contextTypes = {
    locale: PropTypes.string // Current locale (e.g. "en")
  };

  DropdownAnswerComponent.propTypes = {
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
      specify: PropTypes.bool,
      choice: PropTypes.array
    })).isRequired,
    onAnswerChange: PropTypes.func.isRequired,
    answer: PropTypes.object.isRequired, // See answer format
    data: PropTypes.object.isRequired
  };

  return DropdownAnswerComponent;
}.call(undefined);