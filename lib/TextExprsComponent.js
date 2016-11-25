var ExprEvaluator, ExprUtils, H, R, React, TextExprsComponent, _, async, formUtils, markdown,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

async = require('async');

formUtils = require('./formUtils');

ExprEvaluator = require('mwater-expressions').ExprEvaluator;

ExprUtils = require('mwater-expressions').ExprUtils;

markdown = require("markdown").markdown;

module.exports = TextExprsComponent = (function(superClass) {
  extend(TextExprsComponent, superClass);

  TextExprsComponent.propTypes = {
    localizedStr: React.PropTypes.object,
    exprs: React.PropTypes.array,
    schema: React.PropTypes.object.isRequired,
    responseRow: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string,
    markdown: React.PropTypes.bool
  };

  function TextExprsComponent() {
    TextExprsComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      exprValueStrs: []
    };
  }

  TextExprsComponent.prototype.componentWillMount = function() {
    return this.evaluateExprs();
  };

  TextExprsComponent.prototype.componentDidUpdate = function() {
    return this.evaluateExprs();
  };

  TextExprsComponent.prototype.evaluateExprs = function() {
    if (!this.props.exprs || this.props.exprs.length === 0) {
      return;
    }
    return async.map(this.props.exprs, (function(_this) {
      return function(expr, cb) {
        return new ExprEvaluator().evaluate(expr, {
          row: _this.props.responseRow
        }, function(error, value) {
          if (error) {
            return cb(null, "<error>");
          }
          return cb(null, new ExprUtils(_this.props.schema).stringifyExprLiteral(expr, value, _this.props.locale));
        });
      };
    })(this), (function(_this) {
      return function(error, valueStrs) {
        if (!_.isEqual(valueStrs, _this.state.exprValueStrs)) {
          return _this.setState({
            exprValueStrs: valueStrs
          });
        }
      };
    })(this));
  };

  TextExprsComponent.prototype.render = function() {
    var html, str;
    str = formUtils.localizeString(this.props.localizedStr, this.props.locale);
    str = str.replace(/\{(\d+)\}/g, (function(_this) {
      return function(match, index) {
        index = parseInt(index);
        if (_this.state.exprValueStrs[index] != null) {
          return _this.state.exprValueStrs[index];
        }
        return "...";
      };
    })(this));
    if (this.props.markdown) {
      html = str ? markdown.toHTML(str) : void 0;
      return H.div(null, {
        dangerouslySetInnerHTML: {
          __html: html
        }
      });
    } else {
      return H.span(null, str);
    }
  };

  return TextExprsComponent;

})(React.Component);
