'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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
    LikertAnswerComponent,
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

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

module.exports = LikertAnswerComponent = function () {
  var _LikertAnswerComponen;

  var LikertAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(LikertAnswerComponent, _React$Component);

    function LikertAnswerComponent() {
      (0, _classCallCheck3.default)(this, LikertAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (LikertAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(LikertAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(LikertAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        // Nothing to focus
        return null;
      }
    }, {
      key: 'handleValueChange',
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
      key: 'renderChoice',
      value: function renderChoice(item, choice) {
        var id, value;
        id = item.id + ':' + choice.id;
        if (this.props.answer.value != null) {
          value = this.props.answer.value[item.id];
        } else {
          value = null;
        }
        return H.td({
          key: id
          // id is used for testing
        }, H.div({
          className: 'touch-radio ' + (value === choice.id ? "checked" : ""),
          id: id,
          onClick: this.handleValueChange.bind(null, choice, item)
        }, formUtils.localizeString(choice.label, this.context.locale)));
      }

      // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
      //renderChoiceLabel: (choice) ->
      //  H.td key: "label#{choice.id}",
      //    formUtils.localizeString(choice.label, @context.locale)

    }, {
      key: 'renderItem',
      value: function renderItem(item) {
        var _this2 = this;

        return H.tr(null, H.td(null, H.b(null, formUtils.localizeString(item.label, this.context.locale)), item.hint ? H.div(null, H.span({
          className: "",
          style: {
            color: '#888'
          }
        }, formUtils.localizeString(item.hint, this.context.locale))) : void 0), _.map(this.props.choices, function (choice) {
          return _this2.renderChoice(item, choice);
        }));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        return H.table({
          className: "",
          style: {
            width: '100%'
            // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
            //H.thead null,
            //  H.tr null,
            //    H.td(),
            //    _.map @props.choices, (choice) =>
            //      @renderChoiceLabel(choice)
          } }, H.tbody(null, _.map(this.props.items, function (item) {
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
  }, (0, _defineProperty3.default)(_LikertAnswerComponen, 'choices', PropTypes.arrayOf(PropTypes.shape({
    // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
    id: PropTypes.string.isRequired,
    // Label of the choice, localized
    label: PropTypes.object.isRequired,
    // Hint associated with a choice
    hint: PropTypes.object
  })).isRequired), (0, _defineProperty3.default)(_LikertAnswerComponen, 'onAnswerChange', PropTypes.func.isRequired), (0, _defineProperty3.default)(_LikertAnswerComponen, 'answer', PropTypes.object.isRequired), (0, _defineProperty3.default)(_LikertAnswerComponen, 'data', PropTypes.object.isRequired), _LikertAnswerComponen);

  return LikertAnswerComponent;
}.call(undefined);