formUtils = require './formUtils'

React = require 'react'
R = React.createElement

QuestionComponent = require './QuestionComponent'
InstructionsComponent = require './InstructionsComponent'
GroupComponent = require './GroupComponent'
RosterGroupComponent = require './RosterGroupComponent'
RosterMatrixComponent = require './RosterMatrixComponent'

# Render an item, given its data, visibility function, etc.
exports.renderItem = (item, data, parentData, formExprEvaluator, onDataChange, isVisible, onNext) ->
  handleAnswerChange = (id, answer) =>
    change = {}
    change[id] = answer
    onDataChange(_.extend({}, data, change))

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
  else if item._type == "Section"
    # Sections are not usually rendered like this, except when in single-page mode. In which case, render as a group
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
  else
    throw new Error("Unknown item of type #{item._type}")
