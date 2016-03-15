React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

AdminRegionSelectComponent = require './AdminRegionSelectComponent'
FormComponent = require './FormComponent'
sampleFormDesign = require './sampleFormDesign'
QuestionListComponent = require './QuestionListComponent'

# Setup mock localizer
global.T = (str) -> str

canada = { id: "canada", level: 0, name: "Canada", type: "Country" }
manitoba = { id: "manitoba", level: 1, name: "Manitoba", type: "Province" }
ontario = { id: "ontario", level: 1, name: "Ontario", type: "Province" }

formCtx = {
  locale: "en" 
  getAdminRegionPath: (id, callback) ->
    if id == 'manitoba'
      callback(null, [canada, manitoba])
    else if id == 'ontario'
      callback(null, [canada, ontario])
    else if id == "canada"
      callback(null, [canada])
    else
      callback(null, [])

  getSubAdminRegions: (id, level, callback) ->
    if not id?
      callback(null, [canada])
    else if id == "canada"
      callback(null, [manitoba, ontario])
    else
      callback(null, [])

  renderEntitySummaryView: (entityType, entity) ->
    JSON.stringify(entity)

  findAdminRegionByLatLng: (lat, lng, callback) -> callback("Not implemented")

  imageManager: {
    getImageUrl: (id, success, error) -> error("Not implemented")
    getThumbnailImageUrl: (id, success, error) -> error("Not implemented")
  }
}


class DemoComponent extends React.Component
  constructor: ->
    super

    @state = {
      data: {}
    }

  @childContextTypes: 
    locale: React.PropTypes.string
    selectEntity: React.PropTypes.func
    editEntity: React.PropTypes.func
    renderEntitySummaryView: React.PropTypes.func.isRequired

    getEntityById: React.PropTypes.func
    getEntityByCode: React.PropTypes.func

    locationFinder: React.PropTypes.object
    displayMap: React.PropTypes.func # Takes location ({ latitude, etc.}) and callback (called back with new location)
    storage: React.PropTypes.object   # Storage object for saving location
    
    getAdminRegionPath: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    findAdminRegionByLatLng: React.PropTypes.func.isRequired # Call with (lat, lng, callback). Callback (error, id)

    imageManager: React.PropTypes.object.isRequired
    imageAcquirer: React.PropTypes.object
  
  getChildContext: ->  
    formCtx
    

  render: ->
    # R QuestionListComponent, 
    #   contents: sampleFormDesign.contents[0].contents
    #   responseData: @state.data
    #   onResponseDataChange: (data) => @setState(data: data)

    R FormComponent, {
      formCtx: formCtx
      design: sampleFormDesign
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
