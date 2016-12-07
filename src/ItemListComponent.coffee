_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
formRenderUtils = require './formRenderUtils'

#ReactCSSTransitionGroup = require('react-addons-css-transition-group')

# Display a list of items
module.exports = class ItemListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response (for roster entry if in roster)
    responseRow: React.PropTypes.object.isRequired    # ResponseRow object (for roster entry if in roster)
    onDataChange: React.PropTypes.func.isRequired
    onNext: React.PropTypes.func
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not
    schema: React.PropTypes.object.isRequired  # Schema to use, including form

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
      @props.onNext?()
    else
      @refs[@props.contents[index]._id]?.focus?()

  renderItem: (item, index) =>
    if @props.isVisible(item._id) and not item.disabled
      formRenderUtils.renderItem(item, @props.data, @props.responseRow, @props.schema, @props.onDataChange, @props.isVisible, @handleNext.bind(this, index))

  render: ->
    H.div null,
      # Fade in and out
      # TODO: Not working on my phone (mbriau) It sometimes fail when transitioning IN but always fail when transitioning out.
      #       There's no error reported, the order of the questions is just wrong after the transition...
      #R ReactCSSTransitionGroup, transitionName: "fade", transitionEnterTimeout: 300, transitionLeaveTimeout: 300,
      _.map(@props.contents, @renderItem)

