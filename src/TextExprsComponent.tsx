import _ from "lodash"
import React from "react"
const R = React.createElement

import async from "async"
import * as formUtils from "./formUtils"
import { Expr, PromiseExprEvaluator, Schema } from "mwater-expressions"
import { ExprUtils } from "mwater-expressions"
import { format } from "d3-format"
import Markdown from "markdown-it"
import { LocalizedString } from "ez-localize"
import ResponseRow from "./ResponseRow"

export interface TextExprsComponentProps {
  /** String to render (localized) */
  localizedStr?: LocalizedString
  /** Array of mwater-expressions to insert at {0}, {1}, etc. */
  exprs?: Expr[]
  /** Schema that includes the current form */
  schema: Schema
  /** response row to use */
  responseRow: ResponseRow
  /** locale (e.g. "en") to use */
  locale?: string
  /** True to render as markdown text */
  markdown?: boolean
  /** Format to be used by d3 formatter */
  format?: string
}

interface TextExprsComponentState {
  exprValueStrs: string[]
}

/** Displays a text string with optional expressions embedded in it that are computed */
export default class TextExprsComponent extends React.Component<TextExprsComponentProps, TextExprsComponentState> {
  constructor(props: TextExprsComponentProps) {
    super(props)

    this.state = {
      exprValueStrs: [] // Expression values strings to insert
    }
  }

  componentWillMount() {
    // Evaluate expressions
    return this.evaluateExprs()
  }

  componentDidUpdate() {
    // Evaluate expressions
    return this.evaluateExprs()
  }

  evaluateExprs() {
    if (!this.props.exprs || this.props.exprs.length === 0) {
      return
    }

    // Evaluate each expression
    return async.map(
      this.props.exprs,
      (expr, cb) => {
        return new PromiseExprEvaluator({ schema: this.props.schema })
          .evaluate(expr, { row: this.props.responseRow })
          .then((value) => {
            // stringify value
            return cb(null, new ExprUtils(this.props.schema).stringifyExprLiteral(expr, value, this.props.locale))
          })
          .catch(() => cb(null, "<error>"))
      },
      (error, valueStrs) => {
        // Only update state if changed
        if (!error && !_.isEqual(valueStrs, this.state.exprValueStrs)) {
          return this.setState({ exprValueStrs: valueStrs as string[] })
        }
      }
    )
  }

  render() {
    // Localize string
    let str = formUtils.localizeString(this.props.localizedStr, this.props.locale) || ""

    // Perform substitutions ({0}, {1}, etc.)
    str = str.replace(/\{(\d+)\}/g, (match: any, index: any) => {
      index = parseInt(index)
      if (this.state.exprValueStrs[index] != null) {
        return this.state.exprValueStrs[index]
      }
      return "..."
    })

    if (this.props.markdown) {
      let html = str ? new Markdown().render(str) : ""

      // Make sure links are external
      html = html.replace(/<a href=/g, '<a target="_blank" href=')

      return R("div", { dangerouslySetInnerHTML: { __html: html } })
    } else {
      str = this.props.format && !_.isNaN(Number(str)) ? format(this.props.format)(Number(str)) : str
      return R("span", null, str)
    }
  }
}
