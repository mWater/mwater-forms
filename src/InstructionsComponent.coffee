_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
markdown = require("markdown").markdown

module.exports = class InstructionsComponent extends React.Component
  @contextTypes: 
    locale: React.PropTypes.string

  @propTypes:
    instructions: React.PropTypes.object.isRequired # Design of instructions. See schema
    data: React.PropTypes.object      # Current data of response. Data of roster entry if in a roster
    parentData: React.PropTypes.object      # Data of overall response if in a roster
    formExprEvaluator: React.PropTypes.object # FormExprEvaluator for rendering strings with expression

  shouldComponentUpdate: (nextProps, nextState, nextContext) ->
    if @context.locale != nextContext.locale
      return true
    if nextProps.instructions.textExprs? and nextProps.instructions.textExprs.length > 0
      return true
    if nextProps.formExprEvaluator? and nextProps.formExprEvaluator != @props.formExprEvaluator
      return true
    if nextProps.instructions != @props.instructions
      return true

    return false

  render: ->
    text = @props.formExprEvaluator.renderString(@props.instructions.text, @props.instructions.textExprs, @props.data, @props.parentData, @context.locale)

    html = if text then markdown.toHTML(text)

    H.div className: "well well-small", dangerouslySetInnerHTML: { __html: html }
