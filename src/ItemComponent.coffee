_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

QuestionComponent = require './QuestionComponent'
InstructionsComponent = require './InstructionsComponent'
GroupComponent = require './GroupComponent'
RosterGroupComponent = require './RosterGroupComponent'
RosterMatrixComponent = require './RosterMatrixComponent'
formUtils = require './formUtils'

# Renders a question, instruction, roster, etc.
module.exports = class ItemComponent extends React.Component
  @propTypes:
    item: React.PropTypes.object.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired
    onNext: React.PropTypes.func
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not

  handleAnswerChange: (id, answer) =>
    change = {}
    change[id] = answer
    @props.onDataChange(_.extend({}, @props.data, change))

  scrollToInvalid: (alreadyFoundFirst) ->
    if @refs.item?
      return @refs.item.scrollToInvalid(alreadyFoundFirst)
    return false

  focus: () ->
    if @refs.item?
      return @refs.item.focus()
    return false

  render: ->
    if formUtils.isQuestion(@props.item)
      return R QuestionComponent, 
        ref: 'item'
        question: @props.item
        answer: @props.data[@props.item._id]
        onAnswerChange: @handleAnswerChange.bind(null, @props.item._id)
        data: @props.data
        onNext: @props.onNext
        isVisible: @props.isVisible
    else if @props.item._type == "Instructions"
      return R InstructionsComponent,
        instructions: @props.item
        isVisible: @props.isVisible
    else if @props.item._type == "Group"
      return R GroupComponent,
        ref: 'item'
        rosterGroup: @props.item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
    else if @props.item._type == "RosterGroup"
      return R RosterGroupComponent,
        ref: 'item'
        rosterGroup: @props.item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
    else if @props.item._type == "RosterMatrix"
      return R RosterMatrixComponent,
        rosterMatrix: @props.item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
    else
      return H.div null, "TODO: " + @props.item._type
