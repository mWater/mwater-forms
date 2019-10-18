PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

async = require 'async'
formUtils = require './formUtils'
ExprEvaluator = require('mwater-expressions').ExprEvaluator
ExprUtils = require('mwater-expressions').ExprUtils
d3Format = require "d3-format"

markdown = require("markdown").markdown

# Displays a text string with optional expressions embedded in it that are computed
module.exports = class TextExprsComponent extends React.Component
  @propTypes:
    localizedStr: PropTypes.object  # String to render (localized)
    exprs: PropTypes.array          # Array of mwater-expressions to insert at {0}, {1}, etc.
    schema: PropTypes.object.isRequired # Schema that includes the current form
    responseRow: PropTypes.object.isRequired # response row to use
    locale: PropTypes.string        # locale (e.g. "en") to use
    markdown: PropTypes.bool        # True to render as markdown text
    format: PropTypes.string        # Format to be used by d3 formatter

  constructor: (props) ->
    super(props)

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
      new ExprEvaluator(@props.schema).evaluate expr, { row: @props.responseRow }, (error, value) =>      
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
    str = formUtils.localizeString(@props.localizedStr, @props.locale) or ""

    # Perform substitutions ({0}, {1}, etc.)
    str = str.replace(/\{(\d+)\}/g, (match, index) =>
      index = parseInt(index)
      if @state.exprValueStrs[index]?
        return @state.exprValueStrs[index]
      return "..."
    )

    if @props.markdown
      html = if str then markdown.toHTML(str) else ""
      
      # Make sure links are external
      html = html.replace(/<a href=/g, '<a target="_blank" href=')

      return R 'div', dangerouslySetInnerHTML: { __html: html }
    else
      str = if @props.format then d3Format.format(@props.format)(str) else str
      return R('span', null, str)
