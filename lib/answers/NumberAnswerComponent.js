'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H, NumberAnswerComponent, PropTypes, R, React, _, ui;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

R = React.createElement;

H = React.DOM;

ui = require('react-library/lib/bootstrap');

// Number input component that handles parsing and maintains state when number is invalid
module.exports = NumberAnswerComponent = function () {
  var NumberAnswerComponent = function (_React$Component) {
    _inherits(NumberAnswerComponent, _React$Component);

    function NumberAnswerComponent() {
      _classCallCheck(this, NumberAnswerComponent);

      return _possibleConstructorReturn(this, (NumberAnswerComponent.__proto__ || Object.getPrototypeOf(NumberAnswerComponent)).apply(this, arguments));
    }

    _createClass(NumberAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        var ref;
        return (ref = this.input) != null ? ref.focus() : void 0;
      }
    }, {
      key: 'validate',
      value: function validate() {
        if (!this.input.isValid()) {
          return "Invalid number";
        }
        return null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return R(ui.NumberInput, {
          ref: function ref(c) {
            return _this2.input = c;
          },
          decimal: this.props.decimal,
          value: this.props.value,
          onChange: this.props.onChange,
          size: this.props.small ? "sm" : void 0,
          onTab: this.props.onNextOrComments,
          onEnter: this.props.onNextOrComments
        });
      }
    }]);

    return NumberAnswerComponent;
  }(React.Component);

  ;

  NumberAnswerComponent.propTypes = {
    decimal: PropTypes.bool.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func,
    style: PropTypes.object, // Will be merged with style of input box
    small: PropTypes.bool, // True to render with input-sm
    onNextOrComments: PropTypes.func
  };

  return NumberAnswerComponent;
}.call(undefined);