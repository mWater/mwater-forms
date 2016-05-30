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
formRenderUtils = require './formRenderUtils'

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

  renderItem: (item, index) =>
    if @props.isVisible(item._id) and not item.disabled
      formRenderUtils.renderItem(item, @props.data, @props.parentData, @props.formExprEvaluator, @props.onDataChange, @props.isVisible, @handleNext.bind(this, index))

  render: ->
    H.div null,
      # Fade in and out
      # TODO: Not working on my phone (mbriau) It sometimes fail when transitioning IN but always fail when transitioning out.
      #       There's no error reported, the order of the questions is just wrong after the transition...
      #R ReactCSSTransitionGroup, transitionName: "fade", transitionEnterTimeout: 300, transitionLeaveTimeout: 300,
      _.map(@props.contents, @renderItem)

