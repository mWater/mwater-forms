_ = require 'lodash'
formUtils = require '../src/formUtils'
ExprUtils = require('mwater-expressions').ExprUtils
ExprCompiler = require('mwater-expressions').ExprCompiler
update = require 'update-object'
ColumnNotFoundException = require('mwater-expressions').ColumnNotFoundException
TopoSort = require 'topo-sort'

ConditionsExprCompiler = require './ConditionsExprCompiler'

healthRiskEnum = require('./answers/aquagenxCBTUtils').healthRiskEnum

# Adds a form to a mwater-expressions schema
module.exports = class FormSchemaBuilder
  # Pass clone forms if a master form
  addForm: (schema, form, cloneForms) ->
    contents = []
    
    metadata = []

    # Get deployments
    deploymentValues = _.map(form.deployments, (dep) -> { id: dep._id, name: { en: dep.name } })
    metadata.push({ id: "deployment", type: "enum", name: { en: "Deployment" }, enumValues: deploymentValues })

    # Add user
    metadata.push({ 
      id: "user"
      name: { en: "Enumerator" } 
      type: "join"
      join: {
        type: "n-1"
        toTable: "users"
        fromColumn: "user"
        toColumn: "_id"
      }
    })

    # Add status
    metadata.push({ id: "status", type: "enum", name: { en: "Status" }, enumValues: [
      { id: "draft", name: { en: "Draft" } }
      { id: "pending", name: { en: "Pending" } }
      { id: "final", name: { en: "Final" } }
      { id: "rejected", name: { en: "Rejected" } }
    ]})

    # Add code
    metadata.push({ id: "code", type: "text", name: { en: "Response Code" } })

    # Add startedOn
    metadata.push({ id: "startedOn", type: "datetime", name: { en: "Drafted On" } })

    # Add submitted on
    metadata.push({ id: "submittedOn", type: "datetime", name: { en: "Submitted On" } })
    
    # Add IpAddress
    metadata.push({ id: "ipAddress", type: "text", name: { en: "IP Address" } })

    contents.push({ id: "metadata", type: "section", name: { en: "Response Metadata"}, desc: { en: "Information about the response such as status, date, and IP Address" }, contents: metadata })

    conditionsExprCompiler = new ConditionsExprCompiler(form.design)

    # List of joins in format: { table: destination table, column: join column to add }
    reverseJoins = []
    @addFormItem(form.design, contents, "responses:#{form._id}", conditionsExprCompiler, null, reverseJoins)

    # Add to schema
    schema = schema.addTable({
      id: "responses:#{form._id}"
      name: form.design.name
      primaryKey: "_id"
      contents: contents
      ordering: "submittedOn"
    })

    # Add reverse joins from entity and site questions
    schema = @addReverseJoins(schema, form, reverseJoins)

    # Add any roster tables
    schema = @addRosterTables(schema, form, conditionsExprCompiler)

    schema = @addCalculations(schema, form)

    schema = @addIndicatorCalculations(schema, form, false)

    if form.isMaster
      schema = @addMasterForm(schema, form, cloneForms)

    # Create table
    return schema
 
  # Add joins back from entities to site and entity questions
  # reverseJoins: list of joins in format: { table: destination table, column: join column to add }
  # Adds to section with id "!related_forms" with name "Related Forms"
  addReverseJoins: (schema, form, reverseJoins) ->
    for reverseJoin in reverseJoins
      # Prefix form name, since it was not available when join was created
      column = _.clone(reverseJoin.column)
      column.name = appendStr(appendStr(form.design.name, ": "), column.name)

      # Add to entities table if it exists
      if schema.getTable(reverseJoin.table)
        table = schema.getTable(reverseJoin.table)

        # Create related forms section
        sectionIndex = _.findIndex(table.contents, (item) -> item.id == "!related_forms")
        if sectionIndex < 0
          # Add section (this should already be added in for all entities. Add to be safe)
          section = {
            type: "section"
            id: "!related_forms"
            name: { en: "Related Surveys" }
            desc: { en: "Surveys that are linked by a question to #{table.name.en}" }
            contents: []
          }
          table = update(table, { contents: { $push: [section] }})
          sectionIndex = _.findIndex(table.contents, (item) -> item.id == "!related_forms")

        # Add join
        section = update(table.contents[sectionIndex], { contents: { $push: [column] } })
        table = update(table, { contents: { $splice: [[sectionIndex, 1, section]] }})

        # Replace table
        schema = schema.addTable(table)

    return schema

  addRosterTables: (schema, form, conditionsExprCompiler) ->
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
          @addFormItem(rosterItem, contents, "responses:#{form._id}:roster:#{item.rosterId or item._id}", conditionsExprCompiler)

        schema = schema.addTable({
          id: "responses:#{form._id}:roster:#{item.rosterId or item._id}"
          name: appendStr(appendStr(form.design.name, ": "), item.name)
          primaryKey: "_id"
          ordering: "index"
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
    @addFormItem(form.design, contents, "responses:#{form._id}")

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
    # If not calculations, don't add indicators section
    if not form.indicatorCalculations or form.indicatorCalculations.length == 0
      return schema

    # Process indicator calculations 
    for indicatorCalculation in form.indicatorCalculations
      tableId = if isMaster then "master_responses:#{form._id}" else "responses:#{form._id}"

      if indicatorCalculation.roster
        tableId += ":roster:#{indicatorCalculation.roster}"

      # Add indicator section
      indicatorsSection = _.last(schema.getTable(tableId).contents)
      if indicatorsSection.id != "indicators"
        # Add indicator section
        indicatorsSection = {
          id: "indicators"
          type: "section"
          name: { _base: "en", en: "Indicators" }
          contents: []
        }
        schema = schema.addTable(update(schema.getTable(tableId), { contents: { $push: [indicatorsSection] } }))

      # Add to indicators section
      indicatorSectionContents = indicatorsSection.contents.slice()
      indicatorCalculationSection = @createIndicatorCalculationSection(indicatorCalculation, schema, isMaster)
      if indicatorCalculationSection
        indicatorSectionContents.push(indicatorCalculationSection)

      # Update in original
      contents = schema.getTable(tableId).contents.slice()
      contents[contents.length - 1] = update(indicatorsSection, { contents: { $set: indicatorSectionContents } })

      # Re-add table
      schema = schema.addTable(update(schema.getTable(tableId), { contents: { $set: contents } }))

    return schema

  # Create a subsection of Indicators for an indicator calculation.
  # isMaster uses master_response as row to compute from
  createIndicatorCalculationSection: (indicatorCalculation, schema, isMaster) ->
    # Get indicator table
    indicTable = schema.getTable("indicator_values:#{indicatorCalculation.indicator}")

    # If not found, probably don't have permission
    if not indicTable
      return null

    # Create compiler
    exprCompiler = new ExprCompiler(schema)

    # Map columns, replacing jsonql with compiled expression
    contents = _.compact(_.map(indicTable.contents, (item) ->
      return mapTree(item, (col) ->
        # Sections are passed through
        if col.type == "section"
          return col

        expression = indicatorCalculation.expressions[col.id]
        condition = indicatorCalculation.condition

        # If master, hack expression to be from master_responses, not responses
        if isMaster and expression
          expression = JSON.parse(JSON.stringify(expression).replace(/table":"responses:/g, "table\":\"master_responses:"))

        # If master, hack condition to be from master_responses, not responses
        if isMaster and condition
          condition = JSON.parse(JSON.stringify(condition).replace(/table":"responses:/g, "table\":\"master_responses:"))

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

        # If no expression, jsonql null should be explicit so it doesn't just think there is no jsonql specified
        if not expression
          jsonql = { type: "literal", value: null }
          col = update(col, { id: { $set: "indicator_calculation:#{indicatorCalculation._id}:#{col.id}" }, jsonql: { $set: jsonql }})
          return col

        # Add condition if present
        if condition
          # Wrap in case statement
          expression = {
            type: "case"
            table: expression.table
            cases: [
              when: condition
              then: expression
            ]
          }

        # Set expr, type and id, clearing jsonql
        col = _.omit(update(col, { id: { $set: "indicator_calculation:#{indicatorCalculation._id}:#{col.id}" }, expr: { $set: expression }, type: { $set: "expr" } }), "jsonql")
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

  # Adds a form item. existingConditionExpr is any conditions that already condition visibility of the form item. This does not cross roster boundaries.
  # That is, if a roster is entirely invisible, roster items will not be conditioned on the overall visibility, as they simply won't exist
  # reverseJoins: list of reverse joins to add to. In format: { table: destination table, column: join column to add }. This list will be mutated. Pass in empty list in general.
  addFormItem: (item, contents, tableId, conditionsExprCompiler, existingConditionExpr, reverseJoins = []) ->
    addColumn = (column) =>
      contents.push(column)

    # Add sub-items
    if item.contents
      if item._type == "Form"
        for subitem in item.contents
          @addFormItem(subitem, contents, tableId, conditionsExprCompiler, existingConditionExpr, reverseJoins)

      else if item._type in ["Section", "Group"]
        # Create section contents
        sectionContents = []
        if conditionsExprCompiler 
          sectionConditionExpr = ExprUtils.andExprs(existingConditionExpr, conditionsExprCompiler.compileConditions(item.conditions, tableId))
        else
          sectionConditionExpr = existingConditionExpr
          
        for subitem in item.contents
          # TODO add conditions of section/group
          @addFormItem(subitem, sectionContents, tableId, conditionsExprCompiler, sectionConditionExpr, reverseJoins)
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
              toTable: "#{tableId}:roster:#{item._id}"
              fromColumn: "_id"
              toColumn: "response"
            }
          })

    else if formUtils.isQuestion(item)
      # Get type of answer
      answerType = formUtils.getAnswerType(item)

      # Get code
      code = item.exportId or item.code
      sensitive = item.sensitive or false

      switch answerType
        when "text"
          # Get a simple text column. Null if empty
          column = {
            id: "data:#{item._id}:value"
            type: "text"
            name: item.text
            code: code
            sensitive: sensitive
            jsonql: {
              type: "op"
              op: "nullif"
              exprs: [
                {
                  type: "op"
                  op: "#>>"
                  exprs: [
                    { type: "field", tableAlias: "{alias}", column: "data" }
                    "{#{item._id},value}"
                  ]
                }
                ""
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
            sensitive: sensitive
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
            sensitive: sensitive
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
          # Null if empty for simplicity
          column = {
            id: "data:#{item._id}:value"
            type: "enumset"
            name: item.text
            code: code
            sensitive: sensitive
            enumValues: _.map(item.choices, (c) -> { id: c.id, name: c.label, code: c.code })
            jsonql: {
              type: "op"
              op: "nullif"
              exprs: [
                {
                  type: "op"
                  op: "#>"
                  exprs: [
                    { type: "field", tableAlias: "{alias}", column: "data" }
                    "{#{item._id},value}"
                  ]
                }
                { type: "op", op: "::jsonb", exprs: ["[]"] }
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
              sensitive: sensitive
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
              sensitive: sensitive
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
            sensitive: sensitive
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
            sensitive: sensitive
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
            sensitive: sensitive
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

        when "aquagenx_cbt"
          # Create section
          section = {
            type: "section"
            name: item.text
            contents: []
          }

          section.contents.push({
            id: "data:#{item._id}:value:cbt:mpn"
            type: "number"
            name: appendStr(item.text, " (MPN/100ml)")
            code: if code then code + " (mpn)"
            sensitive: sensitive
            jsonql: {
              type: "op"
              op: "::decimal"
              exprs: [
                {
                  type: "op"
                  op: "#>>"
                  exprs: [
                    { type: "field", tableAlias: "{alias}", column: "data" }
                    "{#{item._id},value,cbt,mpn}"
                  ]
                }
              ]
            }
          })

          section.contents.push({
            id: "data:#{item._id}:value:cbt:confidence"
            type: "number"
            name: appendStr(item.text, " (Upper 95% Confidence Interval/100ml)")
            code: if code then code + " (confidence)"
            sensitive: sensitive
            jsonql: {
              type: "op"
              op: "::decimal"
              exprs: [
                {
                  type: "op"
                  op: "#>>"
                  exprs: [
                    { type: "field", tableAlias: "{alias}", column: "data" }
                    "{#{item._id},value,cbt,confidence}"
                  ]
                }
              ]
            }
          })

          section.contents.push({
            id: "data:#{item._id}:value:cbt:healthRisk"
            type: "enum"
            enumValues: healthRiskEnum
            name: appendStr(item.text, " (Health Risk Category)")
            code: if code then code + " (health_risk)"
            sensitive: sensitive
            jsonql: {
              type: "op"
              op: "#>>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value,cbt,healthRisk}"
              ]
            }
          })

          # Get image
          section.contents.push({
            id: "data:#{item._id}:value:image"
            type: "image"
            name: appendStr(item.text, " (image)")
            code: if code then code + " (image)"
            sensitive: sensitive
            jsonql: {
              type: "op"
              op: "#>"
              exprs: [
                { type: "field", tableAlias: "{alias}", column: "data" }
                "{#{item._id},value,image}"
              ]
            }
          })

          addCxColumn = (label, v) ->
            section.contents.push({
              id: "data:#{item._id}:value:cbt:#{v}"
              type: "boolean"
              name: appendStr(item.text, " (#{label})")
              code: if code then code + " (#{v})"
              sensitive: sensitive
              jsonql: {
                type: "op"
                op: "::boolean"
                exprs: [
                  {
                    type: "op"
                    op: "#>>"
                    exprs: [
                      { type: "field", tableAlias: "{alias}", column: "data" }
                      "{#{item._id},value,cbt,#{v}}"
                    ]
                  }
                ]
              }
            })

          addCxColumn('Compartment 1', 'c1')
          addCxColumn('Compartment 2', 'c2')
          addCxColumn('Compartment 3', 'c3')
          addCxColumn('Compartment 4', 'c4')
          addCxColumn('Compartment 5', 'c5')

          addColumn(section)

        when "location"
          column = {
            id: "data:#{item._id}:value"
            type: "geometry"
            name: item.text
            code: code
            sensitive: sensitive
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

          # Add admin region
          if item.calculateAdminRegion
            # ST_Transform(ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326), 3857)
            webmercatorLocation = {
              type: "op"
              op: "ST_Transform"
              exprs: [
                {
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
                            { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{from}", column: "data" }, "{#{item._id},value,longitude}"] }
                          ]
                        }
                        {
                          type: "op"
                          op: "::decimal"
                          exprs: [
                            { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{from}", column: "data" }, "{#{item._id},value,latitude}"] }
                          ]
                        }
                      ]
                    }
                    4326
                  ]
                }
                3857
              ]
            }

            column = {
              id: "data:#{item._id}:value:admin_region"
              type: "join"
              name: appendStr(item.text, " (administrative region)")
              code: if code then code + " (administrative region)"
              sensitive: sensitive
              join: {
                type: "n-1"
                toTable: "admin_regions"
                jsonql: {
                  type: "op"
                  op: "and"
                  exprs: [
                    # Make sure leaf node
                    { type: "field", tableAlias: "{to}", column: "leaf" }
                    { type: "op", op: "&&", exprs: [
                      webmercatorLocation
                      { type: "field", tableAlias: "{to}", column: "shape" }
                    ]}
                    { type: "op", op: "ST_Intersects", exprs: [
                      webmercatorLocation
                      { type: "field", tableAlias: "{to}", column: "shape" }
                    ]}
                  ]
                }
              }
            }

            addColumn(column)

          column = {
            id: "data:#{item._id}:value:accuracy"
            type: "number"
            name: appendStr(item.text, " (accuracy)")
            code: if code then code + " (accuracy)"
            sensitive: sensitive
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
            sensitive: sensitive
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
          # { code: "somecode" }
          codeExpr = {
            type: "op"
            op: "#>>"
            exprs: [
              { type: "field", tableAlias: "{alias}", column: "data" }
              "{#{item._id},value,code}"
            ]
          }

          entityType = if item.siteTypes?[0] then _.first(item.siteTypes).toLowerCase().replace(new RegExp(' ', 'g'), "_") else "water_point"

          column = {
            id: "data:#{item._id}:value"
            type: "join"
            name: item.text
            code: code
            sensitive: sensitive
            join: {
              type: "n-1"
              toTable: "entities.#{entityType}"
              fromColumn: codeExpr
              toColumn: "code"
            }
          }

          addColumn(column)

          # Add reverse join if directly from responses table
          if tableId.match(/^responses:[^:]+$/)
            formId = tableId.split(":")[1]

            # Use {to}._id in (select response from response_entities where question = 'site1' and "entityType" = 'water_point' and property = 'code' and value = {from}."code"))
            # for indexed speed
            jsonql = {
              type: "op"
              op: "in"
              exprs: [
                { type: "field", tableAlias: "{to}", column: "_id" }
                {
                  type: "scalar"
                  expr: { type: "field", tableAlias: "response_entities", column: "response" }
                  from: { type: "table", table: "response_entities", alias: "response_entities" }
                  where: {
                    type: "op"
                    op: "and"
                    exprs: [
                      { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "question" }, item._id] }
                      { type: "op", op: "is null", exprs: [{ type: "field", tableAlias: "response_entities", column: "roster" }] }
                      { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "entityType" }, entityType] }
                      { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "property" }, "code"] }
                      { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "value" }, { type: "field", tableAlias: "{from}", column: "code" }] }
                    ]
                  }
                }
              ]
            }

            reverseJoin = {
              table: "entities.#{entityType}"
              column: {
                id: "#{tableId}:data:#{item._id}:value"
                # Form name is not available here. Prefix later.
                name: item.text
                type: "join"
                join: {
                  type: "1-n"
                  toTable: tableId
                  jsonql: jsonql
                }
              }
            }
            reverseJoins.push(reverseJoin)


        when "entity"
          # Do not add if no entity type
          if item.entityType
            column = {
              id: "data:#{item._id}:value"
              type: "join"
              name: item.text
              code: code
              sensitive: sensitive
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

            # Add reverse join if directly from responses table
            if tableId.match(/^responses:[^:]+$/)
              formId = tableId.split(":")[1]

              # Use {to}._id in (select response from response_entities where question = 'site1' and "entityType" = 'water_point' and property = '_id' and value = {from}."_id"))
              # for indexed speed
              jsonql = {
                type: "op"
                op: "in"
                exprs: [
                  { type: "field", tableAlias: "{to}", column: "_id" }
                  {
                    type: "scalar"
                    expr: { type: "field", tableAlias: "response_entities", column: "response" }
                    from: { type: "table", table: "response_entities", alias: "response_entities" }
                    where: {
                      type: "op"
                      op: "and"
                      exprs: [
                        { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "question" }, item._id] }
                        { type: "op", op: "is null", exprs: [{ type: "field", tableAlias: "response_entities", column: "roster" }] }
                        { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "entityType" }, item.entityType] }
                        { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "property" }, "_id"] }
                        { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "response_entities", column: "value" }, { type: "field", tableAlias: "{from}", column: "_id" }] }
                      ]
                    }
                  }
                ]
              }

              reverseJoin = {
                table: "entities.#{item.entityType}"
                column: {
                  id: "#{tableId}:data:#{item._id}:value"
                  # Form name is not available here. Prefix later.
                  name: item.text
                  type: "join"
                  join: {
                    type: "1-n"
                    toTable: tableId
                    jsonql: jsonql
                  }
                }
              }
              reverseJoins.push(reverseJoin)

        when "texts"
          # Get image
          column = {
            id: "data:#{item._id}:value"
            type: "text[]"
            name: item.text
            code: code
            sensitive: sensitive
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
            sensitive: sensitive
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

        when "images"
          # Get images
          column = {
            id: "data:#{item._id}:value"
            type: "imagelist"
            name: item.text
            code: code
            sensitive: sensitive
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

        when "admin_region"
          # Add join to admin region
          column = {
            id: "data:#{item._id}:value"
            name: item.text
            code: code
            sensitive: sensitive
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
            name: item.text
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
              sensitive: sensitive
              enumValues: _.map(item.choices, (c) -> { id: c.id, name: c.label, code: c.code })
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
                    op: "nullif"
                    exprs: [
                      {
                        type: "op"
                        op: "#>>"
                        exprs: [
                          { type: "field", tableAlias: "{alias}", column: "data" }
                          "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value}"
                        ]
                      }
                      ""
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
                  enumValues: _.map(itemColumn.choices, (c) -> { id: c.id, code: c.code, name: c.label })
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
                  enumValues: _.map(itemColumn.units, (c) -> { id: c.id, code: c.code, name: c.label })
                  jsonql: {
                    type: "op"
                    op: "#>>"
                    exprs: [
                      { type: "field", tableAlias: "{alias}", column: "data" }
                      "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value,units}"
                    ]
                  }
               })

              # SiteColumnQuestion
              if itemColumn._type == "SiteColumnQuestion"
                section.contents.push({
                  id: "data:#{item._id}:value:#{itemItem.id}:#{itemColumn._id}:value"
                  type: "join"
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text)
                  code: cellCode
                  join: {
                    type: "n-1"
                    toTable: "entities." + itemColumn.siteType
                    fromColumn: { 
                      type: "op"
                      op: "#>>"
                      exprs: [
                        { type: "field", tableAlias: "{alias}", column: "data" }
                        "{#{item._id},value,#{itemItem.id},#{itemColumn._id},value,code}"
                      ]
                    }
                    toColumn: "code"
                  }
               })

          # Create section for this question
          addColumn({
            type: "section"
            name: item.text
            contents: sections
            sensitive: sensitive
            })

      # Add specify
      if answerType in ['choice', 'choices']
        for choice in item.choices
          if choice.specify
            column = {
              id: "data:#{item._id}:specify:#{choice.id}"
              type: "text"
              name: appendStr(appendStr(appendStr(item.text, " ("), choice.label), ") - specify")
              code: if code then code + " (#{if choice.code then choice.code else formUtils.localizeString(choice.label)})" + " - specify"
              sensitive: sensitive
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
          sensitive: sensitive
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
          sensitive: sensitive
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
          sensitive: sensitive
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
          sensitive: sensitive
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
          sensitive: sensitive
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
          sensitive: sensitive
          # nullif(data#>>'{questionid,alternate}' = 'na', false) (makes null if false)
          jsonql: {
            type: "op"
            op: "nullif"
            exprs: [
              {
                type: "op"
                op: "="
                exprs: [
                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},alternate}"] }
                  "na"
                ]
              }
              false
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
          sensitive: sensitive
          # nullif(data#>>'{questionid,alternate}' = 'dontknow', false) (makes null if false)
          jsonql: {
            type: "op"
            op: "nullif"
            exprs: [
              {
                type: "op"
                op: "="
                exprs: [
                  { type: "op", op: "#>>", exprs: [{ type: "field", tableAlias: "{alias}", column: "data" }, "{#{item._id},alternate}"] }
                  "dontknow"
                ]
              }
              false
            ]
          }
        }
        
        addColumn(column)

      # Add conditions
      if conditionsExprCompiler and ((item.conditions and item.conditions.length > 0) or existingConditionExpr)
        # Guard against null
        conditionExpr = ExprUtils.andExprs(existingConditionExpr, conditionsExprCompiler.compileConditions(item.conditions, tableId))
        if conditionExpr
          conditionExpr = {
            type: "op"
            op: "and"
            table: tableId
            exprs: [
              { type: "op", table: tableId, op: "is not null", exprs: [conditionExpr] }
              conditionExpr
            ]
          }

          column = {
            id: "data:#{item._id}:visible"
            type: "expr"
            name: appendStr(item.text, " (Asked)")
            code: if code then code + " (Asked)"
            expr: conditionExpr
            sensitive: sensitive
          }
          
          addColumn(column)

  addCalculations: (schema, form) ->
    # If not calculations, don't add  section
    if not form.design.calculations or form.design.calculations.length == 0
      return schema

    # Process indicator calculations 
    for calculation in form.design.calculations
      tableId = "responses:#{form._id}"

      if calculation.roster
        tableId += ":roster:#{calculation.roster}"

      # Add calculations section
      calculationsSection = _.last(schema.getTable(tableId).contents)
      if calculationsSection.id != "calculations"
        # Add calculations section
        calculationsSection = {
          id: "calculations"
          type: "section"
          name: { _base: "en", en: "Calculations" }
          contents: []
        }
        schema = schema.addTable(update(schema.getTable(tableId), { contents: { $push: [calculationsSection] } }))

      # Add to calculations section
      calculationsSectionContents = calculationsSection.contents.slice()
      calculationsSectionContents.push({
        id: "calculation:#{calculation._id}"
        type: "expr"
        name: calculation.name
        desc: calculation.desc
        expr: calculation.expr
      })

      # Update in original
      contents = schema.getTable(tableId).contents.slice()
      contents[contents.length - 1] = update(calculationsSection, { contents: { $set: calculationsSectionContents } })

      # Re-add table
      schema = schema.addTable(update(schema.getTable(tableId), { contents: { $set: contents } }))

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
