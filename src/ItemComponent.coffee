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
  @contextTypes:
    locale: React.PropTypes.string

  @propTypes:
    item: React.PropTypes.object.isRequired 
    data: React.PropTypes.object.isRequired      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired
    onNext: React.PropTypes.func
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression

  handleAnswerChange: (id, answer) =>
    change = {}
    change[id] = answer
    @props.onDataChange(_.extend({}, @props.data, change))

  shouldComponentUpdate: (nextProps, nextState) ->
    if formUtils.isQuestion(nextProps.item) and formUtils.isQuestion(@props.item)
      return @refs.item.testShouldComponentUpdate(@createQuestionComponentProps(nextProps))
    return true

  createQuestionComponentProps: (props) ->
    return {
      ref: 'item'
      question: props.item
      onAnswerChange: @handleAnswerChange.bind(null, props.item._id)
      data: props.data
      onNext: props.onNext
      formExprEvaluator: props.formExprEvaluator
      locale: @context.locale
    }

  validate: (scrollToFirstInvalid) ->
    if @refs.item? and @refs.item.validate?
      return @refs.item.validate(scrollToFirstInvalid)
    return false

  focus: () ->
    if @refs.item?.focus?
      return @refs.item.focus()
    return false

  render: ->
    if formUtils.isQuestion(@props.item)
      return R QuestionComponent, @createQuestionComponentProps(@props)
    else if @props.item._type == "Instructions"
      return R InstructionsComponent,
        ref: 'item'
        instructions: @props.item
        data: @props.data
        formExprEvaluator: @props.formExprEvaluator
    else if @props.item._type == "Group"
      return R GroupComponent,
        ref: 'item'
        group: @props.item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        formExprEvaluator: @props.formExprEvaluator
        onNext: @props.onNext
    else if @props.item._type == "RosterGroup"
      return R RosterGroupComponent,
        ref: 'item'
        rosterGroup: @props.item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        formExprEvaluator: @props.formExprEvaluator
    else if @props.item._type == "RosterMatrix"
      return R RosterMatrixComponent,
        ref: 'item'
        rosterMatrix: @props.item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        formExprEvaluator: @props.formExprEvaluator
    else
      throw new Error("Unknown item of type #{@props.item._type}")
