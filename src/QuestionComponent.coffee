_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
markdown = require("markdown").markdown
LocationEditorComponent = require './LocationEditorComponent'

AnswerValidator = require './answers/AnswerValidator'

AdminRegionAnswerComponent = require './answers/AdminRegionAnswerComponent'
BarcodeAnswerComponent = require './answers/BarcodeAnswerComponent'
CheckAnswerComponent = require './answers/CheckAnswerComponent'
DateAnswerComponent = require './answers/DateAnswerComponent'
DropdownAnswerComponent = require './answers/DropdownAnswerComponent'
EntityAnswerComponent = require './answers/EntityAnswerComponent'
ImageAnswerComponent = require './answers/ImageAnswerComponent'
ImagesAnswerComponent = require './answers/ImagesAnswerComponent'
LocationAnswerComponent = require './answers/LocationAnswerComponent'
MulticheckAnswerComponent = require './answers/MulticheckAnswerComponent'
NumberAnswerComponent = require './answers/NumberAnswerComponent'
RadioAnswerComponent = require './answers/RadioAnswerComponent'
SiteAnswerComponent = require './answers/SiteAnswerComponent'
TextAnswerComponent = require './answers/TextAnswerComponent'
TextListAnswerComponent = require './answers/TextListAnswerComponent'
UnitsAnswerComponent = require './answers/UnitsAnswerComponent'

