React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'
EntityDisplayComponent = require '../EntityDisplayComponent'

# TODO: SurveyorPro: Bug: Code is not actually set in the input field after selecting an entity!!
# TODO: SurveyorPro: Also it doesn't work if you type a code and press enter
# TODO: SurveyorPro: I don't think it should support onNextOrComments (my mistake), if it DOES, then we should pass it down from QuestionComponent
# TODO: validate codes in answervalidator

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
      )
    }

  handleChange: (ev) =>
    if ev.target.value
      @props.onValueChange({ code: ev.target.value })
    else
      @props.onValueChange(null)

  render: ->
    H.div null,
      H.div className:"input-group",
        H.input 
          type: "tel"
          className: "form-control"
          onKeyDown: @handleKeyDown
          ref: 'input'
          value: @props.value?.code or ""
          onChange: @handleChange
        H.span className: "input-group-btn",
          H.button className: "btn btn-default", disabled: not @context.selectEntity?, type: "button", onClick: @handleSelectClick,
            T("Select")
      H.br()
      R EntityDisplayComponent, 
        displayInWell: true
        entityType: @getEntityType()
        entityCode: @props.value?.code
