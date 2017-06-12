var AnswerValidator, H, MatrixAnswerComponent, MatrixColumnCellComponent, PropTypes, R, React, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

MatrixColumnCellComponent = require('../MatrixColumnCellComponent');

AnswerValidator = require('./AnswerValidator');

module.exports = MatrixAnswerComponent = (function(superClass) {
  extend(MatrixAnswerComponent, superClass);

  MatrixAnswerComponent.contextTypes = {
    locale: PropTypes.string
  };

  MatrixAnswerComponent.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.object.isRequired,
      hint: PropTypes.object
    })).isRequired,
    columns: PropTypes.array.isRequired,
    value: PropTypes.object,
    onValueChange: PropTypes.func.isRequired,
    alternate: PropTypes.string,
    data: PropTypes.object,
    responseRow: PropTypes.object,
    schema: PropTypes.object.isRequired
  };

  function MatrixAnswerComponent() {
    this.handleCellChange = bind(this.handleCellChange, this);
    MatrixAnswerComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      validationErrors: {}
    };
  }

  MatrixAnswerComponent.prototype.focus = function() {
    return null;
  };

  MatrixAnswerComponent.prototype.validate = function() {
    var column, columnIndex, data, foundInvalid, i, item, j, key, len, len1, ref, ref1, ref2, ref3, rowIndex, validationError, validationErrors;
    if (this.props.alternate) {
      return false;
    }
    validationErrors = {};
    foundInvalid = false;
    ref = this.props.items;
    for (rowIndex = i = 0, len = ref.length; i < len; rowIndex = ++i) {
      item = ref[rowIndex];
      ref1 = this.props.columns;
      for (columnIndex = j = 0, len1 = ref1.length; j < len1; columnIndex = ++j) {
        column = ref1[columnIndex];
        key = item.id + "_" + column._id;
        data = (ref2 = this.props.value) != null ? (ref3 = ref2[item.id]) != null ? ref3[column._id] : void 0 : void 0;
        if (column.required && (((data != null ? data.value : void 0) == null) || (data != null ? data.value : void 0) === '')) {
          foundInvalid = true;
          validationErrors[key] = true;
          continue;
        }
        if (column.validations && column.validations.length > 0) {
          validationError = new AnswerValidator().compileValidations(column.validations)(data);
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
    return foundInvalid;
  };

  MatrixAnswerComponent.prototype.handleCellChange = function(item, column, answer) {
    var change, itemData, matrixValue;
    matrixValue = this.props.value || {};
    itemData = matrixValue[item.id] || {};
    change = {};
    change[column._id] = answer;
    itemData = _.extend({}, itemData, change);
    change = {};
    change[item.id] = itemData;
    matrixValue = _.extend({}, matrixValue, change);
    return this.props.onValueChange(matrixValue);
  };

  MatrixAnswerComponent.prototype.renderColumnHeader = function(column, index) {
    return H.th({
      key: "header:" + column._id
    }, formUtils.localizeString(column.text, this.context.locale), column.required ? H.span({
      className: "required"
    }, "*") : void 0);
  };

  MatrixAnswerComponent.prototype.renderHeader = function() {
    return H.thead(null, H.tr(null, H.th(null), _.map(this.props.columns, (function(_this) {
      return function(column, index) {
        return _this.renderColumnHeader(column, index);
      };
    })(this))));
  };

  MatrixAnswerComponent.prototype.renderCell = function(item, itemIndex, column, columnIndex) {
    var cellAnswer, invalid, itemData, key, matrixValue;
    matrixValue = this.props.value || {};
    itemData = matrixValue[item.id] || {};
    cellAnswer = itemData[column._id] || {};
    key = item.id + "_" + column._id;
    invalid = this.state.validationErrors[key];
    return R(MatrixColumnCellComponent, {
      key: column._id,
      column: column,
      data: this.props.data,
      responseRow: this.props.responseRow,
      answer: cellAnswer,
      onAnswerChange: this.handleCellChange.bind(null, item, column),
      invalid: invalid != null,
      schema: this.props.schema
    });
  };

  MatrixAnswerComponent.prototype.renderItem = function(item, index) {
    return H.tr({
      key: index
    }, H.td({
      key: "_item"
    }, H.label(null, formUtils.localizeString(item.label, this.context.locale)), item.hint ? [
      H.br(), H.div({
        className: "text-muted"
      }, formUtils.localizeString(item.hint, this.context.locale))
    ] : void 0), _.map(this.props.columns, (function(_this) {
      return function(column, columnIndex) {
        return _this.renderCell(item, index, column, columnIndex);
      };
    })(this)));
  };

  MatrixAnswerComponent.prototype.render = function() {
    return H.table({
      className: "table",
      style: {
        borderCollapse: 'separate'
      }
    }, this.renderHeader(), H.tbody(null, _.map(this.props.items, (function(_this) {
      return function(item, index) {
        return _this.renderItem(item, index);
      };
    })(this))));
  };

  return MatrixAnswerComponent;

})(React.Component);
