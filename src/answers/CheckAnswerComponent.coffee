React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# This one is very different from the other AnswerComponents since it's displayed before the title (passed has children)
# TODO: SurveyorPro: Fix checkbox title size

module.exports = class CheckAnswerComponent extends React.Component
  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired
    label: React.PropTypes.object.isRequired

  @defaultProps:
    value: false

  focus: () ->
    @refs.checkbox.focus()

  handleValueChange: () =>
    @props.onValueChange(!@props.value)

  render: ->
    H.div className: "choice touch-checkbox #{if @props.value then "checked" else ""}", onClick: @handleValueChange, ref: 'checkbox',
      @props.children
