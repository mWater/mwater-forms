var $, AquagenxCBTPopupComponent, H, ModalPopupComponent, PropTypes, React, aquagenxCBTSVGString, getHealthRiskString, possibleCombinations,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PropTypes = require('prop-types');

React = require('react');

H = React.DOM;

$ = require('jquery');

aquagenxCBTSVGString = require('./AquagenxCBTSVG');

ModalPopupComponent = require('react-library/lib/ModalPopupComponent');

getHealthRiskString = require('./aquagenxCBTUtils').getHealthRiskString;

possibleCombinations = {
  "false,false,false,false,false": {
    mpn: 0.0,
    confidence: 2.87,
    healthRisk: 'safe'
  },
  "false,false,false,true,false": {
    mpn: 1.0,
    confidence: 5.14,
    healthRisk: 'probably_safe'
  },
  "false,false,false,false,true": {
    mpn: 1.0,
    confidence: 4.74,
    healthRisk: 'probably_safe'
  },
  "true,false,false,false,false": {
    mpn: 1.1,
    confidence: 5.16,
    healthRisk: 'probably_safe'
  },
  "false,true,false,false,false": {
    mpn: 1.2,
    confidence: 5.64,
    healthRisk: 'probably_safe'
  },
  "false,false,true,false,false": {
    mpn: 1.5,
    confidence: 7.81,
    healthRisk: 'probably_safe'
  },
  "false,false,false,true,true": {
    mpn: 2.0,
    confidence: 6.32,
    healthRisk: 'probably_safe'
  },
  "true,false,false,true,false": {
    mpn: 2.1,
    confidence: 6.85,
    healthRisk: 'probably_safe'
  },
  "true,false,false,false,true": {
    mpn: 2.1,
    confidence: 6.64,
    healthRisk: 'probably_safe'
  },
  "false,true,false,true,false": {
    mpn: 2.4,
    confidence: 7.81,
    healthRisk: 'probably_safe'
  },
  "false,true,false,false,true": {
    mpn: 2.4,
    confidence: 8.12,
    healthRisk: 'probably_safe'
  },
  "true,true,false,false,false": {
    mpn: 2.6,
    confidence: 8.51,
    healthRisk: 'probably_safe'
  },
  "true,false,false,true,true": {
    mpn: 3.2,
    confidence: 8.38,
    healthRisk: 'probably_safe'
  },
  "false,true,false,true,true": {
    mpn: 3.7,
    confidence: 9.70,
    healthRisk: 'probably_safe'
  },
  "false,false,true,false,true": {
    mpn: 3.1,
    confidence: 11.36,
    healthRisk: 'possibly_safe'
  },
  "false,false,true,true,false": {
    mpn: 3.2,
    confidence: 11.82,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,false,false": {
    mpn: 3.4,
    confidence: 12.53,
    healthRisk: 'possibly_safe'
  },
  "true,true,false,false,true": {
    mpn: 3.9,
    confidence: 10.43,
    healthRisk: 'possibly_safe'
  },
  "true,true,false,true,false": {
    mpn: 4.0,
    confidence: 10.94,
    healthRisk: 'possibly_safe'
  },
  "false,true,true,false,false": {
    mpn: 4.7,
    confidence: 22.75,
    healthRisk: 'possibly_safe'
  },
  "false,false,true,true,true": {
    mpn: 5.2,
    confidence: 14.73,
    healthRisk: 'possibly_safe'
  },
  "true,true,false,true,true": {
    mpn: 5.4,
    confidence: 12.93,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,false,true": {
    mpn: 5.6,
    confidence: 17.14,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,true,false": {
    mpn: 5.8,
    confidence: 16.87,
    healthRisk: 'possibly_safe'
  },
  "true,false,true,true,true": {
    mpn: 8.4,
    confidence: 21.19,
    healthRisk: 'possibly_safe'
  },
  "false,true,true,false,true": {
    mpn: 9.1,
    confidence: 37.04,
    healthRisk: 'possibly_safe'
  },
  "false,true,true,true,false": {
    mpn: 9.6,
    confidence: 37.68,
    healthRisk: 'possibly_safe'
  },
  "true,true,true,false,false": {
    mpn: 13.6,
    confidence: 83.06,
    healthRisk: 'possibly_unsafe'
  },
  "false,true,true,true,true": {
    mpn: 17.1,
    confidence: 56.35,
    healthRisk: 'possibly_unsafe'
  },
  "true,true,true,false,true": {
    mpn: 32.6,
    confidence: 145.55,
    healthRisk: 'probably_unsafe'
  },
  "true,true,true,true,false": {
    mpn: 48.3,
    confidence: 351.91,
    healthRisk: 'probably_unsafe'
  },
  "true,true,true,true,true": {
    mpn: 100,
    confidence: 9435.10,
    healthRisk: 'unsafe'
  }
};

