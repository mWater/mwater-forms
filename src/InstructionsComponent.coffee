_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
markdown = require("markdown").markdown
FormExprEvaluator = require './FormExprEvaluator'

module.exports = class InstructionsComponent extends React.Component
  @contextTypes: 
    locale: React.PropTypes.string
    formExprEvaluator: React.PropTypes.object # FormExprEvaluator for rendering strings with expression

  @propTypes:
    instructions: React.PropTypes.object.isRequired # Design of instructions. See schema
    data: React.PropTypes.object      # Current data of response. 

  render: ->
    # Gracefully handle no formExprEvaluator
    text = (@context.formExprEvaluator or new FormExprEvaluator()).renderString(@props.instructions.text, @props.instructions.textExprs, @props.data, @context.locale)

    html = if text then markdown.toHTML(text)

    H.div className: "well well-small", dangerouslySetInnerHTML: { __html: html }
