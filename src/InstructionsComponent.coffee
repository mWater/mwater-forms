PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
TextExprsComponent = require './TextExprsComponent'

module.exports = class InstructionsComponent extends React.Component
  @contextTypes: 
    locale: PropTypes.string

  @propTypes:
    instructions: PropTypes.object.isRequired # Design of instructions. See schema
    data: PropTypes.object      # Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object    # ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired  # Schema to use, including form

  shouldComponentUpdate: (nextProps, nextState, nextContext) ->
    if @context.locale != nextContext.locale
      return true
    if nextProps.instructions.textExprs? and nextProps.instructions.textExprs.length > 0
      return true
    if nextProps.instructions != @props.instructions
      return true

    return false

  render: ->
    H.div className: "well well-small", 
      R TextExprsComponent,
        localizedStr: @props.instructions.text
        exprs: @props.instructions.textExprs
        schema: @props.schema
        responseRow: @props.responseRow
        locale: @context.locale
        markdown: true
