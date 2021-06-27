let RosterGroupComponent;
import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
const R = React.createElement;

import formUtils from './formUtils';
import TextExprsComponent from './TextExprsComponent';

// TODO Add focus()

// Rosters are repeated information, such as asking questions about household members N times.
// A roster group is a group of questions that is asked once for each roster entry
export default RosterGroupComponent = (function() {
  RosterGroupComponent = class RosterGroupComponent extends React.Component {
    constructor(...args) {
      super(...args);
      this.handleAnswerChange = this.handleAnswerChange.bind(this);
      this.handleEntryDataChange = this.handleEntryDataChange.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
      this.isChildVisible = this.isChildVisible.bind(this);
    }

    static initClass() {
      this.contextTypes = {
        locale: PropTypes.string,
        T: PropTypes.func.isRequired  // Localizer to use
      };
  
      this.propTypes = {
        rosterGroup: PropTypes.object.isRequired, // Design of roster group. See schema
        data: PropTypes.object,      // Current data of response. 
        onDataChange: PropTypes.func.isRequired,   // Called when data changes
        isVisible: PropTypes.func.isRequired, // (id) tells if an item is visible or not
        responseRow: PropTypes.object,    // ResponseRow object (for roster entry if in roster)
        schema: PropTypes.object.isRequired
      };
        // Schema to use, including form
    }

    // Gets the id that the answer is stored under
    getAnswerId() {
      // Prefer rosterId if specified, otherwise use id.
      return this.props.rosterGroup.rosterId || this.props.rosterGroup._id;
    }

    // Get the current answer value
    getAnswer() {
      return this.props.data[this.getAnswerId()] || [];
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

    async validate(scrollToFirstInvalid) {
      // For each entry
      let foundInvalid = false;
      const iterable = this.getAnswer();
      for (let index = 0; index < iterable.length; index++) {
        const entry = iterable[index];
        const result = await this[`itemlist_${index}`].validate(scrollToFirstInvalid && !foundInvalid);
        if (result) {
          foundInvalid = true;
        }
      }

      return foundInvalid;
    }

    isChildVisible(index, id) {
      return this.props.isVisible(`${this.getAnswerId()}.${index}.${id}`);
    }

    renderName() {
      return R('h4', {key: "prompt"},
        formUtils.localizeString(this.props.rosterGroup.name, this.context.locale));
    }

    renderEntryTitle(entry, index) {
      return R(TextExprsComponent, {
        localizedStr: this.props.rosterGroup.entryTitle,
        exprs: this.props.rosterGroup.entryTitleExprs,
        schema: this.props.schema,
        responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
        locale: this.context.locale
      }
      );
    }

    renderEntry(entry, index) {
      // To avoid circularity
      const ItemListComponent = require('./ItemListComponent');

      return R('div', {key: index, className: "panel panel-default"}, 
        R('div', {key: "header", className: "panel-heading", style: { fontWeight: "bold" }},
          `${index + 1}. `,
          this.renderEntryTitle(entry, index)),
        R('div', {key: "body", className: "panel-body"},
          this.props.rosterGroup.allowRemove ?
            R('button', {type: "button", style: { float: "right" }, className: "btn btn-sm btn-link", onClick: this.handleRemove.bind(null, index)},
              R('span', {className: "glyphicon glyphicon-remove"})) : undefined,  

          R(ItemListComponent, {
            ref: (c => { return this[`itemlist_${index}`] = c; }), 
            contents: this.props.rosterGroup.contents,
            data: this.getAnswer()[index].data,
            responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), index),
            onDataChange: this.handleEntryDataChange.bind(null, index),
            isVisible: this.isChildVisible.bind(null, index),
            schema: this.props.schema
          }
          )
        )
      );
    }

    renderAdd() {
      if (this.props.rosterGroup.allowAdd) {
        return R('div', {key: "add"},
          R('button', {type: "button", className: "btn btn-default btn-sm", onClick: this.handleAdd},
            R('span', {className: "glyphicon glyphicon-plus"}),
            " " + this.context.T("Add"))
        );
      }
    }

    renderEmptyPrompt() {
      return R('div', {style: { fontStyle: "italic" }}, 
        formUtils.localizeString(this.props.rosterGroup.emptyPrompt, this.context.locale) || this.context.T("Click +Add to add an item"));
    }

    render() {
      return R('div', {style: { padding: 5, marginBottom: 20 }},
        this.renderName(),
        _.map(this.getAnswer(), (entry, index) => this.renderEntry(entry, index)),

        // Display message if none and can add
        (this.getAnswer().length === 0) && this.props.rosterGroup.allowAdd ?
          this.renderEmptyPrompt() : undefined,

        this.renderAdd());
    }
  };
  RosterGroupComponent.initClass();
  return RosterGroupComponent;
})(); 