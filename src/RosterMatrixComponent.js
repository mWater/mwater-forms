let RosterMatrixComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import formUtils from './formUtils';
import ValidationCompiler from './answers/ValidationCompiler';
import ReorderableListComponent from "react-library/lib/reorderable/ReorderableListComponent";
import MatrixColumnCellComponent from './MatrixColumnCellComponent';

// Rosters are repeated information, such as asking questions about household members N times.
// A roster matrix is a list of column-type questions with one row for each entry in the roster
export default RosterMatrixComponent = (function() {
  RosterMatrixComponent = class RosterMatrixComponent extends React.Component {
    static initClass() {
      this.contextTypes = {
        locale: PropTypes.string,
        T: PropTypes.func.isRequired  // Localizer to use
      };
  
      this.propTypes = {
        rosterMatrix: PropTypes.object.isRequired, // Design of roster matrix. See schema
        data: PropTypes.object,      // Current data of response. 
        onDataChange: PropTypes.func.isRequired,   // Called when data changes
        isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
        schema: PropTypes.object.isRequired
      };
        // Schema to use, including form
    }

    constructor(props) {
      this.handleAnswerChange = this.handleAnswerChange.bind(this);
      this.handleEntryDataChange = this.handleEntryDataChange.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
      this.handleCellChange = this.handleCellChange.bind(this);
      this.handleSort = this.handleSort.bind(this);
      this.renderEntry = this.renderEntry.bind(this);
      super(props);

      this.state = {
        validationErrors: {}  // Map of "<rowindex>_<columnid>" to validation error
      };
    }

    // Gets the id that the answer is stored under
    getAnswerId() {
      // Prefer rosterId if specified, otherwise use id. 
      return this.props.rosterMatrix.rosterId || this.props.rosterMatrix._id;
    }

    // Get the current answer value
    getAnswer() {
      return this.props.data[this.getAnswerId()] || [];
    }

    validate(scrollToFirstInvalid) {
      const validationErrors = {};

      // For each entry
      let foundInvalid = false;
      const iterable = this.getAnswer();
      for (let rowIndex = 0; rowIndex < iterable.length; rowIndex++) {
        // For each column
        const entry = iterable[rowIndex];
        for (let columnIndex = 0; columnIndex < this.props.rosterMatrix.contents.length; columnIndex++) {
          const column = this.props.rosterMatrix.contents[columnIndex];
          const key = `${rowIndex}_${column._id}`;

          if (column.required && ((entry.data[column._id]?.value == null) || (entry.data[column._id]?.value === ''))) {
            foundInvalid = true;
            validationErrors[key] = true;
          }

          if (column.validations && (column.validations.length > 0)) {
            const validationError = new ValidationCompiler(this.context.locale).compileValidations(column.validations)(entry.data[column._id]);
            if (validationError) {
              foundInvalid = true;
              validationErrors[key] = validationError;
            }
          }
        }
      }

      // Save state
      this.setState({validationErrors});

      // Scroll into view
      if (foundInvalid && scrollToFirstInvalid) {
        this.prompt.scrollIntoView();
      }

      return foundInvalid;
    }

    // Propagate an answer change to the onDataChange
    handleAnswerChange(answer) {
      const change = {};
      change[this.getAnswerId()] = answer;
      return this.props.onDataChange(_.extend({}, this.props.data, change));
    }

    // Handles a change in data of a specific entry of the roster
    handleEntryDataChange(index, data) {
      const answer = this.getAnswer().slice();
      answer[index] = _.extend({}, answer[index], { data });
      return this.handleAnswerChange(answer);
    }

    handleAdd() {
      const answer = this.getAnswer().slice();
      answer.push({ _id: formUtils.createUid(), data: {} });
      return this.handleAnswerChange(answer);
    }

    handleRemove(index) {
      const answer = this.getAnswer().slice();
      answer.splice(index, 1);
      return this.handleAnswerChange(answer);
    }

    handleCellChange(entryIndex, columnId, answer) {
      let {
        data
      } = this.getAnswer()[entryIndex];
      const change = {};
      change[columnId] = answer;
      data = _.extend({}, data, change);

      return this.handleEntryDataChange(entryIndex, data);
    }

    handleSort(column, order) {
      let answer = this.getAnswer();
      answer = _.sortByOrder(answer, [(item => item.data[column._id]?.value)], [order]);
      return this.handleAnswerChange(answer);
    }

    renderName() {
      return R('h4', {key: "prompt", ref: (c => { return this.prompt = c; })},
        formUtils.localizeString(this.props.rosterMatrix.name, this.context.locale));
    }

    renderColumnHeader(column, index) {
      return R('th', {key: column._id},
        formUtils.localizeString(column.text, this.context.locale),

        // Required star
        column.required ?
          R('span', {className: "required"}, "*") : undefined,

        // Allow sorting
        ["TextColumnQuestion", "NumberColumnQuestion", "DateColumnQuestion"].includes(column._type) ?
          R('div', {style: { float: "right" }},
            R('span', {className: "table-sort-controls glyphicon glyphicon-triangle-top", style: { cursor: "pointer" }, onClick: this.handleSort.bind(null, column, "asc")}),
            R('span', {className: "table-sort-controls glyphicon glyphicon-triangle-bottom", style: { cursor: "pointer" }, onClick: this.handleSort.bind(null, column, "desc")})) : undefined
      );
    }

    renderHeader() {
      return R('thead', null,
        R('tr', null,
          _.map(this.props.rosterMatrix.contents, (column, index) => this.renderColumnHeader(column, index)),
          // Extra for remove button
          this.props.rosterMatrix.allowRemove ?
            R('th', null) : undefined
        )
      );
    }

    renderCell(entry, entryIndex, column, columnIndex) {
      // Get data of the entry
      const entryData = this.getAnswer()[entryIndex].data;

      // Determine if invalid
      const key = `${entryIndex}_${column._id}`;
      const invalid = this.state.validationErrors[key];

      // Render cell
      return R(MatrixColumnCellComponent, { 
        key: column._id,
        column,
        data: entryData,
        responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), entryIndex),
        answer: entryData?.[column._id] || {},
        onAnswerChange: this.handleCellChange.bind(null, entryIndex, column._id),
        invalid,
        schema: this.props.schema
      }
      );
    }

    renderEntry(entry, index, connectDragSource, connectDragPreview, connectDropTarget) {
      const elem = R('tr', {key: index},
        _.map(this.props.rosterMatrix.contents, (column, columnIndex) => this.renderCell(entry, index, column, columnIndex)),
        this.props.rosterMatrix.allowRemove ?
          R('td', {key: "_remove"},
            R('button', {type: "button", className: "btn btn-sm btn-link", onClick: this.handleRemove.bind(null, index)},
              R('span', {className: "glyphicon glyphicon-remove"}))
          ) : undefined
      );  

      return connectDropTarget(connectDragPreview(connectDragSource(elem)));
    }

    renderAdd() {
      if (this.props.rosterMatrix.allowAdd) {
        return R('div', {key: "add", style: { marginTop: 10 }},
          R('button', {type: "button", className: "btn btn-primary", onClick: this.handleAdd},
            R('span', {className: "glyphicon glyphicon-plus"}),
            " " + this.context.T("Add"))
        );
      }
    }

    renderBody() {
      return R(ReorderableListComponent, {
        items: this.getAnswer(),
        onReorder: this.handleAnswerChange,
        renderItem: this.renderEntry,
        getItemId: entry => entry._id,
        element: R('tbody', null)
      }
      );
    }

    renderEmptyPrompt() {
      return R('div', {style: { fontStyle: "italic" }}, 
        formUtils.localizeString(this.props.rosterMatrix.emptyPrompt, this.context.locale) || this.context.T("Click +Add to add an item"));
    }

    render() {
      return R('div', {style: { padding: 5, marginBottom: 20 }},
        this.renderName(),
        R('table', {className: "table"},
          this.renderHeader(),
          this.renderBody()),

        // Display message if none and can add
        (this.getAnswer().length === 0) && this.props.rosterMatrix.allowAdd ?
          this.renderEmptyPrompt() : undefined,

        this.renderAdd());
    }
  };
  RosterMatrixComponent.initClass();
  return RosterMatrixComponent; 
})();


