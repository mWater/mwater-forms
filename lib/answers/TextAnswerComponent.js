var H, R, React, TextAnswerComponent,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

module.exports = TextAnswerComponent = (function(superClass) {
  extend(TextAnswerComponent, superClass);

  TextAnswerComponent.propTypes = {
    value: React.PropTypes.string,
    format: React.PropTypes.string.isRequired,
    readOnly: React.PropTypes.bool,
    onValueChange: React.PropTypes.func.isRequired,
    onNextOrComments: React.PropTypes.func
  };

  TextAnswerComponent.defaultProps = {
    readOnly: false
  };

  function TextAnswerComponent(props) {
    this.handleBlur = bind(this.handleBlur, this);
    this.handleKeyDown = bind(this.handleKeyDown, this);
    TextAnswerComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      text: props.value
    };
  }

  TextAnswerComponent.prototype.componentWillReceiveProps = function(nextProps) {
    if (nextProps.value !== this.props.value) {
      return this.setState({
        text: nextProps.value != null ? nextProps.value : ""
      });
    }
  };

  TextAnswerComponent.prototype.focus = function() {
    return this.refs.input.focus();
  };

  TextAnswerComponent.prototype.handleKeyDown = function(ev) {
    if (this.props.onNextOrComments != null) {
      if (ev.keyCode === 13 || ev.keyCode === 9) {
        this.props.onNextOrComments(ev);
        return ev.preventDefault();
      }
    }
  };

  TextAnswerComponent.prototype.handleBlur = function(ev) {
    return this.props.onValueChange(ev.target.value ? ev.target.value : null);
  };

  TextAnswerComponent.prototype.render = function() {
    if (this.props.format === "multiline") {
      return H.textarea({
        className: "form-control",
        id: 'input',
        ref: 'input',
        value: this.state.text || "",
        rows: "5",
        readOnly: this.props.readOnly,
        onBlur: this.handleBlur,
        onChange: (function(_this) {
          return function(ev) {
            return _this.setState({
              text: ev.target.value
            });
          };
        })(this)
      });
    } else {
      return H.input({
        className: "form-control",
        id: 'input',
        ref: 'input',
        type: "text",
        value: this.state.text || "",
        readOnly: this.props.readOnly,
        onKeyDown: this.handleKeyDown,
        onBlur: this.handleBlur,
        onChange: (function(_this) {
          return function(ev) {
            return _this.setState({
              text: ev.target.value
            });
          };
        })(this)
      });
    }
  };

  return TextAnswerComponent;

})(React.Component);
