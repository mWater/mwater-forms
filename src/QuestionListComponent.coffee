_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

QuestionComponent = require './QuestionComponent'
RosterGroupComponent = require './RosterGroupComponent'
RosterMatrixComponent = require './RosterMatrixComponent'
formUtils = require './formUtils'

module.exports = class QuestionListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired

  handleAnswerChange: (id, answer) =>
    change = {}
    change[id] = answer
    @props.onDataChange(_.extend({}, @props.data, change))

  renderItem: (item) =>
    if formUtils.isQuestion(item)
      return R QuestionComponent, 
        key: item._id
        question: item
        answer: @props.data[item._id]
        onAnswerChange: @handleAnswerChange.bind(null, item._id)
    else if item._type == "RosterGroup"
      # Answer is under rosterId, not _id
      return R RosterGroupComponent,
        key: item._id
        rosterGroup: item
        answer: @props.data[item.rosterId]
        onAnswerChange: @handleAnswerChange.bind(null, item.rosterId)
    else if item._type == "RosterMatrix"
      # Answer is under rosterId, not _id
      return R RosterMatrixComponent,
        key: item._id
        rosterMatrix: item
        answer: @props.data[item.rosterId]
        onAnswerChange: @handleAnswerChange.bind(null, item.rosterId)

  render: ->
    H.div null,
      _.map(@props.contents, (item) => @renderItem(item))

