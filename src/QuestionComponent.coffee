PropTypes = require('prop-types')
_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
markdown = require("markdown").markdown
TextExprsComponent = require './TextExprsComponent'

LocationFinder = require './LocationFinder'
CurrentPositionFinder = require './legacy/CurrentPositionFinder'

AnswerValidator = require './answers/AnswerValidator'

AdminRegionAnswerComponent = require './answers/AdminRegionAnswerComponent'
AquagenxCBTAnswerComponent = require './answers/AquagenxCBTAnswerComponent'
BarcodeAnswerComponent = require './answers/BarcodeAnswerComponent'
CheckAnswerComponent = require './answers/CheckAnswerComponent'
DateAnswerComponent = require './answers/DateAnswerComponent'
DropdownAnswerComponent = require './answers/DropdownAnswerComponent'
EntityAnswerComponent = require './answers/EntityAnswerComponent'
ImageAnswerComponent = require './answers/ImageAnswerComponent'
ImagesAnswerComponent = require './answers/ImagesAnswerComponent'
LikertAnswerComponent = require './answers/LikertAnswerComponent'
LocationAnswerComponent = require './answers/LocationAnswerComponent'
MatrixAnswerComponent = require './answers/MatrixAnswerComponent'
MulticheckAnswerComponent = require './answers/MulticheckAnswerComponent'
NumberAnswerComponent = require './answers/NumberAnswerComponent'
RadioAnswerComponent = require './answers/RadioAnswerComponent'
SiteAnswerComponent = require './answers/SiteAnswerComponent'
StopwatchAnswerComponent = require './answers/StopwatchAnswerComponent'
TextAnswerComponent = require './answers/TextAnswerComponent'
TextListAnswerComponent = require './answers/TextListAnswerComponent'
UnitsAnswerComponent = require './answers/UnitsAnswerComponent'


