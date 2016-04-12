var H, R, React, UnitsAnswerComponent, formUtils,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

React = require('react');

H = React.DOM;

R = React.createElement;

formUtils = require('../formUtils');

module.exports = UnitsAnswerComponent = (function(superClass) {
  extend(UnitsAnswerComponent, superClass);

  UnitsAnswerComponent.contextTypes = {
    locale: React.PropTypes.string
  };

  UnitsAnswerComponent.propTypes = {
    answer: React.PropTypes.object.isRequired,
    onValueChange: React.PropTypes.func.isRequired,
    units: React.PropTypes.array.isRequired,
    defaultUnits: React.PropTypes.string,
    prefix: React.PropTypes.bool.isRequired,
    decimal: React.PropTypes.bool.isRequired,
    onNextOrComments: React.PropTypes.func
  };

  function UnitsAnswerComponent(props) {
    this.handleUnitChange = bind(this.handleUnitChange, this);
    this.handleValueBlur = bind(this.handleValueBlur, this);
    this.handleValueChange = bind(this.handleValueChange, this);
    this.handleInternalNext = bind(this.handleInternalNext, this);
    this.handleKeyDown = bind(this.handleKeyDown, this);
    UnitsAnswerComponent.__super__.constructor.apply(this, arguments);
    this.state = {
      quantity: this.getSelectedQuantity(props.answer)
    };
  }

  UnitsAnswerComponent.prototype.componentWillReceiveProps = function(nextProps) {
    return this.setState({
      quantity: this.getSelectedQuantity(nextProps.answer)
    });
  };

  UnitsAnswerComponent.prototype.focus = function() {
    if (this.props.prefix) {
      return this.refs.quantity.focus();
    } else {
      return this.refs.units.focus();
    }
  };

  UnitsAnswerComponent.prototype.handleKeyDown = function(ev) {
    if (this.props.onNextOrComments != null) {
      if (ev.keyCode === 13 || ev.keyCode === 9) {
        this.props.onNextOrComments(ev);
        return ev.preventDefault();
      }
    }
  };

  UnitsAnswerComponent.prototype.handleInternalNext = function(ev) {
    if (ev.keyCode === 13 || ev.keyCode === 9) {
      if (this.props.prefix) {
        this.refs.quantity.focus();
      } else {
        this.refs.units.focus();
      }
      return ev.preventDefault();
    }
  };

  UnitsAnswerComponent.prototype.handleValueChange = function(val) {
    return this.setState({
      quantity: val.target.value
    });
  };

  UnitsAnswerComponent.prototype.handleValueBlur = function(val) {
    return this.changed(val.target.value, this.getSelectedUnit());
  };

  UnitsAnswerComponent.prototype.handleUnitChange = function(val) {
    return this.changed(this.state.quantity, val.target.value);
  };

  UnitsAnswerComponent.prototype.changed = function(quantity, unit) {
    quantity = this.props.decimal ? parseFloat(quantity) : parseInt(quantity);
    unit = unit ? unit : this.props.defaultUnits;
    if (isNaN(quantity)) {
      quantity = null;
    }
    return this.props.onValueChange({
      quantity: quantity,
      unit: unit
    });
  };

  UnitsAnswerComponent.prototype.getSelectedUnit = function() {
    var answer;
    answer = this.props.answer;
    if (answer.value != null) {
      if (answer.value.quantity != null) {
        return answer.value.unit;
      } else {
        return answer.unit;
      }
    }
    return null;
  };

  UnitsAnswerComponent.prototype.getSelectedQuantity = function(answer) {
    answer = answer;
    if (answer.value != null) {
      if (answer.value.quantity != null) {
        return answer.value.quantity;
      } else {
        return answer.value;
      }
    }
    return null;
  };

  UnitsAnswerComponent.prototype.createNumberInput = function() {
    return H.td(null, H.input({
      id: 'quantity',
      className: "form-control",
      type: "number",
      step: "any",
      style: {
        width: "12em"
      },
      onBlur: this.handleValueBlur,
      onChange: this.handleValueChange,
      value: this.state.quantity,
      ref: 'quantity',
      onKeyDown: this.props.prefix ? this.handleKeyDown : this.handleInternalNext
    }));
  };

  UnitsAnswerComponent.prototype.render = function() {
    var unit;
    return H.table(null, H.tbody(null, H.tr(null, !this.props.prefix ? this.createNumberInput() : void 0, H.td(null, H.select({
      id: "units",
      ref: "units",
      className: "form-control",
      style: {
        width: "auto"
      },
      onChange: this.handleUnitChange
    }, !this.props.defaultUnits ? H.option({
      value: ""
    }, "Select units") : void 0, (function() {
      var i, len, ref, results;
      ref = this.props.units;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        unit = ref[i];
        results.push(H.option({
          key: unit.id,
          value: unit.id
        }, formUtils.localizeString(unit.label, this.context.locale)));
      }
      return results;
    }).call(this))), this.props.prefix ? this.createNumberInput() : void 0)));
  };

  return UnitsAnswerComponent;

})(React.Component);
