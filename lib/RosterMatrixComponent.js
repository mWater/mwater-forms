var AnswerValidator, H, MatrixColumnCellComponent, PropTypes, R, React, ReorderableListComponent, RosterMatrixComponent, _, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

AnswerValidator = require('./answers/AnswerValidator');

ReorderableListComponent = require("react-library/lib/reorderable/ReorderableListComponent");

MatrixColumnCellComponent = require('./MatrixColumnCellComponent');

module.exports = RosterMatrixComponent = (function(superClass) {
  extend(RosterMatrixComponent, superClass);

  RosterMatrixComponent.contextTypes = {
    locale: PropTypes.string,
    T: PropTypes.func.isRequired
  };

  RosterMatrixComponent.propTypes = {
    rosterMatrix: PropTypes.object.isRequired,
    data: PropTypes.object,
    onDataChange: PropTypes.func.isRequired,
    isVisible: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired
  };

  function RosterMatrixComponent() {
    this.renderEntry = bind(this.renderEntry, this);
    this.handleSort = bind(this.handleSort, this);
    this.handleCellChange = bind(this.handleCellChange, this);
    this.handleRemove = bind(this.handleRemove, this);
    this.handleAdd = bind(this.handleAdd, this);
    this.handleEntryDataChange = bind(this.handleEntryDataChange, this);
    this.handleAnswerChange = bind(this.handleAnswerChange, this);
    RosterMatrixComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      validationErrors: {}
    };
  }

  RosterMatrixComponent.prototype.getAnswerId = function() {
    return this.props.rosterMatrix.rosterId || this.props.rosterMatrix._id;
  };

  RosterMatrixComponent.prototype.getAnswer = function() {
    return this.props.data[this.getAnswerId()] || [];
  };

  RosterMatrixComponent.prototype.validate = function(scrollToFirstInvalid) {
    var column, columnIndex, entry, foundInvalid, i, j, key, len, len1, ref, ref1, ref2, ref3, rowIndex, validationError, validationErrors;
    validationErrors = {};
    foundInvalid = false;
    ref = this.getAnswer();
    for (rowIndex = i = 0, len = ref.length; i < len; rowIndex = ++i) {
      entry = ref[rowIndex];
      ref1 = this.props.rosterMatrix.contents;
      for (columnIndex = j = 0, len1 = ref1.length; j < len1; columnIndex = ++j) {
        column = ref1[columnIndex];
        key = rowIndex + "_" + column._id;
        if (column.required && ((((ref2 = entry.data[column._id]) != null ? ref2.value : void 0) == null) || ((ref3 = entry.data[column._id]) != null ? ref3.value : void 0) === '')) {
          foundInvalid = true;
          validationErrors[key] = true;
        }
        if (column.validations && column.validations.length > 0) {
          validationError = new AnswerValidator().compileValidations(column.validations)(entry.data[column._id]);
          if (validationError) {
            foundInvalid = true;
            validationErrors[key] = validationError;
          }
        }
      }
    }
    this.setState({
      validationErrors: validationErrors
    });
    if (foundInvalid && scrollToFirstInvalid) {
      this.refs.prompt.scrollIntoView();
    }
    return foundInvalid;
  };

  RosterMatrixComponent.prototype.handleAnswerChange = function(answer) {
    var change;
    change = {};
    change[this.getAnswerId()] = answer;
    return this.props.onDataChange(_.extend({}, this.props.data, change));
  };

  RosterMatrixComponent.prototype.handleEntryDataChange = function(index, data) {
    var answer;
    answer = this.getAnswer().slice();
    answer[index] = _.extend({}, answer[index], {
      data: data
    });
    return this.handleAnswerChange(answer);
  };

  RosterMatrixComponent.prototype.handleAdd = function() {
    var answer;
    answer = this.getAnswer().slice();
    answer.push({
      _id: formUtils.createUid(),
      data: {}
    });
    return this.handleAnswerChange(answer);
  };

  RosterMatrixComponent.prototype.handleRemove = function(index) {
    var answer;
    answer = this.getAnswer().slice();
    answer.splice(index, 1);
    return this.handleAnswerChange(answer);
  };

  RosterMatrixComponent.prototype.handleCellChange = function(entryIndex, columnId, answer) {
    var change, data;
    data = this.getAnswer()[entryIndex].data;
    change = {};
    change[columnId] = answer;
    data = _.extend({}, data, change);
    return this.handleEntryDataChange(entryIndex, data);
  };

  RosterMatrixComponent.prototype.handleSort = function(column, order) {
    var answer;
    answer = this.getAnswer();
    answer = _.sortByOrder(answer, [
      ((function(_this) {
        return function(item) {
          var ref;
          return (ref = item.data[column._id]) != null ? ref.value : void 0;
        };
      })(this))
    ], [order]);
    return this.handleAnswerChange(answer);
  };

  RosterMatrixComponent.prototype.renderName = function() {
    return H.h3({
      key: "prompt",
      ref: "prompt"
    }, formUtils.localizeString(this.props.rosterMatrix.name, this.context.locale));
  };

  RosterMatrixComponent.prototype.renderColumnHeader = function(column, index) {
    var ref;
    return H.th({
      key: column._id
    }, formUtils.localizeString(column.text, this.context.locale), column.required ? H.span({
      className: "required"
    }, "*") : void 0, (ref = column._type) === "TextColumnQuestion" || ref === "NumberColumnQuestion" || ref === "DateColumnQuestion" ? H.div({
      style: {
        float: "right"
      }
    }, H.span({
      className: "table-sort-controls glyphicon glyphicon-triangle-top",
      style: {
        cursor: "pointer"
      },
      onClick: this.handleSort.bind(null, column, "asc")
    }), H.span({
      className: "table-sort-controls glyphicon glyphicon-triangle-bottom",
      style: {
        cursor: "pointer"
      },
      onClick: this.handleSort.bind(null, column, "desc")
    })) : void 0);
  };

  RosterMatrixComponent.prototype.renderHeader = function() {
    return H.thead(null, H.tr(null, _.map(this.props.rosterMatrix.contents, (function(_this) {
      return function(column, index) {
        return _this.renderColumnHeader(column, index);
      };
    })(this)), this.props.rosterMatrix.allowRemove ? H.th(null) : void 0));
  };

  RosterMatrixComponent.prototype.renderCell = function(entry, entryIndex, column, columnIndex) {
    var entryData, invalid, key;
    entryData = this.getAnswer()[entryIndex].data;
    key = entryIndex + "_" + column._id;
    invalid = this.state.validationErrors[key];
    return R(MatrixColumnCellComponent, {
      key: column._id,
      column: column,
      data: entryData,
      responseRow: this.props.responseRow.getRosterResponseRow(this.getAnswerId(), entryIndex),
      answer: (entryData != null ? entryData[column._id] : void 0) || {},
      onAnswerChange: this.handleCellChange.bind(null, entryIndex, column._id),
      invalid: invalid,
      schema: this.props.schema
    });
  };

  RosterMatrixComponent.prototype.renderEntry = function(entry, index, connectDragSource, connectDragPreview, connectDropTarget) {
    var elem;
    elem = H.tr({
      key: index
    }, _.map(this.props.rosterMatrix.contents, (function(_this) {
      return function(column, columnIndex) {
        return _this.renderCell(entry, index, column, columnIndex);
      };
    })(this)), this.props.rosterMatrix.allowRemove ? H.td({
      key: "_remove"
    }, H.button({
      type: "button",
      className: "btn btn-sm btn-link",
      onClick: this.handleRemove.bind(null, index)
    }, H.span({
      className: "glyphicon glyphicon-remove"
    }))) : void 0);
    return connectDropTarget(connectDragPreview(connectDragSource(elem)));
  };

  RosterMatrixComponent.prototype.renderAdd = function() {
    if (this.props.rosterMatrix.allowAdd) {
      return H.div({
        key: "add",
        style: {
          marginTop: 10
        }
      }, H.button({
        type: "button",
        className: "btn btn-default btn-sm",
        onClick: this.handleAdd
      }, H.span({
        className: "glyphicon glyphicon-plus"
      }), " " + this.context.T("Add")));
    }
  };

  RosterMatrixComponent.prototype.renderBody = function() {
    ({
      items: PropTypes.array.isRequired,
      onReorder: PropTypes.func.isRequired,
      renderItem: PropTypes.func.isRequired,
      listId: PropTypes.string,
      getItemId: PropTypes.func.isRequired,
      element: PropTypes.object
    });
    return R(ReorderableListComponent, {
      items: this.getAnswer(),
      onReorder: this.handleAnswerChange,
      renderItem: this.renderEntry,
      getItemId: (function(_this) {
        return function(entry) {
          return entry._id;
        };
      })(this),
      element: H.tbody(null)
    });
  };

  RosterMatrixComponent.prototype.render = function() {
    return H.div({
      style: {
        padding: 5,
        marginBottom: 20
      }
    }, this.renderName(), H.table({
      className: "table"
    }, this.renderHeader(), this.renderBody()), this.getAnswer().length === 0 ? H.div({
      style: {
        paddingLeft: 20
      }
    }, H.i(null, this.context.T("None"))) : void 0, this.renderAdd());
  };

  return RosterMatrixComponent;

})(React.Component);
