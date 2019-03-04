"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var InstructionsComponent, PropTypes, R, React, TextExprsComponent, _, formUtils;

PropTypes = require('prop-types');
_ = require('lodash');
React = require('react');
R = React.createElement;
formUtils = require('./formUtils');
TextExprsComponent = require('./TextExprsComponent');

module.exports = InstructionsComponent = function () {
  var InstructionsComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2.default)(InstructionsComponent, _React$Component);

    function InstructionsComponent() {
      (0, _classCallCheck2.default)(this, InstructionsComponent);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(InstructionsComponent).apply(this, arguments));
    }

    (0, _createClass2.default)(InstructionsComponent, [{
      key: "shouldComponentUpdate",
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
      key: "render",
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
    instructions: PropTypes.object.isRequired,
    // Design of instructions. See schema
    data: PropTypes.object,
    // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object,
    // ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired // Schema to use, including form

  };
  return InstructionsComponent;
}.call(void 0);