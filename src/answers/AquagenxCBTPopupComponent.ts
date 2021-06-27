// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AquagenxCBTPopupComponent
import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement
import $ from "jquery"
import aquagenxCBTSVGString from "./AquagenxCBTSVG"
import ModalPopupComponent from "react-library/lib/ModalPopupComponent"
import { getHealthRiskString } from "./aquagenxCBTUtils"

const possibleCombinations = {
  "false,false,false,false,false": { mpn: 0.0, confidence: 2.87, healthRisk: "safe" },
  "false,false,false,true,false": { mpn: 1.0, confidence: 5.14, healthRisk: "probably_safe" },
  "false,false,false,false,true": { mpn: 1.0, confidence: 4.74, healthRisk: "probably_safe" },
  "true,false,false,false,false": { mpn: 1.1, confidence: 5.16, healthRisk: "probably_safe" },

  "false,true,false,false,false": { mpn: 1.2, confidence: 5.64, healthRisk: "probably_safe" },
  "false,false,true,false,false": { mpn: 1.5, confidence: 7.81, healthRisk: "probably_safe" },
  "false,false,false,true,true": { mpn: 2.0, confidence: 6.32, healthRisk: "probably_safe" },
  "true,false,false,true,false": { mpn: 2.1, confidence: 6.85, healthRisk: "probably_safe" },

  "true,false,false,false,true": { mpn: 2.1, confidence: 6.64, healthRisk: "probably_safe" },
  "false,true,false,true,false": { mpn: 2.4, confidence: 7.81, healthRisk: "probably_safe" },
  "false,true,false,false,true": { mpn: 2.4, confidence: 8.12, healthRisk: "probably_safe" },
  "true,true,false,false,false": { mpn: 2.6, confidence: 8.51, healthRisk: "probably_safe" },

  "true,false,false,true,true": { mpn: 3.2, confidence: 8.38, healthRisk: "probably_safe" },
  "false,true,false,true,true": { mpn: 3.7, confidence: 9.7, healthRisk: "probably_safe" },
  "false,false,true,false,true": { mpn: 3.1, confidence: 11.36, healthRisk: "possibly_safe" },
  "false,false,true,true,false": { mpn: 3.2, confidence: 11.82, healthRisk: "possibly_safe" },

  "true,false,true,false,false": { mpn: 3.4, confidence: 12.53, healthRisk: "possibly_safe" },
  "true,true,false,false,true": { mpn: 3.9, confidence: 10.43, healthRisk: "possibly_safe" },
  "true,true,false,true,false": { mpn: 4.0, confidence: 10.94, healthRisk: "possibly_safe" },
  "false,true,true,false,false": { mpn: 4.7, confidence: 22.75, healthRisk: "possibly_safe" },

  "false,false,true,true,true": { mpn: 5.2, confidence: 14.73, healthRisk: "possibly_safe" },
  "true,true,false,true,true": { mpn: 5.4, confidence: 12.93, healthRisk: "possibly_safe" },
  "true,false,true,false,true": { mpn: 5.6, confidence: 17.14, healthRisk: "possibly_safe" },
  "true,false,true,true,false": { mpn: 5.8, confidence: 16.87, healthRisk: "possibly_safe" },

  "true,false,true,true,true": { mpn: 8.4, confidence: 21.19, healthRisk: "possibly_safe" },
  "false,true,true,false,true": { mpn: 9.1, confidence: 37.04, healthRisk: "possibly_safe" },
  "false,true,true,true,false": { mpn: 9.6, confidence: 37.68, healthRisk: "possibly_safe" },
  "true,true,true,false,false": { mpn: 13.6, confidence: 83.06, healthRisk: "possibly_unsafe" },

  "false,true,true,true,true": { mpn: 17.1, confidence: 56.35, healthRisk: "possibly_unsafe" },
  "true,true,true,false,true": { mpn: 32.6, confidence: 145.55, healthRisk: "probably_unsafe" },
  "true,true,true,true,false": { mpn: 48.3, confidence: 351.91, healthRisk: "probably_unsafe" },
  "true,true,true,true,true": { mpn: 100, confidence: 9435.1, healthRisk: "unsafe" }
}

