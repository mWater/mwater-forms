import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
const R = React.createElement

import AquagenxCBTDisplaySVGString from "./AquagenxCBTDisplaySVG"
import { getHealthRiskString } from "./aquagenxCBTUtils"
import ImageDisplayComponent from "../ImageDisplayComponent"

export interface AquagenxCBTDisplayComponentProps {
  value?: any
  questionId: string
  onEdit?: any
  imageManager?: any
}

export default class AquagenxCBTDisplayComponent extends React.Component<AquagenxCBTDisplayComponentProps> {
  static contextTypes = { T: PropTypes.func.isRequired }

  handleClick = () => {
    if (this.props.onEdit) {
      return this.props.onEdit()
    }
  }

  renderStyle() {
    const mainId = `#cbtDisplay${this.props.questionId}`
    const cbtValues = this.props.value.cbt
    const compartmentValues = [cbtValues.c1, cbtValues.c2, cbtValues.c3, cbtValues.c4, cbtValues.c5]
    const compartmentColors = _.map(compartmentValues, function (c) {
      if (c) {
        return "#32a89b"
      } else {
        return "#ebe7c2"
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
}\
`
    )
  }

  renderInfo() {
    const cbtValues = this.props.value.cbt
    let { mpn } = cbtValues
    if (mpn === 100) {
      mpn = ">100"
    }
    return R(
      "div",
      null,
      R("div", null, this.context.T("MPN/100ml") + ": ", R("b", null, mpn)),
      R("div", null, this.context.T("Upper 95% Confidence Interval/100ml") + ": ", R("b", null, cbtValues.confidence)),
      R(
        "div",
        null,
        this.context.T("Health Risk Category Based on MPN and Confidence Interval") + ": ",
        R("b", null, getHealthRiskString(cbtValues.healthRisk, this.context.T))
      )
    )
  }

  renderPhoto() {
    // Displays an image
    if (this.props.value.image && this.props.imageManager) {
      return R(
        "div",
        null,
        React.createElement(ImageDisplayComponent, {
          image: this.props.value.image,
          imageManager: this.props.imageManager,
          T: this.context.T
        })
      )
    }
  }

  render() {
    // Can't display if not set
    if (!this.props.value?.cbt) {
      return null
    }

    return R(
      "div",
      { id: `cbtDisplay${this.props.questionId}` },
      this.renderStyle(),
      R("div", { dangerouslySetInnerHTML: { __html: AquagenxCBTDisplaySVGString }, onClick: this.handleClick }),
      this.renderInfo(),
      this.renderPhoto()
    )
  }
}
