_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

async = require 'async'
formUtils = require './formUtils'
ExprEvaluator = require('mwater-expressions').ExprEvaluator

markdown = require("markdown").markdown

# Displays a text string with optional expressions embedded in it that are computed
module.exports = class TextExprsComponent extends React.Component
  @propTypes:
    localizedStr: React.PropTypes.object  # String to render (localized)
    exprs: React.PropTypes.array          # Array of mwater-expressions to insert at {0}, {1}, etc.
    schema: React.PropTypes.object.isRequired # Schema that includes the current form
    responseRow: React.PropTypes.object.isRequired # response row to use
    locale: React.PropTypes.string        # locale (e.g. "en") to use
    markdown: React.PropTypes.bool        # True to render as markdown text

  constructor: ->
    super

    @state = { 
      exprValueStrs: []    # Expression values strings to insert
    }

  componentWillMount: ->
    # Evaluate expressions
    @evaluateExprs()

  componentDidUpdate: ->
    # Evaluate expressions
    @evaluateExprs()

  evaluateExprs: ->
    if not @props.exprs or @props.exprs.length == 0
      return

    # Evaluate each expression
    async.map @props.exprs, (expr, cb) =>
      new ExprEvaluator().evaluate expr, { row: @props.responseRow }, (error, value) =>      
        if error
          return cb(null, "<error>")

        # stringify value
        cb(null, new ExprUtils(@props.schema).stringifyExprLiteral(expr, value, @props.locale))
    , (error, valueStrs) =>
      # Only update state if changed
      if not _.isEqual(valueStrs, @state.exprValueStrs)
        @setState(exprValueStrs: valueStrs)

  render: ->
    # Localize string
    str = formUtils.localizeString(@props.localizedStr, @props.locale)

    # Perform substitutions ({0}, {1}, etc.)
    str = str.replace(/\{(\d+)\}/g, (match, index) =>
      index = parseInt(index)
      if @state.exprValueStrs[index]?
        return @state.exprValueStrs[index]?
      return "..."
    )

    if @props.markdown
      html = if str then markdown.toHTML(str)
      return H.div null, dangerouslySetInnerHTML: { __html: html }
    else
      return H.span(null, str)
