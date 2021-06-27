// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let VisibilityCalculator;
import _ from 'lodash';
import * as formUtils from './formUtils';
import async from 'async';
import * as conditionUtils from './conditionUtils';
import { PromiseExprEvaluator } from 'mwater-expressions';

/*

Uses conditions to defines the visibility status of all the Sections, Questions, Instructions, Group, RosterGroup and RosterMatrix
The result is kept in the visibilityStructure. It contains an entry with true or false for each element (should never be null or undefined)
A parent (like a section or a group), will always force visible to false for all their children if they are invisible.
The usage is fairly simple. It's created with a form and then the visibilityStructure is recalculated with specify data each time it changes.

Visibility is based both on simple conditions (see conditionUtils), but also on conditionExpr (advanced conditions made of mwater-expressions) 
which need access to the entities which the questions may reference.

Non-rosters are just referenced by id: e.g. { "somequestionid": true }

Unless it is a matrix, in which case it is referenced by "questionid.itemid.columnid"

Rosters are referenced by entry index: e.g. { "somerosterid.2.somequestionid": true }


*/
export default VisibilityCalculator = class VisibilityCalculator {
  constructor(formDesign, schema) {
    this.formDesign = formDesign;
    this.schema = schema;
  }

  // Updates the visibilityStructure dictionary with one entry for each element
  // data is the data of the response
  // responseRow is a ResponseRow which represents the same row
  createVisibilityStructure(data, responseRow, callback) {
    const visibilityStructure = {};
    return this.processItem(this.formDesign, false, data, responseRow, visibilityStructure, "", error => {
      if (error) {
        return callback(error);
      } else {
        return callback(null, visibilityStructure);
      }
    });
  }

  // Process a form, section or a group (they both behave the same way when it comes to determining visibility)
  processGroup(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    // Once visibility is calculated, call this
    let isVisible;
    const applyResult = isVisible => {
      // Forms don't have an _id at design level
      if (item._id) {
        visibilityStructure[prefix + item._id] = isVisible;
      }

      return async.each(item.contents, (subitem, cb) => {
        return this.processItem(subitem, isVisible === false, data, responseRow, visibilityStructure, prefix, () => _.defer(cb));
      }
      , callback);
    };


    // Always visible if no condition has been set
    if (forceToInvisible) {
      isVisible = false;
    } else if ((item.conditions != null) && (item.conditions.length > 0)) {
      const conditions = conditionUtils.compileConditions(item.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }

    // Apply conditionExpr
    if (item.conditionExpr) {
      return new PromiseExprEvaluator({ schema: this.schema }).evaluate(item.conditionExpr, { row: responseRow }).then(value => {
        // Null or false is not visible
        if (!value) { 
          isVisible = false;
        }

        return applyResult(isVisible);
      }).catch(error => callback(error));
    } else {
      return applyResult(isVisible);
    }
  }

  // If the parent is invisible, forceToInvisible is set to true and the item will be invisible no matter what
  // The prefix contains the info set by a RosterGroup or a RosterMatrix
  processItem(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    if (formUtils.isQuestion(item)) {
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (['TextColumn', 'Calculation'].includes(item._type)) {
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (item._type === "Instructions") {
      // Behaves like a question
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (item._type === "Timer") {
      // Behaves like a question
      return this.processQuestion(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if ((item._type === "RosterGroup") || (item._type === "RosterMatrix")) {
      return this.processRoster(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else if (['Section', "Group", "Form"].includes(item._type)) {
      return this.processGroup(item, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback);
    } else {
      return callback(new Error('Unknow item type'));
    }
  }

  // Sets visible to false if forceToInvisible is true or the conditions and data make the question invisible
  // The prefix contains the info set by a RosterGroup or a RosterMatrix
  processQuestion(question, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    // Once visibility is calculated, call this
    let isVisible;
    const applyResult = isVisible => {
      visibilityStructure[prefix + question._id] = isVisible;

      if (question._type === 'MatrixQuestion') {
        return async.each(question.items, (item, cb) => {
          return async.each(question.columns, (column, cb2) => {
            const newPrefix = `${question._id}.${item.id}.`;
            return this.processItem(column, isVisible === false, data, responseRow, visibilityStructure, newPrefix, () => _.defer(cb2));
          }
          , cb);
        }
        , callback);
      } else {
        return callback(null);
      }
    };
  
    if (forceToInvisible) {
      isVisible = false;
    } else if ((question.conditions != null) && (question.conditions.length > 0)) {
      const conditions = conditionUtils.compileConditions(question.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }

    // Apply randomAsk
    if ((question.randomAskProbability != null) && (data[question._id]?.randomAsked === false)) {
      isVisible = false;
    }

    // Apply conditionExpr
    if (question.conditionExpr) {
      return new PromiseExprEvaluator({ schema: this.schema }).evaluate(question.conditionExpr, { row: responseRow }).then(value => {
        // Null or false is not visible
        if (!value) { 
          isVisible = false;
        }

        return applyResult(isVisible);
      }).catch(error => callback(error));
    } else {
      return applyResult(isVisible);
    }
  }

  // Handles RosterGroup and RosterMatrix
  // The visibility of the Rosters are similar to questions, the extra logic is for handling the children
  // The logic is a bit more tricky when a rosterId is set. It uses that other roster data for calculating the visibility of its children.
  processRoster(rosterGroup, forceToInvisible, data, responseRow, visibilityStructure, prefix, callback) {
    let isVisible;
    if ((rosterGroup._type !== 'RosterGroup') && (rosterGroup._type !== 'RosterMatrix')) {
      throw new Error('Should be a RosterGroup or RosterMatrix');
    }

    const applyResult = isVisible => {
      let dataId;
      visibilityStructure[rosterGroup._id] = isVisible;

      // The data used (and passed down to sub items) is the one specified by rosterId if set
      if (rosterGroup.rosterId != null) {
        dataId = rosterGroup.rosterId;
      // Else the RosterGroup uses its own data
      } else {
        dataId = rosterGroup._id;
      }
      const subData = data[dataId];

      if (subData != null) {
        // Get subrows
        return responseRow.followJoin(`data:${dataId}`).then(rosterRows => {
          // For each entry of roster
          return async.forEachOf(subData, (entry, index, cb) => {
            return async.each(rosterGroup.contents, (item, cb2) => {
              const newPrefix = `${dataId}.${index}.`;

              // Data is actually stored in .data subfield
              return this.processItem(item, isVisible === false, entry.data, rosterRows[index], visibilityStructure, newPrefix, cb2);
            }
            , cb);
          }
          , callback);
        }).catch(callback);
      } else {
        return callback(null);
      }
    };

    if (forceToInvisible) {
      isVisible = false;
    } else if ((rosterGroup.conditions != null) && (rosterGroup.conditions.length > 0)) {
      const conditions = conditionUtils.compileConditions(rosterGroup.conditions, this.formDesign);
      isVisible = conditions(data);
    } else {
      isVisible = true;
    }

    // Apply conditionExpr
    if (rosterGroup.conditionExpr) {
      return new PromiseExprEvaluator({ schema: this.schema }).evaluate(rosterGroup.conditionExpr, { row: responseRow }).then(value => {
        // Null or false is not visible
        if (!value) { 
          isVisible = false;
        }

        return applyResult(isVisible);
      }).catch(error => callback(error));
    } else {
      return applyResult(isVisible);
    }
  }
};
