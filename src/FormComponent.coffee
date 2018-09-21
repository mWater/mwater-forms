PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

SectionsComponent = require './SectionsComponent'
ItemListComponent = require './ItemListComponent'
ezlocalize = require 'ez-localize'

ResponseCleaner = require './ResponseCleaner'
ResponseRow = require './ResponseRow'
DefaultValueApplier = require './DefaultValueApplier'
VisibilityCalculator = require './VisibilityCalculator'
RandomAskedCalculator = require './RandomAskedCalculator'

# Displays a form that can be filled out
module.exports = class FormComponent extends React.Component
  @propTypes:
    formCtx: PropTypes.object.isRequired   # Context to use for form. See docs/FormsContext.md
    design: PropTypes.object.isRequired # Form design. See schema.coffee
  
    data: PropTypes.object.isRequired # Form response data. See docs/Answer Formats.md
    onDataChange: PropTypes.func.isRequired # Called when response data changes

    schema: PropTypes.object.isRequired  # Schema to use, including form

    deployment: PropTypes.string.isRequired  # The current deployment
    locale: PropTypes.string          # e.g. "fr"
    
    onSubmit: PropTypes.func                # Called when submit is pressed
    onSaveLater: PropTypes.func             # Optional save for later
    onDiscard: PropTypes.func               # Called when discard is pressed

    submitLabel: PropTypes.string           # To override submit label
    saveLaterLabel: PropTypes.string        # To override Save For Later label
    discardLabel: PropTypes.string          # To override Discard label

    entity: PropTypes.object            # Form-level entity to load
    entityType: PropTypes.string        # Type of form-level entity to load

    singlePageMode: PropTypes.bool      # True to render as a single page, not divided into sections
    disableConfidentialFields: PropTypes.bool # True to disable the confidential fields, used during editing responses with confidential data

  @childContextTypes: _.extend({}, require('./formContextTypes'), {
    T: PropTypes.func.isRequired
    locale: PropTypes.string          # e.g. "fr"
    disableConfidentialFields: PropTypes.bool
  })

  constructor: (props) ->
    super(props)

    @state = {
      visibilityStructure: {}
      T: @createLocalizer(@props.design, @props.locale)
    }

    # Save which data visibility structure applies to
    @currentData = null

  getChildContext: -> 
    _.extend({}, @props.formCtx, {
      T: @state.T
      locale: @props.locale
      disableConfidentialFields: @props.disableConfidentialFields
    })

  componentWillReceiveProps: (nextProps) ->
    if @props.design != nextProps.design or @props.locale != nextProps.locale
      @setState(T: @createLocalizer(nextProps.design, nextProps.locale))

  componentDidUpdate: (prevProps) ->
    # When data change is external, process it to set visibility, etc.
    if prevProps.data != @props.data and not _.isEqual(@props.data, @currentData)
      @handleDataChange(@props.data)

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
    result = await @itemListComponent.validate(true)
    if not result
      @props.onSubmit()

  isVisible: (itemId) =>
    return @state.visibilityStructure[itemId]

  createResponseRow: (data) =>
    return new ResponseRow({
      responseData: data
      formDesign: @props.design
      schema: @props.schema
      getEntityById: @props.formCtx.getEntityById
      getEntityByCode: @props.formCtx.getEntityByCode
      deployment: @props.deployment
    })

  handleDataChange: (data) =>
    visibilityCalculator = new VisibilityCalculator(@props.design, @props.schema)
    defaultValueApplier = new DefaultValueApplier(@props.design, @props.formCtx.stickyStorage, @props.entity, @props.entityType)
    randomAskedCalculator = new RandomAskedCalculator(@props.design)
    responseCleaner = new ResponseCleaner()

    # Immediately update data, as another answer might be clicked on (e.g. blur from a number input and clicking on a radio answer)
    @currentData = data
    @props.onDataChange(data)

    # Clean response data, remembering which data object is being cleaned
    this.cleanInProgress = data

    responseCleaner.cleanData @props.design, visibilityCalculator, defaultValueApplier, randomAskedCalculator, data, @createResponseRow, @state.visibilityStructure, (error, results) =>
      if error
        alert(T("Error saving data") + ": #{error.message}")
        return

      # Ignore if from a previous clean
      if data != this.cleanInProgress 
        console.log("Ignoring stale handleDataChange data")
        return

      @setState(visibilityStructure: results.visibilityStructure)
      # Ignore if unchanged
      if not _.isEqual(data, results.data)
        @currentData = results.data
        @props.onDataChange(results.data)

  handleNext: () =>
    @submit.focus()

  render: ->
    if @props.design.contents[0] and @props.design.contents[0]._type == "Section" and not @props.singlePageMode
      R SectionsComponent,
        contents: @props.design.contents
        data: @props.data
        onDataChange: @handleDataChange
        responseRow: @createResponseRow(@props.data)
        schema: @props.schema
        onSubmit: @props.onSubmit
        onSaveLater: @props.onSaveLater
        onDiscard: @props.onDiscard
        isVisible: @isVisible
    else
      H.div null,
        R ItemListComponent,
          ref: ((c) => @itemListComponent = c)
          contents: @props.design.contents
          data: @props.data
          onDataChange: @handleDataChange
          responseRow: @createResponseRow(@props.data)
          schema: @props.schema
          isVisible: @isVisible 
          onNext: @handleNext

        if @props.onSubmit
          H.button type: "button", key: 'submitButton', className: "btn btn-primary", ref: ((c) => @submit = c), onClick: @handleSubmit,
            if @props.submitLabel
              @props.submitLabel
            else
              @state.T("Submit")

        "\u00A0"

        if @props.onSaveLater
          [
            H.button type: "button", key: 'saveLaterButton', className: "btn btn-default", onClick: @props.onSaveLater,
              if @props.saveLaterLabel
                @props.saveLaterLabel
              else
                @state.T("Save for Later")
            "\u00A0"
          ]

        if @props.onDiscard
          H.button type:"button", key: 'discardButton', className: "btn btn-default", onClick: @props.onDiscard,
            if @props.discardLabel
              @props.discardLabel
            else
              [
                H.span className: "glyphicon glyphicon-trash"
                " " + @state.T("Discard")
              ]
