PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
TextExprsComponent = require './TextExprsComponent'

# TODO Add focus()

# Rosters are repeated information, such as asking questions about household members N times.
# A roster group is a group of questions that is asked once for each roster entry
module.exports = class RosterGroupComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    rosterGroup: PropTypes.object.isRequired # Design of roster group. See schema
    data: PropTypes.object      # Current data of response. 
    onDataChange: PropTypes.func.isRequired   # Called when data changes
    isVisible: PropTypes.func.isRequired # (id) tells if an item is visible or not
    responseRow: PropTypes.object    # ResponseRow object (for roster entry if in roster)
    schema: PropTypes.object.isRequired  # Schema to use, including form

  # Gets the id that the answer is stored under
  getAnswerId: ->
    # Prefer rosterId if specified, otherwise use id.
    return @props.rosterGroup.rosterId or @props.rosterGroup._id

  # Get the current answer value
  getAnswer: ->
    return @props.data[@getAnswerId()] or []

  # Propagate an answer change to the onDataChange
  handleAnswerChange: (answer) =>
    change = {}
    change[@getAnswerId()] = answer
    @props.onDataChange(_.extend({}, @props.data, change))

  # Handles a change in data of a specific entry of the roster
  handleEntryDataChange: (index, data) =>
    answer = @getAnswer().slice()
    answer[index] = _.extend({}, answer[index], { data: data })
    @handleAnswerChange(answer)

  handleAdd: =>
    answer = @getAnswer().slice()
    answer.push({ _id: formUtils.createUid(), data: {} })
    @handleAnswerChange(answer)

  handleRemove: (index) =>
    answer = @getAnswer().slice()
    answer.splice(index, 1)
    @handleAnswerChange(answer)

  validate: (scrollToFirstInvalid) ->
    # For each entry
    foundInvalid = false
    for entry, index in @getAnswer()
      foundInvalid = foundInvalid or @refs["itemlist_#{index}"].validate(scrollToFirstInvalid)

    return foundInvalid

  isChildVisible: (index, id) =>
    return @props.isVisible("#{@getAnswerId()}.#{index}.#{id}")

  renderName: ->
    H.h4 key: "prompt",
      formUtils.localizeString(@props.rosterGroup.name, @context.locale)

  renderEntryTitle: (entry, index) ->
    R TextExprsComponent,
      localizedStr: @props.rosterGroup.entryTitle
      exprs: @props.rosterGroup.entryTitleExprs
      schema: @props.schema
      responseRow: @props.responseRow.getRosterResponseRow(@getAnswerId(), index)
      locale: @context.locale

  renderEntry: (entry, index) ->
    # To avoid circularity
    ItemListComponent = require './ItemListComponent'

    H.div key: index, className: "panel panel-default", 
      H.div key: "header", className: "panel-heading", style: { fontWeight: "bold" },
        "#{index + 1}. "
        @renderEntryTitle(entry, index)
      H.div key: "body", className: "panel-body",
        if @props.rosterGroup.allowRemove
          H.button type: "button", style: { float: "right" }, className: "btn btn-sm btn-link", onClick: @handleRemove.bind(null, index),
            H.span className: "glyphicon glyphicon-remove"  

        R ItemListComponent,
          ref: "itemlist_#{index}", 
          contents: @props.rosterGroup.contents
          data: @getAnswer()[index].data
          responseRow: @props.responseRow.getRosterResponseRow(@getAnswerId(), index)
          onDataChange: @handleEntryDataChange.bind(null, index)
          isVisible: @isChildVisible.bind(null, index)
          schema: @props.schema

  renderAdd: ->
    if @props.rosterGroup.allowAdd
      H.div key: "add",
        H.button type: "button", className: "btn btn-default btn-sm", onClick: @handleAdd,
          H.span className: "glyphicon glyphicon-plus"
          " " + @context.T("Add")

  renderEmptyPrompt: ->
    H.div style: { fontStyle: "italic" }, 
      formUtils.localizeString(@props.rosterGroup.emptyPrompt, @context.locale) or @context.T("Click +Add to add an item")

  render: ->
    H.div style: { padding: 5, marginBottom: 20 },
      @renderName()
      _.map(@getAnswer(), (entry, index) => @renderEntry(entry, index))

      # Display message if none and can add
      if @getAnswer().length == 0 and @props.rosterGroup.allowAdd
        @renderEmptyPrompt()

      @renderAdd() 