import PropTypes from "prop-types"
import _ from "lodash"
import React from "react"
const R = React.createElement

import TextExprsComponent from "./TextExprsComponent"
import { Instructions } from "./formDesign"
import { ResponseData } from "./response"
import ResponseRow from "./ResponseRow"
import { Schema } from "mwater-expressions"

export interface InstructionsComponentProps {
  /** Design of instructions. See schema */
  instructions: Instructions
  /** Current data of response (for roster entry if in roster) */
  data?: ResponseData

  /** ResponseRow object (for roster entry if in roster) */
  responseRow: ResponseRow
  
  schema: Schema
}

export default class InstructionsComponent extends React.Component<InstructionsComponentProps> {
  static contextTypes = { locale: PropTypes.string }

  shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any) {
    if (this.context.locale !== nextContext.locale) {
      return true
    }
    if (nextProps.instructions.textExprs != null && nextProps.instructions.textExprs.length > 0) {
      return true
    }
    if (nextProps.instructions !== this.props.instructions) {
      return true
    }

    return false
  }

  render() {
    return R(
      "div",
      { className: "card bg-light mb-3" },
      R(
        "div",
        { className: "card-body" },
        R(TextExprsComponent, {
          localizedStr: this.props.instructions.text,
          exprs: this.props.instructions.textExprs,
          schema: this.props.schema,
          responseRow: this.props.responseRow,
          locale: this.context.locale,
          markdown: true
        })
      )
    )
  }
}
