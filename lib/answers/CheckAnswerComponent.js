"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var CheckAnswerComponent,
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
R = React.createElement;
formUtils = require('../formUtils'); // This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
// TODO: SurveyorPro: Fix checkbox title size

module.exports = CheckAnswerComponent = function () {
  var CheckAnswerComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2.default)(CheckAnswerComponent, _React$Component);

    function CheckAnswerComponent() {
      var _this;

      (0, _classCallCheck2.default)(this, CheckAnswerComponent);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CheckAnswerComponent).apply(this, arguments));
      _this.handleValueChange = _this.handleValueChange.bind((0, _assertThisInitialized2.default)(_this));
      return _this;
    }

    (0, _createClass2.default)(CheckAnswerComponent, [{
      key: "focus",
      value: function focus() {
        return this.checkbox.focus();
      }
    }, {
      key: "handleValueChange",
      value: function handleValueChange() {
        boundMethodCheck(this, CheckAnswerComponent);
        return this.props.onValueChange(!this.props.value);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        return R('div', {
          className: "choice touch-checkbox ".concat(this.props.value ? "checked" : ""),
          onClick: this.handleValueChange,
          ref: function ref(c) {
            return _this2.checkbox = c;
          }
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
}.call(void 0);