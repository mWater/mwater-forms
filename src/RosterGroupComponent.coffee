_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'

# Rosters are repeated information, such as asking questions about household members N times.
# A roster group is a group of questions that is asked once for each roster entry
module.exports = class RosterGroupComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string

  @propTypes:
    rosterGroup: React.PropTypes.object.isRequired # Design of roster group. See schema
    answer: React.PropTypes.arrayOf(React.PropTypes.object.isRequired)      # Current answer. Array of items
    onAnswerChange: React.PropTypes.func.isRequired

  handleDataChange: (index, data) =>
    answer = (@props.answer or []).slice()
    answer[index] = data
    @props.onAnswerChange(answer)

  handleAdd: =>
    answer = (@props.answer or []).slice()
    answer.push({})
    @props.onAnswerChange(answer)

  handleRemove: (index) =>
    answer = (@props.answer or []).slice()
    answer.splice(index, 1)
    @props.onAnswerChange(answer)

  renderName: ->
    H.h4 key: "prompt",
      formUtils.localizeString(@props.rosterGroup.name, @context.locale)

  renderEntry: (entry, index) ->
    # To avoid circularity
    ItemListComponent = require './ItemListComponent'

    H.div key: index, className: "panel panel-default", 
      H.div className: "panel-body",
        if @props.rosterGroup.allowRemove
          H.button type: "button", style: { float: "right" }, className: "btn btn-sm btn-link", onClick: @handleRemove.bind(null, index),
            H.span className: "glyphicon glyphicon-remove"  

        R ItemListComponent,
          contents: @props.rosterGroup.contents
          data: @props.answer[index]
          onDataChange: @handleDataChange.bind(null, index)

  renderAdd: ->
    if @props.rosterGroup.allowAdd
      H.div key: "add",
        H.button type: "button", className: "btn btn-default btn-sm", onClick: @handleAdd,
          H.span className: "glyphicon glyphicon-plus"
          " " + T("Add")

  render: ->
    H.div style: { padding: 5, marginBottom: 20 },
      @renderName()
      _.map(@props.answer, (entry, index) => @renderEntry(entry, index))

      # Display message if none
      if not @props.answer or @props.answer.length == 0
        H.div(style: { paddingLeft: 20 }, H.i(null, T("None")))

      @renderAdd() 