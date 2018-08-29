'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(LikertAnswerComponent, _React$Component);

    function LikertAnswerComponent() {
      _classCallCheck(this, LikertAnswerComponent);

      var _this = _possibleConstructorReturn(this, (LikertAnswerComponent.__proto__ || Object.getPrototypeOf(LikertAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      return _this;
    }

    _createClass(LikertAnswerComponent, [{
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
  }, _defineProperty(_LikertAnswerComponen, 'choices', PropTypes.arrayOf(PropTypes.shape({
    // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
    id: PropTypes.string.isRequired,
    // Label of the choice, localized
    label: PropTypes.object.isRequired,
    // Hint associated with a choice
    hint: PropTypes.object
  })).isRequired), _defineProperty(_LikertAnswerComponen, 'onAnswerChange', PropTypes.func.isRequired), _defineProperty(_LikertAnswerComponen, 'answer', PropTypes.object.isRequired), _defineProperty(_LikertAnswerComponen, 'data', PropTypes.object.isRequired), _LikertAnswerComponen);

  return LikertAnswerComponent;
}.call(undefined);