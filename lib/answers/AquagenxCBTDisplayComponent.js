var AquagenxCBTDisplayComponent, AquagenxCBTDisplaySVGString, H, React, getHealthRiskString,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

AquagenxCBTDisplaySVGString = require('./AquagenxCBTDisplaySVG');

getHealthRiskString = require('./aquagenxCBTUtils').getHealthRiskString;

module.exports = AquagenxCBTDisplayComponent = (function(superClass) {
  extend(AquagenxCBTDisplayComponent, superClass);

  function AquagenxCBTDisplayComponent() {
    this.handleClick = bind(this.handleClick, this);
    return AquagenxCBTDisplayComponent.__super__.constructor.apply(this, arguments);
  }

  AquagenxCBTDisplayComponent.contextTypes = {
    T: React.PropTypes.func.isRequired
  };

  AquagenxCBTDisplayComponent.propTypes = {
    value: React.PropTypes.object,
    questionId: React.PropTypes.string.isRequired,
    onEdit: React.PropTypes.func
  };

  AquagenxCBTDisplayComponent.prototype.handleClick = function() {
    if (this.props.onEdit) {
      return this.props.onEdit();
    }
  };

  AquagenxCBTDisplayComponent.prototype.renderStyle = function() {
    var cbtValues, compartmentColors, compartmentValues, mainId;
    mainId = "#cbtDisplay" + this.props.questionId;
    cbtValues = this.props.value.cbt;
    compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
    compartmentColors = _.map(compartmentValues, function(c) {
      if (c) {
        return '#32a89b';
      } else {
        return '#ebe7c2';
      }
    });
    return H.style(null, mainId + " #compartment1 rect { fill: " + compartmentColors[0] + "; } " + mainId + " #compartment2 rect { fill: " + compartmentColors[1] + "; } " + mainId + " #compartment3 rect { fill: " + compartmentColors[2] + "; } " + mainId + " #compartment4 rect { fill: " + compartmentColors[3] + "; } " + mainId + " #compartment5 rect { fill: " + compartmentColors[4] + "; }");
  };

  AquagenxCBTDisplayComponent.prototype.renderInfo = function() {
    var cbtValues, mpn;
    cbtValues = this.props.value.cbt;
    mpn = cbtValues.mpn;
    if (mpn === 100) {
      mpn = '>100';
    }
    return H.div(null, H.div(null, this.context.T('MPN/100ml:') + ' ', H.b(null, mpn)), H.div(null, this.context.T('Upper 95% Confidence Interval/100ml:') + ' ', H.b(null, cbtValues.confidence)), H.div(null, this.context.T('Health Risk Category Based on MPN and Confidence Interval:') + ' ', H.b(null, getHealthRiskString(cbtValues.healthRisk, this.context.T))));
  };

  AquagenxCBTDisplayComponent.prototype.render = function() {
    if (!this.props.value.cbt) {
      return null;
    }
    return H.div({
      id: "cbtDisplay" + this.props.questionId
    }, this.renderStyle(), H.div({
      dangerouslySetInnerHTML: {
        __html: AquagenxCBTDisplaySVGString
      },
      onClick: this.handleClick
    }), this.renderInfo());
  };

  return AquagenxCBTDisplayComponent;

})(React.Component);
