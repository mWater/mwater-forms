PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'

# A group is a list of questions/other items that can have a common condition and a header
module.exports = class GroupComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string

  @propTypes:
    group: PropTypes.object.isRequired # Design of group. See schema
    data: PropTypes.object      # Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object    # ResponseRow object (for roster entry if in roster)
    onDataChange: PropTypes.func.isRequired   # Called when data changes
    isVisible: PropTypes.func.isRequired # (id) tells if an item is visible or not
    onNext: PropTypes.func.isRequired   # Called when moving out of the GroupComponent questions
    schema: PropTypes.object.isRequired  # Schema to use, including form

  validate: (scrollToFirstInvalid) ->
    return @itemlist.validate(scrollToFirstInvalid)

  render: ->
    # To avoid circularity
    ItemListComponent = require './ItemListComponent'
      
    H.div className: "panel panel-default",
      H.div key: "header", className: "panel-heading",
        formUtils.localizeString(@props.group.name, @context.locale)

      H.div key: "body", className: "panel-body",
        R ItemListComponent,
          ref: ((c) => @itemlist = c)
          contents: @props.group.contents
          data: @props.data
          responseRow: @props.responseRow
          onDataChange: @props.onDataChange
          isVisible: @props.isVisible
          onNext: @props.onNext
          schema: @props.schema
          
