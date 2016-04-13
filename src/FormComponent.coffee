_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

SectionsComponent = require './SectionsComponent'
ItemListComponent = require './ItemListComponent'

ResponseCleaner = require './ResponseCleaner'
StickyEntity = require './StickyEntity'
VisibilityCalculator = require './VisibilityCalculator'
FormExprEvaluator = require './FormExprEvaluator'

# Displays a form that can be filled out
module.exports = class FormComponent extends React.Component
  @contextTypes:
    stickyStorage: React.PropTypes.object   # Storage for sticky values

  @propTypes:
    formCtx: React.PropTypes.object.isRequired   # Context to use for form. See docs/FormsContext.md
    design: React.PropTypes.object.isRequired # Form design. See schema.coffee
  
    data: React.PropTypes.object.isRequired # Form response data. See docs/Answer Formats.md
    onDataChange: React.PropTypes.func.isRequired # Called when response data changes

    onSubmit: React.PropTypes.func.isRequired     # Called when submit is pressed
    onSaveLater: React.PropTypes.func             # Optional save for later
    onDiscard: React.PropTypes.func.isRequired    # Called when discard is pressed

    entity: React.PropTypes.object            # Form-level entity to load TODO https://github.com/mWater/mwater-forms/issues/115
    entityType: React.PropTypes.string        # Type of form-level entity to load TODO https://github.com/mWater/mwater-forms/issues/115

  @childContextTypes: require('./formContextTypes')

  constructor: (props) ->
    super

    @state = {
      visibilityStructure: {}
      formExprEvaluator: new FormExprEvaluator(@props.design)
    }

  getChildContext: -> @props.formCtx

  componentWillReceiveProps: (nextProps) ->
    @setState(formExprEvaluator: new FormExprEvaluator(nextProps.design))

  # This will clean the data that has been passed at creation
  # It will also initialize the visibilityStructure
  # And set the sticky data
  componentWillMount: ->
    @handleDataChange(@props.data)

  handleSubmit: =>
    # Cannot submit if at least one itemComponent is invalid
    if not @refs.itemListComponent.validate(true)
      @props.onSubmit()

  isVisible: (itemId) =>
    return @state.visibilityStructure[itemId]

  handleDataChange: (data) =>
    oldVisibilityStructure = @state.visibilityStructure
    newVisibilityStructure = @computeVisibility(data)
    newData = @cleanData(data, newVisibilityStructure)
    newData = @stickyData(newData, oldVisibilityStructure, newVisibilityStructure)
    @setState(visibilityStructure: newVisibilityStructure)
    @props.onDataChange(newData)

  computeVisibility: (data) ->
    visibilityCalculator = new VisibilityCalculator(@props.design)
    return visibilityCalculator.createVisibilityStructure(data)

  cleanData: (data, visibilityStructure) ->
    responseCleaner = new ResponseCleaner()
    return responseCleaner.cleanData(data, visibilityStructure)

  stickyData: (data, previousVisibilityStructure, newVisibilityStructure) ->
    stickyEntity = new StickyEntity()
    return stickyEntity.setStickyData(@props.design, data, @props.formCtx.stickyStorage, previousVisibilityStructure, newVisibilityStructure)

  render: ->
    if @props.design.contents[0] and @props.design.contents[0]._type == "Section"
      R SectionsComponent,
        contents: @props.design.contents
        data: @props.data
        onDataChange: @handleDataChange
        onSubmit: @props.onSubmit
        onSaveLater: @props.onSaveLater
        onDiscard: @props.onDiscard
        isVisible: @isVisible
        formExprEvaluator: @state.formExprEvaluator 
    else
      H.div null,
        R ItemListComponent,
          ref: 'itemListComponent'
          contents: @props.design.contents
          data: @props.data
          onDataChange: @handleDataChange
          isVisible: @isVisible 
          formExprEvaluator: @state.formExprEvaluator 

        H.button type: "button", className: "btn btn-primary", onClick: @handleSubmit,
          T("Submit")

        if @props.onSaveLater
          [
            H.button type: "button", className: "btn btn-default", onClick: @props.onSaveLater,
              T("Save for Later")
            "\u00A0"
          ]

        H.button type:"button", className: "btn btn-default", onClick: @props.onDiscard,
          H.span className: "glyphicon glyphicon-trash"
          " " + T("Discard")
