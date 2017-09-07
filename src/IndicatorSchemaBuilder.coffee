_ = require 'lodash'
update = require 'update-object'

# Builds a schema from indicators
module.exports = class IndicatorSchemaBuilder
  # Adds indicator to the schema
  addIndicator: (schema, indicator) ->
    if indicator.type == "response"
      return @addResponseIndicator(schema, indicator)
    else if indicator.type == "expression"
      return @addExpressionIndicator(schema, indicator)
    else
      return schema

  # Add indicator of type "response". This creates a table indicator_values:<indicator _id> and also adds to master
  # response_indicators table.
  addResponseIndicator: (schema, indicator) -> 
    # Add indicator properties
    contents = []
    # Reverse join columns that should be added to other tables. Array of { table: ..., column: ... }
    reverseJoins = []

    # Add all property types
    for property in indicator.design.properties.values or []
      @addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins)
    for property in indicator.design.properties.links or []
      @addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins)
    for property in indicator.design.properties.subindicators or []
      @addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins)
    for property in indicator.design.properties.others or []
      @addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins)

    # Add datetime
    contents.push({
      id: "datetime"
      name: { _base: "en", en: "Date" }
      type: "datetime"
    })

    # Add unique response id
    contents.push({
      id: "response_id"
      name: { _base: "en", en: "Unique Response Id" }
      type: "text"
      jsonql: { type: "field", tableAlias: "{alias}", column: "response" }
    })

    # Add responseStatus if includePending
    if indicator.design.includePending
      contents.push({
        id: "responseStatus"
        name: { _base: "en", en: "Response Status" }
        type: "enum"
        enumValues: [
          { id: "final", name: { en: "Final" } }
          { id: "pending0", name: { en: "Pending Level 1" } }
          { id: "pending1", name: { en: "Pending Level 2" } }
          { id: "pending2", name: { en: "Pending Level 3" } }
          { id: "pending3", name: { en: "Pending Level 4" } }
        ]
      })

    # Add reverse joins
    for reverseJoin in reverseJoins
      table = schema.getTable(reverseJoin.table)
      if not table
        console.error "Reverse join to #{reverseJoin.table} not found for #{indicator._id}"
        continue

      table = @addIndicatorToTable(table, reverseJoin.column, indicator.design.recommended)

      # Replace table
      schema = schema.addTable(table)

    # Add aggregations
    for aggregation in indicator.design.aggregations or []
      table = schema.getTable(aggregation.table)

      if not table
        continue

      # Transform aggregation into a column by removing table field and prepending id with indicator 
      aggrColumn = _.omit(aggregation, "table")
      aggrColumn.id = "indicator_values:#{indicator._id}.#{aggregation.id}"

      table = @addIndicatorToTable(table, aggrColumn, indicator.design.recommended)

      # Replace table
      schema = schema.addTable(table)

    # Add indicator to response_indicators table
    if not schema.getTable("response_indicators")
      schema = schema.addTable({
        id: "response_indicators"
        name: { en: "Indicators", _base: "en" }
        desc: { en: "All Indicators", _base: "en" }
        primaryKey: "_id"
        contents: [
          { id: "submittedOn", type: "datetime", name: { en: "Date", _base: "en" } }
        ]
        })

    # Add column for 1-n join to indicator value
    column = {
      type: "join"
      id: indicator._id
      name: indicator.design.name
      desc: indicator.design.desc
      code: indicator.design.code
      join: {
        type: "1-n"
        toTable: "indicator_values:#{indicator._id}"
        fromColumn: "_id"
        toColumn: "response"
      }
      deprecated: indicator.deprecated
    }

    table = update(schema.getTable("response_indicators"), { contents: { $push: [column]}})
    schema = schema.addTable(table)

    # Create indicator table
    return schema.addTable({
      id: "indicator_values:#{indicator._id}"
      name: indicator.design.name
      desc: indicator.design.desc
      code: indicator.design.code
      primaryKey: "_id"
      ordering: "datetime" 
      contents: contents
      deprecated: indicator.deprecated
    })

  addResponseIndicatorProperty: (schema, indicator, property, contents, reverseJoins) ->
    switch property.type
      # Sections not supported
      # when "section"
      #   subcontents = []
      #   section = {
      #     type: "section"
      #     name: property.name
      #     contents: subcontents
      #   }
      #   for subproperty in property.contents
      #     @addResponseIndicatorProperty(indicator, subproperty, subcontents, reverseJoins)

      #   contents.push(section)
      when "text", "date", "datetime"
        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: property.type
          expr: property.expr
          deprecated: property.deprecated
          jsonql: if not property.expr then { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id]}
        })
      
      when "number"
        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: property.type
          expr: property.expr
          deprecated: property.deprecated
          jsonql: if not property.expr then { type: "op", op: "::decimal", exprs: [{ type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id] }] }
        })

      when "boolean"
        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: property.type
          expr: property.expr
          deprecated: property.deprecated
          jsonql: if not property.expr then { type: "op", op: "::boolean", exprs: [{ type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id] }] }
        })
      
      when "enum", "enumset"
        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: property.type
          expr: property.expr
          enumValues: property.enumValues
          deprecated: property.deprecated
          jsonql: if not property.expr then { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id] }
        })

      # Stores geometry as string. e.g. "0101000020110F0000DB0B4ADA772DFB402B432E49D22DFB40"
      when "geometry"
        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: property.type
          expr: property.expr
          deprecated: property.deprecated
          jsonql: if not property.expr then { type: "op", op: "::geometry", exprs: [{ type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id] }] }
        })

      when "image", "imagelist", "text[]"
        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: property.type
          expr: property.expr
          deprecated: property.deprecated
          jsonql: if not property.expr then { type: "op", op: "->", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id] }
        })

      when "id"
        # Column reference is different if integer primary key
        if property.idTable == "admin_regions"
          column = {
            type: "op"
            op: "::integer"
            exprs: [
              { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id] }
            ]
          }
        else
          column = { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, property.id] }

        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: "join"
          expr: property.expr
          join: {
            type: "n-1"
            toTable: property.idTable
            fromColumn: column
            toColumn: schema.getTable(property.idTable)?.primaryKey or "_id"
          }
          deprecated: property.deprecated
        })        

        # Create reverse join
        if not property.idTable
          console.error "MISSING idTable for #{indicator._id}.#{property.id}"
        if property.idTable and property.idTable.match(/entities\./)
          reverseJoins.push({ table: property.idTable, column: {
            id: "!indicator_values:#{indicator._id}.#{property.id}"
            code: indicator.design.code
            name: indicator.design.name
            desc: indicator.design.desc
            type: "join"
            join: {
              type: "1-n"
              toTable: "indicator_values:#{indicator._id}"
              fromColumn: schema.getTable(property.idTable)?.primaryKey or "_id"
              toColumn: column
            }
            deprecated: property.deprecated
          }})

      # DEPRECATED. Remove July 2017
      when "expr"
        contents.push({
          id: property.id
          code: property.code
          name: property.name
          desc: property.desc
          type: "expr"
          expr: property.expr
          deprecated: property.deprecated
        })        


  addExpressionIndicator: (schema, indicator) ->
    # Get table
    table = schema.getTable(indicator.design.table)

    # Add field
    column = { 
      id: "indicators:#{indicator._id}"
      type: "expr"
      expr: indicator.design.expr
      name: indicator.design.name
      desc: indicator.design.desc
      deprecated: indicator.deprecated 
    }

    table = @addIndicatorToTable(table, column, indicator.design.recommended)

    # Replace table
    schema = schema.addTable(table)

    return schema


  # Adds an indicator column to the appropriate section of the table
  addIndicatorToTable: (table, column, recommended) =>
    # Add Indicators section
    sectionIndex = _.findIndex(table.contents, (item) -> item.id == '!indicators')
    if sectionIndex < 0
      # Add section
      section = {
        id: "!indicators" # Special section name
        type: "section"
        name: { en: "Related Indicators" }
        desc: { en: "Indicators are standardized information that are related to this site" }
        contents: []
      }
      table = update(table, { contents: { $push: [section] }})
      sectionIndex = _.findIndex(table.contents, (item) -> item.id == '!indicators')

    # Add reverse join 
    section = update(table.contents[sectionIndex], { contents: { $push: [column] } })

    # Update table
    table = update(table, { contents: { $splice: [[sectionIndex, 1, section]] }})

    return table