export default AquagenxCBTPopupComponent = (function () {
  AquagenxCBTPopupComponent = class AquagenxCBTPopupComponent extends React.Component {
    static initClass() {
      this.contextTypes = { T: PropTypes.func.isRequired } // Localizer to use

      this.propTypes = {
        value: PropTypes.object,
        questionId: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
      }
    }

    constructor(props) {
      super(props)

      const value = _.clone(props.value) || {}
      if (value.cbt == null) {
        const cbt = _.clone(possibleCombinations["false,false,false,false,false"])
        cbt.c1 = cbt.c2 = cbt.c3 = cbt.c4 = cbt.c5 = false
        value.cbt = cbt
      }

      this.state = { value }
    }

    componentDidMount() {
      const { main } = this
      $(main)
        .find("#compartment1")
        .click((ev) => {
          return this.handleCompartmentClick("c1")
        })
      $(main)
        .find("#compartment2")
        .click((ev) => {
          return this.handleCompartmentClick("c2")
        })
      $(main)
        .find("#compartment3")
        .click((ev) => {
          return this.handleCompartmentClick("c3")
        })
      $(main)
        .find("#compartment4")
        .click((ev) => {
          return this.handleCompartmentClick("c4")
        })
      return $(main)
        .find("#compartment5")
        .click((ev) => {
          return this.handleCompartmentClick("c5")
        })
    }

    handleCompartmentClick(compartmentField) {
      const value = _.clone(this.state.value)
      value.cbt = _.clone(value.cbt)
      const cbtValues = value.cbt
      cbtValues[compartmentField] = !cbtValues[compartmentField]

      const compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5]
      const computedValues = _.clone(possibleCombinations[`${compartmentValues}`])

      cbtValues.mpn = computedValues.mpn
      cbtValues.confidence = computedValues.confidence
      cbtValues.healthRisk = computedValues.healthRisk

      return this.setState({ value })
    }

    handleSaveClick = () => {
      return this.props.onSave(this.state.value)
    }

    renderStyle() {
      const mainId = `#cbtPopup${this.props.questionId}`
      const cbtValues = this.state.value.cbt
      const compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5]
      const compartmentColors = _.map(compartmentValues, function (c) {
        if (c) {
          return "#32a89b"
        } else {
          return "#ebe7c2"
        }
      })
      const hoverColors = _.map(compartmentValues, function (c) {
        if (c) {
          return "#62c5bb"
        } else {
          return "#fcf8d6"
        }
      })
      return R(
        "style",
        null,
        `\
${mainId} #compartment1 rect { \
fill: ${compartmentColors[0]}; \
} \
${mainId} #compartment2 rect { \
fill: ${compartmentColors[1]}; \
} \
${mainId} #compartment3 rect { \
fill: ${compartmentColors[2]}; \
} \
${mainId} #compartment4 rect { \
fill: ${compartmentColors[3]}; \
} \
${mainId} #compartment5 rect { \
fill: ${compartmentColors[4]}; \
} \
\
${mainId} #compartment1:hover > rect { \
fill: ${hoverColors[0]}; \
} \
${mainId} #compartment2:hover > rect{ \
fill: ${hoverColors[1]}; \
} \
${mainId} #compartment3:hover > rect{ \
fill: ${hoverColors[2]}; \
} \
${mainId} #compartment4:hover > rect { \
fill: ${hoverColors[3]}; \
} \
${mainId} #compartment5:hover > rect { \
fill: ${hoverColors[4]}; \
}\
`
      )
    }

    renderInfo() {
      const cbtValues = this.state.value.cbt
      let { mpn } = cbtValues
      if (mpn === 100) {
        mpn = ">100"
      }
      return R(
        "div",
        null,
        R("div", null, this.context.T("MPN/100ml") + ": ", R("b", null, mpn)),
        R(
          "div",
          null,
          this.context.T("Upper 95% Confidence Interval/100ml") + ": ",
          R("b", null, cbtValues.confidence)
        ),
        R(
          "div",
          null,
          this.context.T("Health Risk Category Based on MPN and Confidence Interval") + ": ",
          R("b", null, getHealthRiskString(cbtValues.healthRisk, this.context.T))
        )
      )
    }

    render() {
      return React.createElement(
        ModalPopupComponent,
        {
          footer: R(
            "div",
            { id: "footer" },
            R(
              "button",
              { className: "btn btn-primary", id: "save", onClick: this.handleSaveClick },
              this.context.T("Save")
            ),
            R(
              "button",
              { type: "button", className: "btn btn-default", id: "close", onClick: this.props.onClose },
              this.context.T("Cancel")
            )
          ),
          header: this.context.T("Click on the compartments to change color")
        },
        R(
          "div",
          {
            ref: (c) => {
              return (this.main = c)
            },
            id: `cbtPopup${this.props.questionId}`
          },
          this.renderStyle(),
          R("div", { dangerouslySetInnerHTML: { __html: aquagenxCBTSVGString } }),
          this.renderInfo()
        )
      )
    }
  }
  AquagenxCBTPopupComponent.initClass()
  return AquagenxCBTPopupComponent
})()