# TODO make faster with shouldComponentUpdate
# Question component that displays a question of any type.
# Displays question text and hint
# Displays toggleable help 
# Displays required (*)
# Displays comments field
# Does NOT fill in when sticky and visible for first time. This is done by data cleaning
# Does NOT remove answer when invisible. This is done by data cleaning
# Does NOT check conditions and make self invisible. This is done by parent (ItemListComponent)
# Displays alternates and makes exclusive with answer
# TODO Records timestamp when answered
# TODO Records GPS when answered
module.exports = class QuestionComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string
    stickyStorage: React.PropTypes.object   # Storage for sticky values

  @propTypes:
    question: React.PropTypes.object.isRequired # Design of question. See schema
    # TODO we pass both complete data and answer. complete data is needed for substituting expressions in prompts. Should we pass both? Just data? onAnswerChange or onDataChange?
    data: React.PropTypes.object      # Current data of response. 
    answer: React.PropTypes.object      # Current answer. Contains { value: <some value> } usually. See docs/Answer Formats.md
    onAnswerChange: React.PropTypes.func.isRequired
    displayMissingRequired: React.PropTypes.bool
    onNext: React.PropTypes.func

  @defaultProps:
    answer: {}

  constructor: ->
    super

    @state = {
      helpVisible: false    # True to display help
      validationError: null
      # savedValue and savedSpecify are used to save the value when selecting an alternate answer
      savedValue: null
      savedSpecify: null
    }

  focus: ->
    answer = @refs.answer
    if answer? and answer.focus?
      answer.focus()

  # Returns true if validation error
  validate: (scrollToFirstInvalid) ->
    validationError = new AnswerValidator().validate(@props.question, @props.answer)

    if validationError?
      if scrollToFirstInvalid
        @refs.prompt.scrollIntoView()
      @setState(validationError: validationError)
      return true
    else
      @setState(validationError: null)
      return false

  handleToggleHelp: =>
    @setState(helpVisible: not @state.helpVisible)

  handleValueChange: (value) =>
    @handleAnswerChange(_.extend({}, @props.answer, { value: value }, alternate: null))

  handleAnswerChange: (answer) =>
    # TODO: Set sticky value if sticky question
    # TODO: What should happen if value is set to null?
    # TODO: What should happen if alternate is set?
    if @props.question.sticky and @context.stickyStorage? and answer.value?
      @context.stickyStorage.set(@props.question._id, answer.value)
      console.log 'setting sticky value: '
      console.log answer.value
    @props.onAnswerChange(answer)

  handleAlternate: (alternate) =>
    # If we are selecting a new alternate
    if @props.answer.alternate != alternate
      # If old alternate was null (important not to do this when changing from an alternate value to another)
      if not @props.answer.alternate?
        # It saves value and specify
        @setState({savedValue: _.clone @props.answer.value, savedSpecify: _.clone @props.answer.specify})
      # Then clear value, specify and set alternate
      @handleAnswerChange(_.extend({}, @props.answer, {
        value: null
        specify: null
        alternate: alternate
      }))
    else
      # Clear alternate and put back saved value and specify
      @handleAnswerChange(_.extend({}, @props.answer, {
        value: @state.savedValue
        specify: @state.savedSpecify
        alternate: null
      }))
      @setState({savedValue: null, savedSpecify: null})

  handleCommentsChange: (ev) =>
    @handleAnswerChange(_.extend({}, @props.answer, { comments: ev.target.value }))

  # Either jump to next question or select the comments box
  handleNextOrComments: (ev) =>
    # If it has a comment box, set the focus on it
    if @props.question.commentsField?
      comments = @refs.comments
      comments.focus()
      comments.select()
    # Else we lose the focus and go to the next question
    else
      # Blur the input (remove the focus)
      ev.target.blur()
      @props.onNext?()

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

    promptDiv = H.div className: "prompt", ref: 'prompt',
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

    if @props.question._type == 'CheckQuestion'
      R CheckAnswerComponent, {
        ref: "answer"
        value: @props.answer.value
        onValueChange: @handleValueChange
        label: @props.question.label
      }, promptDiv
    else
      return promptDiv

  renderHint: ->
    if @props.question.hint
      H.div className: "text-muted", formUtils.localizeString(@props.question.hint, @context.locale)

  renderHelp: ->
    if @state.helpVisible and @props.question.help
      H.div className: "help well well-sm", dangerouslySetInnerHTML: { __html: markdown.toHTML(formUtils.localizeString(@props.question.help, @context.locale)) }

  renderValidationError: ->
    if @state.validationError? and typeof(@state.validationError) == "string"
      H.div className: "validation-message text-danger",
        @state.validationError

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
      H.textarea className: "form-control question-comments", ref: "comments", placeholder: T("Comments"), value: @props.answer.comments, onChange: @handleCommentsChange

  renderAnswer: ->
    switch @props.question._type
      when "TextQuestion"
        return R TextAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          format: @props.question.format
          onValueChange: @handleValueChange
          onNextOrComments: @handleNextOrComments
        }

      when "NumberQuestion"
        return R NumberAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          onChange: @handleValueChange
          decimal: @props.question.decimal
        }

      when "DropdownQuestion"
        return R DropdownAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          answer: @props.answer
          onAnswerChange: @handleAnswerChange
        }

      when "RadioQuestion"
        return R RadioAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          answer: @props.answer
          onAnswerChange: @handleAnswerChange
        }

      when "MulticheckQuestion"
        return R MulticheckAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          answer: @props.answer
          onAnswerChange: @handleAnswerChange
        }

      when "DateQuestion"
        return R DateAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          onValueChange: @handleValueChange
          format: @props.question.format
          placeholder: @props.question.placeholder
        }

      when "UnitsQuestion"
        return R UnitsAnswerComponent, {
          ref: "answer"
          answer: @props.answer
          onValueChange: @handleValueChange
          units: @props.question.units
          defaultUnits: @props.question.defaultUnits
          prefix: @props.question.unitsPosition == 'prefix'
          decimal: @props.question.decimal
        }

      when "CheckQuestion"
        return null

      when "LocationQuestion"
        return R LocationAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          onValueChange: @handleValueChange
        }

      when "ImageQuestion"
        return R ImageAnswerComponent,
          image: @props.answer.value
          onImageChange: @handleValueChange 

      when "ImagesQuestion"
        return R ImagesAnswerComponent, {
          ref: "answer"
          imagelist: @props.answer.value
          onImagelistChange: @handleValueChange
        }

      when "TextListQuestion"
        return R TextListAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          onValueChange: @handleValueChange
        }

      when "SiteQuestion"
        return R SiteAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          onValueChange: @handleValueChange
        }

      when "BarcodeQuestion"
        return R BarcodeAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          onValueChange: @handleValueChange
        }

      when "EntityQuestion"
        return R EntityAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          entityType: @props.question.entityType
          onValueChange: @handleValueChange
        }

      when "AdminRegionQuestion"
        # TODO defaultValue
        return R AdminRegionAnswerComponent, {
          ref: "answer"
          value: @props.answer.value
          onChange: @handleValueChange
        }
      else
        return "Unknown type #{@props.question._type}"
    return null

  render: ->
    # Create classname to include invalid if invalid
    className = "question"
    if @state.validationError?
      className += " invalid"

    H.div className: className,
      @renderPrompt()
      @renderHint()
      @renderHelp()

      H.div className: "answer",
        @renderAnswer()

      @renderAlternates()
      @renderValidationError()
      @renderCommentsField()
