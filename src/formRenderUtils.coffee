formUtils = require './formUtils'

React = require 'react'
R = React.createElement

QuestionComponent = require './QuestionComponent'
InstructionsComponent = require './InstructionsComponent'
GroupComponent = require './GroupComponent'
RosterGroupComponent = require './RosterGroupComponent'
RosterMatrixComponent = require './RosterMatrixComponent'

exports.renderItem = (item, data, parentData, formExprEvaluator, onDataChange, isVisible, onNext) ->
  handleAnswerChange = (id, answer) =>
    change = {}
    change[id] = answer
    onDataChange(_.extend({}, data, change))

  if not isVisible(item._id) or item.disabled
    return null

  if formUtils.isQuestion(item)
    component = R QuestionComponent,
      key: item._id,
      ref: item._id,
      question: item
      onAnswerChange: handleAnswerChange.bind(null, item._id)
      data: data
      parentData: parentData
      onNext: onNext
      formExprEvaluator: formExprEvaluator
  else if item._type == "Instructions"
    return R InstructionsComponent,
      key: item._id,
      ref: item._id,
      instructions: item
      data: data
      parentData: parentData
      formExprEvaluator: formExprEvaluator
  else if item._type == "Group"
    return R GroupComponent,
      key: item._id,
      ref: item._id,
      group: item
      data: data
      parentData: parentData
      onDataChange: onDataChange
      isVisible: isVisible
      formExprEvaluator: formExprEvaluator
      onNext: onNext
  else if item._type == "RosterGroup"
    return R RosterGroupComponent,
      key: item._id,
      ref: item._id,
      rosterGroup: item
      data: data
      onDataChange: onDataChange
      isVisible: isVisible
      formExprEvaluator: formExprEvaluator
  else if item._type == "RosterMatrix"
    return R RosterMatrixComponent,
      key: item._id,
      ref: item._id,
      rosterMatrix: item
      data: data
      onDataChange: onDataChange
      isVisible: isVisible
      formExprEvaluator: formExprEvaluator
  else
    throw new Error("Unknown item of type #{item._type}")
