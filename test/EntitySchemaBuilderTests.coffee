_ = require 'lodash'
assert = require('chai').assert
Schema = require('mwater-expressions').Schema
EntitySchemaBuilder = require '../src/EntitySchemaBuilder'
canonical = require 'canonical-json'

compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

describe "EntitySchemaBuilder addEntities", ->
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
      name: { en: "Water points"}
      join: {
        type: "1-n"
        toTable: "entities.water_point"
        fromColumn: "_id"
        toColumn: "community"
        inverse: "community"
      }
    })

  it "adds reverse joins for entity references in a section", ->
    entityTypes = [
      {
        code: "water_point"
        name: { en: "Water point"}
        properties: [
          { id: "linked_sites", type: "section", name: { en: "Linked Sites" }, contents: [
            { id: "community", type: "id", idTable: "entities.community", name: { en: "Community" }, roles: [{ id: "all", role: "admin" }] }
          ]}
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
      name: { en: "Water points"}
      join: {
        type: "1-n"
        toTable: "entities.water_point"
        fromColumn: "_id"
        toColumn: "community"
        inverse: "community"
      }
    })


  it "does not convert ids to joins", ->
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
      type: "id"
      name: { en: "Community"}
      idTable: "entities.community"
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

  it "adds custom regions", ->
    entityTypes = [
      {
        code: "water_point"
        name: { en: "Water point"}
        properties: [
          { id: "admin_region", type: "id", idTable: "admin_regions", name: { en: "Admin Region" }, roles: [{ id: "all", role: "admin" }] }
        ]
      }
    ]

    regionTypes = [
      {
        code: "catchment"
        link_name: { _base: "en", en: "Catchment Region" }
      }
    ]
    schema = new EntitySchemaBuilder().addEntities(new Schema(), entityTypes, null, regionTypes)

    compare(schema.getColumn("entities.water_point", "admin_region"), {
      id: "admin_region"
      type: "id"
      name: { en: "Admin Region"}
      idTable: "admin_regions"
    })

    # It should make a n-1 join to the region, looking it up in the 
    compare(schema.getColumn("entities.water_point", "catchment_region"), {
      id: "catchment_region"
      type: "join"
      name: { _base: "en", en: "Catchment Region" }
      join: {
        type: "n-1"
        toTable: "regions.catchment"
        toColumn: "_id"
        fromColumn: { 
          type: "scalar"
          expr: { type: "field", tableAlias: "entity_regions", column: "region_id" }
          from: { type: "table", table: "entity_regions", alias: "entity_regions" }
          where: {
            type: "op"
            op: "and"
            exprs: [
              { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "entity_regions", column: "entity_type"}, { type: "literal", value: "water_point" }]}
              { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "entity_regions", column: "entity_id"}, { type: "field", tableAlias: "{alias}", column: "_id" }]}
              { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "entity_regions", column: "region_type"}, { type: "literal", value: "catchment" }]}
            ]
          }
          limit: 1
        }
      }
    })

