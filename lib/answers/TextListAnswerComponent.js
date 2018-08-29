'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H,
    PropTypes,
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

H = React.DOM;

R = React.createElement;

module.exports = TextListAnswerComponent = function () {
  var TextListAnswerComponent = function (_React$Component) {
    _inherits(TextListAnswerComponent, _React$Component);

    function TextListAnswerComponent() {
      _classCallCheck(this, TextListAnswerComponent);

      var _this = _possibleConstructorReturn(this, (TextListAnswerComponent.__proto__ || Object.getPrototypeOf(TextListAnswerComponent)).apply(this, arguments));

      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleNewLineChange = _this.handleNewLineChange.bind(_this);
      _this.handleKeydown = _this.handleKeydown.bind(_this);
      _this.handleRemoveClick = _this.handleRemoveClick.bind(_this);
      return _this;
    }

    _createClass(TextListAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        var ref;
        return (ref = this.refs.newLine) != null ? ref.focus() : void 0;
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
            nextInput = this.refs["newLine"];
            nextInput.focus();
          } else {
            // If not, we focus the next input
            nextInput = this.refs['input' + (index + 1)];
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
        var index, textLine, value;
        value = this.props.value || [];
        return H.table({
          style: {
            width: "100%"
          }
        }, H.tbody(null, function () {
          var i, len, results;
          results = [];
          for (index = i = 0, len = value.length; i < len; index = ++i) {
            textLine = value[index];
            results.push(H.tr({
              key: index
            }, H.td(null, H.b(null, index + 1 + '.\xA0')), H.td(null, H.div({
              className: "input-group"
            }, H.input({
              ref: 'input' + index,
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
            }), H.span({
              className: "input-group-btn"
            }, H.button({
              className: "btn btn-link remove",
              "data-index": index,
              type: "button",
              onClick: this.handleRemoveClick.bind(null, index)
            }, H.span({
              className: "glyphicon glyphicon-remove"
            })))))));
          }
          return results;
        }.call(this), H.tr(null, H.td(null), H.td(null, H.div({
          className: "input-group"
        }, H.input({
          type: "text",
          className: "form-control box",
          onChange: this.handleNewLineChange,
          value: "",
          ref: 'newLine',
          id: 'newLine'
        }), H.span({
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