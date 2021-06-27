// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let MulticheckAnswerComponent;
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import * as formUtils from '../formUtils';
import * as conditionUtils from '../conditionUtils';

// Multiple checkboxes where more than one can be checked
export default MulticheckAnswerComponent = (function() {
  MulticheckAnswerComponent = class MulticheckAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes =
        {locale: PropTypes.string};  // Current locale (e.g. "en")
  
      this.propTypes = {
        choices: PropTypes.arrayOf(PropTypes.shape({
          // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
          id: PropTypes.string.isRequired,
  
          // Label of the choice, localized
          label: PropTypes.object.isRequired,
  
          // Hint associated with a choice
          hint: PropTypes.object,
  
          // True to require a text field to specify the value when selected
          // Usually used for "Other" options.
          // Value is stored in specify[id]
          specify: PropTypes.bool
        })).isRequired,
  
        answer: PropTypes.object.isRequired, // See answer format
        onAnswerChange: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired
      };
    }

    focus() {
      // Nothing to focus
      return null;
    }

    handleValueChange = choice => {
      let specify;
      const ids = this.props.answer.value || [];
      if (ids.includes(choice.id)) {
        if (this.props.answer.specify != null) {
          specify = _.clone(this.props.answer.specify);
          if (specify[choice.id] != null) {
            delete specify[choice.id];
          }
        } else {
          specify = null;
        }
        return this.props.onAnswerChange({value: _.difference(ids, [choice.id]), specify});
      } else {
        return this.props.onAnswerChange({value: _.union(ids, [choice.id]), specify: this.props.answer.specify});
      }
    };

    handleSpecifyChange = (id, ev) => {
      const change = {};
      change[id] = ev.target.value;
      const specify = _.extend({}, this.props.answer.specify, change);
      return this.props.onAnswerChange({value: this.props.answer.value, specify});
    };

    areConditionsValid(choice) {
      if ((choice.conditions == null)) {
        return true;
      }
      return conditionUtils.compileConditions(choice.conditions)(this.props.data);
    }

    // Render specify input box
    renderSpecify(choice) {
      let value;
      if (this.props.answer.specify != null) {
        value = this.props.answer.specify[choice.id];
      } else {
        value = '';
      }
      return R('input', {className: "form-control specify-input", type: "text", value, onChange: this.handleSpecifyChange.bind(null, choice.id)});
    }

    renderChoice(choice) {
      if (!this.areConditionsValid(choice)) {
        return null;
      }
      
      const selected = _.isArray(this.props.answer.value) && this.props.answer.value.includes(choice.id);

      return R('div', {key: choice.id},
        // id is used for testing
        R('div', {className: `choice touch-checkbox ${selected ? "checked" : ""}`, id: choice.id, onClick: this.handleValueChange.bind(null, choice)},
          formUtils.localizeString(choice.label, this.context.locale),
          choice.hint ?
            R('span', {className: "checkbox-choice-hint"},
              formUtils.localizeString(choice.hint, this.context.locale)) : undefined
        ),

        choice.specify && selected ?
          this.renderSpecify(choice) : undefined
      );
    }

    render() {
      return R('div', null,
        _.map(this.props.choices, choice => this.renderChoice(choice)));
    }
  };
  MulticheckAnswerComponent.initClass();
  return MulticheckAnswerComponent;
})();