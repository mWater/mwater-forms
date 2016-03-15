_ = require 'lodash'
React = require 'react'
H = React.DOM

# Number input component that handles parsing and maintains state when number is invalid
module.exports = class NumberInputComponent extends React.Component
  constructor: ->
    super

    # Parsing happens on blur
    @state = {
      inputText: if @props.value? then "" + @props.value else ""
    }

  @propTypes:
    decimal: React.PropTypes.bool.isRequired
    value: React.PropTypes.number
    onChange: React.PropTypes.func.isRequired
    style: React.PropTypes.object     # Will be merged with style of input box
    small: React.PropTypes.bool       # True to render with input-sm

  componentWillReceiveProps: (nextProps) ->
    # If different, override text
    if nextProps.value != @props.value
      @setState(inputText: if nextProps.value? then "" + nextProps.value else "")

  handleBlur: =>
    # Parse and set value
    if @isValid()
      val = if @props.decimal then parseFloat(@state.inputText) else parseInt(@state.inputText)
      if isNaN(val)
        @props.onChange(null)
      else
        @props.onChange(val)

  # Check regex matching of numbers
  isValid: ->
    if @state.inputText.length == 0
      return true

    if @props.decimal
      return @state.inputText.match(/^-?[0-9]*\.?[0-9]+$/) and not isNaN(parseFloat(@state.inputText))
    else
      return @state.inputText.match(/^-?\d+$/)

  render: ->
    # Display red border if not valid
    style = _.clone(@props.style or {})
    if not @isValid()
      style.borderColor = "#a94442"
      style.boxShadow = "inset 0 1px 1px rgba(0,0,0,.075)"
      style.backgroundColor = "rgba(132, 53, 52, 0.12)" # Faded red

    H.input 
      type: "text"
      className: "form-control #{if @props.small then "input-sm" else ""}"
      style: style
      value: @state.inputText
      onChange: (ev) => @setState(inputText: ev.target.value)
      onBlur: @handleBlur

