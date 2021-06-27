let MatrixAnswerComponent;
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import formUtils from '../formUtils';
import MatrixColumnCellComponent from '../MatrixColumnCellComponent';
import ValidationCompiler from './ValidationCompiler';

// Matrix with columns and items
export default MatrixAnswerComponent = (function() {
  MatrixAnswerComponent = class MatrixAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes =
        {locale: PropTypes.string};  // Current locale (e.g. "en")
  
      this.propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
          // Unique (within the question) id of the item. Cannot be "na" or "dontknow" as they are reserved for alternates
          id: PropTypes.string.isRequired,
  
          // Label of the choice, localized
          label: PropTypes.object.isRequired,
  
          // Hint associated with a choice
          hint: PropTypes.object
        })).isRequired,
  
        // Array of matrix columns
        columns: PropTypes.array.isRequired,
  
        value: PropTypes.object,                    // See answer format
        onValueChange: PropTypes.func.isRequired,
        alternate: PropTypes.string,                // Alternate value if selected
  
        data: PropTypes.object,      // Current data of response (for roster entry if in roster)
        responseRow: PropTypes.object,    // ResponseRow object (for roster entry if in roster)
        schema: PropTypes.object.isRequired
      };
        // Schema to use, including form
    }

    constructor(props) {
      this.handleCellChange = this.handleCellChange.bind(this);
      super(props);

      this.state = {
        validationErrors: {}  // Map of "<item.id>_<column.id>" to validation error
      };
    }

    focus() {
      // TODO
      return null;
    }

    // Validate a matrix answer. Returns true if invalid was found, false otherwise
    validate() {
      // Alternate selected means cannot be invalid
      if (this.props.alternate) {
        return false;
      }

      const validationErrors = {};

      // Important to let know the caller if something has been found (so it can scrollToFirst properly)
      let foundInvalid = false;

      // For each entry
      for (let rowIndex = 0; rowIndex < this.props.items.length; rowIndex++) {
        // For each column
        const item = this.props.items[rowIndex];
        for (let columnIndex = 0; columnIndex < this.props.columns.length; columnIndex++) {
          const column = this.props.columns[columnIndex];
          const key = `${item.id}_${column._id}`;

          const data = this.props.value?.[item.id]?.[column._id];

          if (column.required && ((data?.value == null) || (data?.value === ''))) {
            foundInvalid = true;
            validationErrors[key] = true;
            continue;
          }

          if (column.validations && (column.validations.length > 0)) {
            const validationError = new ValidationCompiler(this.context.locale).compileValidations(column.validations)(data);
            if (validationError) {
              foundInvalid = true;
              validationErrors[key] = validationError;
            }
          }
        }
      }

      // Save state
      this.setState({validationErrors});

      return foundInvalid;
    }

    handleCellChange(item, column, answer) {
      let matrixValue = this.props.value || {};

      // Get data of the item, which is indexed by item id in the answer
      let itemData = matrixValue[item.id] || {};

      // Set column in item
      let change = {};
      change[column._id] = answer;
      itemData = _.extend({}, itemData, change);

      // Set item data within value
      change = {};
      change[item.id] = itemData;
      matrixValue = _.extend({}, matrixValue, change);

      return this.props.onValueChange(matrixValue);
    }

    renderColumnHeader(column, index) {
      return R('th', {key: `header:${column._id}`},
        formUtils.localizeString(column.text, this.context.locale),

        // Required star
        column.required ?
          R('span', {className: "required"}, "*") : undefined
      );
    }

    // Render the header row
    renderHeader() {
      return R('thead', null,
        R('tr', null,
          // First item
          R('th', null),
          _.map(this.props.columns, (column, index) => this.renderColumnHeader(column, index)))
      );
    }

    renderCell(item, itemIndex, column, columnIndex) {
      const matrixValue = this.props.value || {};

      // Get data of the item, which is indexed by item id in the answer
      const itemData = matrixValue[item.id] || {};

      // Get cell answer which is inside the item data, indexed by column id
      const cellAnswer = itemData[column._id] || {};

      // Determine if invalid
      const key = `${item.id}_${column._id}`;
      const invalid = this.state.validationErrors[key];

      // Render cell
      return R(MatrixColumnCellComponent, { 
        key: column._id,
        column,
        data: this.props.data,
        responseRow: this.props.responseRow,
        answer: cellAnswer,
        onAnswerChange: this.handleCellChange.bind(null, item, column),
        invalid: (invalid != null),
        schema: this.props.schema
      }
      );
    }

    renderItem(item, index) {
      return R('tr', {key: index},
        R('td', {key: "_item"}, 
          R('label', null, formUtils.localizeString(item.label, this.context.locale)),
          item.hint ?
            [
              R('br'),
              R('div', {className: "text-muted"}, formUtils.localizeString(item.hint, this.context.locale))
            ] : undefined),
        _.map(this.props.columns, (column, columnIndex) => this.renderCell(item, index, column, columnIndex)));
    }

    render() {
      // Create table
      // borderCollapse is set to separate (overriding bootstrap table value), so that we can properly see the validation
      // error borders (or else the top one of the first row is missing since it's being collapsed with the th border)
      return R('table', {className: "table", style: {borderCollapse: 'separate'}},
        this.renderHeader(),
        R('tbody', null,
          _.map(this.props.items, (item, index) => this.renderItem(item, index)))
      );
    }
  };
  MatrixAnswerComponent.initClass();
  return MatrixAnswerComponent;
})();
