var H, R, React, TextListAnswerComponent,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

module.exports = TextListAnswerComponent = (function(superClass) {
  extend(TextListAnswerComponent, superClass);

  function TextListAnswerComponent() {
    this.handleKeydown = bind(this.handleKeydown, this);
    this.handleNewLineChange = bind(this.handleNewLineChange, this);
    this.handleChange = bind(this.handleChange, this);
    return TextListAnswerComponent.__super__.constructor.apply(this, arguments);
  }

  TextListAnswerComponent.propTypes = {
    value: React.PropTypes.array,
    onValueChange: React.PropTypes.func.isRequired,
    onNextOrComments: React.PropTypes.func
  };

  TextListAnswerComponent.defaultProps = {
    value: []
  };

  TextListAnswerComponent.prototype.focus = function() {
    var ref;
    return (ref = this.refs.newLine) != null ? ref.focus() : void 0;
  };

  TextListAnswerComponent.prototype.handleChange = function(index, ev) {
    var newValue;
    newValue = _.clone(this.props.value);
    newValue[index] = ev.target.value;
    return this.props.onValueChange(newValue);
  };

  TextListAnswerComponent.prototype.handleNewLineChange = function(ev) {
    var newValue;
    newValue = _.clone(this.props.value);
    newValue.push(ev.target.value);
    return this.props.onValueChange(newValue);
  };

  TextListAnswerComponent.prototype.handleKeydown = function(index, ev) {
    var nextInput;
    if (ev.keyCode === 13 || ev.keyCode === 9) {
      if (index >= this.props.value.length) {
        if (this.props.onNextOrComments != null) {
          this.props.onNextOrComments(ev);
        }
      }
      if (index === this.props.value.length - 1) {
        nextInput = this.refs["newLine"];
        nextInput.focus();
      } else {
        nextInput = this.refs["input" + (index + 1)];
        nextInput.focus();
      }
      return ev.preventDefault();
    }
  };

  TextListAnswerComponent.prototype.render = function() {
    var index, textLine;
    return H.table({
      style: {
        width: "100%"
      }
    }, H.tbody(null, (function() {
      var i, len, ref, results;
      ref = this.props.value;
      results = [];
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        textLine = ref[index];
        results.push(H.tr({
          key: index
        }, H.td(null, H.b(null, index + ".\u00a0")), H.td(null, H.div({
          className: "input-group"
        }, H.input({
          ref: "input" + index,
          type: "text",
          className: "form-control box",
          value: textLine,
          onChange: this.handleChange.bind(null, index),
          onKeyDown: this.handleKeydown.bind(null, index),
          autoFocus: index === this.props.value.length - 1,
          onFocus: function(ev) {
            return ev.target.setSelectionRange(textLine.length, textLine.length);
          }
        }), H.span({
          className: "input-group-btn"
        }, H.button({
          className: "btn btn-link remove",
          "data-index": index,
          type: "button"
        }, H.span({
          className: "glyphicon glyphicon-remove"
        })))))));
      }
      return results;
    }).call(this), H.tr(null, H.td(null), H.td(null, H.div({
      className: "input-group"
    }, H.input({
      type: "text",
      className: "form-control box",
      onChange: this.handleNewLineChange,
      value: "",
      ref: 'newLine'
    }), H.span({
      className: "input-group-btn"
    }, H.button({
      className: "btn btn-link remove",
      "data-index": index,
      type: "button",
      hidden: true
    }, H.span({
      className: "glyphicon glyphicon-remove"
    }))))), H.td(null))));
  };

  return TextListAnswerComponent;

})(React.Component);
