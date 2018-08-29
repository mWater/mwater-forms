'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    _inherits(DateTimePickerComponent, _React$Component);

    function DateTimePickerComponent() {
      _classCallCheck(this, DateTimePickerComponent);

      var _this = _possibleConstructorReturn(this, (DateTimePickerComponent.__proto__ || Object.getPrototypeOf(DateTimePickerComponent)).apply(this, arguments));

      _this.onChange = _this.onChange.bind(_this);
      _this.handleInputFocus = _this.handleInputFocus.bind(_this);
      return _this;
    }

    _createClass(DateTimePickerComponent, [{
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
        return $(this.refs.datetimepicker).data("DateTimePicker").destroy();
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
        node = this.refs.datetimepicker;
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
        node = this.refs.datetimepicker;
        $(node).off("dp.change", this.onChange);
        $(node).data("DateTimePicker").date(nextProps.date || null);
        return $(node).on("dp.change", this.onChange);
      }
    }, {
      key: 'handleInputFocus',
      value: function handleInputFocus() {
        var node;
        boundMethodCheck(this, DateTimePickerComponent);
        node = this.refs.datetimepicker;
        return $(node).data("DateTimePicker").show();
      }
    }, {
      key: 'render',
      value: function render() {
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
          ref: "datetimepicker"
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