React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# 100% Functional

module.exports = class RadioAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    choices: React.PropTypes.arrayOf(React.PropTypes.shape({
      # Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: React.PropTypes.string.isRequired

      # Label of the choice, localized
      label: React.PropTypes.object.isRequired

      # Hint associated with a choice
      hint: React.PropTypes.object

      # True to require a text field to specify the value when selected
      # Usually used for "Other" options.
      # Value is stored in specify[id]
      specify: React.PropTypes.bool
    })).isRequired
    onAnswerChange: React.PropTypes.func.isRequired
    answer: React.PropTypes.object.isRequired # See answer format

  focus: () ->
    # Nothing to focus
    null

  handleValueChange: (choice) =>
    if choice.id == @props.answer.value
      @props.onAnswerChange({value: null, specify: null })
    else
      @props.onAnswerChange({value: choice.id, specify: null })

  handleSpecifyChange: (id, ev) =>
    change = {}
    change[id] = ev.target.value
    specify = _.extend({}, @props.answer.specify, change)
    @props.onAnswerChange({value: @props.answer.choice, specify: specify })

  # Render specify input box
  renderSpecify: (choice) ->
    H.input className: "form-control specify-input", type: "text", value: @props.answer.specify[choice.id], onChange: @handleSpecifyChange.bind(null, choice.id)

  renderChoice: (choice) ->
    H.div key: choice.id,
      # id is used for testing
      H.div className: "touch-radio #{if @props.answer.value == choice.id then "checked" else ""}", id: choice.id, onClick: @handleValueChange.bind(null, choice),
        formUtils.localizeString(choice.label, @context.locale)
        if choice.hint
          H.span className: "radio-choice-hint",
            formUtils.localizeString(choice.hint, @context.locale)

      if choice.specify and @props.answer.value == choice.id
        @renderSpecify(choice)

  render: ->
    H.div className: "touch-radio-group",
      _.map @props.choices, (choice) => @renderChoice(choice)