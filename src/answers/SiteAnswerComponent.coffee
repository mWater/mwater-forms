React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

module.exports = class SiteAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")

  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired
    label: React.PropTypes.object.isRequired
    siteTypes: React.PropTypes.array

  @defaultProps:
    value: false

  handleValueChange: () =>
    @props.onValueChange(!@props.value)

  render: ->
    H.div null,
      H.div className:"input-group",
          H.input id: "input", type: "tel", className: "form-control",
            H.span className: "input-group-btn",
              H.button className: "btn btn-default", id: "select", type: "button",
                T("Select")
      H.br()
      H.div id: "site_display"

    # TODO: What should we do with that?
    #if not @ctx.selectEntity?
    #  @$("#select").attr("disabled", "disabled")
