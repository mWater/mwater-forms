// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let AdminRegionDataSource
import $ from "jquery"

// Gets the admin region information from an mWater server. Here as a convenience for creating the form context
export default AdminRegionDataSource = class AdminRegionDataSource {
  constructor(apiUrl: any) {
    this.apiUrl = apiUrl
  }

  getAdminRegionPath = (id: any, callback: any) => {
    // select _id as id, level as level, name as name, type as type from admin_regions as ar
    // where ar._id = any((select jsonb_array_elements_text(path) from admin_regions as ar2 where ar2._id = THE_ID))
    const query = {
      type: "query",
      selects: [
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "_id" }, alias: "id" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "level" }, alias: "level" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "name" }, alias: "name" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "full_name" }, alias: "full_name" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "type" }, alias: "type" }
      ],
      from: { type: "table", table: "admin_regions", alias: "ar" },
      where: {
        type: "op",
        op: "=",
        modifier: "any",
        exprs: [
          { type: "field", tableAlias: "ar", column: "_id" },
          {
            type: "scalar",
            expr: {
              type: "op",
              op: "::integer",
              exprs: [
                {
                  type: "op",
                  op: "jsonb_array_elements_text",
                  exprs: [{ type: "field", tableAlias: "ar2", column: "path" }]
                }
              ]
            },
            from: { type: "table", table: "admin_regions", alias: "ar2" },
            where: {
              type: "op",
              op: "=",
              exprs: [{ type: "field", tableAlias: "ar2", column: "_id" }, id]
            }
          }
        ]
      },
      orderBy: [{ ordinal: 2, direction: "asc" }]
    }

    return this._executeQuery(query, callback)
  }

  getSubAdminRegions = (id: any, level: any, callback: any) => {
    // select _id as id, level as level, name as name, type as type from admin_regions as ar
    // where path @> '[ID]'::jsonb and ar.level = LEVEL order by ar.name
    const query = {
      type: "query",
      selects: [
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "_id" }, alias: "id" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "level" }, alias: "level" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "name" }, alias: "name" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "full_name" }, alias: "full_name" },
        { type: "select", expr: { type: "field", tableAlias: "ar", column: "type" }, alias: "type" }
      ],
      from: { type: "table", table: "admin_regions", alias: "ar" },
      where: {
        type: "op",
        op: "and",
        exprs: [
          {
            type: "op",
            op: "=",
            exprs: [{ type: "field", tableAlias: "ar", column: "level" }, level]
          }
        ]
      },
      orderBy: [{ ordinal: 3, direction: "asc" }]
    }

    // Filter by ancestor if specified
    if (id) {
      query.where.exprs.push({
        type: "op",
        op: "@>",
        exprs: [
          { type: "field", tableAlias: "ar", column: "path" },
          { type: "op", op: "::jsonb", exprs: [JSON.stringify([id])] }
        ]
      })
    }

    return this._executeQuery(query, callback)
  }

  findAdminRegionByLatLng = (lat: any, lng: any, callback: any) => {
    // select _id as id from admin_regions as ar
    // where ST_Intersects(ar.shape, ST_Transform(ST_SetSRID(ST_MakePoint(LNG, LAT), 4326), 3857) order by ar.level desc limit 1
    const query = {
      type: "query",
      selects: [{ type: "select", expr: { type: "field", tableAlias: "ar", column: "_id" }, alias: "id" }],
      from: { type: "table", table: "admin_regions", alias: "ar" },
      where: {
        type: "op",
        op: "ST_Intersects",
        exprs: [
          { type: "field", tableAlias: "ar", column: "shape" },
          {
            type: "op",
            op: "ST_Transform",
            exprs: [
              { type: "op", op: "ST_SetSRID", exprs: [{ type: "op", op: "ST_MakePoint", exprs: [lng, lat] }, 4326] },
              3857
            ]
          }
        ]
      },
      orderBy: [{ expr: { type: "field", tableAlias: "ar", column: "level" }, direction: "desc" }],
      limit: 1
    }

    return this._executeQuery(query, (error: any, rows: any) => {
      if (error) {
        return callback(error)
      }

      if (rows[0]) {
        return callback(null, rows[0].id)
      }

      return callback(null, null)
    })
  }

  _executeQuery(query: any, callback: any) {
    const url = this.apiUrl + "jsonql?jsonql=" + encodeURIComponent(JSON.stringify(query))
    return $.ajax({ dataType: "json", url })
      .done((rows: any) => {
        return callback(null, rows)
      })
      .fail((xhr: any) => {
        return callback(new Error(xhr.responseText))
      })
  }
}
