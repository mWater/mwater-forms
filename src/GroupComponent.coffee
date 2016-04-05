_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'

# A group is a list of questions/other items that can have a common condition and a header
module.exports = class GroupComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string

  @propTypes:
    group: React.PropTypes.object.isRequired # Design of group. See schema
    data: React.PropTypes.object      # Current data of response. 
    onDataChange: React.PropTypes.func.isRequired   # Called when data changes
    isVisible: React.PropTypes.func.isRequired # (id) tells if an item is visible or not

  validate: (scrollToFirstInvalid) ->
    # Ignore if not visible
    if not @props.isVisible(@props.group._id)
      return false

    return @refs.itemlist.validate(scrollToFirstInvalid)

  render: ->
    if not @props.isVisible(@props.group._id)
      return null

    # To avoid circularity
    ItemListComponent = require './ItemListComponent'
      
    H.div key: index, className: "panel panel-default", 
      H.div key: "header", className: "panel-header",
        formUtils.localizeString(@props.group.name, @context.locale)

      H.div key: "body", className: "panel-body",
        R ItemListComponent,
          ref: "itemlist"
          contents: @props.group.contents
          data: @props.data
          onDataChange: @props.onDataChange
          isVisible: @props.isVisible