# Question component that displays a question of any type.
# Displays question text and hint
# Displays toggleable help 
# Displays required (*)
# Displays comments field
# Does NOT fill in when sticky and visible for first time. This is done by data cleaning
# Does NOT remove answer when invisible. This is done by data cleaning
# Does NOT check conditions and make self invisible. This is done by parent (ItemListComponent)
# Displays alternates and makes exclusive with answer
module.exports = class QuestionComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string
    stickyStorage: PropTypes.object   # Storage for sticky values
    locationFinder: PropTypes.object
    T: PropTypes.func.isRequired  # Localizer to use
    disableConfidentialFields: PropTypes.bool

  @propTypes:
    question: PropTypes.object.isRequired # Design of question. See schema
    data: PropTypes.object      # Current data of response (for roster entry if in roster)
    responseRow: PropTypes.object    # ResponseRow object (for roster entry if in roster)
    onAnswerChange: PropTypes.func.isRequired
    displayMissingRequired: PropTypes.bool
    onNext: PropTypes.func
    schema: PropTypes.object.isRequired  # Schema to use, including form

  constructor: ->
    super

    @state = {
      helpVisible: false    # True to display help
      validationError: null
      # savedValue and savedSpecify are used to save the value when selecting an alternate answer
      savedValue: null
      savedSpecify: null
    }

  componentWillUnmount: ->
    @unmounted = true

    # Stop position finder
    if @currentPositionFinder
      @currentPositionFinder.stop()

  shouldComponentUpdate: (nextProps, nextState, nextContext) ->
    if @context.locale != nextContext.locale
      return true
    if nextProps.question.textExprs? and nextProps.question.textExprs.length > 0
      return true
    if nextProps.question.choices?
      for choice in nextProps.question.choices
        if choice.conditions? and choice.conditions.length > 0
          return true

    if nextProps.question != @props.question
      return true

    oldAnswer = @props.data[@props.question._id]
    newAnswer = nextProps.data[@props.question._id]
    if newAnswer != oldAnswer
      return true

    if not _.isEqual @state, nextState
      return true
    return false

  focus: ->
    answer = @refs.answer
    if answer? and answer.focus?
      answer.focus()

  getAnswer: ->
    # The answer to this question
    answer = @props.data[@props.question._id]
    if answer?
      return answer
    return {}

  # Returns true if validation error
  validate: (scrollToFirstInvalid) ->
    # If we are disabling confidential data return true
    if @context.disableConfidentialFields and @props.question.confidential
      return false

    # If answer has custom validation, use that
    if @refs.answer?.validate
      answerInvalid = @refs.answer?.validate()

      if answerInvalid and scrollToFirstInvalid
        @refs.prompt.scrollIntoView()

      if answerInvalid
        return answerInvalid

    validationError = new AnswerValidator().validate(@props.question, @getAnswer())

    # Check for isValid function in answer component, as some answer components don't store invalid answers
    # like the number answer.
    if not validationError and @refs.answer?.isValid and not @refs.answer?.isValid()
      validationError = true

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
    @handleAnswerChange(_.extend({}, @getAnswer(), { value: value }, alternate: null))

  # Record a position found
  handleCurrentPositionFound: (loc) =>
    if not @unmounted
      newAnswer = _.clone @getAnswer()
      newAnswer.location = _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy")
      @props.onAnswerChange(newAnswer)

  handleCurrentPositionStatus: (status) =>
    # Always record useable positions
    if status.useable
      @handleCurrentPositionFound(status.pos)

  handleAnswerChange: (newAnswer) =>
    readonly = @context.disableConfidentialFields and @props.question.confidential 
    if readonly
      return

    oldAnswer = @getAnswer()
    if @props.question.sticky and @context.stickyStorage? and newAnswer.value?
      # TODO: SurveyorPro: What should happen if value is set to null?
      # TODO: SurveyorPro: What should happen if alternate is set? (or anything else that didn't change the value field)
      @context.stickyStorage.set(@props.question._id, newAnswer.value)

    if @props.question.recordTimestamp and not oldAnswer.timestamp?
      newAnswer.timestamp = new Date().toISOString()

    # Record location if no answer and not already getting location
    if @props.question.recordLocation and not oldAnswer.location? and not @currentPositionFinder
      # Create location finder
      locationFinder = @context.locationFinder or new LocationFinder()

      # Create position finder
      @currentPositionFinder = new CurrentPositionFinder(locationFinder: locationFinder)

      # Listen to current position events (for setting location)
      @currentPositionFinder.on 'found', @handleCurrentPositionFound
      @currentPositionFinder.on 'status', @handleCurrentPositionStatus
      @currentPositionFinder.start()

    @props.onAnswerChange(newAnswer)

  handleAlternate: (alternate) =>
    answer = @getAnswer()
    # If we are selecting a new alternate
    if answer.alternate != alternate
      # If old alternate was null (important not to do this when changing from an alternate value to another)
      if not answer.alternate?
        # It saves value and specify
        @setState({ savedValue: answer.value, savedSpecify: answer.specify })
      # Then clear value, specify and set alternate
      @handleAnswerChange(_.extend({}, answer, {
        value: null
        specify: null
        alternate: alternate
      }))
    else
      # Clear alternate and put back saved value and specify
      @handleAnswerChange(_.extend({}, answer, {
        value: @state.savedValue
        specify: @state.savedSpecify
        alternate: null
      }))
      @setState({savedValue: null, savedSpecify: null})

  handleCommentsChange: (ev) =>
    @handleAnswerChange(_.extend({}, @getAnswer(), { comments: ev.target.value }))

  # Either jump to next question or select the comments box
  handleNextOrComments: (ev) =>
    # If it has a comment box, set the focus on it
    if @props.question.commentsField?
      comments = @refs.comments
      # For some reason, comments can be null here sometimes
      comments?.focus()
      comments?.select()
    # Else we lose the focus and go to the next question
    else
      # Blur the input (remove the focus)
      ev.target.blur()
      @props.onNext?()

  renderPrompt: ->
    promptDiv = H.div className: "prompt", ref: 'prompt',
      if @props.question.code
        H.span className: "question-code", @props.question.code + ": "

      R TextExprsComponent,
        localizedStr: @props.question.text
        exprs: @props.question.textExprs
        schema: @props.schema
        responseRow: @props.responseRow
        locale: @context.locale

      # Required star
      if @props.question.required and not (@context.disableConfidentialFields and @props.question.confidential)
        H.span className: "required", "*"

      if @props.question.help
        H.button type: "button", id: 'helpbtn', className: "btn btn-link btn-sm", onClick: @handleToggleHelp,
          H.span className: "glyphicon glyphicon-question-sign"

    # Special case!
    if @props.question._type == 'CheckQuestion'
      R CheckAnswerComponent, {
        ref: "answer"
        value: @getAnswer().value
        onValueChange: @handleValueChange
        label: @props.question.label
      }, promptDiv
    else
      return promptDiv

  renderHint: ->
    H.div null,
      if @props.question.hint
        H.div className: "text-muted", formUtils.localizeString(@props.question.hint, @context.locale)
      if @context.disableConfidentialFields and @props.question.confidential
        H.div className: "text-muted", @context.T("Confidential answers may not be edited.")

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
          H.div id: 'dn', className: "touch-checkbox alternate #{if @getAnswer().alternate == 'dontknow' then 'checked'}", onClick: @handleAlternate.bind(null, 'dontknow'),
            @context.T("Don't Know")
        if @props.question.alternates.na
          H.div id: 'na', className: "touch-checkbox alternate #{if @getAnswer().alternate == 'na' then 'checked'}", onClick: @handleAlternate.bind(null, 'na'),
            @context.T("Not Applicable")

  renderCommentsField: ->
    if @props.question.commentsField
      H.textarea className: "form-control question-comments", id: "comments", ref: "comments", placeholder: @context.T("Comments"), value: @getAnswer().comments, onChange: @handleCommentsChange

  renderAnswer: ->
    answer = @getAnswer()
    readonly = @context.disableConfidentialFields and @props.question.confidential 

    switch @props.question._type
      when "TextQuestion"
        return R TextAnswerComponent, {
          ref: "answer"
          value: answer.value
          format: @props.question.format
          readOnly: readonly
          onValueChange: @handleValueChange
          onNextOrComments: @handleNextOrComments
        }

      when "NumberQuestion"
        return R NumberAnswerComponent, {
          ref: "answer"
          value: answer.value
          onChange: if not readonly then @handleValueChange
          decimal: @props.question.decimal
          onNextOrComments: @handleNextOrComments
        }

      when "DropdownQuestion"
        return R DropdownAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          answer: answer
          data: @props.data
          onAnswerChange: @handleAnswerChange
        }

      when "LikertQuestion"
        return R LikertAnswerComponent, {
          ref: "answer"
          items: @props.question.items
          choices: @props.question.choices
          answer: answer
          data: @props.data
          onAnswerChange: @handleAnswerChange
        }

      when "RadioQuestion"
        return R RadioAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          answer: answer
          data: @props.data
          onAnswerChange: @handleAnswerChange
        }

      when "MulticheckQuestion"
        return R MulticheckAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          data: @props.data
          answer: answer
          onAnswerChange: @handleAnswerChange
        }

      when "DateQuestion"
        return R DateAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
          format: @props.question.format
          placeholder: @props.question.placeholder
          onNextOrComments: @handleNextOrComments
        }

      when "UnitsQuestion"
        return R UnitsAnswerComponent, {
          ref: "answer"
          answer: answer
          onValueChange: @handleValueChange
          units: @props.question.units
          defaultUnits: @props.question.defaultUnits
          prefix: @props.question.unitsPosition == 'prefix'
          decimal: @props.question.decimal
          onNextOrComments: @handleNextOrComments
        }

      when "CheckQuestion"
        # Look at renderPrompt special case
        return null

      when "LocationQuestion"
        return R LocationAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
        }

      when "ImageQuestion"
        return R ImageAnswerComponent,
          ref: "answer"
          image: answer.value
          onImageChange: @handleValueChange
          consentPrompt: if @props.question.consentPrompt then formUtils.localizeString(@props.question.consentPrompt, @context.locale)

      when "ImagesQuestion"
        return R ImagesAnswerComponent, {
          ref: "answer"
          imagelist: answer.value
          onImagelistChange: @handleValueChange
          consentPrompt: if @props.question.consentPrompt then formUtils.localizeString(@props.question.consentPrompt, @context.locale)
        }

      when "TextListQuestion"
        return R TextListAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
          onNextOrComments: @handleNextOrComments
        }

      when "SiteQuestion"
        return R SiteAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
          siteTypes: @props.question.siteTypes
          T: @context.T
        }

      when "BarcodeQuestion"
        return R BarcodeAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
        }

      when "EntityQuestion"
        return R EntityAnswerComponent, {
          ref: "answer"
          value: answer.value
          entityType: @props.question.entityType
          onValueChange: @handleValueChange
        }

      when "AdminRegionQuestion"
        return R AdminRegionAnswerComponent, {
          ref: "answer"
          value: answer.value
          onChange: @handleValueChange
        }

      when "StopwatchQuestion"
        return R StopwatchAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
          T: @context.T
        }

      when "MatrixQuestion"
        return R MatrixAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
          alternate: answer.alternate
          items: @props.question.items
          columns: @props.question.columns
          data: @props.data
          responseRow: @props.responseRow
          schema: @props.schema
        }

      when "AquagenxCBTQuestion"
        return R AquagenxCBTAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
          questionId: @props.question._id
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
