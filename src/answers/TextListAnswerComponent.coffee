React = require 'react'
H = React.DOM
R = React.createElement

# 100% Functional (UGLY)
# not tested

module.exports = class TextListAnswerComponent extends React.Component
  @propTypes:
    value: React.PropTypes.array
    onValueChange: React.PropTypes.func.isRequired
    onNextOrComments: React.PropTypes.func

  @defaultProps:
    value: []

  focus: () ->
    @refs.newLine?.focus()

  handleChange: (index, ev) =>
    newValue = _.clone @props.value
    newValue[index] = ev.target.value
    @props.onValueChange(newValue)

  handleNewLineChange: (ev) =>
    newValue = _.clone @props.value
    newValue.push (ev.target.value)
    @props.onValueChange(newValue)

  handleKeydown: (index, ev) =>
    # When pressing ENTER or TAB
    if ev.keyCode == 13 or ev.keyCode == 9
      # If the index is equal to the items length, it means that it's the last empty entry
      if index >= @props.value.length
        if @props.onNextOrComments?
          @props.onNextOrComments(ev)
      # If it equals to one less, we focus the newLine input
      if index == @props.value.length - 1
        nextInput = @refs["newLine"]
        nextInput.focus()
      # If not, we focus the next input
      else
        nextInput = @refs["input#{index+1}"]
        nextInput.focus()
      # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
      ev.preventDefault()

  render: ->
    H.table style: {width: "100%"},
      H.tbody null,
        for textLine, index in @props.value
          H.tr key: index,
            H.td null,
              H.b null,
                "#{index}.\u00a0"
            H.td null,
              H.div className: "input-group",
                H.input {
                  ref: "input#{index}"
                  type:"text"
                  className: "form-control box"
                  value: textLine
                  onChange: @handleChange.bind(null, index)
                  onKeyDown: @handleKeydown.bind(null, index)
                  autoFocus: index == @props.value.length - 1
                  onFocus: (ev) ->
                    # Necessary or else the cursor is set before the first character after a new line is created
                    ev.target.setSelectionRange(textLine.length, textLine.length)
                }
                H.span className: "input-group-btn",
                  H.button className: "btn btn-link remove", "data-index": index, type:"button",
                    H.span className: "glyphicon glyphicon-remove"
        H.tr null,
          H.td null
          H.td null,
            H.div className: "input-group",
              H.input {type:"text", className: "form-control box", onChange: @handleNewLineChange, value: "", ref: 'newLine'}
              H.span className: "input-group-btn",
                H.button className: "btn btn-link remove", "data-index": index, type:"button", hidden: true,
                  H.span className: "glyphicon glyphicon-remove"
          H.td null
