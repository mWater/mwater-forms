
###

Topological sorting is done, but adding indicator calculations to schema can still fail if expressions are invalid
since they are compiled to build the jsonql field.

###

_ = require 'lodash'
formUtils = require '../src/formUtils'
ExprUtils = require('mwater-expressions').ExprUtils
ExprCompiler = require('mwater-expressions').ExprCompiler
update = require 'update-object'
ColumnNotFoundException = require('mwater-expressions').ColumnNotFoundException
TopoSort = require 'topo-sort'

module.exports = class FormSchemaBuilder
  # Pass clone forms if a master form
  addForm: (schema, form, cloneForms) ->
    contents = []
    
    # Get deployments
    deploymentValues = _.map(form.deployments, (dep) -> { id: dep._id, name: { en: dep.name } })
    contents.push({ id: "deployment", type: "enum", name: { en: "Deployment" }, enumValues: deploymentValues })

    # Add user
    contents.push({ id: "user", type: "text", name: { en: "Enumerator" } })

    # Add status
    contents.push({ id: "status", type: "enum", name: { en: "Status" }, enumValues: [
      { id: "draft", name: { en: "Draft" } }
      { id: "pending", name: { en: "Pending" } }
      { id: "final", name: { en: "Final" } }
      { id: "rejected", name: { en: "Rejected" } }
    ]})

    # Add code
    contents.push({ id: "code", type: "text", name: { en: "Response Code" } })

    # Add submitted on
    contents.push({ id: "submittedOn", type: "datetime", name: { en: "Submitted On" } })

    @addFormItem(form, form.design, contents)

    # Add to schema
    schema = schema.addTable({
      id: "responses:#{form._id}"
      name: form.design.name
      primaryKey: "_id"
      contents: contents
    })

    # Add reverse joins from entity and site questions
    schema = @addReverseEntityJoins(schema, form)

    # Add any roster tables
    schema = @addRosterTables(schema, form)

    schema = @addIndicatorCalculations(schema, form, false)

    if form.isMaster
      schema = @addMasterForm(schema, form, cloneForms)

    # Create table
    return schema

  # Add joins back from entities to site and entity questions
  addReverseEntityJoins: (schema, form) ->
    for column in schema.getColumns("responses:#{form._id}")
      if column.type == "join" and column.join.type == "n-1"
        # Create reverse join
        join = {
          id: "responses:#{form._id}:#{column.id}"
          name: appendStr(appendStr(form.design.name, ": "), column.name)
          type: "join"
          join: {
            type: "1-n"
            toTable: "responses:#{form._id}"
            fromColumn: column.join.toColumn
            toColumn: column.join.fromColumn
          }
        }

        # Add to entities table if it exists
        if schema.getTable(column.join.toTable)
          schema = schema.addTable(update(schema.getTable(column.join.toTable), { contents: { $push: [join] } }))        

    return schema

  addRosterTables: (schema, form) ->
    # For each item
    for item in formUtils.allItems(form.design)
      if item._type in ["RosterGroup", "RosterMatrix"]
        # If new, create table with single join back to responses
        if not item.rosterId
          contents = [
            { 
              id: "response"
              type: "join"
              name: { en: "Response" }
              join: {
                type: "n-1"
                toTable: "responses:#{form._id}"
                fromColumn: "response"
                toColumn: "_id"
              }
            }
            { 
              id: "index"
              type: "number"
              name: { en: "Index" }
            }
          ]
        else
          # Use existing contents
          contents = schema.getTable("responses:#{form._id}:roster:#{item.rosterId}").contents.slice()

        # Add contents
        for rosterItem in item.contents
          @addFormItem(form, rosterItem, contents)

        schema = schema.addTable({
          id: "responses:#{form._id}:roster:#{item.rosterId or item._id}"
          name: appendStr(appendStr(form.design.name, ": "), item.name)
          primaryKey: "_id"
          contents: contents
        })

    return schema

  # Adds a table which references master form data from master_responses table
  addMasterForm: (schema, form, cloneForms) ->
    contents = []

    # Add user
    contents.push({ id: "user", type: "text", name: { en: "Enumerator" } })

    # Add submitted on
    contents.push({ id: "submittedOn", type: "datetime", name: { en: "Submitted On" } })

    # Add deployment enum values
    deploymentValues = _.map(form.deployments, (dep) -> { id: dep._id, name: { en: dep.name } })

    # Add all deployments from clones
    if cloneForms
      for cloneForm in cloneForms
        deploymentValues = deploymentValues.concat(
          _.map(cloneForm.deployments, (dep) -> { id: dep._id, name: appendStr(cloneForm.design.name, " - " + dep.name) })
          )

    contents.push({ id: "deployment", type: "enum", name: { en: "Deployment" }, enumValues: deploymentValues })

    # Add questions of form
    @addFormItem(form, form.design, contents)

    # Transform to reference master_responses flattened structure where all is stored as keys of data field
    contents = mapTree(contents, (item) =>
      switch item.type
        when "text", "date", "datetime", "enum"
          return update(item, jsonql: { $set: { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, item.id ]} })
        when "number" 
          return update(item, jsonql: { $set: { type: "op", op: "convert_to_decimal", exprs: [ { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, item.id ]} ] }})
        when "boolean" 
          return update(item, jsonql: { $set: { type: "op", op: "::boolean", exprs: [ { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, item.id ]} ] }})
        when "geometry"
          return update(item, jsonql: { $set: { type: "op", op: "::geometry", exprs: [ { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, item.id ]} ] }})
        when "join"
          return update(item, join: { 
            fromColumn: { $set: { type: "op", op: "->>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, item.id ] } }
            toColumn: { $set: "_id" }
          })

        else
          # Direct access to underlying JSON type
          return update(item, jsonql: { $set: { type: "op", op: "->", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, item.id ]}})
    )

    schema = schema.addTable({
      id: "master_responses:#{form._id}"
      name: appendStr(form.design.name, " (Master)")
      primaryKey: "response"
      contents: contents
    })

    schema = @addIndicatorCalculations(schema, form, true)

  # Create a section in schema called Indicators with one subsection for each indicator calculated
  addIndicatorCalculations: (schema, form, isMaster) ->
    tableId = if isMaster then "master_responses:#{form._id}" else "responses:#{form._id}"

    # If not calculations, don't add indicators section
    if not form.indicatorCalculations or form.indicatorCalculations.length == 0
      return schema

    # Add indicator section
    indicatorsSection = {
      type: "section"
      name: { _base: "en", en: "Indicators" }
      contents: []
    }
    schema = schema.addTable(update(schema.getTable(tableId), { contents: { $push: [indicatorsSection] } }))

    # Process indicator calculations topologically since the order to add indicator calculations is not clear (#1 might reference #2)
    for indicatorCalculation in @orderIndicatorCalculation(form.indicatorCalculations)
      indicatorsSection = _.last(schema.getTable(tableId).contents)

      # Add to indicators section
      indicatorSectionContents = indicatorsSection.contents.slice()
      indicatorSectionContents.push(@createIndicatorCalculationSection(indicatorCalculation, schema, isMaster))

      # Update in original
      contents = schema.getTable(tableId).contents.slice()
      contents[contents.length - 1] = update(indicatorsSection, { contents: { $set: indicatorSectionContents } })

      # Re-add table
      schema = schema.addTable(update(schema.getTable(tableId), { contents: { $set: contents } }))

    return schema

  # Create a subsection of Indicators for an indicator calculation. Express in jsonql so that it can be computed direcly from the current response 
  # isMaster uses master_response as row to compute from
  createIndicatorCalculationSection: (indicatorCalculation, schema, isMaster) ->
    # Get indicator table
    indicTable = schema.getTable("indicator_values:#{indicatorCalculation.indicator}")

    # If not found, probably don't have permission
    if not indicTable
      return schema

    # Create compiler
    exprCompiler = new ExprCompiler(schema)

    # Map columns, replacing jsonql with compiled expression
    contents = _.compact(_.map(indicTable.contents, (item) ->
      return mapTree(item, (col) ->
        # Sections are passed through
        if col.type == "section"
          return col

        expression = indicatorCalculation.expressions[col.id]

        # If master, hack expression to be from master_responses, not responses
        if isMaster and expression
          expression = JSON.parse(JSON.stringify(expression).replace(/table":"responses:/g, "table\":\"master_responses:"))

        # Joins are special. Only handle "n-1" joins (which are from id fields in original indicator properties)
        if col.type == "join"
          if col.join.type != "n-1"
            return null

          # Compile to an jsonql of the id of the "to" table
          fromColumn = exprCompiler.compileExpr(expr: expression, tableAlias: "{alias}")

          # Create a join expression
          toColumn = schema.getTable(col.join.toTable).primaryKey

          col = update(col, { id: { $set: "indicator_calculation:#{indicatorCalculation._id}:#{col.id}" }, join: { 
            fromColumn: { $set: fromColumn }
            toColumn: { $set: toColumn }
            }})
          return col

        # Compile jsonql
        jsonql = exprCompiler.compileExpr(expr: expression, tableAlias: "{alias}")

        # jsonql null should be explicit so it doesn't just think there is no jsonql specified
        if not jsonql
          jsonql = { type: "literal", value: null }

        # Set jsonql and id
        col = update(col, { id: { $set: "indicator_calculation:#{indicatorCalculation._id}:#{col.id}" }, jsonql: { $set: jsonql }})
        return col
        )
      )
    )

    # Create section
    section = {
      type: "section"
      name: schema.getTable("indicator_values:#{indicatorCalculation.indicator}").name
      contents: contents
    }

    return section

  # Orders indicator calculations, since some can depend on others by using them in their expressions
  # e.g if A depends on B, then B is first and then A
  # Returns indicator calculations in order
  # Throws if circular
  orderIndicatorCalculation: (indicatorCalculations) ->
    toposort = new TopoSort()

    # No schema needed for this function
    exprUtils = new ExprUtils()

    # Check columns used in the calculations. Indicator calculation fields are in format
    #  indicator_calculation:<indicator calculation _id>:<column id>
    for ic in indicatorCalculations
      # Get fields referenced in all expressions and condition
      refedColumns = []
      for id, expr of ic.expressions
        refedColumns = _.union(refedColumns, exprUtils.getImmediateReferencedColumns(expr))

      refedColumns = _.union(refedColumns, exprUtils.getImmediateReferencedColumns(ic.condition))

      # Keep ones matching format
      refedIndicatorCalculationIds = []
      for col in refedColumns
        match = col.match(/^indicator_calculation:(.+?):.+$/)
        if match
          refedIndicatorCalculationIds = _.union(refedIndicatorCalculationIds, [match[1]])

      # Add to topo sort
      toposort.add(ic._id, refedIndicatorCalculationIds);

    # Get in reverse order (to build dependencies correctly)
    orderedIds = toposort.sort()
    orderedIds.reverse()

    map = _.indexBy(indicatorCalculations, "_id")
    return _.map(orderedIds, (id) -> map[id])

  addFormItem: (form, item, contents) ->
    addColumn = (column) =>
      contents.push(column)

    # Add sub-items
    if item.contents
      if item._type == "Form"
        for subitem in item.contents
          @addFormItem(form, subitem, contents)

      else if item._type in ["Section", "Group"]
        # Create section contents
        sectionContents = []
        for subitem in item.contents
          @addFormItem(form, subitem, sectionContents)
        contents.push({ type: "section", name: item.name, contents: sectionContents })

      else if item._type in ["RosterGroup", "RosterMatrix"]
        # Add join to roster table if original (no rosterId specified)
        if not item.rosterId
          contents.push({
            id: "data:#{item._id}"
            type: "join"
            name: item.name
            join: {
              type: "1-n"
              toTable: "responses:#{form._id}:roster:#{item._id}"
              fromColumn: "_id"
              toColumn: "response"
            }
          })

    else if formUtils.isQuestion(item)
      # Get type of answer
      answerType = formUtils.getAnswerType(item)

      # Get code
      code = item.exportId or item.code

      switch answerType
        when "text"
          # Get a simple text column
          column = {
            id: "data:#{item._id}:value"
            type: "text"
            name: item.text
            code: code
            jsonql: {
              type: "op"
              op: "#>>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value}"
              ]
            }
          }
          addColumn(column)

        when "number"
          # Get a decimal column always as integer can run out of room
          column = {
            id: "data:#{item._id}:value"
            type: "number"
            name: item.text
            code: code
            jsonql: {
              type: "op"
              op: "convert_to_decimal"
              exprs: [
                {
                  type: "op"
                  op: "#>>"
                  exprs: [
                    { type: "field", tableAlias: "{alias}", column: "data" }
                    "{#{item._id},value}"
                  ]
                }
              ]
            }
          }
          addColumn(column)

        when "choice"
          # Get a simple text column
          column = {
            id: "data:#{item._id}:value"
            type: "enum"
            name: item.text
            code: code
            enumValues: _.map(item.choices, (c) -> { id: c.id, name: c.label, code: c.code })
            jsonql: {
              type: "op"
              op: "#>>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value}"
              ]
            }
          }
          addColumn(column)

        when "choices"
          column = {
            id: "data:#{item._id}:value"
            type: "enumset"
            name: item.text
            code: code
            enumValues: _.map(item.choices, (c) -> { id: c.id, name: c.label, code: c.code })
            jsonql: {
              type: "op"
              op: "#>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value}"
              ]
            }
          }
          addColumn(column)

        when "date"
          # If date-time
          if item.format.match /ss|LLL|lll|m|h|H/
            # Fill in month and year and remove timestamp
            column = {
              id: "data:#{item._id}:value"
              type: "datetime"
              name: item.text
              code: code
              jsonql: {
                type: "op"
                op: "#>>"
                exprs: [
                  { type: "field", tableAlias: "{alias}", column: "data" }
                  "{#{item._id},value}"
                ]
              }
            }
            addColumn(column)
          else
            # Fill in month and year and remove timestamp
            column = {
              id: "data:#{item._id}:value"
              type: "date"
              name: item.text
              code: code
              # substr(rpad(data#>>'{questionid,value}',10, '-01-01'), 1, 10)
              jsonql: {
                type: "op"
                op: "substr"
                exprs: [
                  {
                    type: "op"
                    op: "rpad"
                    exprs:[
                      {
                        type: "op"
                        op: "#>>"
                        exprs: [
                          { type: "field", tableAlias: "{alias}", column: "data" }
                          "{#{item._id},value}"
                        ]
                      }
                      10
                      '-01-01'
                    ]
                  }
                  1
                  10
                ]
              }
            }
            addColumn(column)

        when "boolean"
          column = {
            id: "data:#{item._id}:value"
            type: "boolean"
            name: item.text
            code: code
            jsonql: {
              type: "op"
              op: "::boolean"
              exprs: [
                {
                  type: "op"
                  op: "#>>"
                  exprs: [
                    { type: "field", tableAlias: "{alias}", column: "data" }
                    "{#{item._id},value}"
                  ]
                }
              ]
            }
          }

          addColumn(column)

        when "units"
          # Get a decimal column as integer can run out of room
          name = appendStr(item.text, " (magnitude)")

          column = {
            id: "data:#{item._id}:value:quantity"
            type: "number"
            name: name
            code: if code then code + " (magnitude)"
            jsonql: {
              type: "op"
              op: "convert_to_decimal"
              exprs: [
                {
                  type: "op"
                  op: "#>>"
                  exprs: [
                    { type: "field", tableAlias: "{alias}", column: "data" }
                    "{#{item._id},value,quantity}"
                  ]
                }
              ]
            }
          }
          addColumn(column)

          column = {
            id: "data:#{item._id}:value:units"
            type: "enum"
            name: appendStr(item.text, " (units)")
            code: if code then code + " (units)"
            jsonql: {
              type: "op"
              op: "#>>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value,units}"
              ]
            }
            enumValues: _.map(item.units, (c) -> { id: c.id, name: c.label })
          }
          addColumn(column)

        when "location"
          column = {
            id: "data:#{item._id}:value"
            type: "geometry"
            name: item.text
            code: code
            # ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326)
            jsonql: {
              type: "op"
              op: "ST_SetSRID"
              exprs: [
                {
                  type: "op"
                  op: "ST_MakePoint"
                  exprs: [
                    {
                      type: "op"
                      op: "::decimal"
                      exprs: [
                        { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},value,longitude}"] }
                      ]
                    }
                    {
                      type: "op"
                      op: "::decimal"
                      exprs: [
                        { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},value,latitude}"] }
                      ]
                    }
                  ]
                }
                4326
              ]
            }
          }
          
          addColumn(column)

          column = {
            id: "data:#{item._id}:value:accuracy"
            type: "number"
            name: appendStr(item.text, " (accuracy)")
            code: if code then code + " (accuracy)"
            # data#>>'{questionid,value,accuracy}'::decimal
            jsonql: {
              type: "op"
              op: "::decimal"
              exprs: [
                { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},value,accuracy}"] }
              ]
            }
          }
          
          addColumn(column)

          column = {
            id: "data:#{item._id}:value:altitude"
            type: "number"
            name: appendStr(item.text, " (altitude)")
            code: if code then code + " (altitude)"
            # data#>>'{questionid,value,accuracy}'::decimal
            jsonql: {
              type: "op"
              op: "::decimal"
              exprs: [
                { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},value,altitude}"] }
              ]
            }
          }
          
          addColumn(column)

        when "site"
          # Legacy codes are stored under value directly, and newer ones under value: { code: "somecode" }
          codeExpr = {
            type: "op"
            op: "coalesce"
            exprs: [
              {
                type: "op"
                op: "#>>"
                exprs: [
                  { type: "field", tableAlias: "{alias}", column: "data" }
                  "{#{item._id},value,code}"
                ]
              }
              {
                type: "op"
                op: "#>>"
                exprs: [
                  { type: "field", tableAlias: "{alias}", column: "data" }
                  "{#{item._id},value}"
                ]
              }
            ]
          }

          column = {
            id: "data:#{item._id}:value"
            type: "join"
            name: item.text
            code: code
            join: {
              type: "n-1"
              toTable: if item.siteTypes then "entities." + _.first(item.siteTypes).toLowerCase().replace(/ /g, "_") else "entities.water_point"
              fromColumn: codeExpr
              toColumn: "code"
            }
          }

          addColumn(column)

        when "entity"
          column = {
            id: "data:#{item._id}:value"
            type: "join"
            name: item.text
            code: code
            join: {
              type: "n-1"
              toTable: "entities.#{item.entityType}"
              fromColumn: {
                type: "op"
                op: "#>>"
                exprs: [
                  { type: "field", tableAlias: "{alias}", column: "data" }
                  "{#{item._id},value}"
                ]
              }
              toColumn: "_id"
            }
          }

          addColumn(column)

        when "texts"
          # Get image
          column = {
            id: "data:#{item._id}:value"
            type: "text[]"
            name: item.text
            code: code
            jsonql: {
              type: "op"
              op: "#>>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value}"
              ]
            }
          }
          addColumn(column)

        when "image"
          # Get image
          column = {
            id: "data:#{item._id}:value"
            type: "image"
            name: item.text
            code: code
            jsonql: {
              type: "op"
              op: "#>>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value}"
              ]
            }
          }
          addColumn(column)

        when "images"
          # Get images
          column = {
            id: "data:#{item._id}:value"
            type: "imagelist"
            name: item.text
            code: code
            jsonql: {
              type: "op"
              op: "#>>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value}"
              ]
            }
          }
          addColumn(column)

        when "admin_region"
          # Add join to admin region
          column = {
            id: "data:#{item._id}:value"
            name: item.text
            code: code
            type: "join"
            join: {
              type: "n-1"
              toTable: "admin_regions"
              fromColumn: {
                type: "op"
                op: "#>>"
                exprs: [
                  { type: "field", tableAlias: "{alias}", column: "data" }
                  "{#{item._id},value}"
                ]
              }
              toColumn: "_id"
            }
          }
          addColumn(column)

        when "items_choices"
          # Create section
          section = {
            type: "section"
            name: item.name
            contents: []
          }

          # For each item
          for itemItem in item.items
            itemCode = if code and itemItem.code then code + " - " + itemItem.code
            section.contents.push({
              id: "data:#{item._id}:value:#{itemItem.id}"
              type: "enum"
              name: appendStr(appendStr(item.text, ": "), itemItem.label)
              code: itemCode
              enumValues: _.map(item.choices, (c) -> { id: c.id, name: c.label })
              jsonql: {
                type: "op"
                op: "#>>"
                exprs: [
                  { type: "field", tableAlias: "{alias}", column: "data" }
                  "{#{item._id},value,#{itemItem.id}}"
                ]
              }
           })
          addColumn(section)

        when "matrix"
          sections = []
          # For each item
          for itemItem in item.items
            # Create section
            section = {
              type: "section"
              name: itemItem.label
              contents: []
            }
            sections.push(section)

            # For each column
            for itemColumn in item.columns
              cellCode = if code and itemItem.code and itemColumn.code then code + " - " + itemItem.code + " - " + itemColumn.code

              # TextColumnQuestion
              if itemColumn._type == "TextColumnQuestion"
                section.contents.push({
                  id: "data:#{item._id}:value:#{itemItem.id}:#{itemColumn._id}:value"
                  type: "text"
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text)
                  code: cellCode
                  jsonql: {
                    type: "op"
                    op: "#>>"
                    exprs: [
                      { type: "field", tableAlias: "{alias}", column: "data" }
                      "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value}"
                    ]
                  }
               })

              # NumberColumnQuestion
              if itemColumn._type == "NumberColumnQuestion"
                section.contents.push({
                  id: "data:#{item._id}:value:#{itemItem.id}:#{itemColumn._id}:value"
                  type: "number"
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text)
                  code: cellCode
                  jsonql: {
                    type: "op"
                    op: "convert_to_decimal"
                    exprs: [{
                      type: "op"
                      op: "#>>"
                      exprs: [
                        { type: "field", tableAlias: "{alias}", column: "data" }
                        "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value}"
                      ]
                    }]
                  }
               })

              # CheckColumnQuestion
              if itemColumn._type == "CheckColumnQuestion"
                section.contents.push({
                  id: "data:#{item._id}:value:#{itemItem.id}:#{itemColumn._id}:value"
                  type: "boolean"
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text)
                  code: cellCode
                  jsonql: {
                    type: "op"
                    op: "::boolean"
                    exprs: [{
                      type: "op"
                      op: "#>>"
                      exprs: [
                        { type: "field", tableAlias: "{alias}", column: "data" }
                        "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value}"
                      ]
                    }]
                  }
               })

              # DropdownColumnQuestion
              if itemColumn._type == "DropdownColumnQuestion"
                section.contents.push({
                  id: "data:#{item._id}:value:#{itemItem.id}:#{itemColumn._id}:value"
                  type: "enum"
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text)
                  code: cellCode
                  enumValues: _.map(itemColumn.choices, (c) -> { id: c.id, name: c.label })
                  jsonql: {
                    type: "op"
                    op: "#>>"
                    exprs: [
                      { type: "field", tableAlias: "{alias}", column: "data" }
                      "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value}"
                    ]
                  }
               })

              # UnitsColumnQuestion
              if itemColumn._type == "UnitsColumnQuestion"
                section.contents.push({
                  id: "data:#{item._id}:value:#{itemItem.id}:#{itemColumn._id}:value:quantity"
                  type: "number"
                  name: appendStr(appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text), " (magnitude)")
                  code: if cellCode then cellCode + " (magnitude)"
                  jsonql: {
                    type: "op"
                    op: "convert_to_decimal"
                    exprs: [{
                      type: "op"
                      op: "#>>"
                      exprs: [
                        { type: "field", tableAlias: "{alias}", column: "data" }
                        "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value,quantity}"
                      ]
                    }]
                  }
                })

                section.contents.push({
                  id: "data:#{item._id}:value:#{itemItem.id}:#{itemColumn._id}:value:units"
                  type: "enum"
                  code: if cellCode then cellCode + " (units)"
                  name: appendStr(appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text), " (units)")
                  enumValues: _.map(itemColumn.units, (c) -> { id: c.id, name: c.label })
                  jsonql: {
                    type: "op"
                    op: "#>>"
                    exprs: [
                      { type: "field", tableAlias: "{alias}", column: "data" }
                      "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value,units}"
                    ]
                  }
               })

          # Create section for this question
          addColumn({
            type: "section"
            name: item.name
            contents: sections
            })


      # Add specify
      if answerType in ['choice', 'choices']
        for choice in item.choices
          if choice.specify
            column = {
              id: "data:#{item._id}:specify:#{choice.id}"
              type: "text"
              name: appendStr(appendStr(appendStr(item.text, " ("), choice.label), ")")
              code: if code then code + " (#{if choice.code then choice.code else formUtils.localizeString(choice.name)})"
              jsonql: {
                type: "op"
                op: "#>>"
                exprs: [
                  { type: "field", tableAlias: "{alias}", column: "data" }
                  "{#{item._id},specify,#{choice.id}}"
                ]
              }
            }
            addColumn(column)

      # Add comments
      if item.commentsField
        column = {
          id: "data:#{item._id}:comments"
          type: "text"
          name: appendStr(item.text, " (Comments)")
          code: if code then code + " (Comments)"
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},comments}"] }
        }

        addColumn(column)

      # Add timestamp
      if item.recordTimestamp
        column = {
          id: "data:#{item._id}:timestamp"
          type: "datetime"
          name: appendStr(item.text, " (Time Answered)")
          code: if code then code + " (Time Answered)"
          jsonql: { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},timestamp}"] }
        }

        addColumn(column)

      # Add GPS stamp
      if item.recordLocation
        column = {
          id: "data:#{item._id}:location"
          type: "geometry"
          name: appendStr(item.text, " (Location Answered)")
          code: if code then code + " (Location Answered)"
          # ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326)
          jsonql: {
            type: "op"
            op: "ST_SetSRID"
            exprs: [
              {
                type: "op"
                op: "ST_MakePoint"
                exprs: [
                  {
                    type: "op"
                    op: "::decimal"
                    exprs: [
                      { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},location,longitude}"] }
                    ]
                  }
                  {
                    type: "op"
                    op: "::decimal"
                    exprs: [
                      { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},location,latitude}"] }
                    ]
                  }
                ]
              }
              4326
            ]
          }
        }

        addColumn(column)

        column = {
          id: "data:#{item._id}:location:accuracy"
          type: "number"
          name: appendStr(item.text, " (Location Answered - accuracy)")
          code: if code then code + " (Location Answered - accuracy)"
          # data#>>'{questionid,location,accuracy}'::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},location,accuracy}"] }
            ]
          }
        }
        
        addColumn(column)

        column = {
          id: "data:#{item._id}:location:altitude"
          type: "number"
          name: appendStr(item.text, " (Location Answered - altitude)")
          code: if code then code + " (Location Answered - altitude)"
          # data#>>'{questionid,location,accuracy}'::decimal
          jsonql: {
            type: "op"
            op: "::decimal"
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},location,altitude}"] }
            ]
          }
        }
        
        addColumn(column)

      # Add n/a
      if item.alternates and item.alternates.na
        column = {
          id: "data:#{item._id}:na"
          type: "boolean"
          name: appendStr(item.text, " (Not Applicable)")
          code: if code then code + " (Not Applicable)"
          # data#>>'{questionid,alternate}' = 'na'
          jsonql: {
            type: "op"
            op: "="
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},alternate}"] }
              "na"
            ]
          }
        }
        
        addColumn(column)

      if item.alternates and item.alternates.dontknow
        column = {
          id: "data:#{item._id}:dontknow"
          type: "boolean"
          name: appendStr(item.text, " (Don't Know)")
          code: if code then code + " (Don't Know)"
          # data#>>'{questionid,alternate}' = 'dontknow'
          jsonql: {
            type: "op"
            op: "="
            exprs: [
              { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},alternate}"] }
              "dontknow"
            ]
          }
        }
        
        addColumn(column)

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

# Map a tree that consists of items with optional 'contents' array. null means to discard item
mapTree = (tree, func) ->
  if not tree
    return tree

  if _.isArray(tree)
    return _.map(tree, (item) -> mapTree(item, func))

  # Map item
  output = func(tree)

  # Map contents
  if tree.contents
    output.contents = _.compact(_.map(tree.contents, (item) -> func(item)))

  return output
