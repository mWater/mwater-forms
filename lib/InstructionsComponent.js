'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var H, InstructionsComponent, PropTypes, R, React, TextExprsComponent, _, formUtils;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

TextExprsComponent = require('./TextExprsComponent');

module.exports = InstructionsComponent = function () {
  var InstructionsComponent = function (_React$Component) {
    _inherits(InstructionsComponent, _React$Component);

    function InstructionsComponent() {
      _classCallCheck(this, InstructionsComponent);

      return _possibleConstructorReturn(this, (InstructionsComponent.__proto__ || Object.getPrototypeOf(InstructionsComponent)).apply(this, arguments));
    }

    _createClass(InstructionsComponent, [{
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
        return H.div({
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