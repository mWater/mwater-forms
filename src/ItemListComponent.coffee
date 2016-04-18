_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

ItemComponent = require './ItemComponent'
ReactCSSTransitionGroup = require('react-addons-css-transition-group')

# Display a list of items
module.exports = class ItemListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired
    onNext: React.PropTypes.func
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression

  validate: (scrollToFirstInvalid) ->
    foundInvalid = false
    for item in @props.contents
      itemComponent = @refs[item._id]
      if itemComponent?.validate?  # Only if validation is possible
        if itemComponent.validate(scrollToFirstInvalid and not foundInvalid)
          foundInvalid = true
    return foundInvalid

  handleNext: (index) ->
    index++
    if index >= @props.contents.length
      @props.onNext()
    else
      @refs[@props.contents[index]._id].focus()

  renderItem: (item, index) =>
    # Check if invisible or disabled
    if not @props.isVisible(item._id) or item.disabled
      return null

    R(ItemComponent, {
      key: item._id,
      ref: item._id,
      item: item,
      data: @props.data,
      onDataChange: @props.onDataChange,
      onNext: @handleNext.bind(this, index)
      isVisible: @props.isVisible
      formExprEvaluator: @props.formExprEvaluator
    })

  render: ->
    H.div null,
      # Fade in and out
      # TODO: Not working on my phone (mbriau) It sometimes fail when transitioning IN but always fail when transitioning out.
      #       There's no error reported, the order of the questions is just wrong after the transition...
      #R ReactCSSTransitionGroup, transitionName: "fade", transitionEnterTimeout: 300, transitionLeaveTimeout: 300,
      _.map(@props.contents, @renderItem)

