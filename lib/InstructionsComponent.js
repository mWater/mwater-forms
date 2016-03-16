var H, InstructionsComponent, R, React, _, formUtils, markdown,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('./formUtils');

markdown = require("markdown").markdown;

module.exports = InstructionsComponent = (function(superClass) {
  extend(InstructionsComponent, superClass);

  function InstructionsComponent() {
    return InstructionsComponent.__super__.constructor.apply(this, arguments);
  }

  InstructionsComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  InstructionsComponent.propTypes = {
    instructions: React.PropTypes.object.isRequired
  };

  InstructionsComponent.prototype.render = function() {
    var html, text;
    text = formUtils.localizeString(this.props.instructions.text);
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
