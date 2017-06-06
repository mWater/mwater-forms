PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
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
    return H.td key: id,
      # id is used for testing
      H.div className: "touch-radio #{if value == choice.id then "checked" else ""}", id: id, onClick: @handleValueChange.bind(null, choice, item),
        formUtils.localizeString(choice.label, @context.locale)

  # IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
  #renderChoiceLabel: (choice) ->
  #  H.td key: "label#{choice.id}",
  #    formUtils.localizeString(choice.label, @context.locale)

  renderItem: (item) ->
    return H.tr null,
      H.td(null,
        H.b(null, formUtils.localizeString(item.label, @context.locale))
        if item.hint
          H.div null,
            H.span className: "", style: {color: '#888'},
              formUtils.localizeString(item.hint, @context.locale)
      ),
      _.map @props.choices, (choice) => @renderChoice(item, choice)

  render: ->
    H.table {className: "", style: {width: '100%'}},
      # IN CASE WE DECIDE TO DISPLAY THE CHOICES AT THE TOP (INSTEAD OF REPEATING THEM)
      #H.thead null,
      #  H.tr null,
      #    H.td(),
      #    _.map @props.choices, (choice) =>
      #      @renderChoiceLabel(choice)
      H.tbody null,
        _.map @props.items, (item) => @renderItem(item)