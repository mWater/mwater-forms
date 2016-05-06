var DateTimePickerComponent, H, R, React, ReactDOM, moment,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

R = React.createElement;

H = React.DOM;

ReactDOM = require('react-dom');

moment = require('moment');

if (process.browser) {
  require('eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js');
}

module.exports = DateTimePickerComponent = (function(superClass) {
  extend(DateTimePickerComponent, superClass);

  function DateTimePickerComponent() {
    this.handleInputFocus = bind(this.handleInputFocus, this);
    this.onChange = bind(this.onChange, this);
    return DateTimePickerComponent.__super__.constructor.apply(this, arguments);
  }

  DateTimePickerComponent.propTypes = {
    format: React.PropTypes.string,
    timepicker: React.PropTypes.bool,
    displayCalendarButton: React.PropTypes.bool,
    showTodayButton: React.PropTypes.bool,
    showClear: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    date: React.PropTypes.object,
    defaultDate: React.PropTypes.object
  };

  DateTimePickerComponent.defaultProps = {
    timepicker: false
  };

  DateTimePickerComponent.prototype.onChange = function(event) {
    var base;
    return typeof (base = this.props).onChange === "function" ? base.onChange(event.date) : void 0;
  };

  DateTimePickerComponent.prototype.componentDidMount = function() {
    var node, picker, pickerOptions;
    pickerOptions = {
      showClear: this.props.showClear,
      useStrict: true
    };
    if (this.props.format != null) {
      pickerOptions.format = this.props.format;
    } else if (this.props.timepicker) {
      pickerOptions.format = "YYYY-MM-DD HH-mm-ss";
    } else {
      pickerOptions.format = "YYYY-MM-DD";
    }
    if (this.props.defaultDate) {
      pickerOptions.defaultDate = this.props.defaultDate;
    }
    pickerOptions.showTodayButton = this.props.showTodayButton;
    node = this.refs.datetimepicker;
    picker = $(node).datetimepicker(pickerOptions);
    $(node).data("DateTimePicker").date(this.props.date || null);
    return $(node).on("dp.change", this.onChange);
  };

  DateTimePickerComponent.prototype.componentWillReceiveProps = function(nextProps) {
    var node;
    if (nextProps.date === null && this.props.date === null) {
      return;
    }
    if ((nextProps.date != null) && (this.props.date != null) && nextProps.date.isSame(this.props.date)) {
      return;
    }
    node = this.refs.datetimepicker;
    $(node).off("dp.change", this.onChange);
    $(node).data("DateTimePicker").date(nextProps.date || null);
    return $(node).on("dp.change", this.onChange);
  };

  DateTimePickerComponent.prototype.componentWillUnmount = function() {
    return $(this.refs.datetimepicker).data("DateTimePicker").destroy();
  };

  DateTimePickerComponent.prototype.handleInputFocus = function() {
    var node;
    node = this.refs.datetimepicker;
    return $(node).data("DateTimePicker").show();
  };

  DateTimePickerComponent.prototype.render = function() {
    var input;
    input = H.input({
      type: "text",
      className: "form-control",
      placeholder: this.props.placeholder,
      onFocus: this.handleInputFocus
    });
    if (this.props.displayCalendarButton) {
      return H.div({
        className: "row"
      }, H.div({
        className: 'col-sm-6'
      }, H.div({
        className: "form-group"
      }, H.div({
        className: 'input-group date',
        ref: "datetimepicker"
      }, input, H.span({
        className: "input-group-addon",
        onClick: this.handleCalendarClick
      }, H.span({
        className: "glyphicon glyphicon-calendar"
      }))))));
    } else {
      return H.div({
        className: "input-group date",
        style: {
          position: "relative"
        }
      }, input);
    }
  };

  return DateTimePickerComponent;

})(React.Component);
