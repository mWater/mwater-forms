// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from "lodash"
import { assert } from "chai"
import EntityRow from "../src/EntityRow"
import { Schema } from "mwater-expressions"

describe("EntityRow", function () {
  before(function () {
    // Create schema with one join
    return (this.schema = new Schema({
      tables: [
        {
          id: "entities.a",
          contents: [
            { id: "x", type: "text" },
            { id: "y", type: "join", join: { type: "n-1", toTable: "entities.b" } }
          ]
        },
        {
          id: "entities.b",
          contents: [{ id: "x", type: "text" }]
        }
      ]
    }))
  })

  it("gets plain values", async function () {
    const row = new EntityRow({
      entityType: "a",
      entity: { x: "abc" },
      schema: this.schema
    })

    const value = await row.getField("x")
    return assert.equal(value, "abc")
  })

  it("gets plain values of join", async function () {
    const row = new EntityRow({
      entityType: "a",
      entity: { y: "someid" },
      schema: this.schema,
      getEntityById: (entityType: any, entityId: any, callback: any) => {
        assert.equal(entityType, "b")
        assert.equal(entityId, "someid")
        return callback({ x: "abc" })
      }
    })

    const value = await row.getField("y")
    return assert.equal(value, "someid")
  })

  return it("gets joins", async function () {
    const row = new EntityRow({
      entityType: "a",
      entity: { y: "someid" },
      schema: this.schema,
      getEntityById: (entityType: any, entityId: any, callback: any) => {
        assert.equal(entityType, "b")
        assert.equal(entityId, "someid")
        return callback({ x: "abc" })
      }
    })

    let value = await row.followJoin("y")
    value = await value.getField("x")
    return assert.equal(value, "abc")
  });
})
