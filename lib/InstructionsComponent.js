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

var InstructionsComponent, PropTypes, R, React, TextExprsComponent, _, formUtils;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

R = React.createElement;

formUtils = require('./formUtils');

TextExprsComponent = require('./TextExprsComponent');

module.exports = InstructionsComponent = function () {
  var InstructionsComponent = function (_React$Component) {
    (0, _inherits3.default)(InstructionsComponent, _React$Component);

    function InstructionsComponent() {
      (0, _classCallCheck3.default)(this, InstructionsComponent);
      return (0, _possibleConstructorReturn3.default)(this, (InstructionsComponent.__proto__ || (0, _getPrototypeOf2.default)(InstructionsComponent)).apply(this, arguments));
    }

    (0, _createClass3.default)(InstructionsComponent, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.context.locale !== nextContext.locale) {
          return true;
        }
        if (nextProps.instructions.textExprs != null && nextProps.instructions.textExprs.length > 0) {
          return true;
        }
        if (nextProps.instructions !== this.props.instructions) {
          return true;
        }
        return false;
      }
    }, {
      key: 'render',
      value: function render() {
        return R('div', {
          className: "well well-small"
        }, R(TextExprsComponent, {
          localizedStr: this.props.instructions.text,
          exprs: this.props.instructions.textExprs,
          schema: this.props.schema,
          responseRow: this.props.responseRow,
          locale: this.context.locale,
          markdown: true
        }));
      }
    }]);
    return InstructionsComponent;
  }(React.Component);

  ;

  InstructionsComponent.contextTypes = {
    locale: PropTypes.string
  };

  InstructionsComponent.propTypes = {
    instructions: PropTypes.object.isRequired, // Design of instructions. See schema
    data: PropTypes.object, // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object, // ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  return InstructionsComponent;
}.call(undefined);