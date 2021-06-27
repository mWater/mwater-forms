let RadioAnswerComponent;
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import formUtils from '../formUtils';
import conditionUtils from '../conditionUtils';

export default RadioAnswerComponent = (function() {
  RadioAnswerComponent = class RadioAnswerComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.handleValueChange = this.handleValueChange.bind(this);
      this.handleSpecifyChange = this.handleSpecifyChange.bind(this);
    }

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
        onAnswerChange: PropTypes.func.isRequired,
        answer: PropTypes.object.isRequired, // See answer format
        data: PropTypes.object.isRequired
      };
    }

    focus() {
      // Nothing to focus
      return null;
    }

    handleValueChange(choice) {
      if (choice.id === this.props.answer.value) {
        return this.props.onAnswerChange({value: null, specify: null });
      } else {
        return this.props.onAnswerChange({value: choice.id, specify: null });
      }
    }

    handleSpecifyChange(id, ev) {
      const change = {};
      change[id] = ev.target.value;
      const specify = _.extend({}, this.props.answer.specify, change);
      return this.props.onAnswerChange({value: this.props.answer.value, specify });
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

    areConditionsValid(choice) {
      if ((choice.conditions == null)) {
        return true;
      }
      return conditionUtils.compileConditions(choice.conditions)(this.props.data);
    }

    // Render general specify input box (without choice specified)
    renderGeneralSpecify() {
      let value;
      const choice = _.findWhere(this.props.choices, { id: this.props.answer.value });
      if (choice && choice.specify && (this.props.answer.specify != null)) {
        value = this.props.answer.specify[choice.id];
      } else {
        value = '';
      }
      if (choice && choice.specify) {
        return R('input', {className: "form-control specify-input", type: "text", value, onChange: this.handleSpecifyChange.bind(null, choice.id)});
      }
    }

    renderVerticalChoice(choice) {
      if (this.areConditionsValid(choice)) {
        return R('div', {key: choice.id},
          // id is used for testing
          R('div', {className: `touch-radio ${this.props.answer.value === choice.id ? "checked" : ""}`, id: choice.id, onClick: this.handleValueChange.bind(null, choice)},
            formUtils.localizeString(choice.label, this.context.locale),
            choice.hint ?
              R('span', {className: "radio-choice-hint"},
                " " + formUtils.localizeString(choice.hint, this.context.locale)) : undefined
          ),

          choice.specify && (this.props.answer.value === choice.id) ?
            this.renderSpecify(choice) : undefined
        );
      }
    }

    renderAsVertical() {
      return R('div', {className: "touch-radio-group"},
        _.map(this.props.choices, choice => this.renderVerticalChoice(choice)));
    }

    // Render as toggle
    renderAsToggle() { 
      return R('div', null,
        R('div', {className: 'btn-group', key: "toggle"},
          _.map(this.props.choices, choice => {
            if (this.areConditionsValid(choice)) {
              let text = formUtils.localizeString(choice.label, this.context.locale);
              if (choice.hint) {
                text += " (" + formUtils.localizeString(choice.hint, this.context.locale) + ")";
              }
              return R('button', {
                key: choice.id,
                type: "button", 
                onClick: () => this.props.onAnswerChange({ value: (choice.id === this.props.answer.value ? null : choice.id), specify: null }),
                className: (this.props.answer.value === choice.id ? "btn btn-primary active" : "btn btn-default")
              },
                  text);
            }
          })
        ),
        
        this.renderGeneralSpecify());
    }

    render() {
      if ((this.props.displayMode || "vertical") === "vertical") {
        return this.renderAsVertical();
      } else if (this.props.displayMode === "toggle") {
        return this.renderAsToggle();
      }
      return null;
    }
  };
  RadioAnswerComponent.initClass();
  return RadioAnswerComponent;
})();
    