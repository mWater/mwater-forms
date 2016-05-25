React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

FormComponent = require './FormComponent'
sampleFormDesign = require './sampleFormDesign'
sampleForm2 = require './sampleForm2'
#bigsampleForm2 = require './bigsampleForm2'
ItemListComponent = require './ItemListComponent'
ResponseDisplayComponent = require './ResponseDisplayComponent'
ResponseAnswersComponent = require './ResponseAnswersComponent'

# Setup mock localizer
global.T = (str) -> str

canada = { id: "canada", level: 0, name: "Canada", type: "Country" }
manitoba = { id: "manitoba", level: 1, name: "Manitoba", type: "Province" }
ontario = { id: "ontario", level: 1, name: "Ontario", type: "Province" }

testStickyStorage = {
  'd0dcfce3a697453ba16cc8baa8e384e7': "Testing sticky value"
}

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

  stickyStorage: {
    get: (questionId) ->
      return testStickyStorage[questionId]
    set: (questionId, value) ->
      return testStickyStorage[questionId] = value
  }

  selectEntity: (options) =>
    options.callback("1234")

  getEntityById: (entityType, entityId, callback) =>
    if entityId == "1234"
      callback({ _id: "1234", code: "10007", name: "Test" })
    else
      callback(null)

  getEntityByCode: (entityType, entityCode, callback) =>
    if entityCode == "10007"
      callback({ _id: "1234", code: "10007", name: "Test" })
    else
      callback(null)
}


class DemoComponent extends React.Component
  constructor: ->
    super

    data = {}

    @state = {data: data}

  handleDataChange: (data) =>
    @setState(data: data)

  render: ->
    # R ItemListComponent, 
    #   contents: sampleFormDesign.contents[0].contents
    #   data: @state.data
    #   onDataChange: (data) => @setState(data: data)

    H.div className: "row",
      H.div(className: "col-md-6",
        R FormComponent, {
          formCtx: formCtx
          design: sampleForm2.design
          # design: bigsampleForm2.design
          # design: rosterFormDesign
          # locale: React.PropTypes.string            # Locale. Defaults to English (en)
          data: @state.data
          onDataChange: @handleDataChange
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
      )
      H.div(className: "col-md-6",
        R ResponseDisplayComponent, {
          form: sampleForm2
          response: {
            data: @state.data
          }
          formCtx: formCtx
          T: T
        }
      )


$ ->
  ReactDOM.render(R(DemoComponent), document.getElementById("main"))

rosterFormDesign = {
  "_type": "Form",
  _id: "form123"
  "_schema": 11,
  "name": {
    "_base": "en",
    "en": "Sample Form"
  },
  "contents": [
    {
      _id: "matrix01"
      _type: "RosterMatrix"
      "name": {
        "_base": "en",
        "en": "Roster Matrix"
      },
      allowAdd: true,
      allowRemove: true,
      contents: [
        { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true }
        { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" } }
        { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } }
        { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
      ]
    },
    {
      _id: "matrix02"
      _type: "RosterMatrix"
      "name": {
        "_base": "en",
        "en": "Roster Matrix 2"
      },
      rosterId: "matrix01",
      contents: [
        { _id: "a2", _type: "TextColumn", text: { en: "Text Column" }, cellText: { en: "Cell Text {0}" }, "cellTextExprs": [
          { "type": "field", "table": "responses:form123:roster:matrix01", "column": "data:a:value" }
        ],}
        {
          id: "b2",
          _type: "UnitsColumnQuestion",
          text: { en: "Units" },
          "decimal": true,
          "defaultUnits": "wtdAQZ3",
          units: [
            {
              "id": "gVQSSfG",
              "label": {
                "en": "cm",
                "_base": "en"
              }
            }
            {
              "id": "wtdAQZ3",
              "label": {
                "en": "inch",
                "_base": "en"
              }
            }
          ]
        }
      ]
    }
  ]
}
