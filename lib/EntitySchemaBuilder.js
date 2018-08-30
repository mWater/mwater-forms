'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EntitySchemaBuilder, _, appendStr, formUtils, _mapTree, _traverseTree;

_ = require('lodash');

formUtils = require('./formUtils');

// Builds schema for entities. Always add entities before forms
module.exports = EntitySchemaBuilder = function () {
  function EntitySchemaBuilder() {
    (0, _classCallCheck3.default)(this, EntitySchemaBuilder);
  }

  (0, _createClass3.default)(EntitySchemaBuilder, [{
    key: 'addEntities',


    // Pass in:
    //   entityTypes: list of entity types objects
    //   propFilter: optional filter function that takes a property and returns true to include, false to exclude
    // Returns updated schema
    value: function addEntities(schema, entityTypes, propFilter) {
      var contents, entityType, i, j, k, labelColumn, len, len1, len2, reverseJoins, rj, table, tableId;
      // Keep list of reverse join columns (one to many) to add later. table and column
      reverseJoins = [];
      // For each entity type, finding reverse joins
      for (i = 0, len = entityTypes.length; i < len; i++) {
        entityType = entityTypes[i];
        _traverseTree(entityType.properties, function (prop) {
          var entityCode;
          if (propFilter && !propFilter(prop)) {
            return null;
          }
          if (prop.type === "id" && prop.idTable.match(/^entities\./)) {
            entityCode = prop.idTable.split(".")[1];
            // Check that exists
            if (!_.findWhere(entityTypes, {
              code: entityCode
            })) {
              return;
            }
            return reverseJoins.push({
              table: prop.idTable,
              column: {
                id: '!entities.' + entityType.code + '.' + prop.id,
                name: entityType.name,
                deprecated: prop.deprecated || entityType.deprecated,
                type: "join",
                join: {
                  type: "1-n",
                  toTable: 'entities.' + entityType.code,
                  fromColumn: "_id",
                  toColumn: prop.id
                }
              }
            });
          }
        });
      }
      // For each entity type
      for (j = 0, len1 = entityTypes.length; j < len1; j++) {
        entityType = entityTypes[j];
        // Get label column
        labelColumn = null;
        // Add properties
        contents = _mapTree(entityType.properties || [], function (prop) {
          var ref;
          if (propFilter && !propFilter(prop)) {
            return null;
          }
          // Sections are untouched unless filtered
          if (prop.type === "section") {
            return prop;
          }
          // Use unique code as label
          if (prop.uniqueCode) {
            labelColumn = prop.id;
          }
          prop = _.pick(prop, "id", "name", "code", "desc", "type", "idTable", "enumValues", "deprecated");
          // Don't include roles
          delete prop.roles;
          // Convert id to join
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
          // Pad date fields
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
        });
        // Add extra columns
        contents.push({
          id: "_managed_by",
          name: {
            en: "Managed By"
          },
          desc: {
            en: 'User or group that manages the data for this ' + formUtils.localizeString(entityType.name)
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
            en: 'User that added this ' + formUtils.localizeString(entityType.name) + ' to the database'
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
            en: 'Date that this ' + formUtils.localizeString(entityType.name) + ' was added to the database'
          },
          type: "datetime"
        });
        contents.push({
          id: "_modified_by",
          name: {
            en: "Last modified by user"
          },
          desc: {
            en: 'User that modified this ' + formUtils.localizeString(entityType.name) + ' last'
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
            en: 'Date that this ' + formUtils.localizeString(entityType.name) + ' was last modified'
          },
          type: "datetime"
        });
        contents.push({
          id: "_merged_entities",
          name: {
            en: "Previous mWater IDs"
          },
          desc: {
            en: 'IDs of other ' + formUtils.localizeString(entityType.name) + ' that were merged into this'
          },
          type: 'text[]'
        });
        // Add datasets
        contents.push({
          id: "!datasets",
          name: "Datasets",
          desc: {
            en: 'Datasets that this ' + formUtils.localizeString(entityType.name) + ' is a part of'
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
        });
        // Add related forms placeholder section
        contents.push({
          type: "section",
          id: "!related_forms",
          name: {
            en: "Related Surveys"
          },
          desc: {
            en: 'Surveys that are linked by a question to ' + formUtils.localizeString(entityType.name)
          },
          contents: []
        });
        // Add related indicators placeholder section
        contents.push({
          type: "section",
          id: "!indicators", // Special section name
          name: {
            en: "Related Indicators"
          },
          desc: {
            en: "Indicators are standardized information that are related to this site"
          },
          contents: []
        });
        tableId = 'entities.' + entityType.code;
        // Add reverse join columns
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
        // Legacy only
        if (entityType.code === "water_point_functionality_report") {
          table.ordering = "date";
        }
        // Create table
        schema = schema.addTable(table);
      }
      return schema;
    }
  }]);
  return EntitySchemaBuilder;
}();

// Append a string to each language
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
};

// Map a tree that consists of items with optional 'contents' array. null means to discard item
_mapTree = function mapTree(tree, func) {
  if (!tree) {
    return tree;
  }
  return _.compact(_.map(tree, function (item) {
    var newItem;
    newItem = func(item);
    if (newItem && item.contents) {
      newItem.contents = _mapTree(item.contents, func);
    }
    return newItem;
  }));
};

// Traverse a tree, calling func for each item
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
};