module.exports = AquagenxCBTPopupComponent = (function(superClass) {
  extend(AquagenxCBTPopupComponent, superClass);

  AquagenxCBTPopupComponent.contextTypes = {
    T: PropTypes.func.isRequired
  };

  AquagenxCBTPopupComponent.propTypes = {
    value: PropTypes.object,
    questionId: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  function AquagenxCBTPopupComponent(props) {
    this.handleSaveClick = bind(this.handleSaveClick, this);
    var cbt, value;
    AquagenxCBTPopupComponent.__super__.constructor.apply(this, arguments);
    value = _.clone(props.value) || {};
    if (value.cbt == null) {
      cbt = _.clone(possibleCombinations["false,false,false,false,false"]);
      cbt.c1 = cbt.c2 = cbt.c3 = cbt.c4 = cbt.c5 = false;
      value.cbt = cbt;
    }
    this.state = {
      value: value
    };
  }

  AquagenxCBTPopupComponent.prototype.componentDidMount = function() {
    var main;
    main = this.refs.main;
    $(main).find("#compartment1").click((function(_this) {
      return function(ev) {
        return _this.handleCompartmentClick('c1');
      };
    })(this));
    $(main).find("#compartment2").click((function(_this) {
      return function(ev) {
        return _this.handleCompartmentClick('c2');
      };
    })(this));
    $(main).find("#compartment3").click((function(_this) {
      return function(ev) {
        return _this.handleCompartmentClick('c3');
      };
    })(this));
    $(main).find("#compartment4").click((function(_this) {
      return function(ev) {
        return _this.handleCompartmentClick('c4');
      };
    })(this));
    return $(main).find("#compartment5").click((function(_this) {
      return function(ev) {
        return _this.handleCompartmentClick('c5');
      };
    })(this));
  };

  AquagenxCBTPopupComponent.prototype.handleCompartmentClick = function(compartmentField) {
    var cbtValues, compartmentValues, computedValues, value;
    value = _.clone(this.state.value);
    value.cbt = _.clone(value.cbt);
    cbtValues = value.cbt;
    cbtValues[compartmentField] = !cbtValues[compartmentField];
    compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
    computedValues = _.clone(possibleCombinations["" + compartmentValues]);
    cbtValues.mpn = computedValues.mpn;
    cbtValues.confidence = computedValues.confidence;
    cbtValues.healthRisk = computedValues.healthRisk;
    return this.setState({
      value: value
    });
  };

  AquagenxCBTPopupComponent.prototype.handleSaveClick = function() {
    return this.props.onSave(this.state.value);
  };

  AquagenxCBTPopupComponent.prototype.renderStyle = function() {
    var cbtValues, compartmentColors, compartmentValues, hoverColors, mainId;
    mainId = "#cbtPopup" + this.props.questionId;
    cbtValues = this.state.value.cbt;
    compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5];
    compartmentColors = _.map(compartmentValues, function(c) {
      if (c) {
        return '#32a89b';
      } else {
        return '#ebe7c2';
      }
    });
    hoverColors = _.map(compartmentValues, function(c) {
      if (c) {
        return '#62c5bb';
      } else {
        return '#fcf8d6';
      }
    });
    return H.style(null, mainId + " #compartment1 rect { fill: " + compartmentColors[0] + "; } " + mainId + " #compartment2 rect { fill: " + compartmentColors[1] + "; } " + mainId + " #compartment3 rect { fill: " + compartmentColors[2] + "; } " + mainId + " #compartment4 rect { fill: " + compartmentColors[3] + "; } " + mainId + " #compartment5 rect { fill: " + compartmentColors[4] + "; } " + mainId + " #compartment1:hover > rect { fill: " + hoverColors[0] + "; } " + mainId + " #compartment2:hover > rect{ fill: " + hoverColors[1] + "; } " + mainId + " #compartment3:hover > rect{ fill: " + hoverColors[2] + "; } " + mainId + " #compartment4:hover > rect { fill: " + hoverColors[3] + "; } " + mainId + " #compartment5:hover > rect { fill: " + hoverColors[4] + "; }");
  };

  AquagenxCBTPopupComponent.prototype.renderInfo = function() {
    var cbtValues, mpn;
    cbtValues = this.state.value.cbt;
    mpn = cbtValues.mpn;
    if (mpn === 100) {
      mpn = '>100';
    }
    return H.div(null, H.div(null, this.context.T('MPN/100ml') + ': ', H.b(null, mpn)), H.div(null, this.context.T('Upper 95% Confidence Interval/100ml') + ': ', H.b(null, cbtValues.confidence)), H.div(null, this.context.T('Health Risk Category Based on MPN and Confidence Interval') + ': ', H.b(null, getHealthRiskString(cbtValues.healthRisk, this.context.T))));
  };

  AquagenxCBTPopupComponent.prototype.render = function() {
    return React.createElement(ModalPopupComponent, {
      footer: H.div({
        id: 'footer'
      }, H.button({
        className: 'btn btn-primary',
        id: 'save',
        onClick: this.handleSaveClick
      }, this.context.T('Save')), H.button({
        type: "button",
        className: "btn btn-default",
        id: 'close',
        onClick: this.props.onClose
      }, this.context.T('Cancel'))),
      header: this.context.T('Click on the compartments to change color')
    }, H.div({
      ref: 'main',
      id: "cbtPopup" + this.props.questionId
    }, this.renderStyle(), H.div({
      dangerouslySetInnerHTML: {
        __html: aquagenxCBTSVGString
      }
    }), this.renderInfo()));
  };

  return AquagenxCBTPopupComponent;

})(React.Component);
