React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

module.exports = class DateAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired

  handleValueChange: () =>
    null

  render: ->
    H.div null
