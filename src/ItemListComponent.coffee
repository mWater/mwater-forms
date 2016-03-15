_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

ItemComponent = require './ItemComponent'

# Display a list of items
# TODO should allow validating and scrolling to the first invalid one
module.exports = class ItemListComponent extends React.Component
  @propTypes:
    contents: React.PropTypes.array.isRequired 
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired

  render: ->
    H.div null,
      _.map(@props.contents, (item) => R(ItemComponent, item: item, data: @props.data, onDataChange: @props.onDataChange))

