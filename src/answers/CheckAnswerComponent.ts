// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let CheckAnswerComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import * as formUtils from '../formUtils';

// This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
// TODO: SurveyorPro: Fix checkbox title size

export default CheckAnswerComponent = (function() {
  CheckAnswerComponent = class CheckAnswerComponent extends React.Component {
    static initClass() {
      this.propTypes = {
        value: PropTypes.bool,
        onValueChange: PropTypes.func.isRequired,
        label: PropTypes.object.isRequired
      };
  
      this.defaultProps =
        {value: false};
    }

    focus() {
      return this.checkbox.focus();
    }

    handleValueChange = () => {
      return this.props.onValueChange(!this.props.value);
    };

    render() {
      return R('div', {className: `choice touch-checkbox ${this.props.value ? "checked" : ""}`, onClick: this.handleValueChange, ref: (c => { return this.checkbox = c; })},
        this.props.children);
    }
  };
  CheckAnswerComponent.initClass();
  return CheckAnswerComponent;
})();
