_ = require 'lodash'
assert = require("chai").assert

ResponseRow = require('../src/ResponseRow').default

describe "ResponseRow", ->
  before ->
    @formDesign = {
      _type: "Form"
      contents: [
        { _id: "qtext", _type: "TextQuestion" }
        { _id: "qdate", _type: "DateQuestion", format: "YYYY-MM-DD" }
        { _id: "qchoice", _type: "RadioQuestion" }
        { _id: "qchoices", _type: "MulticheckQuestion" }
        { _id: "qunits", _type: "UnitsQuestion" }
        { _id: "qlocation", _type: "LocationQuestion" }
        { _id: "qsite", _type: "SiteQuestion", siteTypes: ["Community"] }
        { _id: "qentity", _type: "EntityQuestion", entityType: "community" }
        { _id: "qcbt", _type: "AquagenxCBTQuestion" }
        { _id: "qroster", _type: "RosterGroup", contents: [
          { _id: "qrtext", _type: "TextQuestion" }
        ]}
        { _id: "qconditional", _type: "TextQuestion", conditions: [{ lhs: { question: "qtext" }, op: "present" }] }
        { _id: "qcascadingref", _type: "CascadingRefQuestion", tableId: "custom.ts0.t0" }
      ]
    }

    @testField = (data, column, expected, done) =>
      row = new ResponseRow({ formDesign: @formDesign, responseData: data })
      row.getField(column).then((value) =>
        assert.deepEqual value, expected
        done()
      ).catch(done)
      return

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

    it "normalizes date", (done) ->
      @testField({ qdate: { value: "2012" }}, "data:qdate:value", "2012-01-01", done)
      
    it "nulls empty enumset", (done) ->
      @testField({ qchoices: { value: [] }}, "data:qchoices:value", null, done)

    it "gets magnitude", (done) ->
      @testField({ qunits: { value: { quantity: 4, units: "abc" } }}, "data:qunits:value:quantity", 4, done)

    it "gets units", (done) ->
      @testField({ qunits: { value: { quantity: 4, units: "abc" } }}, "data:qunits:value:units", "abc", done)

    it "gets site", ->
      row = new ResponseRow({ 
        formDesign: @formDesign
        responseData: { qsite: { value: { code: "10007" } } }
        getEntityByCode: (entityType, entityCode, callback) =>
          assert.equal entityType, "community"
          assert.equal entityCode, "10007"
          callback({ _id: "c1", name: "abc" })
      })

      siteRow = await row.getField("data:qsite:value")
      value = await siteRow.getField("name")
      assert.equal value, "abc"
          
      value = await siteRow.getPrimaryKey()
      assert.equal value, "c1"

    it "gets entity", ->
      row = new ResponseRow({ 
        formDesign: @formDesign
        responseData: { qentity: { value: "12345" } }
        getEntityById: (entityType, entityId, callback) =>
          assert.equal entityType, "community"
          assert.equal entityId, "12345"
          callback({ _id: "c1", name: "abc" })
      })

      siteRow = await row.getField("data:qentity:value")
      value = await siteRow.getField("name")
      assert.equal value, "abc"
          
      value = await siteRow.getPrimaryKey()
      assert.equal value, "c1"

    it "gets custom row", ->
      row = new ResponseRow({ 
        formDesign: @formDesign
        responseData: { qcascadingref: { value: "12345" } }
        getCustomTableRow: (tableId, id) =>
          assert.equal tableId, "custom.ts0.t0"
          assert.equal id, "12345"
          return Promise.resolve({ _id: "c1", name: "abc" })
      })

      customRow = await row.getField("data:qcascadingref:value")
      value = await customRow.getField("name")
      assert.equal value, "abc"
          
      value = await customRow.getPrimaryKey()
      assert.equal value, "c1"

    it "gets matrix" # Are just nesting
    it "gets item_choices" # Are just nesting

    it "gets cbt mpn", (done) ->
      # {value:{cbt: {c1,c2,c3,c4,c5 (All booleans), healthRisk(String), mpn (Number), confidence (Number)}, image: {id:"image_ID"}}
      @testField({ qcbt: { value: {cbt: { mpn: true }}}}, "data:qcbt:value:cbt:mpn", true, done)

    it "gets cbt c1", (done) ->
      @testField({ qcbt: { value: {cbt: { c1: true }}}}, "data:qcbt:value:cbt:c1", true, done)

    it "gets cbt image", (done) ->
      @testField({ qcbt: { value: { image: { id: "abc"}}}}, "data:qcbt:value:image", { id: "abc" }, done)

  it "gets specify", (done) ->
    @testField({ qchoice: { value: "abc", specify: { abc: "sometext" } }}, "data:qchoice:specify:abc", "sometext", done)

  it "gets specify", (done) ->
    @testField({ qchoice: { value: "abc", specify: { abc: "sometext" } }}, "data:qchoice:specify:abc", "sometext", done)

  it "gets comments", (done) ->
    @testField({ qchoice: { value: "abc", comments: "sometext" }}, "data:qchoice:comments", "sometext", done)

  it "gets na true", (done) ->
    @testField({ qtext: { alternate: "na" }}, "data:qtext:na", true, done)

  it "gets na false", (done) ->
    @testField({ qtext: { }}, "data:qtext:na", null, done)

  it "gets dontknow true", (done) ->
    @testField({ qtext: { alternate: "dontknow" }}, "data:qtext:dontknow", true, done)

  it "gets dontknow false", (done) ->
    @testField({ qtext: { }}, "data:qtext:dontknow", null, done)

  it "gets timestamp", (done) ->
    @testField({ qtext: { timestamp: "2016" }}, "data:qtext:timestamp", "2016", done)

  it "gets location", (done) ->
    @testField({ qtext: { location: { latitude: 3, longitude: 4 }}}, "data:qtext:location", { type: "Point", coordinates: [4, 3] }, done)

  it "gets location accuracy", (done) ->
    @testField({ qtext: { location: { accuracy: 4 }}}, "data:qtext:location:accuracy", 4, done)

  it "gets location altitude", (done) ->
    @testField({ qtext: { location: { altitude: 4 }}}, "data:qtext:location:altitude", 4, done)

  it "gets visibility false", (done) ->
    @testField({}, "data:qconditional:visible", false, done)

  it "gets visibility true", (done) ->
    @testField({ qtext: { value: "abc" }}, "data:qconditional:visible", true, done)

  it "gets roster contents", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] }
      rosterId: "qroster"
      rosterEntryIndex: 0
    })
    row.getField("data:qrtext:value").then((value) =>
      assert.equal value, "abc"
      done()
    ).catch(done)
    return

  it "gets response from roster", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] }
      rosterId: "qroster"
      rosterEntryIndex: 0
    })

    row.getField("response").then((value) =>
      assert.equal value.rosterId, null
      assert value.getField
      done()
    ).catch(done)
    return

  it "gets index from roster", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] }
      rosterId: "qroster"
      rosterEntryIndex: 0
    })
    
    row.getField("index").then((value) =>
      assert.equal value, 0
      done()
    ).catch(done)
    return

  it "gets roster as array of rows", (done) ->
    row = new ResponseRow({ 
      formDesign: @formDesign
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }, { _id: "r2", data: { qrtext: { value: "def" } } }] }
    })
    
    row.getField("data:qroster").then((rows) =>
      rows[1].getField("data:qrtext:value").then((value) =>
        assert.equal value, "def"
        done()
      ).catch(done)
    ).catch(done)
    return

  it "gets asked"