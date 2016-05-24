React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

module.exports = class LikertAnswerComponent extends React.Component
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
    })).isRequired
    choices: React.PropTypes.arrayOf(React.PropTypes.shape({
      # Unique (within the question) id of the choice. Cannot be "na" or "dontknow" as they are reserved for alternates
      id: React.PropTypes.string.isRequired

      # Label of the choice, localized
      label: React.PropTypes.object.isRequired

      # Hint associated with a choice
      hint: React.PropTypes.object
    })).isRequired
    onAnswerChange: React.PropTypes.func.isRequired
    answer: React.PropTypes.object.isRequired # See answer format
    data: React.PropTypes.object.isRequired

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
    @props.onAnswerChange({value: newValue})

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

  renderChoiceLabel: (choice) ->
    H.td key: "label#{choice.id}",
      formUtils.localizeString(choice.label, @context.locale)

  renderItem: (item) ->
    return H.tr null,
      H.td(null,
        formUtils.localizeString(item.label, @context.locale)
        if item.hint
          H.div null,
            H.span className: "",
              formUtils.localizeString(item.hint, @context.locale)
      ),
      _.map @props.choices, (choice) => @renderChoice(item, choice)

  render: ->
    H.table className: "",
      #H.thead null,
      #  H.tr null,
      #    H.td(),
      #    _.map @props.choices, (choice) =>
      #      @renderChoiceLabel(choice)
      H.tbody null,
        _.map @props.items, (item) => @renderItem(item)