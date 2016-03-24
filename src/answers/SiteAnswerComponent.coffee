React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

EntityDisplayComponent = require '../EntityDisplayComponent'

# TODO: get the formCtx...
# Not tested

module.exports = class SiteAnswerComponent extends React.Component
  @contextTypes:
    selectEntity: React.PropTypes.func
    getEntityById: React.PropTypes.func

  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired
    siteTypes: React.PropTypes.array

  @defaultProps:
    value: false

  constructor: (props) ->
    @state = {isSelectingEntity: false}

  handleSelectClick: () =>
    @setState(isSelectingEntity: true)

  doSomething: () =>
    null
    ## Convert to new entity type
    #siteType = (if props.siteTypes then @props.siteTypes[0]) or "Water point"
    ## TODO: fix this, it screws up my editor display!
    ##entityType = siteType.toLowerCase().replace(/ /g, "_")
    #
    #@context.selectEntity { entityType: entityType, callback: (entityId) =>
    #  # Get entity
    #  @context.getEntityById(entityType, entityId, (entity) =>
    #    @props.onValueChange(code: entity.code)
    #    #TODO: will it be properly validate?
    #    #@validate()
    #  )
    #}

  render: ->
    value = @props.value
    if value then value = value.code

    H.div null,
      H.div className:"input-group",
          H.input id: "input", type: "tel", className: "form-control"
          H.span className: "input-group-btn",
            H.button className: "btn btn-default", disabled: not @context.selectEntity?, type: "button", click: @handleSelectClick,
              T("Select")
      H.br()
      # TODO: get the formCtx...
      #if @state.isSelectingEntity
      #  R EntityDisplayComponent, {formCtx: @ctx, displayInWell: true, entityCode: value, entityType: entityType}
