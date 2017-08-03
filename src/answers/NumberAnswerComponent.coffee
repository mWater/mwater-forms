PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement
H = React.DOM

ui = require 'react-library/lib/bootstrap'

# Number input component that handles parsing and maintains state when number is invalid
module.exports = class NumberAnswerComponent extends React.Component
  @propTypes:
    decimal: PropTypes.bool.isRequired
    value: PropTypes.number
    onChange: PropTypes.func
    style: PropTypes.object     # Will be merged with style of input box
    small: PropTypes.bool       # True to render with input-sm
    onNextOrComments: PropTypes.func

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
