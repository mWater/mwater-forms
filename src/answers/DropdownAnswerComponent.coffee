React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# 100% Functional

module.exports = class DropdownAnswerComponent extends React.Component
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

  handleValueChange: (ev) =>
    if ev.target.value?
      @props.onAnswerChange({value: ev.target.value, specify: null })
    else
      @props.onAnswerChange({value: null, specify: null })

  handleSpecifyChange: (id, ev) =>
    change = {}
    change[id] = ev.target.value
    specify = _.extend({}, @props.answer.specify, change)
    @props.onAnswerChange({value: @props.answer.value, specify: specify })

  # Render specify input box
  renderSpecify: ->
    choice = _.findWhere(@props.choices, { id: @props.answer.value })
    if choice and choice.specify
      H.input className: "form-control specify-input", type: "text", value: @props.answer.specify[choice.id], onChange: @handleSpecifyChange.bind(null, choice.id)

  render: ->
    H.div null,
      H.select className: "form-control", style: { width: "auto" }, value: @props.answer.value, onChange: @handleValueChange,
        H.option key: "__none__", value: ""
        _.map @props.choices, (choice) =>
          text = formUtils.localizeString(choice.label, @context.locale)
          if choice.hint
            text += " (" + formUtils.localizeString(choice.hint, @context.locale) + ")"
          return H.option key: choice.id, value: choice.id, text

      @renderSpecify()