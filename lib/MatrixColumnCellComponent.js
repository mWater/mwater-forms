var DateAnswerComponent, H, MatrixColumnCellComponent, NumberAnswerComponent, R, React, SiteColumnAnswerComponent, UnitsAnswerComponent, _, conditionsUtils, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

conditionsUtils = require('./conditionsUtils');

NumberAnswerComponent = require('./answers/NumberAnswerComponent');

DateAnswerComponent = require('./answers/DateAnswerComponent');

UnitsAnswerComponent = require('./answers/UnitsAnswerComponent');

SiteColumnAnswerComponent = require('./answers/SiteColumnAnswerComponent');

module.exports = MatrixColumnCellComponent = (function(superClass) {
  extend(MatrixColumnCellComponent, superClass);

  function MatrixColumnCellComponent() {
    this.handleValueChange = bind(this.handleValueChange, this);
    return MatrixColumnCellComponent.__super__.constructor.apply(this, arguments);
  }

  MatrixColumnCellComponent.propTypes = {
    column: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    parentData: React.PropTypes.object,
    answer: React.PropTypes.object,
    onAnswerChange: React.PropTypes.func.isRequired,
    formExprEvaluator: React.PropTypes.object.isRequired,
    invalid: React.PropTypes.bool
  };

  MatrixColumnCellComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  MatrixColumnCellComponent.prototype.handleValueChange = function(value) {
    return this.props.onAnswerChange(_.extend({}, this.props.answer, {
      value: value
    }));
  };

  MatrixColumnCellComponent.prototype.areConditionsValid = function(choice) {
    if (choice.conditions == null) {
      return true;
    }
    return conditionsUtils.compileConditions(choice.conditions)(this.props.data);
  };

  MatrixColumnCellComponent.prototype.render = function() {
    var answer, cellText, className, column, elem, ref, value;
    column = this.props.column;
    value = (ref = this.props.answer) != null ? ref.value : void 0;
    switch (column._type) {
      case "TextColumn":
        cellText = this.props.formExprEvaluator.renderString(column.cellText, column.cellTextExprs, this.props.data, this.props.parentData, this.context.locale);
        elem = H.label(null, cellText);
        break;
      case "UnitsColumnQuestion":
        answer = typeof data !== "undefined" && data !== null ? data[column._id] : void 0;
        elem = R(UnitsAnswerComponent, {
          small: true,
          decimal: column.decimal,
          prefix: column.unitsPosition === 'prefix',
          answer: this.props.answer || {},
          units: column.units,
          defaultUnits: column.defaultUnits,
          onValueChange: this.handleValueChange
        });
        break;
      case "TextColumnQuestion":
        elem = H.input({
          type: "text",
          className: "form-control input-sm",
          value: value || "",
          onChange: (function(_this) {
            return function(ev) {
              return _this.handleValueChange(ev.target.value);
            };
          })(this)
        });
        break;
      case "NumberColumnQuestion":
        elem = R(NumberAnswerComponent, {
          small: true,
          style: {
            maxWidth: "10em"
          },
          decimal: column.decimal,
          value: value,
          onChange: this.handleValueChange
        });
        break;
      case "CheckColumnQuestion":
        elem = H.div({
          className: "touch-checkbox " + (value ? "checked" : ""),
          onClick: (function(_this) {
            return function() {
              return _this.handleValueChange(!value);
            };
          })(this),
          style: {
            display: "inline-block"
          }
        }, "\u200B");
        break;
      case "DropdownColumnQuestion":
        elem = H.select({
          className: "form-control input-sm",
          style: {
            width: "auto"
          },
          value: value,
          onChange: ((function(_this) {
            return function(ev) {
              return _this.handleValueChange(ev.target.value ? ev.target.value : null);
            };
          })(this))
        }, H.option({
          key: "__none__",
          value: ""
        }), _.map(column.choices, (function(_this) {
          return function(choice) {
            var text;
            if (_this.areConditionsValid(choice)) {
              text = formUtils.localizeString(choice.label, _this.context.locale);
              return H.option({
                key: choice.id,
                value: choice.id
              }, text);
            }
          };
        })(this)));
        break;
      case "SiteColumnQuestion":
        elem = R(SiteColumnAnswerComponent, {
          value: value,
          onValueChange: this.handleValueChange,
          siteType: column.siteType
        });
        break;
      case "DateColumnQuestion":
        elem = H.div({
          style: {
            maxWidth: "18em"
          }
        }, R(DateAnswerComponent, {
          format: column.format,
          placeholder: column.placeholder,
          value: value,
          onValueChange: this.handleValueChange
        }));
    }
    if (this.props.invalid) {
      className = "invalid";
    }
    return H.td({
      className: className
    }, elem);
  };

  return MatrixColumnCellComponent;

})(React.Component);
