React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

AdminRegionSelectComponent = require './AdminRegionSelectComponent'
FormComponent = require './FormComponent'
sampleFormDesign = require './sampleFormDesign'

# Setup mock localizer
global.T = (str) -> str

formCtx = {
}

class DemoComponent extends React.Component
  constructor: ->
    super

    @state = {
      design: sampleFormDesign
      data: {}
    }

  render: ->
    R FormComponent, {
      formCtx: formCtx
      design: @state.design
      # locale: React.PropTypes.string            # Locale. Defaults to English (en)
      data: @state.data
      onDataChange: (data) => @setState(data: data)
      onSubmit: => alert("Submit")
      onSaveLater: => alert("SaveLater")
      onDiscard:  => alert("Discard")
      # submitLabel: React.PropTypes.string           # Label for submit button
      # discardLabel: React.PropTypes.string           # Label for discard button
      # entity: React.PropTypes.object            # Form-level entity to load
      # entityType: React.PropTypes.string        # Type of form-level entity to load      getAdminRegionPath: getAdminRegionPath
      #   getSubAdminRegions: getSubAdminRegions
      #   onChange: onChange
      #   value: value
      # })  
    }

$ ->
  ReactDOM.render(R(DemoComponent), document.getElementById("main"))
