import { assert } from "chai"
import { Schema, Column } from "mwater-expressions"
import { CustomRow } from "../src/CustomRow"

// Create schema with one join
const schema = new Schema({
  tables: [
    {
      id: "entities.a",
      name: { _base: "en", en: "A" },
      contents: [{ id: "x", type: "text", name: { _base: "en", en: "X" } }] as Column[]
    },
    {
      id: "custom.ts1.t1",
      name: { _base: "en", en: "T1" },
      contents: [
        { id: "x", type: "text", name: { _base: "en", en: "X" } },
        { id: "y", type: "join", join: { type: "n-1", toTable: "entities.a" }, name: { _base: "en", en: "Y" } }
      ]
    }
  ]
})

describe("CustomRow", () => {
  it("gets plain value", async () => {
    const row = new CustomRow({
      schema: schema,
      row: { x: "abc" },
      tableId: "custom.ts1.t1",
      getEntityById: () => null
    })

    const value = await row.getField("x")
    assert.equal(value, "abc")
  })

  it("follows joins", async () => {
    const row = new CustomRow({
      schema: schema,
      row: { x: "abc", y: "id1" },
      tableId: "custom.ts1.t1",
      getEntityById: (entityType, entityId, cb) => {
        assert.equal(entityType, "a")
        assert.equal(entityId, "id1")
        cb({ x: "xyz" })
      }
    })

    const innerRow = await row.followJoin("y")
    const value = await innerRow!.getField("x")
    assert.equal(value, "xyz")
  })
})
