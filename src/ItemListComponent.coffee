_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

ItemComponent = require './ItemComponent'

# Display a list of items
module.exports = class ItemListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired
    onNext: React.PropTypes.func
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not

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
    # Check if visible
    if not @props.isVisible(item._id)
      return null

    R(ItemComponent, {
      key: item._id,
      ref: item._id,
      item: item,
      data: @props.data,
      onDataChange: @props.onDataChange,
      onNext: @handleNext.bind(this, index)
      isVisible: @props.isVisible
    })

  render: ->
    H.div null,
      _.map(@props.contents, @renderItem)

