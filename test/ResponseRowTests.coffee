_ = require 'lodash'
assert = require("chai").assert

ResponseRow = require '../src/ResponseRow'

describe.only "ResponseRow", ->
  before ->
    @formDesign = {
      contents: [
        { _id: "qtext", _type: "TextQuestion" }
        { _id: "qchoices", _type: "MulticheckQuestion" }
        { _id: "qunits", _type: "UnitsQuestion" }
        { _id: "qlocation", _type: "LocationQuestion" }
        { _id: "qsite", _type: "SiteQuestion", siteTypes: ["Community"] }
        { _id: "qentity", _type: "EntityQuestion", entityType: "community" }
        { _id: "qcbt", _type: "AquagenxCBTQuestion" }
        { _id: "qroster", _type: "RosterGroup", contents: [
          { _id: "qrtext", _type: "TextQuestion" }
        ]}
      ]
    }

    @testField = (data, column, expected, done) =>
      row = new ResponseRow({ formDesign: @formDesign, responseData: data })
      row.getField(column, (error, value) =>
        assert.deepEqual value, expected
        done()
      )

  describe "values", ->
    it "gets text value", (done) ->
      @testField({ qtext: { value: "abc" }}, "data:qtext:value", "abc", done)

    it "null empty text", (done) ->
      @testField({ qtext: { value: "" }}, "data:qtext:value", null, done)

    it "gets location", (done) ->
      @testField({ qlocation: { value: { latitude: 3, longitude: 4 }}}, "data:qlocation:value", { type: "Point", coordinates: [4, 3] }, done)

    it "gets altitude", (done) ->
      @testField({ qlocation: { value: { altitude: 4 }}}, "data:qlocation:value:altitude", 4, done)

    it "gets accuracy", (done) ->
      @testField({ qlocation: { value: { accuracy: 4 }}}, "data:qlocation:value:accuracy", 4, done)
      
    it "nulls empty enumset", (done) ->
      @testField({ qchoices: { value: [] }}, "data:qchoices:value", null, done)

    it "gets magnitude", (done) ->
      @testField({ qunits: { value: { quantity: 4, units: "abc" } }}, "data:qunits:value:quantity", 4, done)

    it "gets units", (done) ->
      @testField({ qunits: { value: { quantity: 4, units: "abc" } }}, "data:qunits:value:units", "abc", done)

    it "gets site", (done) ->
      row = new ResponseRow({ 
        formDesign: @formDesign
        responseData: { qsite: { value: { code: "10007" } } }
        getEntityByCode: (entityType, entityCode, callback) =>
          assert.equal entityType, "community"
          assert.equal entityCode, "10007"
          callback({ _id: "c1", name: "abc" })
      })

      row.getField "data:qsite:value", (error, siteRow) =>
        siteRow.getField "name", (error, value) =>
          assert.equal value, "abc"
          
          siteRow.getPrimaryKey (error, value) =>
            assert.equal value, "c1"
            done()

    it "gets entity", (done) ->
      row = new ResponseRow({ 
        formDesign: @formDesign
        responseData: { qentity: { value: "12345" } }
        getEntityById: (entityType, entityId, callback) =>
          assert.equal entityType, "community"
          assert.equal entityId, "12345"
          callback({ _id: "c1", name: "abc" })
      })

      row.getField "data:qentity:value", (error, siteRow) =>
        siteRow.getField "name", (error, value) =>
          assert.equal value, "abc"
          
          siteRow.getPrimaryKey (error, value) =>
            assert.equal value, "c1"
            done()

    it "gets matrix" # Are just nesting
    it "gets item_choices" # Are just nesting

    it "gets cbt mpn", (done) ->
      # {value:{cbt: {c1,c2,c3,c4,c5 (All booleans), healthRisk(String), mpn (Number), confidence (Number)}, image: {id:"image_ID"}}
      @testField({ qcbt: { value: {cbt: { mpn: true }}}}, "data:qcbt:value:cbt:mpn", true, done)

    it "gets cbt c1", (done) ->
      @testField({ qcbt: { value: {cbt: { c1: true }}}}, "data:qcbt:value:cbt:c1", true, done)

    it "gets cbt image", (done) ->
      @testField({ qcbt: { value: { image: { id: "abc"}}}}, "data:qcbt:value:image", { id: "abc" }, done)

  it "gets na", (done) ->
    @testField({ qtext: { alternate: "na" }}, "data:qtext:na", true, done)
    @testField({ qtext: { }}, "data:qtext:na", null, done)

  it "gets dontknow", (done) ->
    @testField({ qtext: { alternate: "dontknow" }}, "data:qtext:dontknow", true, done)
    @testField({ qtext: { }}, "data:qtext:dontknow", null, done)

  it "gets timestamp", (done) ->
    @testField({ qtext: { timestamp: "2016" }}, "data:qtext:timestamp", "2016", done)

  it "gets location", (done) ->
    @testField({ qtext: { location: { latitude: 3, longitude: 4 }}}, "data:qtext:location", { type: "Point", coordinates: [4, 3] }, done)

  it "gets location accuracy", (done) ->
    @testField({ qtext: { location: { accuracy: 4 }}}, "data:qtext:location:accuracy", 4, done)

  it "gets location altitude", (done) ->
    @testField({ qtext: { location: { altitude: 4 }}}, "data:qtext:location:altitude", 4, done)

  it "gets roster contents", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] }
      rosterId: "qroster"
      rosterEntryIndex: 0
    })
    row.getField("data:qrtext:value", (error, value) =>
      assert.equal value, "abc"
      done()
    )

  it "gets response from roster", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] }
      rosterId: "qroster"
      rosterEntryIndex: 0
    })

    row.getField("response", (error, value) =>
      assert.equal value.rosterId, null
      assert value.getField
      done()
    )

  it "gets index from roster", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] }
      rosterId: "qroster"
      rosterEntryIndex: 0
    })
    
    row.getField("index", (error, value) =>
      assert.equal value, 0
      done()
    )

  it "gets roster as array of rows", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }, { _id: "r2", data: { qrtext: { value: "def" } } }] }
    })
    
    row.getField("data:qroster", (error, rows) =>
      rows[1].getField("data:qrtext:value", (error, value) =>
        assert.equal value, "def"
        done()
      )
    )

  it "gets asked"