var IndicatorSchemaBuilder, _, update,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

update = require('update-object');

module.exports = IndicatorSchemaBuilder = (function() {
  function IndicatorSchemaBuilder() {
    this.addIndicatorToTable = bind(this.addIndicatorToTable, this);
  }

  IndicatorSchemaBuilder.prototype.addIndicator = function(schema, indicator) {
    if (indicator.type === "response") {
      return this.addResponseIndicator(schema, indicator);
    } else if (indicator.type === "expression") {
      return this.addExpressionIndicator(schema, indicator);
    } else {
      return schema;
    }
  };

  IndicatorSchemaBuilder.prototype.addResponseIndicator = function(schema, indicator) {
    var aggrColumn, aggregation, column, contents, i, j, k, l, len, len1, len2, len3, len4, len5, m, n, property, ref, ref1, ref2, ref3, ref4, reverseJoin, reverseJoins, table;
    contents = [];
    reverseJoins = [];
    ref = indicator.design.properties.values || [];
    for (i = 0, len = ref.length; i < len; i++) {
      property = ref[i];
      this.addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins);
    }
    ref1 = indicator.design.properties.links || [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      property = ref1[j];
      this.addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins);
    }
    ref2 = indicator.design.properties.subindicators || [];
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      property = ref2[k];
      this.addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins);
    }
    ref3 = indicator.design.properties.others || [];
    for (l = 0, len3 = ref3.length; l < len3; l++) {
      property = ref3[l];
      this.addResponseIndicatorProperty(schema, indicator, property, contents, reverseJoins);
    }
    contents.push({
      id: "datetime",
      name: {
        _base: "en",
        en: "Date"
      },
      type: "datetime"
    });
    contents.push({
      id: "response_id",
      name: {
        _base: "en",
        en: "Unique Response Id"
      },
      type: "text",
      jsonql: {
        type: "field",
        tableAlias: "{alias}",
        column: "response"
      }
    });
    if (indicator.design.includePending) {
      contents.push({
        id: "responseStatus",
        name: {
          _base: "en",
          en: "Response Status"
        },
        type: "enum",
        enumValues: [
          {
            id: "final",
            name: {
              en: "Final"
            }
          }, {
            id: "pending0",
            name: {
              en: "Pending Level 1"
            }
          }, {
            id: "pending1",
            name: {
              en: "Pending Level 2"
            }
          }, {
            id: "pending2",
            name: {
              en: "Pending Level 3"
            }
          }, {
            id: "pending3",
            name: {
              en: "Pending Level 4"
            }
          }
        ]
      });
    }
    for (m = 0, len4 = reverseJoins.length; m < len4; m++) {
      reverseJoin = reverseJoins[m];
      table = schema.getTable(reverseJoin.table);
      if (!table) {
        console.error("Reverse join to " + reverseJoin.table + " not found for " + indicator._id);
        continue;
      }
      table = this.addIndicatorToTable(table, reverseJoin.column, indicator.design.recommended);
      schema = schema.addTable(table);
    }
    ref4 = indicator.design.aggregations || [];
    for (n = 0, len5 = ref4.length; n < len5; n++) {
      aggregation = ref4[n];
      table = schema.getTable(aggregation.table);
      if (!table) {
        continue;
      }
      aggrColumn = _.omit(aggregation, "table");
      aggrColumn.id = "indicator_values:" + indicator._id + "." + aggregation.id;
      table = this.addIndicatorToTable(table, aggrColumn, indicator.design.recommended);
      schema = schema.addTable(table);
    }
    if (!schema.getTable("response_indicators")) {
      schema = schema.addTable({
        id: "response_indicators",
        name: {
          en: "Indicators",
          _base: "en"
        },
        desc: {
          en: "All Indicators",
          _base: "en"
        },
        primaryKey: "_id",
        contents: [
          {
            id: "submittedOn",
            type: "datetime",
            name: {
              en: "Date",
              _base: "en"
            }
          }
        ]
      });
    }
    column = {
      type: "join",
      id: indicator._id,
      name: indicator.design.name,
      desc: indicator.design.desc,
      code: indicator.design.code,
      join: {
        type: "1-n",
        toTable: "indicator_values:" + indicator._id,
        fromColumn: "_id",
        toColumn: "response"
      },
      deprecated: indicator.deprecated
    };
    table = update(schema.getTable("response_indicators"), {
      contents: {
        $push: [column]
      }
    });
    schema = schema.addTable(table);
    return schema.addTable({
      id: "indicator_values:" + indicator._id,
      name: indicator.design.name,
      desc: indicator.design.desc,
      code: indicator.design.code,
      primaryKey: "_id",
      ordering: "datetime",
      contents: contents,
      deprecated: indicator.deprecated
    });
  };

  IndicatorSchemaBuilder.prototype.addResponseIndicatorProperty = function(schema, indicator, property, contents, reverseJoins) {
    var column, ref, ref1;
    switch (property.type) {
      case "text":
      case "date":
      case "datetime":
        return contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: property.type,
          expr: property.expr,
          deprecated: property.deprecated,
          jsonql: !property.expr ? {
            type: "op",
            op: "->>",
            exprs: [
              {
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, property.id
            ]
          } : void 0
        });
      case "number":
        return contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: property.type,
          expr: property.expr,
          deprecated: property.deprecated,
          jsonql: !property.expr ? {
            type: "op",
            op: "::decimal",
            exprs: [
              {
                type: "op",
                op: "->>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, property.id
                ]
              }
            ]
          } : void 0
        });
      case "boolean":
        return contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: property.type,
          expr: property.expr,
          deprecated: property.deprecated,
          jsonql: !property.expr ? {
            type: "op",
            op: "::boolean",
            exprs: [
              {
                type: "op",
                op: "->>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, property.id
                ]
              }
            ]
          } : void 0
        });
      case "enum":
      case "enumset":
        return contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: property.type,
          expr: property.expr,
          enumValues: property.enumValues,
          deprecated: property.deprecated,
          jsonql: !property.expr ? {
            type: "op",
            op: "->>",
            exprs: [
              {
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, property.id
            ]
          } : void 0
        });
      case "geometry":
        return contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: property.type,
          expr: property.expr,
          deprecated: property.deprecated,
          jsonql: !property.expr ? {
            type: "op",
            op: "::geometry",
            exprs: [
              {
                type: "op",
                op: "->>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, property.id
                ]
              }
            ]
          } : void 0
        });
      case "image":
      case "imagelist":
      case "text[]":
        return contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: property.type,
          expr: property.expr,
          deprecated: property.deprecated,
          jsonql: !property.expr ? {
            type: "op",
            op: "->",
            exprs: [
              {
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, property.id
            ]
          } : void 0
        });
      case "id":
        if (property.idTable === "admin_regions") {
          column = {
            type: "op",
            op: "::integer",
            exprs: [
              {
                type: "op",
                op: "->>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, property.id
                ]
              }
            ]
          };
        } else {
          column = {
            type: "op",
            op: "->>",
            exprs: [
              {
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, property.id
            ]
          };
        }
        contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: "join",
          expr: property.expr,
          join: {
            type: "n-1",
            toTable: property.idTable,
            fromColumn: column,
            toColumn: ((ref = schema.getTable(property.idTable)) != null ? ref.primaryKey : void 0) || "_id"
          },
          deprecated: property.deprecated
        });
        if (!property.idTable) {
          console.error("MISSING idTable for " + indicator._id + "." + property.id);
        }
        if (property.idTable && property.idTable.match(/entities\./)) {
          return reverseJoins.push({
            table: property.idTable,
            column: {
              id: "!indicator_values:" + indicator._id + "." + property.id,
              code: indicator.design.code,
              name: indicator.design.name,
              desc: indicator.design.desc,
              type: "join",
              join: {
                type: "1-n",
                toTable: "indicator_values:" + indicator._id,
                fromColumn: ((ref1 = schema.getTable(property.idTable)) != null ? ref1.primaryKey : void 0) || "_id",
                toColumn: column
              },
              deprecated: property.deprecated
            }
          });
        }
        break;
      case "expr":
        return contents.push({
          id: property.id,
          code: property.code,
          name: property.name,
          desc: property.desc,
          type: "expr",
          expr: property.expr,
          deprecated: property.deprecated
        });
    }
  };

  IndicatorSchemaBuilder.prototype.addExpressionIndicator = function(schema, indicator) {
    var column, table;
    table = schema.getTable(indicator.design.table);
    column = {
      id: "indicators:" + indicator._id,
      type: "expr",
      expr: indicator.design.expr,
      name: indicator.design.name,
      desc: indicator.design.desc,
      deprecated: indicator.deprecated
    };
    table = this.addIndicatorToTable(table, column, indicator.design.recommended);
    schema = schema.addTable(table);
    return schema;
  };

  IndicatorSchemaBuilder.prototype.addIndicatorToTable = function(table, column, recommended) {
    var section, sectionIndex;
    sectionIndex = _.findIndex(table.contents, function(item) {
      return item.id === '!indicators';
    });
    if (sectionIndex < 0) {
      section = {
        id: "!indicators",
        type: "section",
        name: {
          en: "Related Indicators"
        },
        desc: {
          en: "Indicators are standardized information that are related to this site"
        },
        contents: []
      };
      table = update(table, {
        contents: {
          $push: [section]
        }
      });
      sectionIndex = _.findIndex(table.contents, function(item) {
        return item.id === '!indicators';
      });
    }
    section = update(table.contents[sectionIndex], {
      contents: {
        $push: [column]
      }
    });
    table = update(table, {
      contents: {
        $splice: [[sectionIndex, 1, section]]
      }
    });
    return table;
  };

  return IndicatorSchemaBuilder;

})();
