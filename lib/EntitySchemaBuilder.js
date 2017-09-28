var EntitySchemaBuilder, _, appendStr, formUtils, mapTree, traverseTree;

_ = require('lodash');

formUtils = require('./formUtils');

module.exports = EntitySchemaBuilder = (function() {
  function EntitySchemaBuilder() {}

  EntitySchemaBuilder.prototype.addEntities = function(schema, entityTypes, propFilter) {
    var contents, entityType, i, j, k, labelColumn, len, len1, len2, reverseJoins, rj, table, tableId;
    reverseJoins = [];
    for (i = 0, len = entityTypes.length; i < len; i++) {
      entityType = entityTypes[i];
      traverseTree(entityType.properties, (function(_this) {
        return function(prop) {
          var entityCode;
          if (propFilter && !propFilter(prop)) {
            return null;
          }
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
          var ref;
          if (propFilter && !propFilter(prop)) {
            return null;
          }
          if (prop.type === "section") {
            return prop;
          }
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
              toColumn: ((ref = schema.getTable(prop.idTable)) != null ? ref.primaryKey : void 0) || "_id"
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
          en: "User or group that manages the data for this " + (formUtils.localizeString(entityType.name))
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
        desc: {
          en: "User that added this " + (formUtils.localizeString(entityType.name)) + " to the database"
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
        desc: {
          en: "Date that this " + (formUtils.localizeString(entityType.name)) + " was added to the database"
        },
        type: "datetime"
      });
      contents.push({
        id: "_modified_by",
        name: {
          en: "Last modified by user"
        },
        desc: {
          en: "User that modified this " + (formUtils.localizeString(entityType.name)) + " last"
        },
        type: "join",
        join: {
          type: "n-1",
          toTable: "users",
          fromColumn: "_modified_by",
          toColumn: "_id"
        }
      });
      contents.push({
        id: "_modified_on",
        name: {
          en: "Date last modified"
        },
        desc: {
          en: "Date that this " + (formUtils.localizeString(entityType.name)) + " was last modified"
        },
        type: "datetime"
      });
      contents.push({
        id: "!datasets",
        name: "Datasets",
        desc: {
          en: "Datasets that this " + (formUtils.localizeString(entityType.name)) + " is a part of"
        },
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
      contents.push({
        type: "section",
        id: "!related_forms",
        name: {
          en: "Related Surveys"
        },
        desc: {
          en: "Surveys that are linked by a question to " + (formUtils.localizeString(entityType.name))
        },
        contents: []
      });
      contents.push({
        type: "section",
        id: "!indicators",
        name: {
          en: "Related Indicators"
        },
        desc: {
          en: "Indicators are standardized information that are related to this site"
        },
        contents: []
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
        desc: entityType.desc,
        primaryKey: "_id",
        label: labelColumn,
        contents: contents,
        deprecated: entityType.deprecated
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
  if (!tree) {
    return tree;
  }
  return _.compact(_.map(tree, function(item) {
    var newItem;
    newItem = func(item);
    if (newItem && item.contents) {
      newItem.contents = mapTree(item.contents, func);
    }
    return newItem;
  }));
};

traverseTree = function(tree, func) {
  var i, item, len, results;
  if (!tree) {
    return;
  }
  results = [];
  for (i = 0, len = tree.length; i < len; i++) {
    item = tree[i];
    func(item);
    if (item.contents) {
      results.push(traverseTree(item.contents, func));
    } else {
      results.push(void 0);
    }
  }
  return results;
};
