_ = require 'lodash'
formUtils = require './formUtils'

# Builds schema for entities. Always add entities before forms
module.exports = class EntitySchemaBuilder  
  # Pass in:
  #   entityTypes: list of entity types objects
  #   propFilter: optional filter function that takes a property and returns true to include, false to exclude
  #   regionTypes: optional region types to add to schema
  # Returns updated schema
  addEntities: (schema, entityTypes, propFilter, regionTypes) ->
    # Keep list of reverse join columns (one to many) to add later. table and column
    reverseJoins = []

    # For each entity type, finding reverse joins
    for entityType in entityTypes
      traverseTree entityType.properties, (prop) =>
        if propFilter and not propFilter(prop)
          return null

        if prop.type == "id" 
          if prop.idTable.match(/^entities\./)
            entityCode = prop.idTable.split(".")[1]

            # Check that exists
            if not _.findWhere(entityTypes, code: entityCode)
              return

            reverseJoins.push({
              table: prop.idTable
              column: {
                id: "!entities.#{entityType.code}.#{prop.id}"
                name: pluralize(entityType.name)
                deprecated: prop.deprecated or entityType.deprecated
                type: "join"
                join: {
                  type: "1-n"
                  toTable: "entities.#{entityType.code}"
                  inverse: prop.id
                  fromColumn: "_id"
                  toColumn: prop.id
                }
              }
            })

          if prop.idTable == "admin_regions" or prop.idTable.match(/^regions\./)
            # Check that table exists
            refTable = schema.getTable(prop.idTable)
            if not refTable or not refTable.ancestryTable
              return

            # Create reverse join that takes into account that regions are hierarchical
            reverseJoins.push({
              table: prop.idTable
              column: {
                id: "!entities.#{entityType.code}.#{prop.id}"
                name: entityType.name
                deprecated: prop.deprecated or entityType.deprecated
                type: "join"
                join: {
                  type: "1-n",
                  toTable: "entities.#{entityType.code}"
                  inverse: prop.id
                  jsonql: {
                    type: "op"
                    op: "exists"
                    exprs: [
                      {
                        type: "scalar"
                        expr: null
                        from: { type: "table", table: refTable.ancestryTable, alias: "subwithin" }
                        where: {
                          type: "op"
                          op: "and"
                          exprs: [
                            { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "subwithin", column: "ancestor" }, { type: "field", tableAlias: "{from}", column: refTable.primaryKey}] }
                            { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "subwithin", column: "descendant" }, { type: "field", tableAlias: "{to}", column: prop.id}] }
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            })

    # For each entity type
    for entityType in entityTypes
      # Get label column
      labelColumn = null

      # Add properties
      contents = mapTree(entityType.properties or [], (prop) =>
        if propFilter and not propFilter(prop)
          return null

        # Sections are untouched unless filtered
        if prop.type == "section"
          return prop

        # Use unique code as label
        if prop.uniqueCode
          labelColumn = prop.id

        prop = _.pick(prop, "id", "name", "code", "desc", "type", "idTable", "enumValues", "deprecated", "expr")

        # Pad date fields
        if prop.type == "date"
          # rpad(field ,10, '-01-01')
          prop.jsonql = {
            type: "op"
            op: "rpad"
            exprs:[
              {
                type: "field"
                tableAlias: "{alias}"
                column: prop.id
              }
              10
              '-01-01'
            ]
          }

        return prop
        )

      # Add custom regions right after admin_region if exists
      contents = mapTree(contents, (item) ->
        if item.id != "admin_region" or not regionTypes or regionTypes.length == 0
          return item

        section = { 
          type: "section"
          name: { _base: "en", en: "Custom Regions" },
          contents: []
        }

        for regionType in regionTypes
          section.contents.push({
            id: "#{regionType.code}_region"
            type: "join"
            name: regionType.link_name
            desc: regionType.desc
            join: {
              type: "n-1"
              toTable: "regions.#{regionType.code}"
              fromColumn: {
                type: "scalar"
                expr: { type: "field", tableAlias: "entity_regions", column: "region_id" }
                from: { type: "table", table: "entity_regions", alias: "entity_regions" }
                where: {
                  type: "op"
                  op: "and"
                  exprs: [
                    { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "entity_regions", column: "entity_type"}, { type: "literal", value: entityType.code }]}
                    { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "entity_regions", column: "entity_id"}, { type: "field", tableAlias: "{alias}", column: "_id" }]}
                    { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "entity_regions", column: "region_type"}, { type: "literal", value: regionType.code }]}
                  ]
                },
                limit: 1
              }
              toColumn: "_id"
            }
          })

        return [item, section]
      )


      # Add extra columns
      contents.push({
        id: "_managed_by"
        name: { en: "Managed By" }
        desc: { en: "User or group that manages the data for this #{formUtils.localizeString(entityType.name)}"}
        type: "id"
        idTable: "subjects"
      })

      contents.push({
        id: "_created_by"
        name: { en: "Added by user" }
        desc: { en: "User that added this #{formUtils.localizeString(entityType.name)} to the database" }
        type: "id"
        idTable: "users"
      })

      contents.push({
        id: "_created_on"
        name: { en: "Date added" }
        desc: { en: "Date that this #{formUtils.localizeString(entityType.name)} was added to the database" }
        type: "datetime"
      })

      contents.push({
        id: "_modified_by"
        name: { en: "Last modified by user" }
        desc: { en: "User that modified this #{formUtils.localizeString(entityType.name)} last" }
        type: "id"
        idTable: "users"
      })

      contents.push({
        id: "_modified_on"
        name: { en: "Date last modified" }
        desc: { en: "Date that this #{formUtils.localizeString(entityType.name)} was last modified" }
        type: "datetime"
      })

      # Add _roles but as hidden
      contents.push({
        id: "_roles",
        name: { en: "Roles" },
        type: "json",
        deprecated: true
      })

      contents.push({
        id: "_merged_entities"
        name: { en: "Previous mWater IDs"}
        desc: { en: "IDs of other #{formUtils.localizeString(entityType.name)} that were merged into this" }
        type: 'text[]'
      })

      # This gets overridden in the schema map
      contents.push({
        id: "_pending_approvals"
        name: { en: "Pending Approvals"}
        desc: { en: "True if there are approvals pending for this site" }
        type: 'boolean'
      })

      # Add datasets
      contents.push({
        id: "!datasets"
        name: { en: "Datasets" }
        desc: { en: "Datasets that this #{formUtils.localizeString(entityType.name)} is a part of" }
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

      # Add related forms placeholder section
      contents.push({
        type: "section"
        id: "!related_forms"
        name: { en: "Related Surveys" }
        desc: { en: "Surveys that are linked by a question to #{formUtils.localizeString(entityType.name)}" }
        contents: []
      })

      # Add related indicators placeholder section
      contents.push({
        type: "section"
        id: "!indicators" # Special section name
        name: { en: "Related Indicators" }
        desc: { en: "Indicators are standardized information that are related to this site" }
        contents: []
      })

      tableId = "entities.#{entityType.code}"

      table = { 
        id: tableId
        name: entityType.name
        desc: entityType.desc
        primaryKey: "_id"
        label: labelColumn
        contents: contents
        deprecated: entityType.deprecated
      }

      # Legacy only
      if entityType.code == "water_point_functionality_report"
        table.ordering = "date"

      # Create table
      schema = schema.addTable(table)

    # Add reverse joins, putting them in "!related_entities" section
    for rjTable, rjs of _.groupBy(reverseJoins, "table")
      table = schema.getTable(rjTable)
      table.contents = table.contents.slice()
      linksSection = _.findWhere(table.contents, { id: "!related_entities", type: "section" })
      if not linksSection
        linksSection = { 
          id: "!related_entities", 
          type: "section", 
          name: { _base: "en", en: "Related Entities" }, 
          contents: [] 
        }
        table.contents.push(linksSection)

      linksSection.contents = linksSection.contents.concat(_.pluck(rjs, "column"))
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

# Map a tree that consists of items with optional 'contents' array. null means to discard item
mapTree = (tree, func) ->
  if not tree
    return tree

  return _.compact(_.flatten(_.map(tree, (item) ->
    newItem = func(item)
    if newItem and item.contents
      newItem = _.extend({}, newItem, { contents: mapTree(item.contents, func) })
    return newItem
  )))

# Traverse a tree, calling func for each item
traverseTree = (tree, func) ->
  if not tree
    return

  for item in tree
    func(item)
    if item.contents
      traverseTree(item.contents, func)


# Make a plural form (in English)
pluralize = (lstr) ->
  str = lstr.en
  if not str
    return lstr

  # Water doesn't pluralize
  if str.match(/ater$/)
    pstr = str
  else if str.match(/s$/)
    pstr = str + "es"
  else if str.match(/y$/)
    pstr = str.substr(0, str.length - 1) + "ies"
  else
    pstr = str + "s"
  
  return _.extend({}, lstr, en: pstr)