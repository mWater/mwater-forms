_ = require 'lodash'
React = require 'react'
H = React.DOM

formUtils = require './formUtils'
markdown = require("markdown").markdown

# Question component that displays a question of any type.
# Displays question text and hint
# Displays toggleable help 
# Displays required (*)
# Displays comments field
# Goes to next question when enter or tab is pressed on previous question
# Goes to comments field when enter or tab is pressed on 
# Does NOT fill in when sticky and visible for first time. This is done by data cleaning
# Does NOT remove answer when invisible. This is done by data cleaning
# Does not check conditions or make self invisible. This is done by parent component.
# Displays alternates and makes exclusive with answer
# Records timestamp when answered
# Records GPS when answered
# Displays validation errors and not answered errors when told to from above.
# Allows focusing on question which scrolls into view
module.exports = class QuestionComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    question: React.PropTypes.object.isRequired # Design of question. See schema
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

  handleAlternate: (alternate) =>
    # Clear value, specify and set alternate
    @props.onAnswerChange(_.extend({}, @props.answer, { 
      value: null
      specify: null
      alternate: alternate
    }))

  handleCommentsChange: (ev) =>
    @props.onAnswerChange(_.extend({}, @props.answer, { comments: ev.target.value }))

  renderPrompt: ->
    H.div className: "prompt",
      if @props.question.code
        H.span className: "question-code", options.code + ": "

      # Prompt
      formUtils.localizeString(@props.question.text, @context.locale)

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
          H.div className: "touch-radio alternate #{if @props.answer.alternate == 'dontknow' then 'checked'}", onClick: @handleAlternate.bind(null, 'dontknow'),
            T("Don't Know")
        if @props.question.alternates.na
          H.div className: "touch-radio alternate #{if @props.answer.alternate == 'na' then 'checked'}", onClick: @handleAlternate.bind(null, 'na'),
            T("Not Applicable")

  renderCommentsField: ->
    if @props.question.commentsField
      H.textarea className: "form-control question-comments", placeholder: T("Comments"), value: @props.answer.comments, onChange: @handleCommentsChange

  renderAnswer: ->
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

