'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateAnswerComponent,
    H,
    MatrixColumnCellComponent,
    NumberAnswerComponent,
    PropTypes,
    R,
    React,
    SiteColumnAnswerComponent,
    TextExprsComponent,
    UnitsAnswerComponent,
    _,
    conditionUtils,
    formUtils,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

conditionUtils = require('./conditionUtils');

NumberAnswerComponent = require('./answers/NumberAnswerComponent');

DateAnswerComponent = require('./answers/DateAnswerComponent');

UnitsAnswerComponent = require('./answers/UnitsAnswerComponent');

SiteColumnAnswerComponent = require('./answers/SiteColumnAnswerComponent');

TextExprsComponent = require('./TextExprsComponent');

// Cell of a matrix column
module.exports = MatrixColumnCellComponent = function () {
  var MatrixColumnCellComponent = function (_React$Component) {
    _inherits(MatrixColumnCellComponent, _React$Component);

    function MatrixColumnCellComponent() {
      _classCallCheck(this, MatrixColumnCellComponent);

      var _this = _possibleConstructorReturn(this, (MatrixColumnCellComponent.__proto__ || Object.getPrototypeOf(MatrixColumnCellComponent)).apply(this, arguments));

      _this.handleValueChange = _this.handleValueChange.bind(_this);
      return _this;
    }

    _createClass(MatrixColumnCellComponent, [{
      key: 'handleValueChange',
      value: function handleValueChange(value) {
        boundMethodCheck(this, MatrixColumnCellComponent);
        return this.props.onAnswerChange(_.extend({}, this.props.answer, {
          value: value
        }));
      }
    }, {
      key: 'areConditionsValid',
      value: function areConditionsValid(choice) {
        if (choice.conditions == null) {
          return true;
        }
        return conditionUtils.compileConditions(choice.conditions)(this.props.data);
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var answer, className, column, elem, ref, value;
        column = this.props.column;
        value = (ref = this.props.answer) != null ? ref.value : void 0;
        // Create element
        switch (column._type) {
          case "TextColumn":
            elem = H.label({
              key: column._id
            }, R(TextExprsComponent, {
              localizedStr: column.cellText,
              exprs: column.cellTextExprs,
              schema: this.props.schema,
              responseRow: this.props.responseRow,
              locale: this.context.locale
            }));
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
              onChange: function onChange(ev) {
                return _this2.handleValueChange(ev.target.value);
              }
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
              className: 'touch-checkbox ' + (value ? "checked" : ""),
              onClick: function onClick() {
                return _this2.handleValueChange(!value);
              },
              style: {
                display: "inline-block"
              }
            }, '\u200B'); // ZWSP
            break;
          case "DropdownColumnQuestion":
            elem = H.select({
              className: "form-control input-sm",
              style: {
                width: "auto"
              },
              value: value,
              onChange: function onChange(ev) {
                return _this2.handleValueChange(ev.target.value ? ev.target.value : null);
              }
            }, H.option({
              key: "__none__",
              value: ""
            }), _.map(column.choices, function (choice) {
              var text;
              if (_this2.areConditionsValid(choice)) {
                text = formUtils.localizeString(choice.label, _this2.context.locale);
                return H.option({
                  key: choice.id,
                  value: choice.id
                }, text);
              }
            }));
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
      }
    }]);

    return MatrixColumnCellComponent;
  }(React.Component);

  ;

  MatrixColumnCellComponent.propTypes = {
    column: PropTypes.object.isRequired, // Column. See designSchema
    data: PropTypes.object, // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object, // ResponseRow object (for roster entry if in roster)
    answer: PropTypes.object, // Answer of the cell
    onAnswerChange: PropTypes.func.isRequired, // Called with new answer of cell
    invalid: PropTypes.bool, // True if invalid
    schema: PropTypes.object.isRequired // Schema to use, including form
  };

  MatrixColumnCellComponent.contextTypes = {
    locale: PropTypes.string
  };

  return MatrixColumnCellComponent;
}.call(undefined);