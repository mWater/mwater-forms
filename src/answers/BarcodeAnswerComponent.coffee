PropTypes = require('prop-types')
React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# Functional? I haven't tried this one yet
# Not tested

module.exports = class BarcodeAnswerComponent extends React.Component
  @contextTypes:
    scanBarcode: PropTypes.func
    T: PropTypes.func.isRequired  # Localizer to use

  @propTypes:
    value: PropTypes.string
    onValueChange: PropTypes.func.isRequired

  focus: () ->
    # Nothing to focus
    null

  handleValueChange: () =>
    @props.onValueChange(!@props.value)

  handleScanClick: =>
    @context.scanBarcode({ success: (text) =>
      @props.onValueChange(text)
    })

  handleClearClick: =>
    @props.onValueChange(null)

  render: ->
    supported = @context.scanBarcode?

    if @props.value
      return H.div null,
        H.pre null,
          H.p null,
            @props.value
        H.div null,
          H.button {className: "btn btn-default", onClick: @handleClearClick, type: "button"},
            H.span {className: "glyphicon glyphicon-remove"},
            @context.T("Clear")
    else
      if supported
        H.div(null,
          H.button({className: "btn btn-default", onClick: @handleScanClick, type: "button"},
            H.span({className: "glyphicon glyphicon-qrcode"})
            @context.T("Scan")
          )
        )
      else
        return H.div className: "text-warning",
          @context.T("Barcode scanning not supported on this platform")
