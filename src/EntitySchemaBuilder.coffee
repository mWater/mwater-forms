_ = require 'lodash'

# Builds schema for entities. Always add entities before forms
module.exports = class EntitySchemaBuilder  
  # Pass in:
  #   entityTypes: list of entity types objects
  #   properties: list of all properties objects (filtered to visible)
  #   units: list of all units objects
  #   user: current username
  #   groups: current groups
  # Returns updated schema
  addEntities: (schema, entityTypes, properties, units) ->
    # Keep list of reverse join columns (one to many) to add later. table and column
    reverseJoins = []
    for prop in properties
      if prop.type == "entity"
        # Lookup entity type 
        entityType = _.findWhere(entityTypes, code: prop.entity_type)
        tableId = "entities.#{entityType.code}"

        reverseJoins.push({
          table: "entities." + prop.ref_entity_type
          column: {
            id: "!#{tableId}.#{prop.code}"
            name: entityType.name
            deprecated: prop.deprecated or entityType.deprecated
            type: "join"
            join: {
              type: "1-n"
              toTable: tableId
              fromColumn: "_id"
              toColumn: prop.code
            }
          }
        })

    # For each entity type
    for entityType in entityTypes
      # Columns and sections
      contents = []

      # Get label column
      labelColumn = null

      # Make filtered copy
      entityProps = _.cloneDeep(_.filter(properties, (prop) -> prop.entity_type == entityType.code))

      # Sort obvious ones to top
      ordering = {
        name: 1
        desc: 2
        type: 3
        admin_region: 4
        location: 5
        code: 6
      }

      entityProps = _.sortBy(entityProps, (prop) -> ordering[prop.code] or 999)

      # Add properties
      for prop in entityProps
        # Fix names and descriptions pending a re-write of properties
        if prop.code == "location"
          prop.name = { _base: "en", en: "GPS Coordinates"}
          prop.desc = { _base: "en", en: "Latitude/longitude of the site. Use 'Location' instead for filtering by country, state, etc."}

        if prop.code == "admin_region"
          prop.name = { _base: "en", en: "Location"}
          prop.desc = { _base: "en", en: "Administrative region (country, state/province, district, village etc.)"}

        # Use unique code as label
        if prop.unique_code
          labelColumn = prop.code

        deprecated = prop.deprecated

        if prop.type == "measurement"
          # Add magnitude and units
          contents.push({
            id: prop.code + ".magnitude"
            name: appendStr(prop.name, " (magnitude)")
            type: "number"
            deprecated: deprecated
          })

          contents.push({
            id: prop.code + ".unit"
            name: appendStr(prop.name, " (units)")
            type: "enum"
            enumValues: _.map(prop.units, (u) -> { id: u, name: _.findWhere(units, { code: u }).name })
            deprecated: deprecated
          })

        else if prop.type == "entity"
          # Check if referenced entity is deprecated
          refEntityType = _.findWhere(entityTypes, code: prop.ref_entity_type)

          # Add two joins (to and from)
          contents.push({ 
            id: "#{prop.code}"
            name: prop.name
            desc: prop.desc
            type: "join"
            deprecated: deprecated or refEntityType.deprecated
            join: {
              type: "n-1"
              toTable: "entities." + prop.ref_entity_type
              fromColumn: prop.code
              toColumn: "_id"
            }
          })

        else if prop.type in ["enum", "enumset"]
          contents.push({
            id: prop.code
            name: prop.name
            desc: prop.desc
            type: prop.type
            enumValues: _.map(prop.values, (v) -> { id: v.code, name: v.name })
            deprecated: deprecated
          })

        # integer and decimal will eventually become number
        else if prop.type in ["integer", "decimal", "number"]
          contents.push({
            id: prop.code
            name: prop.name
            desc: prop.desc
            type: "number"
            deprecated: deprecated
          })

        # date is padded to yyyy-mm-dd
        else if prop.type == "date"
          contents.push({
            id: prop.code
            name: prop.name
            desc: prop.desc
            type: "date"
            deprecated: deprecated
            # rpad(field ,10, '-01-01')
            jsonql: {
              type: "op"
              op: "rpad"
              exprs:[
                {
                  type: "field"
                  tableAlias: "{alias}"
                  column: prop.code
                }
                10
                '-01-01'
              ]
            }
          })

        # admin_region is a join
        else if prop.type == "admin_region"
          contents.push({
            id: prop.code
            name: prop.name
            desc: prop.desc
            type: "join"
            join: {
              type: "n-1"
              toTable: "admin_regions"
              fromColumn: prop.code
              toColumn: "_id"
            }
            deprecated: deprecated
          })

        else if prop.type not in ['json']
          contents.push({
            id: prop.code
            name: prop.name
            desc: prop.desc
            type: prop.type
            enumValues: prop.values
            deprecated: deprecated
          })

      # Add extra columns
      contents.push({
        id: "_managed_by"
        name: { en: "Managed By" }
        desc: { en: "User or group that manages the data for the site"}
        type: "join"
        join: {
          type: "n-1"
          toTable: "subjects"
          fromColumn: "_managed_by"
          toColumn: "id"
        }
      })

      contents.push({
        id: "_created_by"
        name: { en: "Added by user" }
        type: "join"
        join: {
          type: "n-1"
          toTable: "users"
          fromColumn: "_created_by"
          toColumn: "_id"
        }
      })

      contents.push({
        id: "_created_on"
        name: { en: "Date added" }
        type: "datetime"
      })

      # Add datasets
      contents.push({
        id: "!datasets"
        name: "Datasets"
        type: "join"
        join: {
          type: "n-n"
          toTable: "datasets"
          jsonql: {
            type: "op"
            op: "exists"
            exprs: [
              { 
                type: "query"
                selects: [{ type: "select", expr: null, alias: "null_value"}]
                from: { type: "table", table: "dataset_members", alias: "members" }
                where: {
                  type: "op"
                  op: "and"
                  exprs: [
                    { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "members", column: "entity_type" }, entityType.code] }
                    { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "members", column: "entity_id" }, { type: "field", tableAlias: "{from}", column: "_id" }] }
                    { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "members", column: "dataset" }, { type: "field", tableAlias: "{to}", column: "_id" }] }
                  ]
                }
              }
            ]
          }
        }
      })

      tableId = "entities.#{entityType.code}"

      # Add reverse join columns
      for rj in reverseJoins
        if rj.table == tableId
          contents.push(rj.column)  

      table = { 
        id: tableId
        name: entityType.name
        primaryKey: "_id"
        label: labelColumn
        contents: contents
      }

      # Legacy only
      if entityType.code == "water_point_functionality_report"
        table.ordering = "date"

      # Create table
      schema = schema.addTable(table)

    return schema

# Append a string to each language
appendStr = (str, suffix) ->
  output = {}
  for key, value of str
    if key == "_base"
      output._base = value
    else
      # If it's a simple string
      if _.isString(suffix)
        output[key] = value + suffix
      else
        output[key] = value + (suffix[key] or suffix[suffix._base] or suffix.en)
  return output
