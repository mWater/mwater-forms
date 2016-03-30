_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

QuestionComponent = require './QuestionComponent'
InstructionsComponent = require './InstructionsComponent'
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

  handleAnswerChange: (id, answer) =>
    change = {}
    change[id] = answer
    @props.onDataChange(_.extend({}, @props.data, change))

  scrollToInvalid: (alreadyFoundFirst) ->
    if @refs.question?
      return @refs.question.scrollToInvalid(alreadyFoundFirst)
    if @refs.rosterGroup?
      return @refs.rosterGroup.scrollToInvalid(alreadyFoundFirst)
    return false

  focus: () ->
    if @refs.question?
      return @refs.question.focus()
    if @refs.rosterGroup?
      return @refs.rosterGroup.focus()
    return false

  render: ->
    if formUtils.isQuestion(@props.item)
      return R QuestionComponent, 
        ref: 'question'
        question: @props.item
        answer: @props.data[@props.item._id]
        onAnswerChange: @handleAnswerChange.bind(null, @props.item._id)
        data: @props.data
        onNext: @props.onNext
    else if @props.item._type == "Instructions"
      return R InstructionsComponent,
        instructions: @props.item
    else if @props.item._type == "RosterGroup"
      # Answer is under rosterId, not _id
      return R RosterGroupComponent,
        ref: 'rosterGroup'
        rosterGroup: @props.item
        answer: @props.data[@props.item.rosterId]
        onAnswerChange: @handleAnswerChange.bind(null, @props.item.rosterId)
    else if @props.item._type == "RosterMatrix"
      # Answer is under rosterId, not _id
      return R RosterMatrixComponent,
        rosterMatrix: @props.item
        answer: @props.data[@props.item.rosterId]
        onAnswerChange: @handleAnswerChange.bind(null, @props.item.rosterId)
    else
      return H.div null, "TODO: " + @props.item._type
