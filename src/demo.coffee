React = require 'react'
ReactDOM = require 'react-dom'
R = React.createElement
H = React.DOM

AdminRegionSelectComponent = require './AdminRegionSelectComponent'
FormComponent = require './FormComponent'
sampleFormDesign = require './sampleFormDesign'
sampleForm2 = require './sampleForm2'
ItemListComponent = require './ItemListComponent'

CleaningEntity = require './CleaningEntity'
StickyEntity = require './StickyEntity'
VisibilityEntity = require './VisibilityEntity'

# Setup mock localizer
global.T = (str) -> str

canada = { id: "canada", level: 0, name: "Canada", type: "Country" }
manitoba = { id: "manitoba", level: 1, name: "Manitoba", type: "Province" }
ontario = { id: "ontario", level: 1, name: "Ontario", type: "Province" }

testStickyStorage = {}

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
}


class DemoComponent extends React.Component
  constructor: ->
    super

    data = {}
    visibilityStructure = @computeVisibility(data)

    @state = {data: data, visibilityStructure: visibilityStructure}

  @childContextTypes: 
    locale: React.PropTypes.string
    selectEntity: React.PropTypes.func
    editEntity: React.PropTypes.func
    renderEntitySummaryView: React.PropTypes.func.isRequired

    getEntityById: React.PropTypes.func
    getEntityByCode: React.PropTypes.func

    locationFinder: React.PropTypes.object
    displayMap: React.PropTypes.func # Takes location ({ latitude, etc.}) and callback (called back with new location)
    stickyStorage: React.PropTypes.object   # Storage for sticky values
    
    getAdminRegionPath: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] in level ascending order)
    getSubAdminRegions: React.PropTypes.func.isRequired # Call with (id, callback). Callback (error, [{ id:, level: <e.g. 1>, name: <e.g. Manitoba>, type: <e.g. Province>}] of admin regions directly under the specified id)
    findAdminRegionByLatLng: React.PropTypes.func.isRequired # Call with (lat, lng, callback). Callback (error, id)

    imageManager: React.PropTypes.object.isRequired
    imageAcquirer: React.PropTypes.object
  
  getChildContext: -> formCtx

  isVisible: (itemId) =>
    return @state.visibilityStructure[itemId]

  handleDataChange: (data) =>
    oldVisibilityStructure = @state.visibilityStructure
    newVisibilityStructure = @computeVisibility(data)
    newData = @cleanData(data, newVisibilityStructure)
    console.log newData
    newData = @stickyData(newData, oldVisibilityStructure, newVisibilityStructure)
    console.log newData
    @setState(data: newData, visibilityStructure: newVisibilityStructure)

  computeVisibility: (data) ->
    visibilityEntity = new VisibilityEntity(sampleForm2)
    return visibilityEntity.createVisibilityStructure(data)

  cleanData: (data, visibilityStructure) ->
    cleaningEntity = new CleaningEntity()
    return cleaningEntity.cleanData(data, visibilityStructure)

  stickyData: (data, previousVisibilityStructure, newVisibilityStructure) ->
    stickyEntity = new StickyEntity()
    return stickyEntity.setStickyData(sampleForm2, data, formCtx.stickyStorage, previousVisibilityStructure, newVisibilityStructure)

  render: ->
    # R ItemListComponent, 
    #   contents: sampleFormDesign.contents[0].contents
    #   data: @state.data
    #   onDataChange: (data) => @setState(data: data)

    R FormComponent, {
      design: sampleForm2
      # design: rosterFormDesign
      # locale: React.PropTypes.string            # Locale. Defaults to English (en)
      data: @state.data
      onDataChange: @handleDataChange
      onSubmit: => alert("Submit")
      onSaveLater: => alert("SaveLater")
      onDiscard:  => alert("Discard")
      isVisible: @isVisible
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

rosterFormDesign = {
  "_type": "Form",
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
      rosterId: "02",
      allowAdd: true,
      allowRemove: true,
      contents: [
        { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true }
        { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" } }
        { _id: "c", _type: "CheckboxColumnQuestion", text: { en: "Present" } }
        { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
      ]
    }
    {
      "_type": "TextQuestion",
      "_id": "c11d1865674d4498a2adbeddc440230f",
      "text": {
        "_base": "en",
        "en": "Name of partner organization"
      },
      "conditions": [],
      "validations": [],
      "required": false,
      "format": "singleline"
    },
    {
      "_type": "TextQuestion",
      "_id": "fd620bf420a54dcd99dbae7b7c67a67c",
      "text": {
        "_base": "en",
        "en": "Program Number"
      },
      "conditions": [],
      "validations": [],
      "required": false,
      "format": "singleline"
    },
    {
      "_id": "02",
      "_type": "RosterGroup",
      "name": {
        "_base": "en",
        "en": "Roster Group"
      },
      rosterId: "02",
      allowAdd: true,
      allowRemove: true,
      "contents": [
        {
          "_type": "DropdownQuestion",
          "_id": "febdcbd89bed40799f92951729b6d360",
          "text": {
            "_base": "en",
            "en": "Have you taken a loan with [name of partner organization]?"
          },
          "conditions": [],
          "validations": [],
          "required": false,
          "choices": [
            {
              "label": {
                "_base": "en",
                "en": "Yes"
              },
              "id": "He8psmv"
            },
            {
              "label": {
                "_base": "en",
                "en": "No"
              },
              "id": "XX52gjb"
            },
            {
              "label": {
                "_base": "en",
                "en": "Other"
              },
              "specify": true,
              "id": "8X52gj3"
            }
          ]
        },
        {
          "_type": "RadioQuestion",
          "_id": "dd7ffa2f8cf9423fbf814d710a3e55a4",
          "text": {
            "_base": "en",
            "en": "Are you the head of the household?"
          },
          "conditions": [],
          "validations": [],
          "required": false,
          "choices": [
            {
              "label": {
                "_base": "en",
                "en": "Yes"
              },
              "id": "ChFvwt8"
            },
            {
              "label": {
                "_base": "en",
                "en": "No"
              },
              "id": "AK51bEJ"
            }
          ]
        }
      ]
    }
  ]
}
