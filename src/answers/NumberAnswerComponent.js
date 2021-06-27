// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let NumberAnswerComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import ui from 'react-library/lib/bootstrap';

// Number input component that handles parsing and maintains state when number is invalid
export default NumberAnswerComponent = (function() {
  NumberAnswerComponent = class NumberAnswerComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        decimal: PropTypes.bool.isRequired,
        value: PropTypes.number,
        onChange: PropTypes.func,
        style: PropTypes.object,     // Will be merged with style of input box
        small: PropTypes.bool,       // True to render with input-sm
        onNextOrComments: PropTypes.func
      };
    }

    focus() {
      return this.input?.focus();
    }

    validate() {
      if (!this.input.isValid()) {
        return "Invalid number";
      }
      return null;
    }

    render() {
      return R(ui.NumberInput, {
        ref: c => { return this.input = c; },
        decimal: this.props.decimal,
        value: this.props.value,
        onChange: this.props.onChange,
        size: this.props.small ? "sm" : undefined,
        onTab: this.props.onNextOrComments,
        onEnter: this.props.onNextOrComments
      }
      );
    }
  };
  NumberAnswerComponent.initClass();
  return NumberAnswerComponent;
})();
