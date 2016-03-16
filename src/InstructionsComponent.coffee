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

  render: ->
    text = formUtils.localizeString(@props.instructions.text)
    html = if text then markdown.toHTML(text)

    H.div className: "well well-small", dangerouslySetInnerHTML: { __html: html }
