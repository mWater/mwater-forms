"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var EntitySchemaBuilder, _, appendStr, formUtils, _mapTree, pluralize, _traverseTree;

_ = require('lodash');
formUtils = require('./formUtils'); // Builds schema for entities. Always add entities before forms

module.exports = EntitySchemaBuilder =
/*#__PURE__*/
function () {
  function EntitySchemaBuilder() {
    (0, _classCallCheck2["default"])(this, EntitySchemaBuilder);
  }

  (0, _createClass2["default"])(EntitySchemaBuilder, [{
    key: "addEntities",
    // Pass in:
    //   entityTypes: list of entity types objects
    //   propFilter: optional filter function that takes a property and returns true to include, false to exclude
    // Returns updated schema
    value: function addEntities(schema, entityTypes, propFilter) {
      var contents, entityType, i, j, labelColumn, len, len1, linksSection, ref, reverseJoins, rjTable, rjs, table, tableId; // Keep list of reverse join columns (one to many) to add later. table and column

      reverseJoins = []; // For each entity type, finding reverse joins

      for (i = 0, len = entityTypes.length; i < len; i++) {
        entityType = entityTypes[i];

        _traverseTree(entityType.properties, function (prop) {
          var entityCode, refTable;

          if (propFilter && !propFilter(prop)) {
            return null;
          }

          if (prop.type === "id") {
            if (prop.idTable.match(/^entities\./)) {
              entityCode = prop.idTable.split(".")[1]; // Check that exists

              if (!_.findWhere(entityTypes, {
                code: entityCode
              })) {
                return;
              }

              reverseJoins.push({
                table: prop.idTable,
                column: {
                  id: "!entities.".concat(entityType.code, ".").concat(prop.id),
                  name: pluralize(entityType.name),
                  deprecated: prop.deprecated || entityType.deprecated,
                  type: "join",
                  join: {
                    type: "1-n",
                    toTable: "entities.".concat(entityType.code),
                    inverse: prop.id,
                    fromColumn: "_id",
                    toColumn: prop.id
                  }
                }
              });
            }

            if (prop.idTable === "admin_regions" || prop.idTable.match(/^regions\./)) {
              // Check that table exists
              refTable = schema.getTable(prop.idTable);

              if (!refTable || !refTable.ancestryTable) {
                return;
              } // Create reverse join that takes into account that regions are hierarchical


              return reverseJoins.push({
                table: prop.idTable,
                column: {
                  id: "!entities.".concat(entityType.code, ".").concat(prop.id),
                  name: entityType.name,
                  deprecated: prop.deprecated || entityType.deprecated,
                  type: "join",
                  join: {
                    type: "1-n",
                    toTable: "entities.".concat(entityType.code),
                    inverse: prop.id,
                    jsonql: {
                      type: "op",
                      op: "exists",
                      exprs: [{
                        type: "scalar",
                        expr: null,
                        from: {
                          type: "table",
                          table: refTable.ancestryTable,
                          alias: "subwithin"
                        },
                        where: {
                          type: "op",
                          op: "and",
                          exprs: [{
                            type: "op",
                            op: "=",
                            exprs: [{
                              type: "field",
                              tableAlias: "subwithin",
                              column: "ancestor"
                            }, {
                              type: "field",
                              tableAlias: "{from}",
                              column: refTable.primaryKey
                            }]
                          }, {
                            type: "op",
                            op: "=",
                            exprs: [{
                              type: "field",
                              tableAlias: "subwithin",
                              column: "descendant"
                            }, {
                              type: "field",
                              tableAlias: "{to}",
                              column: prop.id
                            }]
                          }]
                        }
                      }]
                    }
                  }
                }
              });
            }
          }
        });
      } // For each entity type


      for (j = 0, len1 = entityTypes.length; j < len1; j++) {
        entityType = entityTypes[j]; // Get label column

        labelColumn = null; // Add properties

        contents = _mapTree(entityType.properties || [], function (prop) {
          var ref;

          if (propFilter && !propFilter(prop)) {
            return null;
          } // Sections are untouched unless filtered


          if (prop.type === "section") {
            return prop;
          } // Use unique code as label


          if (prop.uniqueCode) {
            labelColumn = prop.id;
          }

          prop = _.pick(prop, "id", "name", "code", "desc", "type", "idTable", "enumValues", "deprecated", "expr", "units"); // Convert id to join

          if (prop.type === "id") {
            prop.type = "join";
            prop.join = {
              type: "n-1",
              toTable: prop.idTable,
              fromColumn: prop.id,
              toColumn: ((ref = schema.getTable(prop.idTable)) != null ? ref.primaryKey : void 0) || "_id"
            };
            delete prop.idTable;
          } // Measurement type


          if (prop.type === "measurement") {
            return {
              type: "section",
              id: prop.id,
              name: prop.name,
              desc: prop.desc,
              contents: [{
                id: "".concat(prop.id, "_magnitude"),
                name: {
                  en: "Magnitude"
                },
                desc: {
                  en: "Magnitude of ".concat(formUtils.localizeString(prop.name))
                },
                type: "number"
              }, {
                id: "".concat(prop.id, "_unit"),
                name: {
                  en: "Unit"
                },
                desc: {
                  en: "Unit of ".concat(formUtils.localizeString(prop.name))
                },
                type: "enum",
                enumValues: prop.units
              }]
            };
          } // Pad date fields


          if (prop.type === "date") {
            // rpad(field ,10, '-01-01')
            prop.jsonql = {
              type: "op",
              op: "rpad",
              exprs: [{
                type: "field",
                tableAlias: "{alias}",
                column: prop.id
              }, 10, '-01-01']
            };
          }

          return prop;
        }); // Add extra columns

        contents.push({
          id: "_managed_by",
          name: {
            en: "Managed By"
          },
          desc: {
            en: "User or group that manages the data for this ".concat(formUtils.localizeString(entityType.name))
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
            en: "User that added this ".concat(formUtils.localizeString(entityType.name), " to the database")
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
            en: "Date that this ".concat(formUtils.localizeString(entityType.name), " was added to the database")
          },
          type: "datetime"
        });
        contents.push({
          id: "_modified_by",
          name: {
            en: "Last modified by user"
          },
          desc: {
            en: "User that modified this ".concat(formUtils.localizeString(entityType.name), " last")
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
            en: "Date that this ".concat(formUtils.localizeString(entityType.name), " was last modified")
          },
          type: "datetime"
        }); // Add _roles but as hidden

        contents.push({
          id: "_roles",
          name: {
            en: "Roles"
          },
          type: "json",
          deprecated: true
        });
        contents.push({
          id: "_merged_entities",
          name: {
            en: "Previous mWater IDs"
          },
          desc: {
            en: "IDs of other ".concat(formUtils.localizeString(entityType.name), " that were merged into this")
          },
          type: 'text[]'
        }); // This gets overridden in the schema map

        contents.push({
          id: "_pending_approvals",
          name: {
            en: "Pending Approvals"
          },
          desc: {
            en: "True if there are approvals pending for this site"
          },
          type: 'boolean'
        }); // Add datasets

        contents.push({
          id: "!datasets",
          name: {
            en: "Datasets"
          },
          desc: {
            en: "Datasets that this ".concat(formUtils.localizeString(entityType.name), " is a part of")
          },
          type: "join",
          join: {
            type: "n-n",
            toTable: "datasets",
            jsonql: {
              type: "op",
              op: "exists",
              exprs: [{
                type: "query",
                selects: [{
                  type: "select",
                  expr: null,
                  alias: "null_value"
                }],
                from: {
                  type: "table",
                  table: "dataset_members",
                  alias: "members"
                },
                where: {
                  type: "op",
                  op: "and",
                  exprs: [{
                    type: "op",
                    op: "=",
                    exprs: [{
                      type: "field",
                      tableAlias: "members",
                      column: "entity_type"
                    }, entityType.code]
                  }, {
                    type: "op",
                    op: "=",
                    exprs: [{
                      type: "field",
                      tableAlias: "members",
                      column: "entity_id"
                    }, {
                      type: "field",
                      tableAlias: "{from}",
                      column: "_id"
                    }]
                  }, {
                    type: "op",
                    op: "=",
                    exprs: [{
                      type: "field",
                      tableAlias: "members",
                      column: "dataset"
                    }, {
                      type: "field",
                      tableAlias: "{to}",
                      column: "_id"
                    }]
                  }]
                }
              }]
            }
          }
        }); // Add related forms placeholder section

        contents.push({
          type: "section",
          id: "!related_forms",
          name: {
            en: "Related Surveys"
          },
          desc: {
            en: "Surveys that are linked by a question to ".concat(formUtils.localizeString(entityType.name))
          },
          contents: []
        }); // Add related indicators placeholder section

        contents.push({
          type: "section",
          id: "!indicators",
          // Special section name
          name: {
            en: "Related Indicators"
          },
          desc: {
            en: "Indicators are standardized information that are related to this site"
          },
          contents: []
        });
        tableId = "entities.".concat(entityType.code);
        table = {
          id: tableId,
          name: entityType.name,
          desc: entityType.desc,
          primaryKey: "_id",
          label: labelColumn,
          contents: contents,
          deprecated: entityType.deprecated
        }; // Legacy only

        if (entityType.code === "water_point_functionality_report") {
          table.ordering = "date";
        } // Create table


        schema = schema.addTable(table);
      }

      ref = _.groupBy(reverseJoins, "table"); // Add reverse joins, putting them in "!related_entities" section

      for (rjTable in ref) {
        rjs = ref[rjTable];
        table = schema.getTable(rjTable);
        table.contents = table.contents.slice();
        linksSection = _.findWhere(table.contents, {
          id: "!related_entities",
          type: "section"
        });

        if (!linksSection) {
          linksSection = {
            id: "!related_entities",
            type: "section",
            name: {
              _base: "en",
              en: "Related Entities"
            },
            contents: []
          };
          table.contents.push(linksSection);
        }

        linksSection.contents = linksSection.contents.concat(_.pluck(rjs, "column"));
        schema = schema.addTable(table);
      }

      return schema;
    }
  }]);
  return EntitySchemaBuilder;
}(); // Append a string to each language


