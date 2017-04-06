_ = require 'lodash'
React = require 'react'
R = React.createElement
H = React.DOM

ui = require 'react-library/lib/bootstrap'

# Number input component that handles parsing and maintains state when number is invalid
module.exports = class NumberAnswerComponent extends React.Component
  @propTypes:
    decimal: React.PropTypes.bool.isRequired
    value: React.PropTypes.number
    onChange: React.PropTypes.func.isRequired
    style: React.PropTypes.object     # Will be merged with style of input box
    small: React.PropTypes.bool       # True to render with input-sm
    onNextOrComments: React.PropTypes.func

  focus: ->
    @input?.focus()

  render: ->
    R ui.NumberInput,
      ref: (c) -> @input = c
      decimal: @props.decimal
      value: @props.value
      onChange: @props.onChange
      size: if @props.small then "sm"
      onTab: @props.onNextOrComments
      onEnter: @props.onNextOrComments
