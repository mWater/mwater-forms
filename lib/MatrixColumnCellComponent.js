"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var DateAnswerComponent,
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
R = React.createElement;
formUtils = require('./formUtils');
conditionUtils = require('./conditionUtils');
NumberAnswerComponent = require('./answers/NumberAnswerComponent');
DateAnswerComponent = require('./answers/DateAnswerComponent');
UnitsAnswerComponent = require('./answers/UnitsAnswerComponent');
SiteColumnAnswerComponent = require('./answers/SiteColumnAnswerComponent');
TextExprsComponent = require('./TextExprsComponent'); // Cell of a matrix column

module.exports = MatrixColumnCellComponent = function () {
  var MatrixColumnCellComponent =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2["default"])(MatrixColumnCellComponent, _React$Component);

    function MatrixColumnCellComponent() {
      var _this;

      (0, _classCallCheck2["default"])(this, MatrixColumnCellComponent);
      _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MatrixColumnCellComponent).apply(this, arguments));
      _this.handleValueChange = _this.handleValueChange.bind((0, _assertThisInitialized2["default"])(_this));
      return _this;
    }

    (0, _createClass2["default"])(MatrixColumnCellComponent, [{
      key: "handleValueChange",
      value: function handleValueChange(value) {
        boundMethodCheck(this, MatrixColumnCellComponent);
        return this.props.onAnswerChange(_.extend({}, this.props.answer, {
          value: value
        }));
      }
    }, {
      key: "areConditionsValid",
      value: function areConditionsValid(choice) {
        if (choice.conditions == null) {
          return true;
        }

        return conditionUtils.compileConditions(choice.conditions)(this.props.data);
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var answer, className, column, elem, ref, value;
        column = this.props.column;
        value = (ref = this.props.answer) != null ? ref.value : void 0; // Create element

        switch (column._type) {
          case "Calculation":
            elem = R('label', {
              key: column._id
            }, R(TextExprsComponent, {
              localizedStr: {
                _base: "en",
                en: "{0}" // This does not need to be translated, so en as base should be fine

              },
              exprs: [column.expr],
              format: column.format,
              schema: this.props.schema,
              responseRow: this.props.responseRow,
              locale: this.context.locale
            }));
            break;

          case "TextColumn":
            elem = R('label', {
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
            elem = R('input', {
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
            elem = R('div', {
              className: "touch-checkbox ".concat(value ? "checked" : ""),
              onClick: function onClick() {
                return _this2.handleValueChange(!value);
              },
              style: {
                display: "inline-block"
              }
            }, "\u200B"); // ZWSP

            break;

          case "DropdownColumnQuestion":
            elem = R('select', {
              className: "form-control input-sm",
              style: {
                width: "auto"
              },
              value: value,
              onChange: function onChange(ev) {
                return _this2.handleValueChange(ev.target.value ? ev.target.value : null);
              }
            }, R('option', {
              key: "__none__",
              value: ""
            }), _.map(column.choices, function (choice) {
              var text;

              if (_this2.areConditionsValid(choice)) {
                text = formUtils.localizeString(choice.label, _this2.context.locale);
                return R('option', {
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
            elem = R('div', {
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

        return R('td', {
          className: className
        }, elem);
      }
    }]);
    return MatrixColumnCellComponent;
  }(React.Component);

  ;
  MatrixColumnCellComponent.propTypes = {
    column: PropTypes.object.isRequired,
    // Column. See designSchema
    data: PropTypes.object,
    // Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object,
    // ResponseRow object (for roster entry if in roster)
    answer: PropTypes.object,
    // Answer of the cell
    onAnswerChange: PropTypes.func.isRequired,
    // Called with new answer of cell
    invalid: PropTypes.bool,
    // True if invalid
    schema: PropTypes.object.isRequired // Schema to use, including form

  };
  MatrixColumnCellComponent.contextTypes = {
    locale: PropTypes.string
  };
  return MatrixColumnCellComponent;
}.call(void 0);