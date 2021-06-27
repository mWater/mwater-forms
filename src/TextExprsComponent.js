let TextExprsComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import async from 'async';
import formUtils from './formUtils';
import { PromiseExprEvaluator } from 'mwater-expressions';
import { ExprUtils } from 'mwater-expressions';
import d3Format from "d3-format";
import Markdown from "markdown-it";

// Displays a text string with optional expressions embedded in it that are computed
export default TextExprsComponent = (function() {
  TextExprsComponent = class TextExprsComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        localizedStr: PropTypes.object,  // String to render (localized)
        exprs: PropTypes.array,          // Array of mwater-expressions to insert at {0}, {1}, etc.
        schema: PropTypes.object.isRequired, // Schema that includes the current form
        responseRow: PropTypes.object.isRequired, // response row to use
        locale: PropTypes.string,        // locale (e.g. "en") to use
        markdown: PropTypes.bool,        // True to render as markdown text
        format: PropTypes.string
      };
              // Format to be used by d3 formatter
    }

    constructor(props) {
      super(props);

      this.state = { 
        exprValueStrs: []    // Expression values strings to insert
      };
    }

    componentWillMount() {
      // Evaluate expressions
      return this.evaluateExprs();
    }

    componentDidUpdate() {
      // Evaluate expressions
      return this.evaluateExprs();
    }

    evaluateExprs() {
      if (!this.props.exprs || (this.props.exprs.length === 0)) {
        return;
      }

      // Evaluate each expression
      return async.map(this.props.exprs, (expr, cb) => {
        return new PromiseExprEvaluator({ schema: this.props.schema }).evaluate(expr, { row: this.props.responseRow }).then(value => { 
          // stringify value
          return cb(null, new ExprUtils(this.props.schema).stringifyExprLiteral(expr, value, this.props.locale));
        }).catch(() => cb(null, "<error>"));
      }
      , (error, valueStrs) => {
        // Only update state if changed
        if (!_.isEqual(valueStrs, this.state.exprValueStrs)) {
          return this.setState({exprValueStrs: valueStrs});
        }
      });
    }

    render() {
      // Localize string
      let str = formUtils.localizeString(this.props.localizedStr, this.props.locale) || "";

      // Perform substitutions ({0}, {1}, etc.)
      str = str.replace(/\{(\d+)\}/g, (match, index) => {
        index = parseInt(index);
        if (this.state.exprValueStrs[index] != null) {
          return this.state.exprValueStrs[index];
        }
        return "...";
      });

      if (this.props.markdown) {
        let html = str ? new Markdown().render(str) : "";
      
        // Make sure links are external
        html = html.replace(/<a href=/g, '<a target="_blank" href=');

        return R('div', {dangerouslySetInnerHTML: { __html: html }});
      } else {
        str = (this.props.format && !_.isNaN(Number(str))) ? d3Format.format(this.props.format)(str) : str;
        return R('span', null, str);
      }
    }
  };
  TextExprsComponent.initClass();
  return TextExprsComponent;
})();
