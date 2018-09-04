_ = require 'lodash'
PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'
conditionUtils = require '../conditionUtils'

module.exports = class DropdownAnswerComponent extends React.Component
  @contextTypes:
    locale: PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    choices: PropTypes.arrayOf(PropTypes.shape({
      # Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: PropTypes.string.isRequired

      # Label of the choice, localized
      label: PropTypes.object.isRequired

      # Hint associated with a choice
      hint: PropTypes.object

      # True to require a text field to specify the value when selected
      # Usually used for "Other" options.
      # Value is stored in specify[id]
      specify: PropTypes.bool

      choice: PropTypes.array
    })).isRequired
    onAnswerChange: PropTypes.func.isRequired
    answer: PropTypes.object.isRequired # See answer format
    data: PropTypes.object.isRequired

  focus: () ->
    @select?.focus()

  handleValueChange: (ev) =>
    if ev.target.value? and ev.target.value != ''
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
    if choice and choice.specify and @props.answer.specify?
      value = @props.answer.specify[choice.id]
    else
      value = ''
    if choice and choice.specify
      H.input className: "form-control specify-input", type: "text", value: value, onChange: @handleSpecifyChange.bind(null, choice.id)

  areConditionsValid: (choice) ->
    if not choice.conditions?
      return true
    return conditionUtils.compileConditions(choice.conditions)(@props.data)

  render: ->
    H.div null,
      H.select className: "form-control", style: { width: "auto" }, value: @props.answer.value, onChange: @handleValueChange, ref: ((c) => @select = c),
        H.option key: "__none__", value: ""
        _.map @props.choices, (choice) =>
          if @areConditionsValid(choice)
            text = formUtils.localizeString(choice.label, @context.locale)
            if choice.hint
              text += " (" + formUtils.localizeString(choice.hint, @context.locale) + ")"
            return H.option key: choice.id, value: choice.id, text

      @renderSpecify()