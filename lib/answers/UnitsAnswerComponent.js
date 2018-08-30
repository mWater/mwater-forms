'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var H,
    PropTypes,
    R,
    React,
    UnitsAnswerComponent,
    formUtils,
    ui,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

ui = require('react-library/lib/bootstrap');

// Not tested
module.exports = UnitsAnswerComponent = function () {
  var UnitsAnswerComponent = function (_React$Component) {
    (0, _inherits3.default)(UnitsAnswerComponent, _React$Component);

    function UnitsAnswerComponent(props) {
      (0, _classCallCheck3.default)(this, UnitsAnswerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (UnitsAnswerComponent.__proto__ || (0, _getPrototypeOf2.default)(UnitsAnswerComponent)).call(this, props));

      _this.handleKeyDown = _this.handleKeyDown.bind(_this);
      _this.handleInternalNext = _this.handleInternalNext.bind(_this);
      _this.handleValueChange = _this.handleValueChange.bind(_this);
      _this.handleUnitChange = _this.handleUnitChange.bind(_this);
      _this.state = {
        quantity: _this.getSelectedQuantity(props.answer),
        selectedUnits: _this.getSelectedUnit(props.answer)
      };
      return _this;
    }

    (0, _createClass3.default)(UnitsAnswerComponent, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        return this.setState({
          quantity: this.getSelectedQuantity(nextProps.answer),
          selectedUnits: this.getSelectedUnit(nextProps.answer)
        });
      }
    }, {
      key: 'focus',
      value: function focus() {
        if (this.props.prefix) {
          return this.quantity.focus();
        } else {
          return this.units.focus();
        }
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(ev) {
        boundMethodCheck(this, UnitsAnswerComponent);
        if (this.props.onNextOrComments != null) {
          // When pressing ENTER or TAB
          if (ev.keyCode === 13 || ev.keyCode === 9) {
            this.props.onNextOrComments(ev);
            // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
            return ev.preventDefault();
          }
        }
      }
    }, {
      key: 'handleInternalNext',
      value: function handleInternalNext(ev) {
        boundMethodCheck(this, UnitsAnswerComponent);
        // When pressing ENTER or TAB
        if (ev.keyCode === 13 || ev.keyCode === 9) {
          if (this.props.prefix) {
            this.quantity.focus();
          } else {
            this.units.focus();
          }
          // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
          return ev.preventDefault();
        }
      }
    }, {
      key: 'handleValueChange',
      value: function handleValueChange(val) {
        boundMethodCheck(this, UnitsAnswerComponent);
        return this.changed(val, this.state.selectedUnits);
      }
    }, {
      key: 'handleUnitChange',
      value: function handleUnitChange(val) {
        boundMethodCheck(this, UnitsAnswerComponent);
        return this.changed(this.state.quantity, val.target.value);
      }
    }, {
      key: 'changed',
      value: function changed(quantity, unit) {
        unit = unit ? unit : this.props.defaultUnits;
        return this.props.onValueChange({
          quantity: quantity,
          units: unit
        });
      }
    }, {
      key: 'getSelectedUnit',
      value: function getSelectedUnit(answer) {
        if (answer.value != null) {
          return answer.value.units;
        }
        if (this.props.defaultUnits != null) {
          return this.props.defaultUnits;
        }
        return null;
      }
    }, {
      key: 'getSelectedQuantity',
      value: function getSelectedQuantity(answer) {
        var ref;
        if (((ref = answer.value) != null ? ref.quantity : void 0) != null) {
          return answer.value.quantity;
        }
        return null;
      }
    }, {
      key: 'createNumberInput',
      value: function createNumberInput() {
        var _this2 = this;

        return H.td(null, R(ui.NumberInput, {
          ref: function ref(c) {
            return _this2.quantity = c;
          },
          decimal: this.props.decimal,
          value: this.state.quantity != null ? this.state.quantity : void 0,
          onChange: this.handleValueChange,
          onTab: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext,
          onEnter: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext
        }));
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var unit;
        return H.table(null, H.tbody(null, H.tr(null, !this.props.prefix ? this.createNumberInput() : void 0, H.td(null, H.select({
          id: "units",
          ref: function ref(c) {
            return _this3.units = c;
          },
          className: "form-control",
          style: {
            width: "auto"
          },
          onChange: this.handleUnitChange,
          value: this.state.selectedUnits === null ? '' : this.state.selectedUnits
        }, !this.props.defaultUnits ? H.option({
          value: ""
        }, "Select units") : void 0, function () {
          var i, len, ref, results;
          ref = this.props.units;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            unit = ref[i];
            results.push(H.option({
              key: unit.id,
              value: unit.id
            }, formUtils.localizeString(unit.label, this.context.locale)));
          }
          return results;
        }.call(this))), this.props.prefix ? this.createNumberInput() : void 0)));
      }
    }]);
    return UnitsAnswerComponent;
  }(React.Component);

  ;

  UnitsAnswerComponent.contextTypes = {
    locale: PropTypes.string // Current locale (e.g. "en")
  };

  UnitsAnswerComponent.propTypes = {
    answer: PropTypes.object.isRequired,
    onValueChange: PropTypes.func.isRequired,
    units: PropTypes.array.isRequired,
    defaultUnits: PropTypes.string,
    prefix: PropTypes.bool.isRequired,
    decimal: PropTypes.bool.isRequired,
    onNextOrComments: PropTypes.func
  };

  return UnitsAnswerComponent;
}.call(undefined);