'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExprEvaluator, ExprUtils, H, PropTypes, R, React, TextExprsComponent, _, async, formUtils, markdown;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

async = require('async');

formUtils = require('./formUtils');

ExprEvaluator = require('mwater-expressions').ExprEvaluator;

ExprUtils = require('mwater-expressions').ExprUtils;

markdown = require("markdown").markdown;

// Displays a text string with optional expressions embedded in it that are computed
module.exports = TextExprsComponent = function () {
  var TextExprsComponent = function (_React$Component) {
    _inherits(TextExprsComponent, _React$Component);

    function TextExprsComponent(props) {
      _classCallCheck(this, TextExprsComponent);

      var _this = _possibleConstructorReturn(this, (TextExprsComponent.__proto__ || Object.getPrototypeOf(TextExprsComponent)).call(this, props));

      _this.state = {
        exprValueStrs: []
      };
      return _this;
    }

    _createClass(TextExprsComponent, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        // Evaluate expressions
        return this.evaluateExprs();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        // Evaluate expressions
        return this.evaluateExprs();
      }
    }, {
      key: 'evaluateExprs',
      value: function evaluateExprs() {
        var _this2 = this;

        if (!this.props.exprs || this.props.exprs.length === 0) {
          return;
        }
        // Evaluate each expression
        return async.map(this.props.exprs, function (expr, cb) {
          return new ExprEvaluator(_this2.props.schema).evaluate(expr, {
            row: _this2.props.responseRow
          }, function (error, value) {
            if (error) {
              return cb(null, "<error>");
            }
            // stringify value
            return cb(null, new ExprUtils(_this2.props.schema).stringifyExprLiteral(expr, value, _this2.props.locale));
          });
        }, function (error, valueStrs) {
          // Only update state if changed
          if (!_.isEqual(valueStrs, _this2.state.exprValueStrs)) {
            return _this2.setState({
              exprValueStrs: valueStrs
            });
          }
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var html, str;
        // Localize string
        str = formUtils.localizeString(this.props.localizedStr, this.props.locale) || "";
        // Perform substitutions ({0}, {1}, etc.)
        str = str.replace(/\{(\d+)\}/g, function (match, index) {
          index = parseInt(index);
          if (_this3.state.exprValueStrs[index] != null) {
            return _this3.state.exprValueStrs[index];
          }
          return "...";
        });
        if (this.props.markdown) {
          html = str ? markdown.toHTML(str) : "";

          // Make sure links are external
          html = html.replace(/<a href=/g, '<a target="_blank" href=');
          return H.div({
            dangerouslySetInnerHTML: {
              __html: html
            }
          });
        } else {
          return H.span(null, str);
        }
      }
    }]);

    return TextExprsComponent;
  }(React.Component);

  ;

  TextExprsComponent.propTypes = {
    localizedStr: PropTypes.object, // String to render (localized)
    exprs: PropTypes.array, // Array of mwater-expressions to insert at {0}, {1}, etc.
    schema: PropTypes.object.isRequired, // Schema that includes the current form
    responseRow: PropTypes.object.isRequired, // response row to use
    locale: PropTypes.string, // locale (e.g. "en") to use
    markdown: PropTypes.bool // True to render as markdown text
  };

  return TextExprsComponent;
}.call(undefined);