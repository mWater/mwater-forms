PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

EntityDisplayComponent = require '../EntityDisplayComponent'
formUtils = require '../formUtils'

# Displays a site answer in a cell. No direct code entering, but stores answer as a code.
module.exports = class SiteColumnAnswerComponent extends React.Component
  @contextTypes:
    selectEntity: PropTypes.func
    getEntityById: PropTypes.func.isRequired
    getEntityByCode: PropTypes.func.isRequired
    renderEntityListItemView: PropTypes.func.isRequired
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: PropTypes.object
    onValueChange: PropTypes.func.isRequired
    siteType: PropTypes.string.isRequired

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
      return R 'div', null,
        R 'button', className: "btn btn-link btn-sm pull-right", onClick: @handleClearClick,
          R 'span', className: "glyphicon glyphicon-remove"

        R EntityDisplayComponent, 
          entityType: @props.siteType
          entityCode: @props.value?.code
          getEntityByCode: @context.getEntityByCode
          renderEntityView: @context.renderEntityListItemView
          T: @context.T
    else
      return R 'button', className: "btn btn-link", onClick: @handleSelectClick,
        @context.T("Select...")
