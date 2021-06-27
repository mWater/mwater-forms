// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let InstructionsComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import * as formUtils from './formUtils';
import TextExprsComponent from './TextExprsComponent';

export default InstructionsComponent = (function() {
  InstructionsComponent = class InstructionsComponent extends React.Component {
    static initClass() {
      this.contextTypes = 
        {locale: PropTypes.string};
  
      this.propTypes = {
        instructions: PropTypes.object.isRequired, // Design of instructions. See schema
        data: PropTypes.object,      // Current data of response (for roster entry if in roster)
        responseRow: PropTypes.object,    // ResponseRow object (for roster entry if in roster)
        schema: PropTypes.object.isRequired
      };
        // Schema to use, including form
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      if (this.context.locale !== nextContext.locale) {
        return true;
      }
      if ((nextProps.instructions.textExprs != null) && (nextProps.instructions.textExprs.length > 0)) {
        return true;
      }
      if (nextProps.instructions !== this.props.instructions) {
        return true;
      }

      return false;
    }

    render() {
      return R('div', {className: "well well-small"}, 
        R(TextExprsComponent, {
          localizedStr: this.props.instructions.text,
          exprs: this.props.instructions.textExprs,
          schema: this.props.schema,
          responseRow: this.props.responseRow,
          locale: this.context.locale,
          markdown: true
        }
        )
      );
    }
  };
  InstructionsComponent.initClass();
  return InstructionsComponent;
})();
