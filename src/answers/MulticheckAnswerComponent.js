_ = require 'lodash'
PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

formUtils = require '../formUtils'
conditionUtils = require '../conditionUtils'

# Multiple checkboxes where more than one can be checked
module.exports = class MulticheckAnswerComponent extends React.Component
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
    })).isRequired

    answer: PropTypes.object.isRequired # See answer format
    onAnswerChange: PropTypes.func.isRequired
    data: PropTypes.object.isRequired

  focus: () ->
    # Nothing to focus
    null

  handleValueChange: (choice) =>
    ids = @props.answer.value or []
    if choice.id in ids
      if @props.answer.specify?
        specify = _.clone @props.answer.specify
        if specify[choice.id]?
          delete specify[choice.id]
      else
        specify = null
      @props.onAnswerChange({value: _.difference(ids, [choice.id]), specify: specify})
    else
      @props.onAnswerChange({value: _.union(ids, [choice.id]), specify: @props.answer.specify})

  handleSpecifyChange: (id, ev) =>
    change = {}
    change[id] = ev.target.value
    specify = _.extend({}, @props.answer.specify, change)
    @props.onAnswerChange({value: @props.answer.value, specify: specify})

  areConditionsValid: (choice) ->
    if not choice.conditions?
      return true
    return conditionUtils.compileConditions(choice.conditions)(@props.data)

  # Render specify input box
  renderSpecify: (choice) ->
    if @props.answer.specify?
      value = @props.answer.specify[choice.id]
    else
      value = ''
    R 'input', className: "form-control specify-input", type: "text", value: value, onChange: @handleSpecifyChange.bind(null, choice.id)

  renderChoice: (choice) ->
    if not @areConditionsValid(choice)
      return null
      
    selected = _.isArray(@props.answer.value) and choice.id in @props.answer.value

    R 'div', key: choice.id,
      # id is used for testing
      R 'div', className: "choice touch-checkbox #{if selected then "checked" else ""}", id: choice.id, onClick: @handleValueChange.bind(null, choice),
        formUtils.localizeString(choice.label, @context.locale)
        if choice.hint
          R 'span', className: "checkbox-choice-hint",
            formUtils.localizeString(choice.hint, @context.locale)

      if choice.specify and selected
        @renderSpecify(choice)

  render: ->
    R 'div', null,
      _.map @props.choices, (choice) => @renderChoice(choice)