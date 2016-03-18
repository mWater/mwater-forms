React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

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
    value: React.PropTypes.string
    onValueChange: React.PropTypes.func.isRequired
    specify: React.PropTypes.object # See answer format
    onSpecifyChange: React.PropTypes.func.isRequired

  @defaultProps:
    specify: {}

  handleValueChange: (choice) =>
    if choice.id == @props.value
      @props.onValueChange(null)
    else
      @props.onValueChange(choice.id)

  handleSpecifyChange: (id, ev) =>
    change = {}
    change[id] = ev.target.value
    specify = _.extend({}, @props.specify, change)
    @props.onSpecifyChange(specify)

# Render specify input box
  renderSpecify: (choice) ->
    H.input className: "form-control specify-input", type: "text", value: @props.specify[choice.id], onChange: @handleSpecifyChange.bind(null, choice.id)

  renderChoice: (choice) ->
    H.div key: choice.id,
      H.div className: "touch-radio #{if @props.value == choice.id then "checked" else ""}", onClick: @handleValueChange.bind(null, choice),
        formUtils.localizeString(choice.label, @context.locale)
        if choice.hint
          H.span className: "radio-choice-hint",
            formUtils.localizeString(choice.hint, @context.locale)

      if choice.specify and @props.value == choice.id
        @renderSpecify(choice)

  render: ->
    H.div className: "touch-radio-group",
      _.map @props.choices, (choice) => @renderChoice(choice)