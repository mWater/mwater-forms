_ = require 'lodash'
assert = require("chai").assert

EntityRow = require '../src/EntityRow'
Schema = require('mwater-expressions').Schema

describe "EntityRow", ->
  before ->
    # Create schema with one join
    @schema = new Schema({
      tables: [
        {
          id: "entities.a"
          contents: [
            { id: "x", type: "text" }
            { id: "y", type: "join", join: { type: "n-1", toTable: "entities.b" }}
          ]
        }
        {
          id: "entities.b"
          contents: [
            { id: "x", type: "text" }
          ]
        }
      ]
    })

  it "gets plain values", ->
    row = new EntityRow({
      entityType: "a"
      entity: { x: "abc" }
      schema: @schema
    })

    value = await row.getField("x")
    assert.equal value, "abc"

  it "gets joins", ->
    row = new EntityRow({
      entityType: "a"
      entity: { y: "someid" }
      schema: @schema
      getEntityById: (entityType, entityId, callback) =>
        assert.equal entityType, "b"
        assert.equal entityId, "someid"
        callback({ x: "abc" })
    })

    value = await row.getField("y")
    value = await value.getField("x")
    assert.equal value, "abc"

