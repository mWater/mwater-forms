React = require 'react'
H = React.DOM
R = React.createElement

formUtils = require '../formUtils'

# Functional? I haven't tried this one yet
# Not tested

module.exports = class BarcodeAnswerComponent extends React.Component
  @contextTypes:
    locale: React.PropTypes.string  # Current locale (e.g. "en")
    scanBarcode: React.PropTypes.func

  @propTypes:
    value: React.PropTypes.bool
    onValueChange: React.PropTypes.func.isRequired

  handleValueChange: () =>
    @props.onValueChange(!@props.value)

  handleScanClick: ->
    @context.scanBarcode({ success: (text) =>
      @props.onValueChange(text)
    })

  handleClearClick: ->
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
            T("Clear")
    else
      if supported
        H.div(null,
          H.button({className: "btn btn-default", onClick: @handleScanClick, type: "button"},
            H.span({className: "glyphicon glyphicon-qrcode"})
            T("Scan")
          )
        )
      else
    	  return H.div className: "text-warning",
          T("Barcode scanning not supported on this platform")
