"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $, AdminRegionDataSource;

$ = require('jquery');

// Gets the admin region information from an mWater server. Here as a convenience for creating the form context
module.exports = AdminRegionDataSource = function () {
  function AdminRegionDataSource(apiUrl) {
    _classCallCheck(this, AdminRegionDataSource);

    this.getAdminRegionPath = this.getAdminRegionPath.bind(this);
    this.getSubAdminRegions = this.getSubAdminRegions.bind(this);
    this.findAdminRegionByLatLng = this.findAdminRegionByLatLng.bind(this);
    this.apiUrl = apiUrl;
  }

  _createClass(AdminRegionDataSource, [{
    key: "getAdminRegionPath",
    value: function getAdminRegionPath(id, callback) {
      var query;
      // select _id as id, level as level, name as name, type as type from admin_regions as ar 
      // where ar._id = any((select jsonb_array_elements_text(path) from admin_regions as ar2 where ar2._id = THE_ID))
      query = {
        type: "query",
        selects: [{
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "_id"
          },
          alias: "id"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "level"
          },
          alias: "level"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "name"
          },
          alias: "name"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "full_name"
          },
          alias: "full_name"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "type"
          },
          alias: "type"
        }],
        from: {
          type: "table",
          table: "admin_regions",
          alias: "ar"
        },
        where: {
          type: "op",
          op: "=",
          modifier: "any",
          exprs: [{
            type: "field",
            tableAlias: "ar",
            column: "_id"
          }, {
            type: "scalar",
            expr: {
              type: "op",
              op: "::integer",
              exprs: [{
                type: "op",
                op: "jsonb_array_elements_text",
                exprs: [{
                  type: "field",
                  tableAlias: "ar2",
                  column: "path"
                }]
              }]
            },
            from: {
              type: "table",
              table: "admin_regions",
              alias: "ar2"
            },
            where: {
              type: "op",
              op: "=",
              exprs: [{
                type: "field",
                tableAlias: "ar2",
                column: "_id"
              }, id]
            }
          }]
        },
        orderBy: [{
          ordinal: 2,
          direction: "asc"
        }]
      };
      return this._executeQuery(query, callback);
    }
  }, {
    key: "getSubAdminRegions",
    value: function getSubAdminRegions(id, level, callback) {
      var query;
      // select _id as id, level as level, name as name, type as type from admin_regions as ar
      // where path @> '[ID]'::jsonb and ar.level = LEVEL order by ar.name
      query = {
        type: "query",
        selects: [{
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "_id"
          },
          alias: "id"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "level"
          },
          alias: "level"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "name"
          },
          alias: "name"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "full_name"
          },
          alias: "full_name"
        }, {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "type"
          },
          alias: "type"
        }],
        from: {
          type: "table",
          table: "admin_regions",
          alias: "ar"
        },
        where: {
          type: "op",
          op: "and",
          exprs: [{
            type: "op",
            op: "=",
            exprs: [{
              type: "field",
              tableAlias: "ar",
              column: "level"
            }, level]
          }]
        },
        orderBy: [{
          ordinal: 3,
          direction: "asc"
        }]
      };
      // Filter by ancestor if specified
      if (id) {
        query.where.exprs.push({
          type: "op",
          op: "@>",
          exprs: [{
            type: "field",
            tableAlias: "ar",
            column: "path"
          }, {
            type: "op",
            op: "::jsonb",
            exprs: [JSON.stringify([id])]
          }]
        });
      }
      return this._executeQuery(query, callback);
    }
  }, {
    key: "findAdminRegionByLatLng",
    value: function findAdminRegionByLatLng(lat, lng, callback) {
      var query;
      // select _id as id from admin_regions as ar
      // where ST_Intersects(ar.shape, ST_Transform(ST_SetSRID(ST_MakePoint(LNG, LAT), 4326), 3857) order by ar.level desc limit 1
      query = {
        type: "query",
        selects: [{
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "_id"
          },
          alias: "id"
        }],
        from: {
          type: "table",
          table: "admin_regions",
          alias: "ar"
        },
        where: {
          type: "op",
          op: "ST_Intersects",
          exprs: [{
            type: "field",
            tableAlias: "ar",
            column: "shape"
          }, {
            type: "op",
            op: "ST_Transform",
            exprs: [{
              type: "op",
              op: "ST_SetSRID",
              exprs: [{
                type: "op",
                op: "ST_MakePoint",
                exprs: [lng, lat]
              }, 4326]
            }, 3857]
          }]
        },
        orderBy: [{
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "level"
          },
          direction: "desc"
        }],
        limit: 1
      };
      return this._executeQuery(query, function (error, rows) {
        if (error) {
          return callback(error);
        }
        if (rows[0]) {
          return callback(null, rows[0].id);
        }
        return callback(null, null);
      });
    }
  }, {
    key: "_executeQuery",
    value: function _executeQuery(query, callback) {
      var url;
      url = this.apiUrl + "jsonql?jsonql=" + encodeURIComponent(JSON.stringify(query));
      return $.ajax({
        dataType: "json",
        url: url
      }).done(function (rows) {
        return callback(null, rows);
      }).fail(function (xhr) {
        return callback(new Error(xhr.responseText));
      });
    }
  }]);

  return AdminRegionDataSource;
}();