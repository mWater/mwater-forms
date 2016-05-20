
/*

Topological sorting is done, but adding indicator calculations to schema can still fail if expressions are invalid
since they are compiled to build the jsonql field.
 */
var ColumnNotFoundException, ExprCompiler, ExprUtils, FormSchemaBuilder, TopoSort, _, appendStr, formUtils, mapTree, update;

_ = require('lodash');

formUtils = require('../src/formUtils');

ExprUtils = require('mwater-expressions').ExprUtils;

ExprCompiler = require('mwater-expressions').ExprCompiler;

update = require('update-object');

ColumnNotFoundException = require('mwater-expressions').ColumnNotFoundException;

TopoSort = require('topo-sort');

module.exports = FormSchemaBuilder = (function() {
  function FormSchemaBuilder() {}

  FormSchemaBuilder.prototype.addForm = function(schema, form, cloneForms) {
    var contents, deploymentValues;
    contents = [];
    deploymentValues = _.map(form.deployments, function(dep) {
      return {
        id: dep._id,
        name: {
          en: dep.name
        }
      };
    });
    contents.push({
      id: "deployment",
      type: "enum",
      name: {
        en: "Deployment"
      },
      enumValues: deploymentValues
    });
    contents.push({
      id: "user",
      type: "text",
      name: {
        en: "Enumerator"
      }
    });
    contents.push({
      id: "status",
      type: "enum",
      name: {
        en: "Status"
      },
      enumValues: [
        {
          id: "draft",
          name: {
            en: "Draft"
          }
        }, {
          id: "pending",
          name: {
            en: "Pending"
          }
        }, {
          id: "final",
          name: {
            en: "Final"
          }
        }, {
          id: "rejected",
          name: {
            en: "Rejected"
          }
        }
      ]
    });
    contents.push({
      id: "code",
      type: "text",
      name: {
        en: "Response Code"
      }
    });
    contents.push({
      id: "submittedOn",
      type: "datetime",
      name: {
        en: "Submitted On"
      }
    });
    this.addFormItem(form, form.design, contents);
    schema = schema.addTable({
      id: "responses:" + form._id,
      name: form.design.name,
      primaryKey: "_id",
      contents: contents
    });
    schema = this.addReverseEntityJoins(schema, form);
    schema = this.addRosterTables(schema, form);
    schema = this.addIndicatorCalculations(schema, form, false);
    if (form.isMaster) {
      schema = this.addMasterForm(schema, form, cloneForms);
    }
    return schema;
  };

  FormSchemaBuilder.prototype.addReverseEntityJoins = function(schema, form) {
    var column, i, join, len, ref;
    ref = schema.getColumns("responses:" + form._id);
    for (i = 0, len = ref.length; i < len; i++) {
      column = ref[i];
      if (column.type === "join" && column.join.type === "n-1") {
        join = {
          id: "responses:" + form._id + ":" + column.id,
          name: appendStr(appendStr(form.design.name, ": "), column.name),
          type: "join",
          join: {
            type: "1-n",
            toTable: "responses:" + form._id,
            fromColumn: column.join.toColumn,
            toColumn: column.join.fromColumn
          }
        };
        if (schema.getTable(column.join.toTable)) {
          schema = schema.addTable(update(schema.getTable(column.join.toTable), {
            contents: {
              $push: [join]
            }
          }));
        }
      }
    }
    return schema;
  };

  FormSchemaBuilder.prototype.addRosterTables = function(schema, form) {
    var contents, i, item, j, len, len1, ref, ref1, ref2, rosterItem;
    ref = formUtils.allItems(form.design);
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if ((ref1 = item._type) === "RosterGroup" || ref1 === "RosterMatrix") {
        if (!item.rosterId) {
          contents = [
            {
              id: "response",
              type: "join",
              name: {
                en: "Response"
              },
              join: {
                type: "n-1",
                toTable: "responses:" + form._id,
                fromColumn: "response",
                toColumn: "_id"
              }
            }, {
              id: "index",
              type: "number",
              name: {
                en: "Index"
              }
            }
          ];
        } else {
          contents = schema.getTable("responses:" + form._id + ":roster:" + item.rosterId).contents.slice();
        }
        ref2 = item.contents;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          rosterItem = ref2[j];
          this.addFormItem(form, rosterItem, contents);
        }
        schema = schema.addTable({
          id: "responses:" + form._id + ":roster:" + (item.rosterId || item._id),
          name: appendStr(appendStr(form.design.name, ": "), item.name),
          primaryKey: "_id",
          contents: contents
        });
      }
    }
    return schema;
  };

  FormSchemaBuilder.prototype.addMasterForm = function(schema, form, cloneForms) {
    var cloneForm, contents, deploymentValues, i, len;
    contents = [];
    contents.push({
      id: "user",
      type: "text",
      name: {
        en: "Enumerator"
      }
    });
    contents.push({
      id: "submittedOn",
      type: "datetime",
      name: {
        en: "Submitted On"
      }
    });
    deploymentValues = _.map(form.deployments, function(dep) {
      return {
        id: dep._id,
        name: {
          en: dep.name
        }
      };
    });
    if (cloneForms) {
      for (i = 0, len = cloneForms.length; i < len; i++) {
        cloneForm = cloneForms[i];
        deploymentValues = deploymentValues.concat(_.map(cloneForm.deployments, function(dep) {
          return {
            id: dep._id,
            name: appendStr(cloneForm.design.name, " - " + dep.name)
          };
        }));
      }
    }
    contents.push({
      id: "deployment",
      type: "enum",
      name: {
        en: "Deployment"
      },
      enumValues: deploymentValues
    });
    this.addFormItem(form, form.design, contents);
    contents = mapTree(contents, (function(_this) {
      return function(item) {
        switch (item.type) {
          case "text":
          case "date":
          case "datetime":
          case "enum":
            return update(item, {
              jsonql: {
                $set: {
                  type: "op",
                  op: "->>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, item.id
                  ]
                }
              }
            });
          case "number":
            return update(item, {
              jsonql: {
                $set: {
                  type: "op",
                  op: "convert_to_decimal",
                  exprs: [
                    {
                      type: "op",
                      op: "->>",
                      exprs: [
                        {
                          type: "field",
                          tableAlias: "{alias}",
                          column: "data"
                        }, item.id
                      ]
                    }
                  ]
                }
              }
            });
          case "boolean":
            return update(item, {
              jsonql: {
                $set: {
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
                        }, item.id
                      ]
                    }
                  ]
                }
              }
            });
          case "geometry":
            return update(item, {
              jsonql: {
                $set: {
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
                        }, item.id
                      ]
                    }
                  ]
                }
              }
            });
          case "join":
            return update(item, {
              join: {
                fromColumn: {
                  $set: {
                    type: "op",
                    op: "->>",
                    exprs: [
                      {
                        type: "field",
                        tableAlias: "{alias}",
                        column: "data"
                      }, item.id
                    ]
                  }
                },
                toColumn: {
                  $set: "_id"
                }
              }
            });
          default:
            return update(item, {
              jsonql: {
                $set: {
                  type: "op",
                  op: "->",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, item.id
                  ]
                }
              }
            });
        }
      };
    })(this));
    schema = schema.addTable({
      id: "master_responses:" + form._id,
      name: appendStr(form.design.name, " (Master)"),
      primaryKey: "response",
      contents: contents
    });
    return schema = this.addIndicatorCalculations(schema, form, true);
  };

  FormSchemaBuilder.prototype.addIndicatorCalculations = function(schema, form, isMaster) {
    var contents, i, indicatorCalculation, indicatorSectionContents, indicatorsSection, len, ref, tableId;
    tableId = isMaster ? "master_responses:" + form._id : "responses:" + form._id;
    if (!form.indicatorCalculations || form.indicatorCalculations.length === 0) {
      return schema;
    }
    indicatorsSection = {
      type: "section",
      name: {
        _base: "en",
        en: "Indicators"
      },
      contents: []
    };
    schema = schema.addTable(update(schema.getTable(tableId), {
      contents: {
        $push: [indicatorsSection]
      }
    }));
    ref = this.orderIndicatorCalculation(form.indicatorCalculations);
    for (i = 0, len = ref.length; i < len; i++) {
      indicatorCalculation = ref[i];
      indicatorsSection = _.last(schema.getTable(tableId).contents);
      indicatorSectionContents = indicatorsSection.contents.slice();
      indicatorSectionContents.push(this.createIndicatorCalculationSection(indicatorCalculation, schema, isMaster));
      contents = schema.getTable(tableId).contents.slice();
      contents[contents.length - 1] = update(indicatorsSection, {
        contents: {
          $set: indicatorSectionContents
        }
      });
      schema = schema.addTable(update(schema.getTable(tableId), {
        contents: {
          $set: contents
        }
      }));
    }
    return schema;
  };

  FormSchemaBuilder.prototype.createIndicatorCalculationSection = function(indicatorCalculation, schema, isMaster) {
    var contents, exprCompiler, indicTable, section;
    indicTable = schema.getTable("indicator_values:" + indicatorCalculation.indicator);
    if (!indicTable) {
      return schema;
    }
    exprCompiler = new ExprCompiler(schema);
    contents = _.compact(_.map(indicTable.contents, function(item) {
      return mapTree(item, function(col) {
        var expression, fromColumn, jsonql, toColumn;
        if (col.type === "section") {
          return col;
        }
        expression = indicatorCalculation.expressions[col.id];
        if (isMaster && expression) {
          expression = JSON.parse(JSON.stringify(expression).replace(/table":"responses:/g, "table\":\"master_responses:"));
        }
        if (col.type === "join") {
          if (col.join.type !== "n-1") {
            return null;
          }
          fromColumn = exprCompiler.compileExpr({
            expr: expression,
            tableAlias: "{alias}"
          });
          toColumn = schema.getTable(col.join.toTable).primaryKey;
          col = update(col, {
            id: {
              $set: "indicator_calculation:" + indicatorCalculation._id + ":" + col.id
            },
            join: {
              fromColumn: {
                $set: fromColumn
              },
              toColumn: {
                $set: toColumn
              }
            }
          });
          return col;
        }
        jsonql = exprCompiler.compileExpr({
          expr: expression,
          tableAlias: "{alias}"
        });
        if (!jsonql) {
          jsonql = {
            type: "literal",
            value: null
          };
        }
        col = update(col, {
          id: {
            $set: "indicator_calculation:" + indicatorCalculation._id + ":" + col.id
          },
          jsonql: {
            $set: jsonql
          }
        });
        return col;
      });
    }));
    section = {
      type: "section",
      name: schema.getTable("indicator_values:" + indicatorCalculation.indicator).name,
      contents: contents
    };
    return section;
  };

  FormSchemaBuilder.prototype.orderIndicatorCalculation = function(indicatorCalculations) {
    var col, expr, exprUtils, i, ic, id, j, len, len1, map, match, orderedIds, ref, refedColumns, refedIndicatorCalculationIds, toposort;
    toposort = new TopoSort();
    exprUtils = new ExprUtils();
    for (i = 0, len = indicatorCalculations.length; i < len; i++) {
      ic = indicatorCalculations[i];
      refedColumns = [];
      ref = ic.expressions;
      for (id in ref) {
        expr = ref[id];
        refedColumns = _.union(refedColumns, exprUtils.getImmediateReferencedColumns(expr));
      }
      refedColumns = _.union(refedColumns, exprUtils.getImmediateReferencedColumns(ic.condition));
      refedIndicatorCalculationIds = [];
      for (j = 0, len1 = refedColumns.length; j < len1; j++) {
        col = refedColumns[j];
        match = col.match(/^indicator_calculation:(.+?):.+$/);
        if (match) {
          refedIndicatorCalculationIds = _.union(refedIndicatorCalculationIds, [match[1]]);
        }
      }
      toposort.add(ic._id, refedIndicatorCalculationIds);
    }
    orderedIds = toposort.sort();
    orderedIds.reverse();
    map = _.indexBy(indicatorCalculations, "_id");
    return _.map(orderedIds, function(id) {
      return map[id];
    });
  };

  FormSchemaBuilder.prototype.addFormItem = function(form, item, contents) {
    var addColumn, answerType, choice, codeExpr, column, i, j, k, len, len1, len2, name, ref, ref1, ref2, ref3, ref4, results, sectionContents, subitem;
    addColumn = (function(_this) {
      return function(column) {
        return contents.push(column);
      };
    })(this);
    if (item.contents) {
      if (item._type === "Form") {
        ref = item.contents;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          subitem = ref[i];
          results.push(this.addFormItem(form, subitem, contents));
        }
        return results;
      } else if ((ref1 = item._type) === "Section" || ref1 === "Group") {
        sectionContents = [];
        ref2 = item.contents;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          subitem = ref2[j];
          this.addFormItem(form, subitem, sectionContents);
        }
        return contents.push({
          type: "section",
          name: item.name,
          contents: sectionContents
        });
      } else if ((ref3 = item._type) === "RosterGroup" || ref3 === "RosterMatrix") {
        if (!item.rosterId) {
          return contents.push({
            id: "data:" + item._id,
            type: "join",
            name: item.name,
            join: {
              type: "1-n",
              toTable: "responses:" + form._id + ":roster:" + item._id,
              fromColumn: "_id",
              toColumn: "response"
            }
          });
        }
      }
    } else if (formUtils.isQuestion(item)) {
      answerType = formUtils.getAnswerType(item);
      switch (answerType) {
        case "text":
          column = {
            id: "data:" + item._id + ":value",
            type: "text",
            name: item.text,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "number":
          column = {
            id: "data:" + item._id + ":value",
            type: "number",
            name: item.text,
            jsonql: {
              type: "op",
              op: "convert_to_decimal",
              exprs: [
                {
                  type: "op",
                  op: "#>>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, "{" + item._id + ",value}"
                  ]
                }
              ]
            }
          };
          addColumn(column);
          break;
        case "choice":
          column = {
            id: "data:" + item._id + ":value",
            type: "enum",
            name: item.text,
            enumValues: _.map(item.choices, function(c) {
              return {
                id: c.id,
                name: c.label
              };
            }),
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "choices":
          column = {
            id: "data:" + item._id + ":value",
            type: "enumset",
            name: item.text,
            enumValues: _.map(item.choices, function(c) {
              return {
                id: c.id,
                name: c.label
              };
            }),
            jsonql: {
              type: "op",
              op: "#>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "date":
          if (item.format.match(/ss|LLL|lll|m|h|H/)) {
            column = {
              id: "data:" + item._id + ":value",
              type: "datetime",
              name: item.text,
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",value}"
                ]
              }
            };
            addColumn(column);
          } else {
            column = {
              id: "data:" + item._id + ":value",
              type: "date",
              name: item.text,
              jsonql: {
                type: "op",
                op: "substr",
                exprs: [
                  {
                    type: "op",
                    op: "rpad",
                    exprs: [
                      {
                        type: "op",
                        op: "#>>",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "{alias}",
                            column: "data"
                          }, "{" + item._id + ",value}"
                        ]
                      }, 10, '-01-01'
                    ]
                  }, 1, 10
                ]
              }
            };
            addColumn(column);
          }
          break;
        case "boolean":
          column = {
            id: "data:" + item._id + ":value",
            type: "boolean",
            name: item.text,
            jsonql: {
              type: "op",
              op: "::boolean",
              exprs: [
                {
                  type: "op",
                  op: "#>>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, "{" + item._id + ",value}"
                  ]
                }
              ]
            }
          };
          addColumn(column);
          break;
        case "units":
          name = appendStr(item.text, " (magnitude)");
          column = {
            id: "data:" + item._id + ":value:quantity",
            type: "number",
            name: name,
            jsonql: {
              type: "op",
              op: "::decimal",
              exprs: [
                {
                  type: "op",
                  op: "#>>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, "{" + item._id + ",value,quantity}"
                  ]
                }
              ]
            }
          };
          addColumn(column);
          column = {
            id: "data:" + item._id + ":value:units",
            type: "enum",
            name: appendStr(item.text, " (units)"),
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{" + item._id + ",value,units}"
              ]
            },
            enumValues: _.map(item.units, function(c) {
              return {
                id: c.id,
                name: c.label
              };
            })
          };
          addColumn(column);
          break;
        case "location":
          column = {
            id: "data:" + item._id + ":value",
            type: "geometry",
            name: item.text,
            jsonql: {
              type: "op",
              op: "ST_SetSRID",
              exprs: [
                {
                  type: "op",
                  op: "ST_MakePoint",
                  exprs: [
                    {
                      type: "op",
                      op: "::decimal",
                      exprs: [
                        {
                          type: "op",
                          op: "#>>",
                          exprs: [
                            {
                              type: "field",
                              tableAlias: "{alias}",
                              column: "data"
                            }, "{" + item._id + ",value,longitude}"
                          ]
                        }
                      ]
                    }, {
                      type: "op",
                      op: "::decimal",
                      exprs: [
                        {
                          type: "op",
                          op: "#>>",
                          exprs: [
                            {
                              type: "field",
                              tableAlias: "{alias}",
                              column: "data"
                            }, "{" + item._id + ",value,latitude}"
                          ]
                        }
                      ]
                    }
                  ]
                }, 4326
              ]
            }
          };
          addColumn(column);
          column = {
            id: "data:" + item._id + ":value:accuracy",
            type: "number",
            name: appendStr(item.text, " (accuracy)"),
            jsonql: {
              type: "op",
              op: "::decimal",
              exprs: [
                {
                  type: "op",
                  op: "#>>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, "{" + item._id + ",value,accuracy}"
                  ]
                }
              ]
            }
          };
          addColumn(column);
          column = {
            id: "data:" + item._id + ":value:altitude",
            type: "number",
            name: appendStr(item.text, " (altitude)"),
            jsonql: {
              type: "op",
              op: "::decimal",
              exprs: [
                {
                  type: "op",
                  op: "#>>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, "{" + item._id + ",value,altitude}"
                  ]
                }
              ]
            }
          };
          addColumn(column);
          break;
        case "site":
          codeExpr = {
            type: "op",
            op: "coalesce",
            exprs: [
              {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",value,code}"
                ]
              }, {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",value}"
                ]
              }
            ]
          };
          column = {
            id: "data:" + item._id + ":value",
            type: "join",
            name: item.text,
            join: {
              type: "n-1",
              toTable: item.siteTypes ? "entities." + _.first(item.siteTypes).toLowerCase().replace(/ /g, "_") : "entities.water_point",
              fromColumn: codeExpr,
              toColumn: "code"
            }
          };
          addColumn(column);
          break;
        case "entity":
          column = {
            id: "data:" + item._id + ":value",
            type: "join",
            name: item.text,
            join: {
              type: "n-1",
              toTable: "entities." + item.entityType,
              fromColumn: {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",value}"
                ]
              },
              toColumn: "_id"
            }
          };
          addColumn(column);
          break;
        case "texts":
          column = {
            id: "data:" + item._id + ":value",
            type: "text[]",
            name: item.text,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "image":
          column = {
            id: "data:" + item._id + ":value",
            type: "image",
            name: item.text,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "images":
          column = {
            id: "data:" + item._id + ":value",
            type: "imagelist",
            name: item.text,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "admin_region":
          column = {
            id: "data:" + item._id + ":value",
            name: item.text,
            type: "join",
            join: {
              type: "n-1",
              toTable: "admin_regions",
              fromColumn: {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",value}"
                ]
              },
              toColumn: "_id"
            }
          };
          addColumn(column);
      }
      if (answerType === 'choice' || answerType === 'choices') {
        ref4 = item.choices;
        for (k = 0, len2 = ref4.length; k < len2; k++) {
          choice = ref4[k];
          if (choice.specify) {
            column = {
              id: "data:" + item._id + ":specify:" + choice.id,
              type: "text",
              name: appendStr(appendStr(appendStr(item.text, " ("), choice.label), ")"),
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",specify," + choice.id + "}"
                ]
              }
            };
            addColumn(column);
          }
        }
      }
      if (item.commentsField) {
        column = {
          id: "data:" + item._id + ":comments",
          type: "text",
          name: appendStr(item.text, " (Comments)"),
          jsonql: {
            type: "op",
            op: "#>>",
            exprs: [
              {
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, "{" + item._id + ",comments}"
            ]
          }
        };
        addColumn(column);
      }
      if (item.recordTimestamp) {
        column = {
          id: "data:" + item._id + ":timestamp",
          type: "datetime",
          name: appendStr(item.text, " (Time Answered)"),
          jsonql: {
            type: "op",
            op: "#>>",
            exprs: [
              {
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, "{" + item._id + ",timestamp}"
            ]
          }
        };
        addColumn(column);
      }
      if (item.recordLocation) {
        column = {
          id: "data:" + item._id + ":location",
          type: "geometry",
          name: appendStr(item.text, " (Location Answered)"),
          jsonql: {
            type: "op",
            op: "ST_SetSRID",
            exprs: [
              {
                type: "op",
                op: "ST_MakePoint",
                exprs: [
                  {
                    type: "op",
                    op: "::decimal",
                    exprs: [
                      {
                        type: "op",
                        op: "#>>",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "{alias}",
                            column: "data"
                          }, "{" + item._id + ",location,longitude}"
                        ]
                      }
                    ]
                  }, {
                    type: "op",
                    op: "::decimal",
                    exprs: [
                      {
                        type: "op",
                        op: "#>>",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "{alias}",
                            column: "data"
                          }, "{" + item._id + ",location,latitude}"
                        ]
                      }
                    ]
                  }
                ]
              }, 4326
            ]
          }
        };
        addColumn(column);
        column = {
          id: "data:" + item._id + ":location:accuracy",
          type: "number",
          name: appendStr(item.text, " (Location Answered - accuracy)"),
          jsonql: {
            type: "op",
            op: "::decimal",
            exprs: [
              {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",location,accuracy}"
                ]
              }
            ]
          }
        };
        addColumn(column);
        column = {
          id: "data:" + item._id + ":location:altitude",
          type: "number",
          name: appendStr(item.text, " (Location Answered - altitude)"),
          jsonql: {
            type: "op",
            op: "::decimal",
            exprs: [
              {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",location,altitude}"
                ]
              }
            ]
          }
        };
        addColumn(column);
      }
      if (item.alternates && item.alternates.na) {
        column = {
          id: "data:" + item._id + ":na",
          type: "boolean",
          name: appendStr(item.text, " (Not Applicable)"),
          jsonql: {
            type: "op",
            op: "=",
            exprs: [
              {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",alternate}"
                ]
              }, "na"
            ]
          }
        };
        addColumn(column);
      }
      if (item.alternates && item.alternates.dontknow) {
        column = {
          id: "data:" + item._id + ":dontknow",
          type: "boolean",
          name: appendStr(item.text, " (Don't Know)"),
          jsonql: {
            type: "op",
            op: "=",
            exprs: [
              {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{" + item._id + ",alternate}"
                ]
              }, "dontknow"
            ]
          }
        };
        return addColumn(column);
      }
    }
  };

  return FormSchemaBuilder;

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
