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

# Displays a form that can be filled out
module.exports = class FormComponent extends React.Component
  @propTypes:
    formCtx: React.PropTypes.object.isRequired   # Context to use for form. See docs/FormsContext.md
    design: React.PropTypes.object.isRequired # Form design. See schema.coffee
  
    data: React.PropTypes.object.isRequired # Form response data. See docs/Answer Formats.md
    onDataChange: React.PropTypes.func.isRequired # Called when response data changes

    schema: React.PropTypes.object.isRequired  # Schema to use, including form

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
      T: @createLocalizer(@props.design, @props.locale)
    }

  getChildContext: -> 
    _.extend({}, @props.formCtx, {
      T: @state.T
      locale: @props.locale
    })

  componentWillReceiveProps: (nextProps) ->
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

  createResponseRow: (data) =>
    return new ResponseRow({
      responseData: data
      formDesign: @props.design
      schema: @props.schema
      getEntityById: @props.formCtx.getEntityById
      getEntityByCode: @props.formCtx.getEntityByCode
    })

  handleDataChange: (data) =>
    visibilityCalculator = new VisibilityCalculator(@props.design)
    defaultValueApplier = new DefaultValueApplier(@props.design, @props.formCtx.stickyStorage, @props.entity, @props.entityType)
    responseCleaner = new ResponseCleaner()

    # Clean response data
    responseCleaner.cleanData @props.design, visibilityCalculator, defaultValueApplier, data, @createResponseRow, @state.visibilityStructure, (error, results) =>
      if error
        # TODO what to do with this?
        throw error

      @setState(visibilityStructure: results.visibilityStructure)
      @props.onDataChange(results.data)

  handleNext: () =>
    @refs.submit.focus()

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
          ref: 'itemListComponent'
          contents: @props.design.contents
          data: @props.data
          onDataChange: @handleDataChange
          responseRow: @createResponseRow(@props.data)
          schema: @props.schema
          isVisible: @isVisible 
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
