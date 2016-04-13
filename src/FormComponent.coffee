_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

SectionsComponent = require './SectionsComponent'
ItemListComponent = require './ItemListComponent'

ResponseCleaner = require './ResponseCleaner'
DefaultValueApplier = require './DefaultValueApplier'
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

  # The process of computing visibility, cleaning data and applying stickyData/defaultValue can trigger more changes
  # and should be repeated until the visibilityStructure is stable.
  # A simple case: Question A, B and C with B only visible if A is set and C only visible if B is set and B containing a defaultValue
  # Setting a value to A will make B visible and set to defaultValue, but C will remain invisible until the process is repeated
  computingVisibilityAndUpdatingData: (data, oldVisibilityStructure) ->
    oldVisibilityStructure = @state.visibilityStructure
    newVisibilityStructure = @computeVisibility(data)
    newData = @cleanData(data, newVisibilityStructure)
    newData = @stickyData(newData, oldVisibilityStructure, newVisibilityStructure)
    return [newData, newVisibilityStructure]

  handleDataChange: (data) =>
    newData = data
    oldVisibilityStructure = @state.visibilityStructure
    nbIterations = 0
    # This needs to be repeated until it stabilizes
    while true
      [newData, newVisibilityStructure] = @computingVisibilityAndUpdatingData(newData, oldVisibilityStructure)
      nbIterations++
      # If the visibilityStructure is still the same twice, the process is now stable.
      if _.isEqual(newVisibilityStructure, oldVisibilityStructure)
        break
      # Looping conditions???
      if nbIterations >= 10
        throw new Error('Impossible to compute question visibility. The question conditions must be looping')
      # New is now old
      oldVisibilityStructure = newVisibilityStructure

    @setState(visibilityStructure: newVisibilityStructure)
    @props.onDataChange(newData)

  computeVisibility: (data) ->
    visibilityCalculator = new VisibilityCalculator(@props.design)
    return visibilityCalculator.createVisibilityStructure(data)

  cleanData: (data, visibilityStructure) ->
    responseCleaner = new ResponseCleaner()
    return responseCleaner.cleanData(data, visibilityStructure)

  stickyData: (data, previousVisibilityStructure, newVisibilityStructure) ->
    defaultValueApplier = new DefaultValueApplier()
    return defaultValueApplier.setStickyData(@props.design, data, @props.formCtx.stickyStorage, previousVisibilityStructure, newVisibilityStructure)

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
