let CheckAnswerComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import formUtils from '../formUtils';

// This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
// TODO: SurveyorPro: Fix checkbox title size

export default CheckAnswerComponent = (function() {
  CheckAnswerComponent = class CheckAnswerComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.handleValueChange = this.handleValueChange.bind(this);
    }

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

    handleValueChange() {
      return this.props.onValueChange(!this.props.value);
    }

    render() {
      return R('div', {className: `choice touch-checkbox ${this.props.value ? "checked" : ""}`, onClick: this.handleValueChange, ref: (c => { return this.checkbox = c; })},
        this.props.children);
    }
  };
  CheckAnswerComponent.initClass();
  return CheckAnswerComponent;
})();
