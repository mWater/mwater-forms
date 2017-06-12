var H, InstructionsComponent, PropTypes, R, React, TextExprsComponent, _, formUtils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

TextExprsComponent = require('./TextExprsComponent');

module.exports = InstructionsComponent = (function(superClass) {
  extend(InstructionsComponent, superClass);

  function InstructionsComponent() {
    return InstructionsComponent.__super__.constructor.apply(this, arguments);
  }

  InstructionsComponent.contextTypes = {
    locale: PropTypes.string
  };

  InstructionsComponent.propTypes = {
    instructions: PropTypes.object.isRequired,
    data: PropTypes.object,
    responseRow: PropTypes.object,
    schema: PropTypes.object.isRequired
  };

  InstructionsComponent.prototype.shouldComponentUpdate = function(nextProps, nextState, nextContext) {
    if (this.context.locale !== nextContext.locale) {
      return true;
    }
    if ((nextProps.instructions.textExprs != null) && nextProps.instructions.textExprs.length > 0) {
      return true;
    }
    if (nextProps.instructions !== this.props.instructions) {
      return true;
    }
    return false;
  };

  InstructionsComponent.prototype.render = function() {
    return H.div({
      className: "well well-small"
    }, R(TextExprsComponent, {
      localizedStr: this.props.instructions.text,
      exprs: this.props.instructions.textExprs,
      schema: this.props.schema,
      responseRow: this.props.responseRow,
      locale: this.context.locale,
      markdown: true
    }));
  };

  return InstructionsComponent;

})(React.Component);
