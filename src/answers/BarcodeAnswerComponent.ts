import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import * as formUtils from "../formUtils"

interface BarcodeAnswerComponentProps {
  value?: string
  onValueChange: any
}

// Functional? I haven't tried this one yet
// Not tested

export default class BarcodeAnswerComponent extends React.Component<BarcodeAnswerComponentProps> {
  static contextTypes = {
    scanBarcode: PropTypes.func,
    T: PropTypes.func.isRequired // Localizer to use
  }

  focus() {
    // Nothing to focus
    return null
  }

  handleValueChange = () => {
    return this.props.onValueChange(!this.props.value)
  }

  handleScanClick = () => {
    return this.context.scanBarcode({
      success: (text: any) => {
        return this.props.onValueChange(text)
      }
    })
  }

  handleClearClick = () => {
    return this.props.onValueChange(null)
  }

  render() {
    const supported = this.context.scanBarcode != null

    if (this.props.value) {
      return R(
        "div",
        null,
        R("pre", null, R("p", null, this.props.value)),
        R(
          "div",
          null,
          R(
            "button",
            { className: "btn btn-secondary", onClick: this.handleClearClick, type: "button" },
            R("span", { className: "fas fa-times" }, this.context.T("Clear"))
          )
        )
      )
    } else {
      if (supported) {
        return R(
          "div",
          null,
          R(
            "button",
            { className: "btn btn-secondary", onClick: this.handleScanClick, type: "button" },
            R("span", { className: "fas fa-qrcode" }),
            this.context.T("Scan")
          )
        )
      } else {
        return R(
          "div",
          { className: "text-warning" },
          this.context.T("Barcode scanning not supported on this platform")
        )
      }
    }
  }
}
