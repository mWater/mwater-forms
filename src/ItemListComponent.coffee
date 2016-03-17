_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

ItemComponent = require './ItemComponent'

# Display a list of items
# TODO should allow validating and scrolling to the first invalid one
# TODO should display only items where conditions are true
module.exports = class ItemListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired

  renderItem: (item) ->
    # HACK condition
    if item._id == "c91fd40903ff4f0a980352f7ae0b3998" and @props.data.b >= 18
      return null

    R(ItemComponent, item: item, data: @props.data, onDataChange: @props.onDataChange)

  render: ->
    H.div null,
      _.map(@props.contents, (item) => @renderItem(item))

