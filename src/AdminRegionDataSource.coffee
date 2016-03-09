$ = require 'jquery'

# Gets the admin region information from an mWater server. Here as a convenience for creating the form context
module.exports = class AdminRegionDataSource 
  constructor: (apiUrl) ->
    @apiUrl = apiUrl

  getAdminRegionPath: (id, callback) =>
    # select _id as id, level as level, name as name, type as type from admin_regions as ar inner join admin_region_subtrees as ars on ar._id = ars.ancestor
    # where ars.descendant = THE_ID order by ar.level
    query = {
      type: "query"
      selects: [
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "_id" }, alias: "id" }
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "level" }, alias: "level" }
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "name" }, alias: "name" }
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "type" }, alias: "type" }
      ]
      from: {
        type: "join"
        kind: "inner"
        left: { type: "table", table: "admin_regions", alias: "ar" }
        right: { type: "table", table: "admin_region_subtrees", alias: "ars" }
        on: {
          type: "op"
          op: "="
          exprs: [
            { type: "field", tableAlias: "ar", column: "_id" }
            { type: "field", tableAlias: "ars", column: "ancestor" }
          ]
        }
      }
      where: {
        type: "op"
        op: "="
        exprs: [
          { type: "field", tableAlias: "ars", column: "descendant" }
          id
        ]
      }
      orderBy: [
        { ordinal: 2, direction: "asc" }
      ]
    }

    @_executeQuery(query, callback)

  getSubAdminRegions: (id, level, callback) =>
    # select _id as id, level as level, name as name, type as type from admin_regions as ar inner join admin_region_subtrees as ars on ar._id = ars.descendant
    # where ars.ancestor = ID and ar.level = LEVEL order by ar.name
    query = {
      type: "query"
      selects: [
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "_id" }, alias: "id" }
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "level" }, alias: "level" }
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "name" }, alias: "name" }
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "type" }, alias: "type" }
      ]
      from: {
        type: "join"
        kind: "inner"
        left: { type: "table", table: "admin_regions", alias: "ar" }
        right: { type: "table", table: "admin_region_subtrees", alias: "ars" }
        on: {
          type: "op"
          op: "="
          exprs: [
            { type: "field", tableAlias: "ar", column: "_id" }
            { type: "field", tableAlias: "ars", column: "descendant" }
          ]
        }
      }
      where: {
        type: "op"
        op: "and"
        exprs: [
          {
            type: "op"
            op: "="
            exprs: [
              { type: "field", tableAlias: "ar", column: "level" }
              level
            ]
          }
        ]
      }
      orderBy: [
        { ordinal: 3, direction: "asc" }
      ]
    }

    # Filter by ancestor if specified
    if id
      query.where.exprs.push({
        type: "op"
        op: "="
        exprs: [
          { type: "field", tableAlias: "ars", column: "ancestor" }
          id
        ]
      })


    @_executeQuery(query, callback)

  _executeQuery: (query, callback) ->
    url = @apiUrl + "jsonql?jsonql=" + encodeURIComponent(JSON.stringify(query))
    $.ajax({ dataType: "json", url: url })
      .done (rows) =>
        callback(null, rows)
      .fail (xhr) =>
        callback(new Error(xhr.responseText))
