var EntitySchemaBuilder, _, appendStr, mapTree;

_ = require('lodash');

module.exports = EntitySchemaBuilder = (function() {
  function EntitySchemaBuilder() {}

  EntitySchemaBuilder.prototype.addEntities = function(schema, entityTypes) {
    var contents, entityType, i, j, k, labelColumn, len, len1, len2, reverseJoins, rj, table, tableId;
    reverseJoins = [];
    for (i = 0, len = entityTypes.length; i < len; i++) {
      entityType = entityTypes[i];
      mapTree(entityType.properties, (function(_this) {
        return function(prop) {
          var entityCode;
          if (prop.type === "id" && prop.idTable.match(/^entities\./)) {
            entityCode = prop.idTable.split(".")[1];
            if (!_.findWhere(entityTypes, {
              code: entityCode
            })) {
              return;
            }
            return reverseJoins.push({
              table: prop.idTable,
              column: {
                id: "!entities." + entityType.code + "." + prop.id,
                name: entityType.name,
                deprecated: prop.deprecated || entityType.deprecated,
                type: "join",
                join: {
                  type: "1-n",
                  toTable: "entities." + entityType.code,
                  fromColumn: "_id",
                  toColumn: prop.id
                }
              }
            });
          }
        };
      })(this));
    }
    for (j = 0, len1 = entityTypes.length; j < len1; j++) {
      entityType = entityTypes[j];
      labelColumn = null;
      contents = mapTree(entityType.properties || [], (function(_this) {
        return function(prop) {
          if (prop.uniqueCode) {
            labelColumn = prop.id;
          }
          prop = _.pick(prop, "id", "name", "code", "desc", "type", "idTable", "enumValues", "deprecated");
          delete prop.roles;
          if (prop.type === "id") {
            prop.type = "join";
            prop.join = {
              type: "n-1",
              toTable: prop.idTable,
              fromColumn: prop.id,
              toColumn: "_id"
            };
            delete prop.idTable;
          }
          if (prop.type === "date") {
            prop.jsonql = {
              type: "op",
              op: "rpad",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: prop.id
                }, 10, '-01-01'
              ]
            };
          }
          return prop;
        };
      })(this));
      contents.push({
        id: "_managed_by",
        name: {
          en: "Managed By"
        },
        desc: {
          en: "User or group that manages the data for the site"
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
      for (k = 0, len2 = reverseJoins.length; k < len2; k++) {
        rj = reverseJoins[k];
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

mapTree = function(tree, func) {
  var output;
  if (!tree) {
    return tree;
  }
  if (_.isArray(tree)) {
    return _.map(tree, function(item) {
      return mapTree(item, func);
    });
  }
  output = func(tree);
  if (tree.contents) {
    output.contents = _.compact(_.map(tree.contents, function(item) {
      return func(item);
    }));
  }
  return output;
};
