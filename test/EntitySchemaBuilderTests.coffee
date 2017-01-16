_ = require 'lodash'
assert = require('chai').assert
Schema = require('mwater-expressions').Schema
EntitySchemaBuilder = require '../src/EntitySchemaBuilder'
canonical = require 'canonical-json'

compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

describe.only "EntitySchemaBuilder addEntities", ->
  it "adds properties", ->
    entityTypes = [
      {
        code: "water_point"
        name: { en: "Water point"}
        properties: [
          { id: "name", type: "text", name: { en: "Name" }, roles: [{ id: "all", role: "admin" }] }
        ]
      }
    ]
    schema = new EntitySchemaBuilder().addEntities(new Schema(), entityTypes)

    table = schema.getTable("entities.water_point")

    compare(table.name, { en: "Water point"})
    compare(schema.getColumn("entities.water_point", "name"), {
      id: "name"
      type: "text"
      name: { en: "Name" }
    })

  it "pads dates", ->
    entityTypes = [
      {
        code: "water_point"
        name: { en: "Water point"}
        properties: [
          { id: "date", type: "date", name: { en: "Date" }, roles: [{ id: "all", role: "admin" }] }
        ]
      }
    ]
    schema = new EntitySchemaBuilder().addEntities(new Schema(), entityTypes)

    compare(schema.getColumn("entities.water_point", "date").jsonql, {
      type: "op"
      op: "rpad"
      exprs:[
        {
          type: "field"
          tableAlias: "{alias}"
          column: "date"
        }
        10
        '-01-01'
      ]
    })


  it "adds reverse joins for entity references", ->
    entityTypes = [
      {
        code: "water_point"
        name: { en: "Water point"}
        properties: [
          { id: "community", type: "id", idTable: "entities.community", name: { en: "Community" }, roles: [{ id: "all", role: "admin" }] }
        ]
      }
      {
        code: "community"
        name: { en: "Community"}
        properties: []
      }
    ]
    schema = new EntitySchemaBuilder().addEntities(new Schema(), entityTypes)

    compare(schema.getColumn("entities.community", "!entities.water_point.community"), {
      id: "!entities.water_point.community"
      type: "join"
      name: { en: "Water point"}
      join: {
        type: "1-n"
        toTable: "entities.water_point"
        fromColumn: "_id"
        toColumn: "community"
      }
    })

  it "converts ids to joins", ->
    entityTypes = [
      {
        code: "water_point"
        name: { en: "Water point"}
        properties: [
          { id: "community", type: "id", idTable: "entities.community", name: { en: "Community" }, roles: [{ id: "all", role: "admin" }] }
        ]
      }
    ]
    schema = new EntitySchemaBuilder().addEntities(new Schema(), entityTypes)

    compare(schema.getColumn("entities.water_point", "community"), {
      id: "community"
      type: "join"
      name: { en: "Community"}
      join: {
        type: "n-1"
        toTable: "entities.community"
        fromColumn: "community"
        toColumn: "_id"
      }
    })


  it "adds _managed_by, _created_by, _created_on", ->
    entityTypes = [
      {
        code: "water_point"
        name: { en: "Water point"}
        properties: [
        ]
      }
    ]
    schema = new EntitySchemaBuilder().addEntities(new Schema(), entityTypes)

    assert schema.getColumn("entities.water_point", "_managed_by")
    assert schema.getColumn("entities.water_point", "_created_by")
    assert schema.getColumn("entities.water_point", "_created_on")

  it "adds datasets"
