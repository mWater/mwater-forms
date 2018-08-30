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

var $,
    DateTimePickerComponent,
    H,
    PropTypes,
    R,
    React,
    moment,
    boundMethodCheck = function boundMethodCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new Error('Bound instance method accessed before binding');
  }
};

PropTypes = require('prop-types');

React = require('react');

R = React.createElement;

H = React.DOM;

moment = require('moment');

$ = require('jquery');

// This only works in browser. Load datetime picker
if (process.browser) {
  require('eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js');
}

module.exports = DateTimePickerComponent = function () {
  var DateTimePickerComponent = function (_React$Component) {
    (0, _inherits3.default)(DateTimePickerComponent, _React$Component);

    function DateTimePickerComponent() {
      (0, _classCallCheck3.default)(this, DateTimePickerComponent);

      var _this = (0, _possibleConstructorReturn3.default)(this, (DateTimePickerComponent.__proto__ || (0, _getPrototypeOf2.default)(DateTimePickerComponent)).apply(this, arguments));

      _this.onChange = _this.onChange.bind(_this);
      _this.handleInputFocus = _this.handleInputFocus.bind(_this);
      return _this;
    }

    (0, _createClass3.default)(DateTimePickerComponent, [{
      key: 'onChange',
      value: function onChange(event) {
        var base;
        boundMethodCheck(this, DateTimePickerComponent);
        return typeof (base = this.props).onChange === "function" ? base.onChange(event.date) : void 0;
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        return this.createNativeComponent(this.props);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        return this.destroyNativeComponent();
      }
    }, {
      key: 'destroyNativeComponent',
      value: function destroyNativeComponent() {
        return $(datetimepicker).data("DateTimePicker").destroy();
      }
    }, {
      key: 'createNativeComponent',
      value: function createNativeComponent(props) {
        var node, picker, pickerOptions;
        pickerOptions = {
          showClear: props.showClear,
          useStrict: true,
          focusOnShow: false
        };
        if (props.format != null) {
          pickerOptions.format = props.format;
        } else if (props.timepicker) {
          pickerOptions.format = "YYYY-MM-DD HH-mm-ss";
        } else {
          pickerOptions.format = "YYYY-MM-DD";
        }
        if (props.defaultDate) {
          pickerOptions.defaultDate = props.defaultDate;
        }
        pickerOptions.showTodayButton = props.showTodayButton;
        node = this.datetimepicker;
        picker = $(node).datetimepicker(pickerOptions);
        $(node).data("DateTimePicker").date(props.date || null);
        return $(node).on("dp.change", this.onChange);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        var node;
        // If format changed, recreate
        if (nextProps.format !== this.props.format) {
          this.destroyNativeComponent();
          _.defer(function () {
            return _this2.createNativeComponent(nextProps);
          });
          return;
        }
        // If unchanged
        if (nextProps.date === null && this.props.date === null) {
          return;
        }
        if (nextProps.date != null && this.props.date != null && nextProps.date.isSame(this.props.date)) {
          return;
        }
        node = this.datetimepicker;
        $(node).off("dp.change", this.onChange);
        $(node).data("DateTimePicker").date(nextProps.date || null);
        return $(node).on("dp.change", this.onChange);
      }
    }, {
      key: 'handleInputFocus',
      value: function handleInputFocus() {
        var node;
        boundMethodCheck(this, DateTimePickerComponent);
        node = this.datetimepicker;
        return $(node).data("DateTimePicker").show();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var input;
        // Override z-index due to bootstrap oddness
        input = H.input({
          type: "text",
          className: "form-control",
          placeholder: this.props.placeholder,
          onFocus: this.handleInputFocus,
          style: {
            zIndex: "inherit",
            minWidth: "12em"
          }
        });
        return H.div({
          className: 'input-group date',
          ref: function ref(c) {
            return _this3.datetimepicker = c;
          }
        }, input, H.span({
          className: "input-group-addon",
          onClick: this.handleCalendarClick
        }, H.span({
          className: "glyphicon glyphicon-calendar"
        })));
      }
    }]);
    return DateTimePickerComponent;
  }(React.Component);

  ;

  DateTimePickerComponent.propTypes = {
    // date format
    format: PropTypes.string,
    // do we need time picker?  (Only useful if format is not set)
    timepicker: PropTypes.bool,
    showTodayButton: PropTypes.bool, // Show the today button
    showClear: PropTypes.bool, // Show the clear button

    // callback on date change (argument: moment date)
    onChange: PropTypes.func,
    // date as moment
    date: PropTypes.object,
    // default date as moment
    defaultDate: PropTypes.object
  };

  DateTimePickerComponent.defaultProps = {
    timepicker: false
  };

  return DateTimePickerComponent;
}.call(undefined);