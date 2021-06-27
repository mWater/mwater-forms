let LikertAnswerComponent;
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import formUtils from '../formUtils';

export default LikertAnswerComponent = (function() {
  LikertAnswerComponent = class LikertAnswerComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.handleValueChange = this.handleValueChange.bind(this);
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
          hint: PropTypes.object
        })).isRequired,
        choices: PropTypes.arrayOf(PropTypes.shape({
          // Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
          id: PropTypes.string.isRequired,
  
          // Label of the choice, localized
          label: PropTypes.object.isRequired,
  
          // Hint associated with a choice
          hint: PropTypes.object
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

    handleValueChange(choice, item) {
      let newValue;
      if (this.props.answer.value != null) {
        newValue = _.clone(this.props.answer.value);
      } else {
        newValue = {};
      }
      if (newValue[item.id] === choice.id) {
        delete newValue[item.id];
      } else {
        newValue[item.id] = choice.id;
      }

      return this.props.onAnswerChange(_.extend({}, this.props.answer, { value: newValue }));
    }

    renderChoice(item, choice) {
      let value;
      const id = `${item.id}:${choice.id}`;
      if (this.props.answer.value != null) {
        value = this.props.answer.value[item.id];
      } else {
        value = null;
      }
      return R('td', {key: id},
        // id is used for testing
        R('div', {className: `touch-radio ${value === choice.id ? "checked" : ""}`, id, onClick: this.handleValueChange.bind(null, choice, item)},
          formUtils.localizeString(choice.label, this.context.locale))
      );
    }

    // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
    //renderChoiceLabel: (choice) ->
    //  R 'td', key: "label#{choice.id}",
    //    formUtils.localizeString(choice.label, @context.locale)

    renderItem(item) {
      return R('tr', null,
        R('td', null,
          R('b', null, formUtils.localizeString(item.label, this.context.locale)),
          item.hint ?
            R('div', null,
              R('span', {className: "", style: {color: '#888'}},
                formUtils.localizeString(item.hint, this.context.locale))) : undefined
        ),
        _.map(this.props.choices, choice => this.renderChoice(item, choice)));
    }

    render() {
      return R('table', {className: "", style: {width: '100%'}},
        // IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
        //R 'thead', null,
        //  R 'tr', null,
        //    R('td'),
        //    _.map @props.choices, (choice) =>
        //      @renderChoiceLabel(choice)
        R('tbody', null,
          _.map(this.props.items, item => this.renderItem(item)))
      );
    }
  };
  LikertAnswerComponent.initClass();
  return LikertAnswerComponent;
})();