_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
markdown = require("markdown").markdown
ImageEditorComponent = require './ImageEditorComponent'
ImagelistEditorComponent = require './ImagelistEditorComponent'
AdminRegionAnswerComponent = require './AdminRegionAnswerComponent'
EntityAnswerComponent = require './EntityAnswerComponent'
LocationEditorComponent = require './LocationEditorComponent'
NumberInputComponent = require './NumberInputComponent'

CheckAnswerComponent = require './answers/CheckAnswerComponent'
DateAnswerComponent = require './answers/DateAnswerComponent'
DropdownAnswerComponent = require './answers/DropdownAnswerComponent'
LocationAnswerComponent = require './answers/LocationAnswerComponent'
MulticheckAnswerComponent = require './answers/MulticheckAnswerComponent'
RadioAnswerComponent = require './answers/RadioAnswerComponent'
TextAnswerComponent = require './answers/TextAnswerComponent'
TextListAnswerComponent = require './answers/TextListAnswerComponent'
UnitsAnswerComponent = require './answers/UnitsAnswerComponent'

# TODO clear alternate on value change
# TODO make faster with shouldComponentUpdate

# Question component that displays a question of any type.
# Displays question text and hint
# Displays toggleable help 
# Displays required (*)
# Displays comments field
# TODO Goes to next question when enter or tab is pressed on previous question
# TODO Goes to comments field when enter or tab is pressed on 
# Does NOT fill in when sticky and visible for first time. This is done by data cleaning
# Does NOT remove answer when invisible. This is done by data cleaning
# Does not check conditions or make self invisible. This is done by parent component.
# Displays alternates and makes exclusive with answer
# TODO Records timestamp when answered
# TODO Records GPS when answered
# TODO Displays validation errors and not answered errors when told to from above.
# TODO Allows focusing on question which scrolls into view
module.exports = class QuestionComponent extends React.Component
  @contextTypes: require('./formContextTypes')

  @propTypes:
    question: React.PropTypes.object.isRequired # Design of question. See schema
    # TODO we pass both complete data and answer. complete data is needed for substituting expressions in prompts. Should we pass both? Just data? onAnswerChange or onDataChange?
    data: React.PropTypes.object      # Current data of response. 
    answer: React.PropTypes.object      # Current answer. Contains { value: <some value> } usually. See docs/Answer Formats.md
    onAnswerChange: React.PropTypes.func.isRequired

  @defaultProps:
    answer: {}  # Default to {}

  constructor: ->
    super

    @state = {
      helpVisible: false    # True to display help
    }

  handleToggleHelp: =>
    @setState(helpVisible: not @state.helpVisible)

  handleValueChange: (value) =>
    @props.onAnswerChange(_.extend({}, @props.answer, { value: value }))

  handleAlternate: (alternate) =>
    # Clear value, specify and set alternate
    @props.onAnswerChange(_.extend({}, @props.answer, { 
      value: null
      specify: null
      alternate: if @props.answer.alternate == alternate then null else alternate
    }))

  handleCommentsChange: (ev) =>
    @props.onAnswerChange(_.extend({}, @props.answer, { comments: ev.target.value }))

  handleSpecifyChange: (specify) =>
    @props.onAnswerChange(_.extend({}, @props.answer, { specify: specify }))

  renderPrompt: ->
    prompt = formUtils.localizeString(@props.question.text, @context.locale)

    # Substitute data # TODO HACK
    prompt = prompt.replace(/\{(.+?)\}/g, (match, expr) =>
      value = @props.data
      for path in expr.split(":")
        if value
          value = value[path]
      return value or ""
      )

    H.div className: "prompt",
      if @props.question.code
        H.span className: "question-code", @props.question.code + ": "

      # Prompt
      prompt

      # Required star
      if @props.question.required
        H.span className: "required", "*"

      if @props.question.help
        H.button type: "button", className: "btn btn-link btn-sm", onClick: @handleToggleHelp,
          H.span className: "glyphicon glyphicon-question-sign"

  renderHint: ->
    if @props.question.hint
      H.div className: "text-muted", formUtils.localizeString(@props.question.hint, @context.locale)

  renderHelp: ->
    if @state.helpVisible and @props.question.help
      H.div className: "help well well-sm", dangerouslySetInnerHTML: { __html: markdown.toHTML(formUtils.localizeString(@props.question.help, @context.locale)) }

  renderAlternates: ->
    if @props.question.alternates and (@props.question.alternates.na or @props.question.alternates.dontknow)
      H.div null,
        if @props.question.alternates.dontknow
          H.div className: "touch-checkbox alternate #{if @props.answer.alternate == 'dontknow' then 'checked'}", onClick: @handleAlternate.bind(null, 'dontknow'),
            T("Don't Know")
        if @props.question.alternates.na
          H.div className: "touch-checkbox alternate #{if @props.answer.alternate == 'na' then 'checked'}", onClick: @handleAlternate.bind(null, 'na'),
            T("Not Applicable")

  renderCommentsField: ->
    if @props.question.commentsField
      H.textarea className: "form-control question-comments", placeholder: T("Comments"), value: @props.answer.comments, onChange: @handleCommentsChange

  renderAnswer: ->
    switch @props.question._type
      when "TextQuestion"
        # TODO multiline
        return R TextAnswerComponent, value: @props.answer.value, onValueChange: @handleValueChange

      when "NumberQuestion"
        return R NumberInputComponent, value: @props.answer.value, onChange: @handleValueChange, decimal: @props.question.decimal

      when "DropdownQuestion"
        return R DropdownAnswerComponent, {
          choices: @props.question.choices
          value: @props.answer.value
          onValueChange: @handleValueChange
          specify: @props.answer.specify
          onSpecifyChange: @handleSpecifyChange
        }

      when "RadioQuestion"
        return R RadioAnswerComponent, {
          choices: @props.question.choices
          value: @props.answer.value
          onValueChange: @handleValueChange
          specify: @props.answer.specify
          onSpecifyChange: @handleSpecifyChange
        }

      when "MulticheckQuestion"
        return R MulticheckAnswerComponent, {
          choices: @props.question.choices
          value: @props.answer.value
          onValueChange: @handleValueChange
          specify: @props.answer.specify
          onSpecifyChange: @handleSpecifyChange
        }

      when "DateQuestion" # , "DateTimeQuestion"??
        #console.log @props.question
        #console.log @props.answer
        return R DateAnswerComponent, {
          value: @props.answer.value
          onValueChange: @handleValueChange
        }

      when "UnitsQuestion"
        return R UnitsAnswerComponent, {
          answer: @props.answer
          onValueChange: @handleValueChange
          units: @props.question.units
          defaultUnits: @props.question.defaultUnits
          prefix: @props.question.unitsPosition == 'prefix'
        }

      when "CheckQuestion"
        return R CheckAnswerComponent, {
          value: @props.answer.value
          onValueChange: @handleValueChange
          label: @props.question.label
        }

      when "LocationQuestion"
        R LocationAnswerComponent,
          value: @props.answer.value
          onValueChange: @handleValueChange
          # storage: @context.storage
          displayMap: @context.displayMap

      when "ImageQuestion"
        return R ImageEditorComponent,
          imageManager: @context.imageManager
          imageAcquirer: @context.imageAcquirer
          image: @props.answer.value
          onImageChange: @handleValueChange 

      when "ImagesQuestion"
        return R ImageEditorComponent,
          imageManager: @context.imageManager
          imageAcquirer: @context.imageAcquirer
          imagelist: @props.answer.value
          onImagelistChange: @handleValueChange

      when "TextListQuestion"
        return R TextListAnswerComponent, {
          value: @props.answer.value
          onValueChange: @handleValueChange
        }

      when "SiteQuestion"
        return "TODO - site"

      when "BarcodeQuestion"
        return "TODO - text"

      when "EntityQuestion"
        return R EntityAnswerComponent,
          value: @props.answer.value
          entityType: @props.question.entityType
          onValueChange: @handleValueChange
          selectEntity: @context.selectEntity
          editEntity: @context.editEntity
          renderEntitySummaryView: @context.renderEntitySummaryView
          getEntityById: @context.getEntityById
          canEditEntity: @context.canEditEntity

      when "AdminRegionQuestion"
        # TODO defaultValue
        return R AdminRegionAnswerComponent,
          locationFinder: @context.locationFinder
          displayMap: @context.displayMap
          getAdminRegionPath: @context.getAdminRegionPath
          getSubAdminRegions: @context.getSubAdminRegions
          findAdminRegionByLatLng: @context.findAdminRegionByLatLng
          value: @props.answer.value
          onChange: @handleValueChange

      else
        return "Unknown type #{@props.question._type}"
    return null

  render: ->
    H.div className: "question",
      @renderPrompt()
      @renderHint()
      @renderHelp()

      H.div className: "answer",
        @renderAnswer()

      @renderAlternates()
      @renderCommentsField()
