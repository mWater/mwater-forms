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
    (0, _inherits3.default)(CheckAnswerComponent, _React$Component);

    function CheckAnswerComponent() {
      (0, _classCallCheck3.default)(this, CheckAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (CheckAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(CheckAnswerComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(CheckAnswerComponent, [{
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