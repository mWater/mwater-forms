_ = require 'lodash'
PropTypes = require('prop-types')
React = require 'react'
R = React.createElement

formUtils = require '../formUtils'

module.exports = class LikertAnswerComponent extends React.Component
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
    })).isRequired
    choices: PropTypes.arrayOf(PropTypes.shape({
      # Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: PropTypes.string.isRequired

      # Label of the choice, localized
      label: PropTypes.object.isRequired

      # Hint associated with a choice
      hint: PropTypes.object
    })).isRequired
    onAnswerChange: PropTypes.func.isRequired
    answer: PropTypes.object.isRequired # See answer format
    data: PropTypes.object.isRequired

  focus: () ->
    # Nothing to focus
    null

  handleValueChange: (choice, item) =>
    if @props.answer.value?
      newValue = _.clone(@props.answer.value)
    else
      newValue = {}
    if newValue[item.id] == choice.id
      delete newValue[item.id]
    else
      newValue[item.id] = choice.id

    @props.onAnswerChange(_.extend({}, @props.answer, { value: newValue }))

  renderChoice: (item, choice) ->
    id = "#{item.id}:#{choice.id}"
    if @props.answer.value?
      value = @props.answer.value[item.id]
    else
      value = null
    return R 'td', key: id,
      # id is used for testing
      R 'div', className: "touch-radio #{if value == choice.id then "checked" else ""}", id: id, onClick: @handleValueChange.bind(null, choice, item),
        formUtils.localizeString(choice.label, @context.locale)

  # IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
  #renderChoiceLabel: (choice) ->
  #  R 'td', key: "label#{choice.id}",
  #    formUtils.localizeString(choice.label, @context.locale)

  renderItem: (item) ->
    return R 'tr', null,
      R('td', null,
        R('b', null, formUtils.localizeString(item.label, @context.locale))
        if item.hint
          R 'div', null,
            R 'span', className: "", style: {color: '#888'},
              formUtils.localizeString(item.hint, @context.locale)
      ),
      _.map @props.choices, (choice) => @renderChoice(item, choice)

  render: ->
    R 'table', {className: "", style: {width: '100%'}},
      # IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
      #R 'thead', null,
      #  R 'tr', null,
      #    R('td'),
      #    _.map @props.choices, (choice) =>
      #      @renderChoiceLabel(choice)
      R 'tbody', null,
        _.map @props.items, (item) => @renderItem(item)