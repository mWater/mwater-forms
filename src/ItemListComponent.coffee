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

#ReactCSSTransitionGroup = require('react-addons-css-transition-group')

# Display a list of items
module.exports = class ItemListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. Data of roster entry if in a roster
    parentData: React.PropTypes.object      # Data of overall response if in a roster
    onDataChange: React.PropTypes.func.isRequired
    onNext: React.PropTypes.func
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression

  validate: (scrollToFirstInvalid) ->
    foundInvalid = false
    for item in @props.contents
      # Only if validation is possible
      if @refs[item._id]?.validate?(scrollToFirstInvalid and not foundInvalid)
        # DO NOT BREAK, it's important to call validate on each item
        foundInvalid = true
    return foundInvalid

  handleNext: (index) ->
    index++
    if index >= @props.contents.length
      @props.onNext()
    else
      @refs[@props.contents[index]._id]?.focus?()

  handleAnswerChange: (id, answer) =>
    change = {}
    change[id] = answer
    @props.onDataChange(_.extend({}, @props.data, change))

  renderItem: (item, index) =>
    # Check if invisible or disabled
    if not @props.isVisible(item._id) or item.disabled
      return null

    if formUtils.isQuestion(item)
      component = R QuestionComponent,
        key: item._id,
        ref: item._id,
        question: item
        onAnswerChange: @handleAnswerChange.bind(null, item._id)
        data: @props.data
        parentData: @props.parentData
        onNext: @handleNext.bind(this, index)
        formExprEvaluator: @props.formExprEvaluator
    else if item._type == "Instructions"
      return R InstructionsComponent,
        key: item._id,
        ref: item._id,
        instructions: item
        data: @props.data
        parentData: @props.parentData
        formExprEvaluator: @props.formExprEvaluator
    else if item._type == "Group"
      return R GroupComponent,
        key: item._id,
        ref: item._id,
        group: item
        data: @props.data
        parentData: @props.parentData
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        formExprEvaluator: @props.formExprEvaluator
        onNext: @handleNext.bind(this, index)
    else if item._type == "RosterGroup"
      return R RosterGroupComponent,
        key: item._id,
        ref: item._id,
        rosterGroup: item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        formExprEvaluator: @props.formExprEvaluator
    else if item._type == "RosterMatrix"
      return R RosterMatrixComponent,
        key: item._id,
        ref: item._id,
        rosterMatrix: item
        data: @props.data
        onDataChange: @props.onDataChange
        isVisible: @props.isVisible
        formExprEvaluator: @props.formExprEvaluator
    else
      throw new Error("Unknown item of type #{item._type}")

  render: ->
    H.div null,
      # Fade in and out
      # TODO: Not working on my phone (mbriau) It sometimes fail when transitioning IN but always fail when transitioning out.
      #       There's no error reported, the order of the questions is just wrong after the transition...
      #R ReactCSSTransitionGroup, transitionName: "fade", transitionEnterTimeout: 300, transitionLeaveTimeout: 300,
      _.map(@props.contents, @renderItem)

