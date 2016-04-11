var FormExprEvaluator, H, InstructionsComponent, R, React, _, formUtils, markdown,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

markdown = require("markdown").markdown;

FormExprEvaluator = require('./FormExprEvaluator');

module.exports = InstructionsComponent = (function(superClass) {
  extend(InstructionsComponent, superClass);

  function InstructionsComponent() {
    return InstructionsComponent.__super__.constructor.apply(this, arguments);
  }

  InstructionsComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  InstructionsComponent.propTypes = {
    instructions: React.PropTypes.object.isRequired,
    data: React.PropTypes.object,
    formExprEvaluator: React.PropTypes.object
  };

  InstructionsComponent.prototype.render = function() {
    var html, text;
    text = this.props.formExprEvaluator.renderString(this.props.instructions.text, this.props.instructions.textExprs, this.props.data, this.context.locale);
    html = text ? markdown.toHTML(text) : void 0;
    return H.div({
      className: "well well-small",
      dangerouslySetInnerHTML: {
        __html: html
      }
    });
  };

  return InstructionsComponent;

})(React.Component);