appendStr = function appendStr(str, suffix) {
  var key, output, value;
  output = {};

  for (key in str) {
    value = str[key];

    if (key === "_base") {
      output._base = value;
    } else {
      // If it's a simple string
      if (_.isString(suffix)) {
        output[key] = value + suffix;
      } else {
        output[key] = value + (suffix[key] || suffix[suffix._base] || suffix.en);
      }
    }
  }

  return output;
}; // Map a tree that consists of items with optional 'contents' array. null means to discard item


_mapTree = function mapTree(tree, func) {
  if (!tree) {
    return tree;
  }

  return _.compact(_.map(tree, function (item) {
    var newItem;
    newItem = func(item);

    if (newItem && item.contents) {
      newItem = _.extend({}, newItem, {
        contents: _mapTree(item.contents, func)
      });
    }

    return newItem;
  }));
}; // Traverse a tree, calling func for each item


_traverseTree = function traverseTree(tree, func) {
  var i, item, len, results;

  if (!tree) {
    return;
  }

  results = [];

  for (i = 0, len = tree.length; i < len; i++) {
    item = tree[i];
    func(item);

    if (item.contents) {
      results.push(_traverseTree(item.contents, func));
    } else {
      results.push(void 0);
    }
  }

  return results;
}; // Make a plural form (in English)


pluralize = function pluralize(lstr) {
  var pstr, str;
  str = lstr.en;

  if (!str) {
    return lstr;
  } // Water doesn't pluralize


  if (str.match(/ater$/)) {
    pstr = str;
  } else if (str.match(/s$/)) {
    pstr = str + "es";
  } else if (str.match(/y$/)) {
    pstr = str.substr(0, str.length - 1) + "ies";
  } else {
    pstr = str + "s";
  }

  return _.extend({}, lstr, {
    en: pstr
  });
};