let UnitsAnswerComponent;
import PropTypes from 'prop-types';
import React from 'react';
const R = React.createElement;

import formUtils from '../formUtils';
import ui from 'react-library/lib/bootstrap';

// Not tested
export default UnitsAnswerComponent = (function() {
  UnitsAnswerComponent = class UnitsAnswerComponent extends React.Component {
    static initClass() {
      this.contextTypes =
        {locale: PropTypes.string};  // Current locale (e.g. "en")
  
      this.propTypes = {
        answer: PropTypes.object.isRequired,
        onValueChange: PropTypes.func.isRequired,
        units: PropTypes.array.isRequired,
        defaultUnits: PropTypes.string,
        prefix: PropTypes.bool.isRequired,
        decimal: PropTypes.bool.isRequired,
        onNextOrComments: PropTypes.func
      };
    }

    constructor(props) {
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleInternalNext = this.handleInternalNext.bind(this);
      this.handleValueChange = this.handleValueChange.bind(this);
      this.handleUnitChange = this.handleUnitChange.bind(this);
      super(props);
      this.state = {quantity: this.getSelectedQuantity(props.answer), selectedUnits: this.getSelectedUnit(props.answer)};
    }

    componentWillReceiveProps(nextProps) {
      return this.setState({quantity: this.getSelectedQuantity(nextProps.answer), selectedUnits: this.getSelectedUnit(nextProps.answer)});
    }

    focus() {
      if (this.props.prefix) {
        return this.quantity.focus();
      } else {
        return this.units.focus();
      }
    }

    handleKeyDown(ev) {
      if (this.props.onNextOrComments != null) {
        // When pressing ENTER or TAB
        if ((ev.keyCode === 13) || (ev.keyCode === 9)) {
          this.props.onNextOrComments(ev);
          // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
          return ev.preventDefault();
        }
      }
    }

    handleInternalNext(ev) {
      // When pressing ENTER or TAB
      if ((ev.keyCode === 13) || (ev.keyCode === 9)) {
        if (this.props.prefix) {
          this.quantity.focus();
        } else {
          this.units.focus();
        }
        // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        return ev.preventDefault();
      }
    }

    handleValueChange(val) {
      return this.changed(val, this.state.selectedUnits);
    }

    handleUnitChange(val) {
      return this.changed(this.state.quantity, val.target.value);
    }

    changed(quantity, unit) {
      unit = unit ? unit : this.props.defaultUnits;
      return this.props.onValueChange({quantity, units: unit});
    }

    getSelectedUnit(answer) {
      if (answer.value != null) {
        return answer.value.units;
      }

      if (this.props.defaultUnits != null) {
        return this.props.defaultUnits;
      }

      return null;
    }

    getSelectedQuantity(answer) {
      if (answer.value?.quantity != null) {
        return answer.value.quantity;
      }
      return null;
    }

    createNumberInput() {
      return R('td', null,
        R(ui.NumberInput, {
          ref: c => { return this.quantity = c; },
          decimal: this.props.decimal,
          value: (this.state.quantity != null) ? this.state.quantity : undefined,
          onChange: this.handleValueChange,
          onTab: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext,
          onEnter: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext
        }
        )
      );
    }

    render() {
      return R('table', null,
        R('tbody', null,
          R('tr', null,
            !this.props.prefix ?
              this.createNumberInput() : undefined,
            R('td', null,
              R('select', {
                id: "units",
                ref: c => { return this.units = c; },
                className: "form-control",
                style: {width: "auto"},
                onChange: this.handleUnitChange,
                value: this.state.selectedUnits === null ? '' : this.state.selectedUnits
              },
                !this.props.defaultUnits ?
                  R('option', {value: ""},
                    "Select units") : undefined,
                this.props.units.map((unit) =>
                  R('option', {key: unit.id, value:unit.id},
                    formUtils.localizeString(unit.label, this.context.locale)))
              )
            ),
            this.props.prefix ?
              this.createNumberInput() : undefined
          )
        )
      );
    }
  };
  UnitsAnswerComponent.initClass();
  return UnitsAnswerComponent;
})();
