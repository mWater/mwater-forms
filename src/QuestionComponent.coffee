_ = require 'lodash'
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require './formUtils'
markdown = require("markdown").markdown
FormExprEvaluator = require './FormExprEvaluator'

LocationFinder = require './LocationFinder'

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

# TODO: SurveyorPro: make faster with shouldComponentUpdate
# Question component that displays a question of any type.
# Displays question text and hint
# Displays toggleable help 
# Displays required (*)
# Displays comments field
# Does NOT fill in when sticky and visible for first time. This is done by data cleaning
# Does NOT remove answer when invisible. This is done by data cleaning
# Does NOT check conditions and make self invisible. This is done by parent (ItemListComponent)
# Displays alternates and makes exclusive with answer
# TODO: SurveyorPro: Test that it records GPS when answered and recordLocation is true
module.exports = class QuestionComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string
    stickyStorage: React.PropTypes.object   # Storage for sticky values
    locationFinder: React.PropTypes.object

  @propTypes:
    question: React.PropTypes.object.isRequired # Design of question. See schema
    data: React.PropTypes.object      # Current data of response.
    onAnswerChange: React.PropTypes.func.isRequired
    displayMissingRequired: React.PropTypes.bool
    onNext: React.PropTypes.func
    formExprEvaluator: React.PropTypes.object.isRequired # FormExprEvaluator for rendering strings with expression

  constructor: ->
    super

    @state = {
      helpVisible: false    # True to display help
      validationError: null
      # savedValue and savedSpecify are used to save the value when selecting an alternate answer
      savedValue: null
      savedSpecify: null
    }

  shouldComponentUpdate: (nextProps, nextState, nextContext) ->
    if @context.locale != nextContext.locale
      return true
    if nextProps.question.textExprs? and nextProps.question.textExprs.length > 0
      return true
    if nextProps.question.choices?
      for choice in nextProps.question.choices
        if choice.conditions? and choice.conditions.length > 0
          return true

    if nextProps.formExprEvaluator? and nextProps.formExprEvaluator != @props.formExprEvaluator
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

  componentWillUnmount: () ->
    @unmounted = true

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
    validationError = new AnswerValidator().validate(@props.question, @getAnswer())

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

  handleAnswerChange: (newAnswer) =>
    oldAnswer = @getAnswer()
    if @props.question.sticky and @context.stickyStorage? and newAnswer.value?
      # TODO: SurveyorPro: What should happen if value is set to null?
      # TODO: SurveyorPro: What should happen if alternate is set? (or anything else that didn't change the value field)
      @context.stickyStorage.set(@props.question._id, newAnswer.value)

    if @props.question.recordTimestamp and not oldAnswer.timestamp?
      newAnswer.timestamp = new Date().toISOString()

    if @props.question.recordLocation and not oldAnswer.location?
      locationFinder = @context.locationFinder or new LocationFinder()
      locationFinder.getLocation (loc) =>
        # TODO: SurveyorPro: Should check if component is still mounted!
        if loc? and not @unmounted?
          newAnswer = _.clone @getAnswer()
          newAnswer.location = _.pick(loc.coords, "latitude", "longitude", "accuracy", "altitude", "altitudeAccuracy")
          @props.onAnswerChange(newAnswer)
      , ->
        console.log "Location not found for recordLocation in Question"
    @props.onAnswerChange(newAnswer)

  handleAlternate: (alternate) =>
    answer = @getAnswer()
    # If we are selecting a new alternate
    if answer.alternate != alternate
      # If old alternate was null (important not to do this when changing from an alternate value to another)
      if not answer.alternate?
        # It saves value and specify
        @setState({savedValue: _.clone answer.value, savedSpecify: _.clone answer.specify})
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
      comments.focus()
      comments.select()
    # Else we lose the focus and go to the next question
    else
      # Blur the input (remove the focus)
      ev.target.blur()
      @props.onNext?()

  renderPrompt: ->
    promptDiv = H.div className: "prompt", ref: 'prompt',
      if @props.question.code
        H.span className: "question-code", @props.question.code + ": "
      
      @props.formExprEvaluator.renderString(@props.question.text, @props.question.textExprs, @props.data, @context.locale)

      # Required star
      if @props.question.required
        H.span className: "required", "*"

      if @props.question.help
        H.button type: "button", id: 'helpbtn', className: "btn btn-link btn-sm", onClick: @handleToggleHelp,
          H.span className: "glyphicon glyphicon-question-sign"

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
          H.div id: 'dn', className: "touch-checkbox alternate #{if @getAnswer().alternate == 'dontknow' then 'checked'}", onClick: @handleAlternate.bind(null, 'dontknow'),
            T("Don't Know")
        if @props.question.alternates.na
          H.div id: 'na', className: "touch-checkbox alternate #{if @getAnswer().alternate == 'na' then 'checked'}", onClick: @handleAlternate.bind(null, 'na'),
            T("Not Applicable")

  renderCommentsField: ->
    if @props.question.commentsField
      H.textarea className: "form-control question-comments", id: "comments", ref: "comments", placeholder: T("Comments"), value: @getAnswer().comments, onChange: @handleCommentsChange

  renderAnswer: ->
    answer = @getAnswer()
    switch @props.question._type
      when "TextQuestion"
        return R TextAnswerComponent, {
          ref: "answer"
          value: answer.value
          format: @props.question.format
          onValueChange: @handleValueChange
          onNextOrComments: @handleNextOrComments
        }

      when "NumberQuestion"
        return R NumberAnswerComponent, {
          ref: "answer"
          value: answer.value
          onChange: @handleValueChange
          decimal: @props.question.decimal
          onNextOrComments: @handleNextOrComments
        }

      when "DropdownQuestion"
        return R DropdownAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          answer: answer
          onAnswerChange: @handleAnswerChange
        }

      when "RadioQuestion"
        return R RadioAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
          answer: answer
          onAnswerChange: @handleAnswerChange
        }

      when "MulticheckQuestion"
        return R MulticheckAnswerComponent, {
          ref: "answer"
          choices: @props.question.choices
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
        return null

      when "LocationQuestion"
        return R LocationAnswerComponent, {
          ref: "answer"
          value: answer.value
          onValueChange: @handleValueChange
        }

      when "ImageQuestion"
        return R ImageAnswerComponent,
          image: answer.value
          onImageChange: @handleValueChange 

      when "ImagesQuestion"
        return R ImagesAnswerComponent, {
          ref: "answer"
          imagelist: answer.value
          onImagelistChange: @handleValueChange
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
          onNextOrComments: @handleNextOrComments
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
