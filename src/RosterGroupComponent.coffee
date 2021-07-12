PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
R = React.createElement

formUtils = require './formUtils'
TextExprsComponent = require './TextExprsComponent'
cx = require 'classnames'
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

  constructor: (props) ->
    super(props)

    @state = {
      collapsedEntries: [] # the indices that are collapsed
    }

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
      result = await @["itemlist_#{index}"].validate(scrollToFirstInvalid and not foundInvalid)
      if result
        foundInvalid = true

    return foundInvalid

  isChildVisible: (index, id) =>
    return @props.isVisible("#{@getAnswerId()}.#{index}.#{id}")

  handleToggle: (index) => 
    @setState(collapsedEntries: _.xor(@state.collapsedEntries, [index]))

  renderName: ->
    R 'h4', key: "prompt",
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
    isCollapsed = @state.collapsedEntries.includes(index)

    bodyStyle = {
      height: if isCollapsed then 0 else 'auto', 
      transition: 'height 0.25s ease-in'
      padding: if isCollapsed then 0 else 15, 
      overflow: 'hidden'
    }

    R 'div', key: index, className: "panel panel-default", 
      R 'div', key: "header", className: "panel-heading", style: { fontWeight: "bold", position: "relative" },
        "#{index + 1}. "
        @renderEntryTitle(entry, index)

        R 'button', className: 'btn btn-link', style: {position: 'absolute', right: 0, top: 5}, onClick: @handleToggle.bind(null, index),
          R 'span', className: cx('glyphicon', {'glyphicon-chevron-up': !isCollapsed, 'glyphicon-chevron-down':  isCollapsed})

      R 'div', key: "body", className: "panel-body", style: bodyStyle,
        if @props.rosterGroup.allowRemove
          R 'button', type: "button", style: { float: "right" }, className: "btn btn-sm btn-link", onClick: @handleRemove.bind(null, index),
            R 'span', className: "glyphicon glyphicon-remove"  

        R ItemListComponent,
          ref: ((c) => @["itemlist_#{index}"] = c), 
          contents: @props.rosterGroup.contents
          data: @getAnswer()[index].data
          responseRow: @props.responseRow.getRosterResponseRow(@getAnswerId(), index)
          onDataChange: @handleEntryDataChange.bind(null, index)
          isVisible: @isChildVisible.bind(null, index)
          schema: @props.schema

  renderAdd: ->
    if @props.rosterGroup.allowAdd
      R 'div', key: "add",
        R 'button', type: "button", className: "btn btn-default btn-sm", onClick: @handleAdd,
          R 'span', className: "glyphicon glyphicon-plus"
          " " + @context.T("Add")

  renderEmptyPrompt: ->
    R 'div', style: { fontStyle: "italic" }, 
      formUtils.localizeString(@props.rosterGroup.emptyPrompt, @context.locale) or @context.T("Click +Add to add an item")

  render: ->
    R 'div', style: { padding: 5, marginBottom: 20 },
      @renderName()
      _.map(@getAnswer(), (entry, index) => @renderEntry(entry, index))

      # Display message if none and can add
      if @getAnswer().length == 0 and @props.rosterGroup.allowAdd
        @renderEmptyPrompt()

      @renderAdd() 