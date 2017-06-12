var DateAnswerComponent, DateTimePickerComponent, H, PropTypes, R, React, formUtils, moment,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

moment = require('moment');

DateTimePickerComponent = require('../DateTimePickerComponent');

module.exports = DateAnswerComponent = (function(superClass) {
  extend(DateAnswerComponent, superClass);

  DateAnswerComponent.propTypes = {
    value: PropTypes.string,
    onValueChange: PropTypes.func.isRequired,
    format: PropTypes.string,
    placeholder: PropTypes.string,
    onNextOrComments: PropTypes.func
  };

  DateAnswerComponent.defaultProps = {
    format: "YYYY-MM-DD"
  };

  function DateAnswerComponent(props) {
    this.handleChange = bind(this.handleChange, this);
    this.handleKeyDown = bind(this.handleKeyDown, this);
    this.updateState = bind(this.updateState, this);
    this.componentWillReceiveProps = bind(this.componentWillReceiveProps, this);
    DateAnswerComponent.__super__.constructor.apply(this, arguments);
    this.updateState(props);
  }

  DateAnswerComponent.prototype.componentWillReceiveProps = function(nextProps) {
    return this.updateState(nextProps);
  };

  DateAnswerComponent.prototype.updateState = function(props) {
    var detailLevel, format, isoFormat, placeholder;
    format = props.format;
    isoFormat = null;
    if (format.match(/ss|LLL|lll/)) {
      detailLevel = 5;
    } else if (format.match(/m/)) {
      detailLevel = 4;
    } else if (format.match(/h|H/)) {
      detailLevel = 3;
    } else if (format.match(/D|l|L/)) {
      detailLevel = 2;
      isoFormat = "YYYY-MM-DD";
    } else if (format.match(/M/)) {
      detailLevel = 1;
      isoFormat = "YYYY-MM";
    } else if (format.match(/Y/)) {
      detailLevel = 0;
      isoFormat = "YYYY";
    } else {
      throw new Error("Invalid format: " + format);
    }
    placeholder = null;
    if (props.placeholder != null) {
      placeholder = props.placeholder;
    } else {
      if (!format.match(/l|L/)) {
        placeholder = format;
      } else {
        placeholder = '...';
      }
    }
    return this.state = {
      detailLevel: detailLevel,
      isoFormat: isoFormat,
      placeholder: placeholder
    };
  };

  DateAnswerComponent.prototype.focus = function() {
    var datetimepicker;
    datetimepicker = this.refs.datetimepicker;
    if (datetimepicker.focus != null) {
      return datetimepicker.focus();
    }
  };

  DateAnswerComponent.prototype.handleKeyDown = function(ev) {
    if (this.props.onNextOrComments != null) {
      if (ev.keyCode === 13 || ev.keyCode === 9) {
        this.props.onNextOrComments(ev);
        return ev.preventDefault();
      }
    }
  };

  DateAnswerComponent.prototype.handleChange = function(date) {
    if (!date) {
      this.props.onValueChange(null);
      return;
    }
    if (this.state.isoFormat) {
      date = date.format(this.isoFormat);
    } else {
      date = date.toISOString();
    }
    switch (this.state.detailLevel) {
      case 0:
        date = date.substring(0, 4);
        break;
      case 1:
        date = date.substring(0, 7);
        break;
      case 2:
        date = date.substring(0, 10);
        break;
      case 3:
        date = date.substring(0, 13) + "Z";
        break;
      case 4:
        date = date.substring(0, 16) + "Z";
        break;
      case 5:
        date = date.substring(0, 19) + "Z";
        break;
      default:
        throw new Error("Invalid detail level");
    }
    return this.props.onValueChange(date);
  };

  DateAnswerComponent.prototype.render = function() {
    var value;
    value = this.props.value;
    if (value) {
      if (this.state.isoFormat) {
        value = moment(value, this.state.isoFormat);
      } else {
        value = moment(value, moment.ISO_8601);
      }
    }
    return R(DateTimePickerComponent, {
      ref: 'datetimepicker',
      onChange: this.handleChange,
      date: value,
      format: this.props.format,
      placeholder: this.state.placeholder,
      showTodayButton: true,
      showClear: true,
      onKeyDown: this.handleKeyDown
    });
  };

  return DateAnswerComponent;

})(React.Component);
