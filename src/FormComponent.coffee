_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

SectionsComponent = require './SectionsComponent'
ItemListComponent = require './ItemListComponent'
ezlocalize = require 'ez-localize'

ResponseCleaner = require './ResponseCleaner'
DefaultValueApplier = require './DefaultValueApplier'
VisibilityCalculator = require './VisibilityCalculator'
FormExprEvaluator = require './FormExprEvaluator'

# Displays a form that can be filled out
module.exports = class FormComponent extends React.Component
  @propTypes:
    formCtx: React.PropTypes.object.isRequired   # Context to use for form. See docs/FormsContext.md
    design: React.PropTypes.object.isRequired # Form design. See schema.coffee
  
    data: React.PropTypes.object.isRequired # Form response data. See docs/Answer Formats.md
    onDataChange: React.PropTypes.func.isRequired # Called when response data changes

    locale: React.PropTypes.string          # e.g. "fr"
    
    onSubmit: React.PropTypes.func.isRequired     # Called when submit is pressed
    onSaveLater: React.PropTypes.func             # Optional save for later
    onDiscard: React.PropTypes.func.isRequired    # Called when discard is pressed

    entity: React.PropTypes.object            # Form-level entity to load
    entityType: React.PropTypes.string        # Type of form-level entity to load

    singlePageMode: React.PropTypes.bool      # True to render as a single page, not divided into sections

  @childContextTypes: _.extend({}, require('./formContextTypes'), {
    T: React.PropTypes.func.isRequired
    locale: React.PropTypes.string          # e.g. "fr"
  })

  constructor: (props) ->
    super(props)

    @state = {
      visibilityStructure: {}
      formExprEvaluator: new FormExprEvaluator(@props.design)
      T: @createLocalizer(@props.design, @props.locale)
    }

  getChildContext: -> 
    _.extend({}, @props.formCtx, {
      T: @state.T
      locale: @props.locale
    })

  componentWillReceiveProps: (nextProps) ->
    if @props.design != nextProps.design
      @setState(formExprEvaluator: new FormExprEvaluator(nextProps.design))

    if @props.design != nextProps.design or @props.locale != nextProps.locale
      @setState(T: @createLocalizer(nextProps.design, nextProps.locale))

  # This will clean the data that has been passed at creation
  # It will also initialize the visibilityStructure
  # And set the sticky data
  componentWillMount: ->
    @handleDataChange(@props.data)

  # Creates a localizer for the form design
  createLocalizer: (design, locale) ->
    # Create localizer
    localizedStrings = design.localizedStrings or []
    localizerData = {
      locales: design.locales
      strings: localizedStrings
    }
    T = new ezlocalize.Localizer(localizerData, locale).T
    return T

  handleSubmit: =>
    # Cannot submit if at least one item is invalid
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
    return responseCleaner.cleanData(data, visibilityStructure, @props.design)

  stickyData: (data, previousVisibilityStructure, newVisibilityStructure) ->
    defaultValueApplier = new DefaultValueApplier(@props.design, @props.formCtx.stickyStorage, @props.entity, @props.entityType)
    return defaultValueApplier.setStickyData(data, previousVisibilityStructure, newVisibilityStructure)

  handleNext: () =>
    @refs.submit.focus()

  render: ->
    if @props.design.contents[0] and @props.design.contents[0]._type == "Section" and not @props.singlePageMode
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
          onNext: @handleNext

        H.button type: "button", key: 'submitButton', className: "btn btn-primary", ref: 'submit', onClick: @handleSubmit,
          @state.T("Submit")

        "\u00A0"

        if @props.onSaveLater
          [
            H.button type: "button", key: 'saveLaterButton', className: "btn btn-default", onClick: @props.onSaveLater,
              @state.T("Save for Later")
            "\u00A0"
          ]

        H.button type:"button", key: 'discardButton', className: "btn btn-default", onClick: @props.onDiscard,
          H.span className: "glyphicon glyphicon-trash"
          " " + @state.T("Discard")
