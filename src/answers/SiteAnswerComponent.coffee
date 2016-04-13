React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

EntityDisplayComponent = require '../EntityDisplayComponent'

# TODO: SurveyorPro: Bug: Code is not actually set in the input field after selecting an entity!!
# TODO: SurveyorPro: Also it doesn't work if you type a code and press enter
# TODO: SurveyorPro: I don't think it should support onNextOrComments (my mistake), if it DOES, then we should pass it down from QuestionComponent

module.exports = class SiteAnswerComponent extends React.Component
  @contextTypes:
    selectEntity: React.PropTypes.func
    getEntityById: React.PropTypes.func
    getEntityByCode: React.PropTypes.func
    renderEntitySummaryView: React.PropTypes.func
    onNextOrComments: React.PropTypes.func

  @propTypes:
    value: React.PropTypes.object
    onValueChange: React.PropTypes.func.isRequired
    siteTypes: React.PropTypes.array

  @defaultProps:
    value: false

  constructor: (props) ->
    super
    @state = {shownEntity: false}

  focus: () ->
    @refs.input.focus()

  handleKeyDown: (ev) =>
    if @props.onNextOrComments?
      # When pressing ENTER or TAB
      if ev.keyCode == 13 or ev.keyCode == 9
        @props.onNextOrComments(ev)
        # It's important to prevent the default behavior when handling tabs (or else the tab is applied after the focus change)
        ev.preventDefault()

  getEntityType: () ->
    # Convert to new entity type
    siteType = (if @props.siteTypes then @props.siteTypes[0]) or "Water point"
    entityType = siteType.toLowerCase().replace(' ', "_")
    return entityType

  handleSelectClick: () =>
    entityType = @getEntityType()

    @context.selectEntity { entityType: entityType, callback: (entityId) =>
      # Get entity
      @context.getEntityById(entityType, entityId, (entity) =>
        @props.onValueChange(code: entity.code)
        @setState(shownEntityCode: entity.code)
      )
    }

  renderEntityDisplayComponent: ->
    entityType = @getEntityType()
    formCtx = {
      getEntityById: @context.getEntityById
      getEntityByCode: @context.getEntityByCode
      renderEntitySummaryView: @context.renderEntitySummaryView
    }
    return R EntityDisplayComponent, {formCtx: formCtx, displayInWell: true, entityCode: @state.shownEntityCode, entityType: entityType}

  render: ->
    H.div null,
      H.div className:"input-group",
          H.input id: "input", type: "tel", className: "form-control", onKeyDown: @handleKeyDown, ref: 'input'
          H.span className: "input-group-btn",
            H.button className: "btn btn-default", disabled: not @context.selectEntity?, type: "button", onClick: @handleSelectClick,
              T("Select")
      H.br()
      if @state.shownEntityCode
        @renderEntityDisplayComponent()
