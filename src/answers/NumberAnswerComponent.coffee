_ = require 'lodash'
React = require 'react'
H = React.DOM

# Number input component that handles parsing and maintains state when number is invalid
module.exports = class NumberAnswerComponent extends React.Component
  constructor: (props) ->
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
    onNextOrComments: React.PropTypes.func

  componentWillReceiveProps: (nextProps) ->
    # If different, override text
    if nextProps.value != @props.value
      @setState(inputText: if nextProps.value? then "" + nextProps.value else "")

  focus: () ->
    @refs.input.focus()
    @refs.input.select()

  handleKeyDown: (ev) =>
    if @props.onNextOrComments?
      # When pressing ENTER or TAB
      if ev.keyCode == 13 or ev.keyCode == 9
        @props.onNextOrComments(ev)
        # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        ev.preventDefault()

  handleBlur: =>
    # Parse and set value
    if @isValid()
      val = if @props.decimal then parseFloat(@state.inputText) else parseInt(@state.inputText)
      if isNaN(val)
        @props.onChange(null)
      else
        @props.onChange(val)
    else
      @props.onChange(@props.value)

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
      ref: 'input'
      type: "text"
      className: "form-control #{if @props.small then "input-sm" else ""}"
      style: style
      value: @state.inputText
      onChange: (ev) => @setState(inputText: ev.target.value)
      onBlur: @handleBlur
      onKeyDown: @handleKeyDown

