import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"
import * as ui from "react-library/lib/bootstrap"

export interface UnitsAnswerComponentProps {
  answer: any
  onValueChange: any
  units: any
  defaultUnits?: string
  prefix: boolean
  decimal: boolean
  onNextOrComments?: any
}

interface UnitsAnswerComponentState {
  selectedUnits: any
  quantity: any
}

// Not tested
export default class UnitsAnswerComponent extends React.Component<
  UnitsAnswerComponentProps,
  UnitsAnswerComponentState
> {
  static contextTypes = { locale: PropTypes.string }

  constructor(props: any) {
    super(props)
    this.state = {
      quantity: this.getSelectedQuantity(props.answer),
      selectedUnits: this.getSelectedUnit(props.answer)
    }
  }

  componentWillReceiveProps(nextProps: any) {
    return this.setState({
      quantity: this.getSelectedQuantity(nextProps.answer),
      selectedUnits: this.getSelectedUnit(nextProps.answer)
    })
  }

  focus() {
    if (this.props.prefix) {
      return this.quantity.focus()
    } else {
      return this.units.focus()
    }
  }

  handleKeyDown = (ev: any) => {
    if (this.props.onNextOrComments != null) {
      // When pressing ENTER or TAB
      if (ev.keyCode === 13 || ev.keyCode === 9) {
        this.props.onNextOrComments(ev)
        // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        return ev.preventDefault()
      }
    }
  }

  handleInternalNext = (ev: any) => {
    // When pressing ENTER or TAB
    if (ev.keyCode === 13 || ev.keyCode === 9) {
      if (this.props.prefix) {
        this.quantity.focus()
      } else {
        this.units.focus()
      }
      // It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
      return ev.preventDefault()
    }
  }

  handleValueChange = (val: any) => {
    return this.changed(val, this.state.selectedUnits)
  }

  handleUnitChange = (val: any) => {
    return this.changed(this.state.quantity, val.target.value)
  }

  changed(quantity: any, unit: any) {
    unit = unit ? unit : this.props.defaultUnits
    return this.props.onValueChange({ quantity, units: unit })
  }

  getSelectedUnit(answer: any) {
    if (answer.value != null) {
      return answer.value.units
    }

    if (this.props.defaultUnits != null) {
      return this.props.defaultUnits
    }

    return null
  }

  getSelectedQuantity(answer: any) {
    if (answer.value?.quantity != null) {
      return answer.value.quantity
    }
    return null
  }

  createNumberInput() {
    return R(
      "td",
      null,
      R(ui.NumberInput, {
        ref: (c) => {
          return (this.quantity = c)
        },
        decimal: this.props.decimal,
        value: this.state.quantity != null ? this.state.quantity : undefined,
        onChange: this.handleValueChange,
        onTab: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext,
        onEnter: this.props.prefix ? this.props.onNextOrComments : this.handleInternalNext
      })
    )
  }

  render() {
    return R(
      "table",
      null,
      R(
        "tbody",
        null,
        R(
          "tr",
          null,
          !this.props.prefix ? this.createNumberInput() : undefined,
          R(
            "td",
            null,
            R(
              "select",
              {
                id: "units",
                ref: (c: any) => {
                  return (this.units = c)
                },
                className: "form-control",
                style: { width: "auto" },
                onChange: this.handleUnitChange,
                value: this.state.selectedUnits === null ? "" : this.state.selectedUnits
              },
              !this.props.defaultUnits ? R("option", { value: "" }, "Select units") : undefined,
              this.props.units.map((unit: any) =>
                R("option", { key: unit.id, value: unit.id }, formUtils.localizeString(unit.label, this.context.locale))
              )
            )
          ),
          this.props.prefix ? this.createNumberInput() : undefined
        )
      )
    )
  }
}
