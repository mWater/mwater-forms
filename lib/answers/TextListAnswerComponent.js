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

var PropTypes,
    R,
    React,
    TextListAnswerComponent,
    _,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

_ = require('lodash');

PropTypes = require('prop-types');

React = require('react');

R = React.createElement;

module.exports = TextListAnswerComponent = function () {
  var TextListAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(TextListAnswerComponent, _React$Component);

    function TextListAnswerComponent() {
      (0, _classCallCheck3.default)(this, TextListAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (TextListAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(TextListAnswerComponent)).apply(this, arguments));

      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleNewLineChange = _this.handleNewLineChange.bind(_this);
      _this.handleKeydown = _this.handleKeydown.bind(_this);
      _this.handleRemoveClick = _this.handleRemoveClick.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(TextListAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        var ref;
        return (ref = this.newLine) != null ? ref.focus() : void 0;
      }
    }, {
      key: 'handleChange',
      value: function handleChange(index, ev) {
        var newValue;
        boundMethodCheck(this, TextListAnswerComponent);
        if (this.props.value != null) {
          newValue = _.clone(this.props.value);
        } else {
          newValue = [];
        }
        newValue[index] = ev.target.value;
        return this.props.onValueChange(newValue);
      }
    }, {
      key: 'handleNewLineChange',
      value: function handleNewLineChange(ev) {
        var newValue;
        boundMethodCheck(this, TextListAnswerComponent);
        if (this.props.value != null) {
          newValue = _.clone(this.props.value);
        } else {
          newValue = [];
        }
        newValue.push(ev.target.value);
        return this.props.onValueChange(newValue);
      }
    }, {
      key: 'handleKeydown',
      value: function handleKeydown(index, ev) {
        var nextInput, value;
        boundMethodCheck(this, TextListAnswerComponent);
        if (this.props.value != null) {
          value = _.clone(this.props.value);
        } else {
          value = [];
        }
        // When pressing ENTER or TAB
        if (ev.keyCode === 13 || ev.keyCode === 9) {
          // If the index is equal to the items length, it means that it's the last empty entry
          if (index >= value.length) {
            if (this.props.onNextOrComments != null) {
              this.props.onNextOrComments(ev);
            }
          }
          // If it equals to one less, we focus the newLine input
          if (index === value.length - 1) {
            nextInput = this.newLine;
            nextInput.focus();
          } else {
            // If not, we focus the next input
            nextInput = this['input' + (index + 1)];
            nextInput.focus();
          }
          // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
          return ev.preventDefault();
        }
      }
    }, {
      key: 'handleRemoveClick',
      value: function handleRemoveClick(index, ev) {
        var newValue;
        boundMethodCheck(this, TextListAnswerComponent);
        if (this.props.value != null) {
          newValue = _.clone(this.props.value);
        } else {
          newValue = [];
        }
        newValue.splice(index, 1);
        return this.props.onValueChange(newValue);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var index, textLine, value;
        value = this.props.value || [];
        return R('table', {
          style: {
            width: "100%"
          }
        }, R('tbody', null, function () {
          var _this2 = this;

          var i, len, results;
          results = [];
          for (index = i = 0, len = value.length; i < len; index = ++i) {
            textLine = value[index];
            results.push(R('tr', {
              key: index
            }, R('td', null, R('b', null, index + 1 + '.\xA0')), R('td', null, R('div', {
              className: "input-group"
            }, R('input', {
              ref: function ref(c) {
                return _this2['input' + index] = c;
              },
              type: "text",
              className: "form-control box",
              value: textLine,
              onChange: this.handleChange.bind(null, index),
              onKeyDown: this.handleKeydown.bind(null, index),
              autoFocus: index === value.length - 1,
              onFocus: function onFocus(ev) {
                // Necessary or else the cursor is set before the first character after a new line is created
                return ev.target.setSelectionRange(textLine.length, textLine.length);
              }
            }), R('span', {
              className: "input-group-btn"
            }, R('button', {
              className: "btn btn-link remove",
              "data-index": index,
              type: "button",
              onClick: this.handleRemoveClick.bind(null, index)
            }, R('span', {
              className: "glyphicon glyphicon-remove"
            })))))));
          }
          return results;
        }.call(this), R('tr', null, R('td', null), R('td', null, R('div', {
          className: "input-group"
        }, R('input', {
          type: "text",
          className: "form-control box",
          onChange: this.handleNewLineChange,
          value: "",
          ref: function ref(c) {
            return _this3.newLine = c;
          },
          id: 'newLine'
        }), R('span', {
          className: "input-group-btn",
          style: {
            paddingRight: '39px'
          }
        }))))));
      }
    }]);
    return TextListAnswerComponent;
  }(React.Component);

  ;

  TextListAnswerComponent.propTypes = {
    value: PropTypes.array,
    onValueChange: PropTypes.func.isRequired,
    onNextOrComments: PropTypes.func
  };

  return TextListAnswerComponent;
}.call(undefined);