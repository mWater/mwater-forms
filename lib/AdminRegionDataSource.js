var $, AdminRegionDataSource,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

$ = require('jquery');

module.exports = AdminRegionDataSource = (function() {
  function AdminRegionDataSource(apiUrl) {
    this.findAdminRegionByLatLng = bind(this.findAdminRegionByLatLng, this);
    this.getSubAdminRegions = bind(this.getSubAdminRegions, this);
    this.getAdminRegionPath = bind(this.getAdminRegionPath, this);
    this.apiUrl = apiUrl;
  }

  AdminRegionDataSource.prototype.getAdminRegionPath = function(id, callback) {
    var query;
    query = {
      type: "query",
      selects: [
        {
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
            column: "type"
          },
          alias: "type"
        }
      ],
      from: {
        type: "join",
        kind: "inner",
        left: {
          type: "table",
          table: "admin_regions",
          alias: "ar"
        },
        right: {
          type: "table",
          table: "admin_region_subtrees",
          alias: "ars"
        },
        on: {
          type: "op",
          op: "=",
          exprs: [
            {
              type: "field",
              tableAlias: "ar",
              column: "_id"
            }, {
              type: "field",
              tableAlias: "ars",
              column: "ancestor"
            }
          ]
        }
      },
      where: {
        type: "op",
        op: "=",
        exprs: [
          {
            type: "field",
            tableAlias: "ars",
            column: "descendant"
          }, id
        ]
      },
      orderBy: [
        {
          ordinal: 2,
          direction: "asc"
        }
      ]
    };
    return this._executeQuery(query, callback);
  };

  AdminRegionDataSource.prototype.getSubAdminRegions = function(id, level, callback) {
    var query;
    query = {
      type: "query",
      selects: [
        {
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
            column: "type"
          },
          alias: "type"
        }
      ],
      from: {
        type: "join",
        kind: "inner",
        left: {
          type: "table",
          table: "admin_regions",
          alias: "ar"
        },
        right: {
          type: "table",
          table: "admin_region_subtrees",
          alias: "ars"
        },
        on: {
          type: "op",
          op: "=",
          exprs: [
            {
              type: "field",
              tableAlias: "ar",
              column: "_id"
            }, {
              type: "field",
              tableAlias: "ars",
              column: "descendant"
            }
          ]
        }
      },
      where: {
        type: "op",
        op: "and",
        exprs: [
          {
            type: "op",
            op: "=",
            exprs: [
              {
                type: "field",
                tableAlias: "ar",
                column: "level"
              }, level
            ]
          }
        ]
      },
      orderBy: [
        {
          ordinal: 3,
          direction: "asc"
        }
      ]
    };
    if (id) {
      query.where.exprs.push({
        type: "op",
        op: "=",
        exprs: [
          {
            type: "field",
            tableAlias: "ars",
            column: "ancestor"
          }, id
        ]
      });
    }
    return this._executeQuery(query, callback);
  };

  AdminRegionDataSource.prototype.findAdminRegionByLatLng = function(lat, lng, callback) {
    var query;
    query = {
      type: "query",
      selects: [
        {
          type: "select",
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "_id"
          },
          alias: "id"
        }
      ],
      from: {
        type: "table",
        table: "admin_regions",
        alias: "ar"
      },
      where: {
        type: "op",
        op: "ST_Intersects",
        exprs: [
          {
            type: "field",
            tableAlias: "ar",
            column: "shape"
          }, {
            type: "op",
            op: "ST_Transform",
            exprs: [
              {
                type: "op",
                op: "ST_SetSRID",
                exprs: [
                  {
                    type: "op",
                    op: "ST_MakePoint",
                    exprs: [lng, lat]
                  }, 4326
                ]
              }, 3857
            ]
          }
        ]
      },
      orderBy: [
        {
          expr: {
            type: "field",
            tableAlias: "ar",
            column: "level"
          },
          direction: "desc"
        }
      ],
      limit: 1
    };
    return this._executeQuery(query, (function(_this) {
      return function(error, rows) {
        if (error) {
          return callback(error);
        }
        if (rows[0]) {
          return callback(null, rows[0].id);
        }
        return callback(null, null);
      };
    })(this));
  };

  AdminRegionDataSource.prototype._executeQuery = function(query, callback) {
    var url;
    url = this.apiUrl + "jsonql?jsonql=" + encodeURIComponent(JSON.stringify(query));
    return $.ajax({
      dataType: "json",
      url: url
    }).done((function(_this) {
      return function(rows) {
        return callback(null, rows);
      };
    })(this)).fail((function(_this) {
      return function(xhr) {
        return callback(new Error(xhr.responseText));
      };
    })(this));
  };

  return AdminRegionDataSource;

})();
