var H, NumberAnswerComponent, R, React, RosterMatrixComponent, _, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

NumberAnswerComponent = require('./answers/NumberAnswerComponent');

module.exports = RosterMatrixComponent = (function(superClass) {
  extend(RosterMatrixComponent, superClass);

  function RosterMatrixComponent() {
    this.handleCellChange = bind(this.handleCellChange, this);
    this.handleRemove = bind(this.handleRemove, this);
    this.handleAdd = bind(this.handleAdd, this);
    this.handleDataChange = bind(this.handleDataChange, this);
    return RosterMatrixComponent.__super__.constructor.apply(this, arguments);
  }

  RosterMatrixComponent.contextTypes = {
    locale: React.PropTypes.string,
    isVisible: React.PropTypes.func.isRequired
  };

  RosterMatrixComponent.propTypes = {
    rosterMatrix: React.PropTypes.object.isRequired,
    answer: React.PropTypes.arrayOf(React.PropTypes.object.isRequired),
    onAnswerChange: React.PropTypes.func.isRequired
  };

  RosterMatrixComponent.prototype.handleDataChange = function(index, data) {
    var answer;
    answer = (this.props.answer || []).slice();
    answer[index] = data;
    return this.props.onAnswerChange(answer);
  };

  RosterMatrixComponent.prototype.handleAdd = function() {
    var answer;
    answer = (this.props.answer || []).slice();
    answer.push({});
    return this.props.onAnswerChange(answer);
  };

  RosterMatrixComponent.prototype.handleRemove = function(index) {
    var answer;
    answer = (this.props.answer || []).slice();
    answer.splice(index, 1);
    return this.props.onAnswerChange(answer);
  };

  RosterMatrixComponent.prototype.handleCellChange = function(entryIndex, columnId, value) {
    var change, data;
    data = this.props.answer[entryIndex];
    change = {};
    change[columnId] = value;
    data = _.extend({}, data, change);
    return this.handleDataChange(entryIndex, data);
  };

  RosterMatrixComponent.prototype.renderName = function() {
    return H.h3({
      key: "prompt"
    }, formUtils.localizeString(this.props.rosterMatrix.name, this.context.locale));
  };

  RosterMatrixComponent.prototype.renderColumnHeader = function(column, index) {
    return H.th({
      key: column._id
    }, formUtils.localizeString(column.name, this.context.locale), column.required ? H.span({
      className: "required"
    }, "*") : void 0);
  };

  RosterMatrixComponent.prototype.renderHeader = function() {
    return H.thead(null, H.tr(null, _.map(this.props.rosterMatrix.columns, (function(_this) {
      return function(column, index) {
        return _this.renderColumnHeader(column, index);
      };
    })(this)), this.props.rosterMatrix.allowRemove ? H.th(null) : void 0));
  };

  RosterMatrixComponent.prototype.renderCell = function(entry, entryIndex, column, columnIndex) {
    var elem, value;
    value = this.props.answer[entryIndex][column._id];
    switch (column._type) {
      case "Text":
        elem = H.input({
          type: "text",
          className: "form-control input-sm",
          value: value,
          onChange: (function(_this) {
            return function(ev) {
              return _this.handleCellChange(entryIndex, column._id, ev.target.value);
            };
          })(this)
        });
        break;
      case "Number":
        elem = R(NumberAnswerComponent, {
          small: true,
          style: {
            maxWidth: "10em"
          },
          value: value,
          onChange: (function(_this) {
            return function(val) {
              return _this.handleCellChange(entryIndex, column._id, val);
            };
          })(this)
        });
        break;
      case "Checkbox":
        elem = H.div({
          className: "touch-checkbox " + (value ? "checked" : ""),
          onClick: (function(_this) {
            return function() {
              return _this.handleCellChange(entryIndex, column._id, !value);
            };
          })(this),
          style: {
            display: "inline-block"
          }
        }, "\u200B");
        break;
      case "Dropdown":
        elem = H.select({
          className: "form-control input-sm",
          style: {
            width: "auto"
          },
          value: value,
          onChange: ((function(_this) {
            return function(ev) {
              return _this.handleCellChange(entryIndex, column._id, ev.target.value ? ev.target.value : null);
            };
          })(this))
        }, H.option({
          key: "__none__",
          value: ""
        }), _.map(column.choices, (function(_this) {
          return function(choice) {
            var text;
            text = formUtils.localizeString(choice.label, _this.context.locale);
            return H.option({
              key: choice.id,
              value: choice.id
            }, text);
          };
        })(this)));
    }
    return H.td(null, elem);
  };

  RosterMatrixComponent.prototype.renderEntry = function(entry, index) {
    return H.tr({
      key: index
    }, _.map(this.props.rosterMatrix.columns, (function(_this) {
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
      }), " " + T("Add")));
    }
  };

  RosterMatrixComponent.prototype.render = function() {
    return H.div({
      style: {
        padding: 5,
        marginBottom: 20
      }
    }, this.renderName(), H.table({
      className: "table"
    }, this.renderHeader(), H.tbody(null, _.map(this.props.answer, (function(_this) {
      return function(entry, index) {
        return _this.renderEntry(entry, index);
      };
    })(this)))), !this.props.answer || this.props.answer.length === 0 ? H.div({
      style: {
        paddingLeft: 20
      }
    }, H.i(null, T("None"))) : void 0, this.renderAdd());
  };

  return RosterMatrixComponent;

})(React.Component);
