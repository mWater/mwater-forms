var EntitySchemaBuilder, _, appendStr;

_ = require('lodash');

module.exports = EntitySchemaBuilder = (function() {
  function EntitySchemaBuilder() {}

  EntitySchemaBuilder.prototype.addEntities = function(schema, entityTypes, properties, units) {
    var contents, deprecated, entityProps, entityType, i, j, k, l, labelColumn, len, len1, len2, len3, ordering, prop, ref, ref1, ref2, refEntityType, reverseJoins, rj, table, tableId;
    reverseJoins = [];
    for (i = 0, len = properties.length; i < len; i++) {
      prop = properties[i];
      if (prop.type === "entity") {
        entityType = _.findWhere(entityTypes, {
          code: prop.entity_type
        });
        tableId = "entities." + entityType.code;
        reverseJoins.push({
          table: "entities." + prop.ref_entity_type,
          column: {
            id: "!" + tableId + "." + prop.code,
            name: entityType.name,
            deprecated: prop.deprecated || entityType.deprecated,
            type: "join",
            join: {
              type: "1-n",
              toTable: tableId,
              fromColumn: "_id",
              toColumn: prop.code
            }
          }
        });
      }
    }
    for (j = 0, len1 = entityTypes.length; j < len1; j++) {
      entityType = entityTypes[j];
      contents = [];
      labelColumn = null;
      entityProps = _.filter(properties, function(prop) {
        return prop.entity_type === entityType.code;
      });
      ordering = {
        name: 1,
        desc: 2,
        type: 3,
        location: 4,
        code: 5
      };
      entityProps = _.sortBy(entityProps, function(prop) {
        return ordering[prop.code] || 999;
      });
      for (k = 0, len2 = entityProps.length; k < len2; k++) {
        prop = entityProps[k];
        if (prop.unique_code) {
          labelColumn = prop.code;
        }
        deprecated = prop.deprecated;
        if (prop.type === "measurement") {
          contents.push({
            id: prop.code + ".magnitude",
            name: appendStr(prop.name, " (magnitude)"),
            type: "number",
            deprecated: deprecated
          });
          contents.push({
            id: prop.code + ".unit",
            name: appendStr(prop.name, " (units)"),
            type: "enum",
            enumValues: _.map(prop.units, function(u) {
              return {
                id: u,
                name: _.findWhere(units, {
                  code: u
                }).name
              };
            }),
            deprecated: deprecated
          });
        } else if (prop.type === "entity") {
          refEntityType = _.findWhere(entityTypes, {
            code: prop.ref_entity_type
          });
          contents.push({
            id: "" + prop.code,
            name: prop.name,
            type: "join",
            deprecated: deprecated || refEntityType.deprecated,
            join: {
              type: "n-1",
              toTable: "entities." + prop.ref_entity_type,
              fromColumn: prop.code,
              toColumn: "_id"
            }
          });
        } else if ((ref = prop.type) === "enum" || ref === "enumset") {
          contents.push({
            id: prop.code,
            name: prop.name,
            type: prop.type,
            enumValues: _.map(prop.values, function(v) {
              return {
                id: v.code,
                name: v.name
              };
            }),
            deprecated: deprecated
          });
        } else if ((ref1 = prop.type) === "integer" || ref1 === "decimal" || ref1 === "number") {
          contents.push({
            id: prop.code,
            name: prop.name,
            type: "number",
            deprecated: deprecated
          });
        } else if (prop.type === "date") {
          contents.push({
            id: prop.code,
            name: prop.name,
            type: "date",
            deprecated: deprecated,
            jsonql: {
              type: "op",
              op: "rpad",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: prop.code
                }, 10, '-01-01'
              ]
            }
          });
        } else if (prop.type === "admin_region") {
          contents.push({
            id: prop.code,
            name: prop.name,
            type: "join",
            join: {
              type: "n-1",
              toTable: "admin_regions",
              fromColumn: prop.code,
              toColumn: "_id"
            },
            deprecated: deprecated
          });
        } else if ((ref2 = prop.type) !== 'json') {
          contents.push({
            id: prop.code,
            name: prop.name,
            type: prop.type,
            enumValues: prop.values,
            deprecated: deprecated
          });
        }
      }
      contents.push({
        id: "_managed_by",
        name: {
          en: "Managed By"
        },
        type: "join",
        join: {
          type: "n-1",
          toTable: "subjects",
          fromColumn: "_managed_by",
          toColumn: "id"
        }
      });
      contents.push({
        id: "_created_by",
        name: {
          en: "Added by user"
        },
        type: "join",
        join: {
          type: "n-1",
          toTable: "users",
          fromColumn: "_created_by",
          toColumn: "_id"
        }
      });
      contents.push({
        id: "_created_on",
        name: {
          en: "Date added"
        },
        type: "datetime"
      });
      contents.push({
        id: "!datasets",
        name: "Datasets",
        type: "join",
        join: {
          type: "n-n",
          toTable: "datasets",
          jsonql: {
            type: "op",
            op: "exists",
            exprs: [
              {
                type: "query",
                selects: [
                  {
                    type: "select",
                    expr: null,
                    alias: "null_value"
                  }
                ],
                from: {
                  type: "table",
                  table: "dataset_members",
                  alias: "members"
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
                          tableAlias: "members",
                          column: "entity_type"
                        }, entityType.code
                      ]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [
                        {
                          type: "field",
                          tableAlias: "members",
                          column: "entity_id"
                        }, {
                          type: "field",
                          tableAlias: "{from}",
                          column: "_id"
                        }
                      ]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [
                        {
                          type: "field",
                          tableAlias: "members",
                          column: "dataset"
                        }, {
                          type: "field",
                          tableAlias: "{to}",
                          column: "_id"
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        }
      });
      tableId = "entities." + entityType.code;
      for (l = 0, len3 = reverseJoins.length; l < len3; l++) {
        rj = reverseJoins[l];
        if (rj.table === tableId) {
          contents.push(rj.column);
        }
      }
      table = {
        id: tableId,
        name: entityType.name,
        primaryKey: "_id",
        label: labelColumn,
        contents: contents
      };
      if (entityType.code === "water_point_functionality_report") {
        table.ordering = "date";
      }
      schema = schema.addTable(table);
    }
    return schema;
  };

  return EntitySchemaBuilder;

})();

appendStr = function(str, suffix) {
  var key, output, value;
  output = {};
  for (key in str) {
    value = str[key];
    if (key === "_base") {
      output._base = value;
    } else {
      if (_.isString(suffix)) {
        output[key] = value + suffix;
      } else {
        output[key] = value + (suffix[key] || suffix[suffix._base] || suffix.en);
      }
    }
  }
  return output;
};
