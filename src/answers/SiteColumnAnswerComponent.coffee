React = require 'react'
H = React.DOM
R = React.createElement

EntityDisplayComponent = require '../EntityDisplayComponent'
formUtils = require '../formUtils'

# Displays a site answer in a cell. No direct code entering, but stores answer as a code.
module.exports = class SiteColumnAnswerComponent extends React.Component
  @contextTypes:
    selectEntity: React.PropTypes.func
    getEntityById: React.PropTypes.func.isRequired
    getEntityByCode: React.PropTypes.func.isRequired
    renderEntityListItemView: React.PropTypes.func.isRequired
    T: React.PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: React.PropTypes.object
    onValueChange: React.PropTypes.func.isRequired
    siteType: React.PropTypes.string.isRequired

  handleSelectClick: =>
    @context.selectEntity { entityType: @props.siteType, callback: (entityId) =>
      # Get entity
      @context.getEntityById(@props.siteType, entityId, (entity) =>
        @props.onValueChange(code: entity.code)
      )
    }

  handleClearClick: =>
    @props.onValueChange(null)

  render: ->
    if @props.value?.code
      return H.div null,
        H.button className: "btn btn-link pull-right", onClick: @handleClearClick,
          H.span className: "glyphicon glyphicon-remove"

        R EntityDisplayComponent, 
          entityType: @props.siteType
          entityCode: @props.value?.code
          getEntityByCode: @context.getEntityByCode
          renderEntityView: @context.renderEntityListItemView
          T: @context.T
    else
      return H.button className: "btn btn-link", onClick: @handleSelectClick,
        @context.T("Select...")
