React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# Functional
# TODO: What should be done about the display? It used to show the checkbox next to the title of the question

module.exports = class CheckAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

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
    H.div null,
      H.div className: "choice touch-checkbox #{if @props.value then "checked" else ""}", onClick: @handleValueChange, ref: 'checkbox',
        formUtils.localizeString(@props.label, @context.locale)
