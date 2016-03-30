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
    getEntityByCode: React.PropTypes.func
    renderEntitySummaryView: React.PropTypes.func
    onNextOrComments: React.PropTypes.func

  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired
    siteTypes: React.PropTypes.array

  @defaultProps:
    value: false

  constructor: (props) ->
    super
    @state = {isSelectingEntity: false}

  focus: () ->
    @refs.input.focus()
    @refs.input.select()

  handleKeyDown: (ev) =>
    if @props.onNextOrComments?
      # When pressing ENTER or TAB
      if ev.keyCode == 13 or ev.keyCode == 9
        @props.onNextOrComments(ev)
        # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        ev.preventDefault()

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

    formCtx = {
      getEntityById: @context.getEntityById
      getEntityByCode: @context.getEntityByCode
      renderEntitySummaryView: @context.renderEntitySummaryView
    }

    H.div null,
      H.div className:"input-group",
          H.input id: "input", type: "tel", className: "form-control", onKeyDown: @handleKeyDown, ref: 'input'
          H.span className: "input-group-btn",
            H.button className: "btn btn-default", disabled: not @context.selectEntity?, type: "button", click: @handleSelectClick,
              T("Select")
      H.br()
      if @state.isSelectingEntity
        R EntityDisplayComponent, {formCtx: formCtx, displayInWell: true, entityCode: value, entityType: entityType}
