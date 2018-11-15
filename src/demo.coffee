PropTypes = require('prop-types')
React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement

FormComponent = require './FormComponent'
sampleFormDesign = require './sampleFormDesign'
sampleForm2 = require './sampleForm2'
sampleFormAdvancedValidations = require './sampleFormAdvancedValidations'
#bigsampleForm2 = require './bigsampleForm2'
ItemListComponent = require './ItemListComponent'
ResponseDisplayComponent = require './ResponseDisplayComponent'
Schema = require('mwater-expressions').Schema
FormSchemaBuilder = require './FormSchemaBuilder'
ImageUploaderModalComponent = require './ImageUploaderModalComponent'
HTML5Backend = require('react-dnd-html5-backend').default
DragDropContext = require("react-dnd").DragDropContext

# Setup mock localizer
global.T = (str) ->
  if arguments.length > 1
    for subValue, index in Array.from(arguments).slice(1)
      tag = "{#{index}}"
      str = str.replace(tag, subValue)
  return str

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

  renderEntityListItemView: (entityType, entity) ->
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
  constructor: (props) ->
    super(props)

    data = { site01: { value: { code: "10007"}}}

    @state = {data: data}

  handleDataChange: (data) =>
    console.log data
    @setState(data: data)

  render: ->
    # R ItemListComponent, 
    #   contents: sampleFormDesign.contents[0].contents
    #   data: @state.data
    #   onDataChange: (data) => @setState(data: data)

    schema = new Schema()
    # design = rosterFormDesign
    # design = matrixFormDesign
    # design = rosterFormDesign
    design = sampleForm2.design
    # design = sampleFormAdvancedValidations.design
    # design = randomAskFormDesign
    schema = new FormSchemaBuilder({user: "bob"}).addForm(schema, { _id: "form1", design: design })

    R 'div', className: "row",
      R('div', className: "col-md-6",
        R FormComponent, {
          formCtx: formCtx
          # locale: PropTypes.string            # Locale. Defaults to English (en)
          design: design
          data: @state.data
          schema: schema
          onDataChange: @handleDataChange
          onSubmit: => alert("Submit")
          onSaveLater: => alert("SaveLater")
          onDiscard:  => alert("Discard")
          # submitLabel: PropTypes.string           # Label for submit button
          # discardLabel: PropTypes.string           # Label for discard button
          # entity: PropTypes.object            # Form-level entity to load
          # entityType: PropTypes.string        # Type of form-level entity to load      getAdminRegionPath: getAdminRegionPath
          #   getSubAdminRegions: getSubAdminRegions
          #   onChange: onChange
          #   value: value
          # })
        }
      )
      R('div', className: "col-md-6",
        R ResponseDisplayComponent, {
          form: {design: design}
          response: {
            data: @state.data
          }
          formCtx: formCtx
          T: T
        }
      )

DemoComponent = DragDropContext(HTML5Backend)(DemoComponent)

# class ImageUploaderTestComponent extends React.Component
#   render: ->
#     R ImageUploaderModalComponent, 
#       T: window.T
#       apiUrl: "http://localhost:1234/v3/"
#       onSuccess: (id) => console.log(id)
#       onCancel: => console.log "Cancel"


$ ->
  ReactDOM.render(R(DemoComponent), document.getElementById("main"))
  # ImageUploaderModalComponent.show("http://localhost:1234/v3/", null, window.T, (id) -> alert(id))
  # ReactDOM.render(R(ImageUploaderTestComponent), document.getElementById("main"))

rosterFormDesign = {
  "_type": "Form",
  _id: "form123"
  "_schema": 11,
  "name": {
    "_base": "en",
    "en": "Sample Form"
  },
  localizedStrings: [],
  "contents": [
    {
      _id: "site01"
      _type: "SiteQuestion"
      "text": {
        "_base": "en",
        "en": "Site?"
      },
      siteTypes: ['Water point']
    },    
    {
      _id: "text01"
      _type: "TextQuestion"
      "text": {
        "_base": "en",
        "en": "Text {0}"
      },
      textExprs: [
        { type: "scalar", table: "responses:form123", joins: ["data:site01:value"], expr: { type: "field", table: "entities.water_point", column: "code" }}
      ]
      siteTypes: ['Water point'],
      conditionExpr: {
        type: "op"
        table: "responses:form123"
        op: "is not null"
        exprs: [{ type: "scalar", table: "responses:form123", joins: ["data:site01:value"], expr: { type: "field", table: "entities.water_point", column: "code" }}]
      }
    },    
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
        { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false }
        { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } }
        { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
        { _id: "e", _type: "DateColumnQuestion", text: { en: "Date" }, format: "YYYY-MM-DD", required: false }
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
          _id: "b2",
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

matrixFormDesign = {
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
      _type: "MatrixQuestion"
      "name": {
        "_base": "en",
        "en": "Matrix"
      },
      items: [
        { "id": "item1", "label": { "en": "First", "_base": "en" } }
        { "id": "item2", "label": { "en": "Second", "_base": "en" } }
        { "id": "item3", "label": { "en": "Third", "_base": "en" }, hint: { en: "Some hint"} }
      ]
      columns: [
        { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true, validations: [{
          "op": "lengthRange",
          "rhs": {
            "literal": {
              "max": 10
            }
          },
          "message": {
            "en": "String is too long",
            "_base": "en"
          }
        }] }
        { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false }
        { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } }
        { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
        { _id: "e", _type: "UnitsColumnQuestion", text: { en: "Unit" }, decimal: true, units: [{ label: { en: "CM"}, id: "cm" }, { label: { en: "INCH"}, id: "inch" }] }
      ]
      alternates: { na: 1 }
    }
  ]
}


randomAskFormDesign = {
  "name": {
    "en": "Visualization Test",
    "_base": "en"
  },
  "_type": "Form",
  "locales": [
    {
      "code": "en",
      "name": "English"
    }
  ],
  "contents": [
    {
      "_id": "textid",
      "text": {
        "en": "Random Question",
        "_base": "en"
      },
      "_type": "TextQuestion",
      "randomAskProbability": 0.2
    }
  ]
}
