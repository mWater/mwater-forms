'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckAnswerComponent,
    H,
    PropTypes,
    R,
    React,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

// This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
// TODO: SurveyorPro: Fix checkbox title size
module.exports = CheckAnswerComponent = function () {
  var CheckAnswerComponent = function (_React$Component) {
    _inherits(CheckAnswerComponent, _React$Component);

    function CheckAnswerComponent() {
      _classCallCheck(this, CheckAnswerComponent);

      var _this = _possibleConstructorReturn(this, (CheckAnswerComponent.__proto__ || Object.getPrototypeOf(CheckAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      return _this;
    }

    _createClass(CheckAnswerComponent, [{
      key: 'focus',
      value: function focus() {
        return this.refs.checkbox.focus();
      }
    }, {
      key: 'handleValueChange',
      value: function handleValueChange() {
        boundMethodCheck(this, CheckAnswerComponent);
        return this.props.onValueChange(!this.props.value);
      }
    }, {
      key: 'render',
      value: function render() {
        return H.div({
          className: 'choice touch-checkbox ' + (this.props.value ? "checked" : ""),
          onClick: this.handleValueChange,
          ref: 'checkbox'
        }, this.props.children);
      }
    }]);

    return CheckAnswerComponent;
  }(React.Component);

  ;

  CheckAnswerComponent.propTypes = {
    value: PropTypes.bool,
    onValueChange: PropTypes.func.isRequired,
    label: PropTypes.object.isRequired
  };

  CheckAnswerComponent.defaultProps = {
    value: false
  };

  return CheckAnswerComponent;
}.call(undefined);