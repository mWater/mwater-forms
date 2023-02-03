// @ts-nocheck
import _ from "lodash"
import { assert } from "chai"
import { default as ResponseRow } from "../src/ResponseRow"

describe("ResponseRow", function () {
  before(function () {
    this.formDesign = {
      _type: "Form",
      contents: [
        { _id: "qtext", _type: "TextQuestion" },
        { _id: "qdate", _type: "DateQuestion", format: "YYYY-MM-DD" },
        { _id: "qchoice", _type: "RadioQuestion" },
        { _id: "qchoices", _type: "MulticheckQuestion" },
        { _id: "qunits", _type: "UnitsQuestion" },
        { _id: "qlocation", _type: "LocationQuestion" },
        { _id: "qsite", _type: "SiteQuestion", siteTypes: ["Community"] },
        { _id: "qentity", _type: "EntityQuestion", entityType: "community" },
        { _id: "qcbt", _type: "AquagenxCBTQuestion" },
        { _id: "qroster", _type: "RosterGroup", contents: [{ _id: "qrtext", _type: "TextQuestion" }] },
        { _id: "qconditional", _type: "TextQuestion", conditions: [{ lhs: { question: "qtext" }, op: "present" }] },
        { _id: "qcascadingref", _type: "CascadingRefQuestion", tableId: "custom.ts0.t0" },
        { _id: "qasset", _type: "AssetQuestion", assetSystemId: 1 }
      ]
    }

    this.testField = (data: any, column: any, expected: any, done: any) => {
      const row = new ResponseRow({ formDesign: this.formDesign, responseData: data })
      row
        .getField(column)
        .then((value) => {
          assert.deepEqual(value, expected)
          return done()
        })
        .catch(done)
    }
  })

  describe("values", function () {
    it("gets text value", function (done) {
      return this.testField({ qtext: { value: "abc" } }, "data:qtext:value", "abc", done)
    })

    it("null empty text", function (done) {
      return this.testField({ qtext: { value: "" } }, "data:qtext:value", null, done)
    })

    it("gets location", function (done) {
      return this.testField(
        { qlocation: { value: { latitude: 3, longitude: 4 } } },
        "data:qlocation:value",
        { type: "Point", coordinates: [4, 3] },
        done
      )
    })

    it("gets altitude", function (done) {
      return this.testField({ qlocation: { value: { altitude: 4 } } }, "data:qlocation:value:altitude", 4, done)
    })

    it("gets accuracy", function (done) {
      return this.testField({ qlocation: { value: { accuracy: 4 } } }, "data:qlocation:value:accuracy", 4, done)
    })

    it("normalizes date", function (done) {
      return this.testField({ qdate: { value: "2012" } }, "data:qdate:value", "2012-01-01", done)
    })

    it("nulls empty enumset", function (done) {
      return this.testField({ qchoices: { value: [] } }, "data:qchoices:value", null, done)
    })

    it("gets magnitude", function (done) {
      return this.testField({ qunits: { value: { quantity: 4, units: "abc" } } }, "data:qunits:value:quantity", 4, done)
    })

    it("gets units", function (done) {
      return this.testField(
        { qunits: { value: { quantity: 4, units: "abc" } } },
        "data:qunits:value:units",
        "abc",
        done
      )
    })

    it("gets site", async function () {
      const row = new ResponseRow({
        formDesign: this.formDesign,
        responseData: { qsite: { value: { code: "10007" } } },
        getEntityByCode: (entityType, entityCode, callback) => {
          assert.equal(entityType, "community")
          assert.equal(entityCode, "10007")
          return callback({ _id: "c1", name: "abc" })
        }
      })

      const siteId = await row.getField("data:qsite:value")
      assert.equal(siteId, "c1")

      const siteRow = await row.followJoin("data:qsite:value")

      let value = await siteRow.getField("name")
      assert.equal(value, "abc")

      value = await siteRow.getPrimaryKey()
      return assert.equal(value, "c1")
    })

    it("gets entity", async function () {
      const row = new ResponseRow({
        formDesign: this.formDesign,
        responseData: { qentity: { value: "12345" } },
        getEntityById: (entityType, entityId, callback) => {
          assert.equal(entityType, "community")
          assert.equal(entityId, "12345")
          return callback({ _id: "12345", name: "abc" })
        }
      })

      const siteId = await row.getField("data:qentity:value")
      assert.equal(siteId, "12345")

      const siteRow = await row.followJoin("data:qentity:value")
      let value = await siteRow.getField("name")
      assert.equal(value, "abc")

      value = await siteRow.getPrimaryKey()
      return assert.equal(value, "12345")
    })

    it("gets custom row", async function () {
      const row = new ResponseRow({
        formDesign: this.formDesign,
        responseData: { qcascadingref: { value: "12345" } },
        getCustomTableRow: (tableId, id) => {
          assert.equal(tableId, "custom.ts0.t0")
          assert.equal(id, "12345")
          return Promise.resolve({ _id: "c1", name: "abc" })
        }
      })

      const customId = await row.getField("data:qcascadingref:value")
      assert.equal(customId, "12345")

      const customRow = await row.followJoin("data:qcascadingref:value")
      let value = await customRow.getField("name")
      assert.equal(value, "abc")

      value = await customRow.getPrimaryKey()
      return assert.equal(value, "c1")
    })

    it("gets asset", async function () {
      const row = new ResponseRow({
        formDesign: this.formDesign,
        responseData: { qasset: { value: "12345" } },
        getAssetById: (systemId, assetId) => {
          assert.equal(systemId, 1)
          assert.equal(assetId, "12345")
          return Promise.resolve({ _id: "c1", name: "abc", data: { foo: "bar" } })
        }
      })

      const customId = await row.getField("data:qasset:value")
      assert.equal(customId, "12345")

      let assetRow = await row.followJoin("data:qasset:value")
      let value = await assetRow.getField("name")
      assert.equal(value, "abc")

      assetRow = await row.followJoin("data:qasset:value")
      value = await assetRow.getField("foo")
      assert.equal(value, "bar")

      value = await assetRow.getPrimaryKey()
      assert.equal(value, "c1")
    })

    it("gets matrix") // Are just nesting
    it("gets item_choices") // Are just nesting

    it("gets cbt mpn", function (done) {
      // {value:{cbt: {c1,c2,c3,c4,c5 (All booleans), healthRisk(String), mpn (Number), confidence (Number)}, image: {id:"image_ID"}}
      return this.testField({ qcbt: { value: { cbt: { mpn: true } } } }, "data:qcbt:value:cbt:mpn", true, done)
    })

    it("gets cbt c1", function (done) {
      return this.testField({ qcbt: { value: { cbt: { c1: true } } } }, "data:qcbt:value:cbt:c1", true, done)
    })

    return it("gets cbt image", function (done) {
      return this.testField({ qcbt: { value: { image: { id: "abc" } } } }, "data:qcbt:value:image", { id: "abc" }, done)
    })
  })

  it("gets specify", function (done) {
    return this.testField(
      { qchoice: { value: "abc", specify: { abc: "sometext" } } },
      "data:qchoice:specify:abc",
      "sometext",
      done
    )
  })

  it("gets specify", function (done) {
    return this.testField(
      { qchoice: { value: "abc", specify: { abc: "sometext" } } },
      "data:qchoice:specify:abc",
      "sometext",
      done
    )
  })

  it("gets comments", function (done) {
    return this.testField(
      { qchoice: { value: "abc", comments: "sometext" } },
      "data:qchoice:comments",
      "sometext",
      done
    )
  })

  it("gets na true", function (done) {
    return this.testField({ qtext: { alternate: "na" } }, "data:qtext:na", true, done)
  })

  it("gets na false", function (done) {
    return this.testField({ qtext: {} }, "data:qtext:na", null, done)
  })

  it("gets dontknow true", function (done) {
    return this.testField({ qtext: { alternate: "dontknow" } }, "data:qtext:dontknow", true, done)
  })

  it("gets dontknow false", function (done) {
    return this.testField({ qtext: {} }, "data:qtext:dontknow", null, done)
  })

  it("gets timestamp", function (done) {
    return this.testField({ qtext: { timestamp: "2016" } }, "data:qtext:timestamp", "2016", done)
  })

  it("gets location", function (done) {
    return this.testField(
      { qtext: { location: { latitude: 3, longitude: 4 } } },
      "data:qtext:location",
      { type: "Point", coordinates: [4, 3] },
      done
    )
  })

  it("gets location accuracy", function (done) {
    return this.testField({ qtext: { location: { accuracy: 4 } } }, "data:qtext:location:accuracy", 4, done)
  })

  it("gets location altitude", function (done) {
    return this.testField({ qtext: { location: { altitude: 4 } } }, "data:qtext:location:altitude", 4, done)
  })

  it("gets visibility false", function (done) {
    return this.testField({}, "data:qconditional:visible", false, done)
  })

  it("gets visibility true", function (done) {
    return this.testField({ qtext: { value: "abc" } }, "data:qconditional:visible", true, done)
  })

  it("gets roster contents", async function () {
    const row = new ResponseRow({
      formDesign: this.formDesign,
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] },
      rosterId: "qroster",
      rosterEntryIndex: 0
    })

    const value = await row.getField("data:qrtext:value")
    assert.equal(value, "abc")
  })

  it("gets response from roster", async function () {
    const row = new ResponseRow({
      formDesign: this.formDesign,
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] },
      rosterId: "qroster",
      rosterEntryIndex: 0
    })

    const value = await row.followJoin("response")
    assert.equal(value.rosterId, null)
    assert(value.getField)
  })

  it("gets index from roster", function (done) {
    const row = new ResponseRow({
      formDesign: this.formDesign,
      responseData: { qroster: [{ _id: "r1", data: { qrtext: { value: "abc" } } }] },
      rosterId: "qroster",
      rosterEntryIndex: 0
    })

    row
      .getField("index")
      .then((value) => {
        assert.equal(value, 0)
        return done()
      })
      .catch(done)
  })

  it("gets roster as array of rows", async function () {
    const row = new ResponseRow({
      formDesign: this.formDesign,
      responseData: {
        qroster: [
          { _id: "r1", data: { qrtext: { value: "abc" } } },
          { _id: "r2", data: { qrtext: { value: "def" } } }
        ]
      }
    })

    const rowIds = await row.getField("data:qroster")
    assert.deepEqual(rowIds, ["r1", "r2"])

    const rows = await row.followJoin("data:qroster")
    const value = await rows[1].getField("data:qrtext:value")
    assert.equal(value, "def")
  })

  it("gets asked")
})
