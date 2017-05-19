var ColumnNotFoundException, ConditionsExprCompiler, ExprCompiler, ExprUtils, FormSchemaBuilder, TopoSort, _, appendStr, formUtils, healthRiskEnum, mapTree, update;

_ = require('lodash');

formUtils = require('../src/formUtils');

ExprUtils = require('mwater-expressions').ExprUtils;

ExprCompiler = require('mwater-expressions').ExprCompiler;

update = require('update-object');

ColumnNotFoundException = require('mwater-expressions').ColumnNotFoundException;

TopoSort = require('topo-sort');

ConditionsExprCompiler = require('./ConditionsExprCompiler');

healthRiskEnum = require('./answers/aquagenxCBTUtils').healthRiskEnum;

module.exports = FormSchemaBuilder = (function() {
  function FormSchemaBuilder() {}

  FormSchemaBuilder.prototype.addForm = function(schema, form, cloneForms, isAdmin) {
    var conditionsExprCompiler, contents, deploymentValues, metadata, reverseJoins;
    if (isAdmin == null) {
      isAdmin = true;
    }
    contents = [];
    metadata = [];
    deploymentValues = _.map(form.deployments, function(dep) {
      return {
        id: dep._id,
        name: {
          en: dep.name
        }
      };
    });
    metadata.push({
      id: "deployment",
      type: "enum",
      name: {
        en: "Deployment"
      },
      enumValues: deploymentValues
    });
    metadata.push({
      id: "user",
      name: {
        en: "Enumerator"
      },
      type: "join",
      join: {
        type: "n-1",
        toTable: "users",
        fromColumn: "user",
        toColumn: "_id"
      }
    });
    metadata.push({
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
    metadata.push({
      id: "code",
      type: "text",
      name: {
        en: "Response Code"
      }
    });
    metadata.push({
      id: "startedOn",
      type: "datetime",
      name: {
        en: "Drafted On"
      }
    });
    metadata.push({
      id: "submittedOn",
      type: "datetime",
      name: {
        en: "Submitted On"
      }
    });
    metadata.push({
      id: "ipAddress",
      type: "text",
      name: {
        en: "IP Address"
      }
    });
    contents.push({
      id: "metadata",
      type: "section",
      name: {
        en: "Response Metadata"
      },
      desc: {
        en: "Information about the response such as status, date, and IP Address"
      },
      contents: metadata
    });
    conditionsExprCompiler = new ConditionsExprCompiler(form.design);
    reverseJoins = [];
    this.addFormItem(form.design, contents, "responses:" + form._id, conditionsExprCompiler, null, reverseJoins);
    schema = schema.addTable({
      id: "responses:" + form._id,
      name: form.design.name,
      primaryKey: "_id",
      contents: contents,
      ordering: "submittedOn"
    });
    schema = this.addReverseJoins(schema, form, reverseJoins);
    schema = this.addRosterTables(schema, form, conditionsExprCompiler);
    if (isAdmin) {
      schema = this.addConfidentialData(schema, form, conditionsExprCompiler);
      schema = this.addConfidentialDataForRosters(schema, form, conditionsExprCompiler);
    }
    schema = this.addCalculations(schema, form);
    schema = this.addIndicatorCalculations(schema, form, false);
    if (form.isMaster) {
      schema = this.addMasterForm(schema, form, cloneForms);
    }
    return schema;
  };

  FormSchemaBuilder.prototype.addReverseJoins = function(schema, form, reverseJoins) {
    var column, i, len, reverseJoin, section, sectionIndex, table;
    for (i = 0, len = reverseJoins.length; i < len; i++) {
      reverseJoin = reverseJoins[i];
      column = _.clone(reverseJoin.column);
      column.name = appendStr(appendStr(form.design.name, ": "), column.name);
      if (schema.getTable(reverseJoin.table)) {
        table = schema.getTable(reverseJoin.table);
        sectionIndex = _.findIndex(table.contents, function(item) {
          return item.id === "!related_forms";
        });
        if (sectionIndex < 0) {
          section = {
            type: "section",
            id: "!related_forms",
            name: {
              en: "Related Surveys"
            },
            desc: {
              en: "Surveys that are linked by a question to " + table.name.en
            },
            contents: []
          };
          table = update(table, {
            contents: {
              $push: [section]
            }
          });
          sectionIndex = _.findIndex(table.contents, function(item) {
            return item.id === "!related_forms";
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
        schema = schema.addTable(table);
      }
    }
    return schema;
  };

  FormSchemaBuilder.prototype.addRosterTables = function(schema, form, conditionsExprCompiler) {
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
          this.addFormItem(rosterItem, contents, "responses:" + form._id + ":roster:" + (item.rosterId || item._id), conditionsExprCompiler);
        }
        schema = schema.addTable({
          id: "responses:" + form._id + ":roster:" + (item.rosterId || item._id),
          name: appendStr(appendStr(form.design.name, ": "), item.name),
          primaryKey: "_id",
          ordering: "index",
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
    this.addFormItem(form.design, contents, "responses:" + form._id);
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
    var contents, i, indicatorCalculation, indicatorCalculationSection, indicatorSectionContents, indicatorsSection, len, ref, tableId;
    if (!form.indicatorCalculations || form.indicatorCalculations.length === 0) {
      return schema;
    }
    ref = form.indicatorCalculations;
    for (i = 0, len = ref.length; i < len; i++) {
      indicatorCalculation = ref[i];
      tableId = isMaster ? "master_responses:" + form._id : "responses:" + form._id;
      if (indicatorCalculation.roster) {
        tableId += ":roster:" + indicatorCalculation.roster;
      }
      indicatorsSection = _.last(schema.getTable(tableId).contents);
      if (indicatorsSection.id !== "indicators") {
        indicatorsSection = {
          id: "indicators",
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
      }
      indicatorSectionContents = indicatorsSection.contents.slice();
      indicatorCalculationSection = this.createIndicatorCalculationSection(indicatorCalculation, schema, isMaster);
      if (indicatorCalculationSection) {
        indicatorSectionContents.push(indicatorCalculationSection);
      }
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
      return null;
    }
    exprCompiler = new ExprCompiler(schema);
    contents = _.compact(_.map(indicTable.contents, function(item) {
      return mapTree(item, function(col) {
        var condition, expression, fromColumn, jsonql, toColumn;
        if (col.type === "section") {
          return col;
        }
        if (col.expr) {
          return null;
        }
        expression = indicatorCalculation.expressions[col.id];
        condition = indicatorCalculation.condition;
        if (isMaster && expression) {
          expression = JSON.parse(JSON.stringify(expression).replace(/table":"responses:/g, "table\":\"master_responses:"));
        }
        if (isMaster && condition) {
          condition = JSON.parse(JSON.stringify(condition).replace(/table":"responses:/g, "table\":\"master_responses:"));
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
        if (!expression) {
          jsonql = {
            type: "literal",
            value: null
          };
          col = update(col, {
            id: {
              $set: "indicator_calculation:" + indicatorCalculation._id + ":" + col.id
            },
            jsonql: {
              $set: jsonql
            }
          });
          return col;
        }
        if (condition) {
          expression = {
            type: "case",
            table: expression.table,
            cases: [
              {
                when: condition,
                then: expression
              }
            ]
          };
        }
        col = _.omit(update(col, {
          id: {
            $set: "indicator_calculation:" + indicatorCalculation._id + ":" + col.id
          },
          expr: {
            $set: expression
          }
        }), "jsonql");
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

  FormSchemaBuilder.prototype.addConfidentialDataForRosters = function(schema, form, conditionsExprCompiler) {
    var confidentialDataSection, confidentialDataSectionContents, contents, i, index, item, j, len, len1, ref, ref1, ref2, rosterItem, tableId;
    ref = formUtils.allItems(form.design);
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if ((ref1 = item._type) === "RosterGroup" || ref1 === "RosterMatrix") {
        tableId = "responses:" + form._id + ":roster:" + (item.rosterId || item._id);
        contents = schema.getTable(tableId).contents.slice();
        ref2 = item.contents;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          rosterItem = ref2[j];
          if (rosterItem.confidential) {
            confidentialDataSection = _.find(contents, {
              id: "confidentialData"
            });
            if (!confidentialDataSection) {
              confidentialDataSection = {
                id: "confidentialData",
                type: "section",
                name: {
                  _base: "en",
                  en: "Confidential Data"
                },
                contents: []
              };
              schema = schema.addTable(update(schema.getTable(tableId), {
                contents: {
                  $push: [confidentialDataSection]
                }
              }));
            }
            confidentialDataSectionContents = confidentialDataSection.contents.slice();
            this.addFormItem(rosterItem, confidentialDataSectionContents, tableId, conditionsExprCompiler, null, [], true);
            contents = schema.getTable(tableId).contents.slice();
            index = _.findIndex(contents, {
              id: "confidentialData"
            });
            contents[index] = update(confidentialDataSection, {
              contents: {
                $set: confidentialDataSectionContents
              }
            });
            schema = schema.addTable(update(schema.getTable(tableId), {
              contents: {
                $set: contents
              }
            }));
          }
        }
      }
    }
    return schema;
  };

  FormSchemaBuilder.prototype.addConfidentialData = function(schema, form, conditionsExprCompiler) {
    var addData, i, item, j, len, len1, ref, ref1, ref2, subItem, tableId;
    tableId = "responses:" + form._id;
    addData = (function(_this) {
      return function(question) {
        var confidentialDataSection, confidentialDataSectionContents, contents, index;
        if (question.confidential) {
          confidentialDataSection = _.find(schema.getTable(tableId).contents, {
            id: "confidentialData"
          });
          if (!confidentialDataSection) {
            confidentialDataSection = {
              id: "confidentialData",
              type: "section",
              name: {
                _base: "en",
                en: "Confidential Data"
              },
              contents: []
            };
            schema = schema.addTable(update(schema.getTable(tableId), {
              contents: {
                $push: [confidentialDataSection]
              }
            }));
          }
          confidentialDataSectionContents = confidentialDataSection.contents.slice();
          _this.addFormItem(question, confidentialDataSectionContents, "responses:" + form._id, conditionsExprCompiler, null, [], true);
          contents = schema.getTable(tableId).contents.slice();
          index = _.findIndex(contents, {
            id: "confidentialData"
          });
          contents[index] = update(confidentialDataSection, {
            contents: {
              $set: confidentialDataSectionContents
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
    })(this);
    ref = form.design.contents;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item.contents && ((ref1 = item._type) === "Section" || ref1 === "Group")) {
        ref2 = item.contents;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          subItem = ref2[j];
          schema = addData(subItem);
        }
      } else if (formUtils.isQuestion(item)) {
        schema = addData(item);
      }
    }
    return schema;
  };

  FormSchemaBuilder.prototype.addFormItem = function(item, contents, tableId, conditionsExprCompiler, existingConditionExpr, reverseJoins, confidentialData) {
    var addColumn, addCxColumn, answerType, cellCode, choice, code, codeExpr, column, conditionExpr, dataColumn, entityType, formId, i, itemCode, itemColumn, itemItem, j, jsonql, k, l, len, len1, len2, len3, len4, len5, m, n, name, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, results, reverseJoin, section, sectionConditionExpr, sectionContents, sections, subitem, webmercatorLocation;
    if (reverseJoins == null) {
      reverseJoins = [];
    }
    if (confidentialData == null) {
      confidentialData = false;
    }
    addColumn = (function(_this) {
      return function(column) {
        if (formUtils.isQuestion(item) && item.confidential) {
          if (confidentialData) {
            column.confidential = true;
            column.name = appendStr(column.name, " (confidential)");
          } else {
            column.redacted = true;
            column.name = appendStr(column.name, " (redacted)");
          }
        }
        return contents.push(column);
      };
    })(this);
    if (item.contents) {
      if (item._type === "Form") {
        ref = item.contents;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          subitem = ref[i];
          results.push(this.addFormItem(subitem, contents, tableId, conditionsExprCompiler, existingConditionExpr, reverseJoins));
        }
        return results;
      } else if ((ref1 = item._type) === "Section" || ref1 === "Group") {
        sectionContents = [];
        if (conditionsExprCompiler) {
          sectionConditionExpr = ExprUtils.andExprs(existingConditionExpr, conditionsExprCompiler.compileConditions(item.conditions, tableId));
        } else {
          sectionConditionExpr = existingConditionExpr;
        }
        ref2 = item.contents;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          subitem = ref2[j];
          this.addFormItem(subitem, sectionContents, tableId, conditionsExprCompiler, sectionConditionExpr, reverseJoins);
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
              toTable: tableId + ":roster:" + item._id,
              fromColumn: "_id",
              toColumn: "response"
            }
          });
        }
      }
    } else if (formUtils.isQuestion(item)) {
      answerType = formUtils.getAnswerType(item);
      code = item.exportId || item.code;
      dataColumn = confidentialData ? "confidentialData" : "data";
      switch (answerType) {
        case "text":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "text",
            name: item.text,
            code: code,
            jsonql: {
              type: "op",
              op: "nullif",
              exprs: [
                {
                  type: "op",
                  op: "#>>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: dataColumn
                    }, "{" + item._id + ",value}"
                  ]
                }, ""
              ]
            }
          };
          addColumn(column);
          break;
        case "number":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "number",
            name: item.text,
            code: code,
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
                      column: dataColumn
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
            id: dataColumn + ":" + item._id + ":value",
            type: "enum",
            name: item.text,
            code: code,
            enumValues: _.map(item.choices, function(c) {
              return {
                id: c.id,
                name: c.label,
                code: c.code
              };
            }),
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "choices":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "enumset",
            name: item.text,
            code: code,
            enumValues: _.map(item.choices, function(c) {
              return {
                id: c.id,
                name: c.label,
                code: c.code
              };
            }),
            jsonql: {
              type: "op",
              op: "nullif",
              exprs: [
                {
                  type: "op",
                  op: "#>",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{alias}",
                      column: dataColumn
                    }, "{" + item._id + ",value}"
                  ]
                }, {
                  type: "op",
                  op: "::jsonb",
                  exprs: ["[]"]
                }
              ]
            }
          };
          addColumn(column);
          break;
        case "date":
          if (item.format.match(/ss|LLL|lll|m|h|H/)) {
            column = {
              id: dataColumn + ":" + item._id + ":value",
              type: "datetime",
              name: item.text,
              code: code,
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{" + item._id + ",value}"
                ]
              }
            };
            addColumn(column);
          } else {
            column = {
              id: dataColumn + ":" + item._id + ":value",
              type: "date",
              name: item.text,
              code: code,
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
                            column: dataColumn
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
            id: dataColumn + ":" + item._id + ":value",
            type: "boolean",
            name: item.text,
            code: code,
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
                      column: dataColumn
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
            id: dataColumn + ":" + item._id + ":value:quantity",
            type: "number",
            name: name,
            code: code ? code + " (magnitude)" : void 0,
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
                      column: dataColumn
                    }, "{" + item._id + ",value,quantity}"
                  ]
                }
              ]
            }
          };
          addColumn(column);
          column = {
            id: dataColumn + ":" + item._id + ":value:units",
            type: "enum",
            name: appendStr(item.text, " (units)"),
            code: code ? code + " (units)" : void 0,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
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
        case "aquagenx_cbt":
          section = {
            type: "section",
            name: item.text,
            contents: []
          };
          section.contents.push({
            id: dataColumn + ":" + item._id + ":value:cbt:mpn",
            type: "number",
            name: appendStr(item.text, " (MPN/100ml)"),
            code: code ? code + " (mpn)" : void 0,
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
                      column: dataColumn
                    }, "{" + item._id + ",value,cbt,mpn}"
                  ]
                }
              ]
            }
          });
          section.contents.push({
            id: dataColumn + ":" + item._id + ":value:cbt:confidence",
            type: "number",
            name: appendStr(item.text, " (Upper 95% Confidence Interval/100ml)"),
            code: code ? code + " (confidence)" : void 0,
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
                      column: dataColumn
                    }, "{" + item._id + ",value,cbt,confidence}"
                  ]
                }
              ]
            }
          });
          section.contents.push({
            id: dataColumn + ":" + item._id + ":value:cbt:healthRisk",
            type: "enum",
            enumValues: healthRiskEnum,
            name: appendStr(item.text, " (Health Risk Category)"),
            code: code ? code + " (health_risk)" : void 0,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{" + item._id + ",value,cbt,healthRisk}"
              ]
            }
          });
          section.contents.push({
            id: dataColumn + ":" + item._id + ":value:image",
            type: "image",
            name: appendStr(item.text, " (image)"),
            code: code ? code + " (image)" : void 0,
            jsonql: {
              type: "op",
              op: "#>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{" + item._id + ",value,image}"
              ]
            }
          });
          addCxColumn = function(label, v) {
            return section.contents.push({
              id: dataColumn + ":" + item._id + ":value:cbt:" + v,
              type: "boolean",
              name: appendStr(item.text, " (" + label + ")"),
              code: code ? code + (" (" + v + ")") : void 0,
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
                        column: dataColumn
                      }, "{" + item._id + ",value,cbt," + v + "}"
                    ]
                  }
                ]
              }
            });
          };
          addCxColumn('Compartment 1', 'c1');
          addCxColumn('Compartment 2', 'c2');
          addCxColumn('Compartment 3', 'c3');
          addCxColumn('Compartment 4', 'c4');
          addCxColumn('Compartment 5', 'c5');
          addColumn(section);
          break;
        case "location":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "geometry",
            name: item.text,
            code: code,
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
                              column: dataColumn
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
                              column: dataColumn
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
          if (item.calculateAdminRegion) {
            webmercatorLocation = {
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
                                  tableAlias: "{from}",
                                  column: dataColumn
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
                                  tableAlias: "{from}",
                                  column: dataColumn
                                }, "{" + item._id + ",value,latitude}"
                              ]
                            }
                          ]
                        }
                      ]
                    }, 4326
                  ]
                }, 3857
              ]
            };
            column = {
              id: dataColumn + ":" + item._id + ":value:admin_region",
              type: "join",
              name: appendStr(item.text, " (administrative region)"),
              code: code ? code + " (administrative region)" : void 0,
              join: {
                type: "n-1",
                toTable: "admin_regions",
                jsonql: {
                  type: "op",
                  op: "and",
                  exprs: [
                    {
                      type: "field",
                      tableAlias: "{to}",
                      column: "leaf"
                    }, {
                      type: "op",
                      op: "&&",
                      exprs: [
                        webmercatorLocation, {
                          type: "field",
                          tableAlias: "{to}",
                          column: "shape"
                        }
                      ]
                    }, {
                      type: "op",
                      op: "ST_Intersects",
                      exprs: [
                        webmercatorLocation, {
                          type: "field",
                          tableAlias: "{to}",
                          column: "shape"
                        }
                      ]
                    }
                  ]
                }
              }
            };
            addColumn(column);
          }
          column = {
            id: dataColumn + ":" + item._id + ":value:accuracy",
            type: "number",
            name: appendStr(item.text, " (accuracy)"),
            code: code ? code + " (accuracy)" : void 0,
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
                      column: dataColumn
                    }, "{" + item._id + ",value,accuracy}"
                  ]
                }
              ]
            }
          };
          addColumn(column);
          column = {
            id: dataColumn + ":" + item._id + ":value:altitude",
            type: "number",
            name: appendStr(item.text, " (altitude)"),
            code: code ? code + " (altitude)" : void 0,
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
                      column: dataColumn
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
            op: "#>>",
            exprs: [
              {
                type: "field",
                tableAlias: "{alias}",
                column: dataColumn
              }, "{" + item._id + ",value,code}"
            ]
          };
          entityType = ((ref4 = item.siteTypes) != null ? ref4[0] : void 0) ? _.first(item.siteTypes).toLowerCase().replace(new RegExp(' ', 'g'), "_") : "water_point";
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "join",
            name: item.text,
            code: code,
            join: {
              type: "n-1",
              toTable: "entities." + entityType,
              fromColumn: codeExpr,
              toColumn: "code"
            }
          };
          addColumn(column);
          if (tableId.match(/^responses:[^:]+$/)) {
            formId = tableId.split(":")[1];
            jsonql = {
              type: "op",
              op: "in",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{to}",
                  column: "_id"
                }, {
                  type: "scalar",
                  expr: {
                    type: "field",
                    tableAlias: "response_entities",
                    column: "response"
                  },
                  from: {
                    type: "table",
                    table: "response_entities",
                    alias: "response_entities"
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
                            tableAlias: "response_entities",
                            column: "question"
                          }, item._id
                        ]
                      }, {
                        type: "op",
                        op: "is null",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "response_entities",
                            column: "roster"
                          }
                        ]
                      }, {
                        type: "op",
                        op: "=",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "response_entities",
                            column: "entityType"
                          }, entityType
                        ]
                      }, {
                        type: "op",
                        op: "=",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "response_entities",
                            column: "property"
                          }, "code"
                        ]
                      }, {
                        type: "op",
                        op: "=",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "response_entities",
                            column: "value"
                          }, {
                            type: "field",
                            tableAlias: "{from}",
                            column: "code"
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            };
            reverseJoin = {
              table: "entities." + entityType,
              column: {
                id: tableId + ":data:" + item._id + ":value",
                name: item.text,
                type: "join",
                join: {
                  type: "1-n",
                  toTable: tableId,
                  jsonql: jsonql
                }
              }
            };
            reverseJoins.push(reverseJoin);
          }
          break;
        case "entity":
          if (item.entityType) {
            column = {
              id: dataColumn + ":" + item._id + ":value",
              type: "join",
              name: item.text,
              code: code,
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
                      column: dataColumn
                    }, "{" + item._id + ",value}"
                  ]
                },
                toColumn: "_id"
              }
            };
            addColumn(column);
            if (tableId.match(/^responses:[^:]+$/)) {
              formId = tableId.split(":")[1];
              jsonql = {
                type: "op",
                op: "in",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{to}",
                    column: "_id"
                  }, {
                    type: "scalar",
                    expr: {
                      type: "field",
                      tableAlias: "response_entities",
                      column: "response"
                    },
                    from: {
                      type: "table",
                      table: "response_entities",
                      alias: "response_entities"
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
                              tableAlias: "response_entities",
                              column: "question"
                            }, item._id
                          ]
                        }, {
                          type: "op",
                          op: "is null",
                          exprs: [
                            {
                              type: "field",
                              tableAlias: "response_entities",
                              column: "roster"
                            }
                          ]
                        }, {
                          type: "op",
                          op: "=",
                          exprs: [
                            {
                              type: "field",
                              tableAlias: "response_entities",
                              column: "entityType"
                            }, item.entityType
                          ]
                        }, {
                          type: "op",
                          op: "=",
                          exprs: [
                            {
                              type: "field",
                              tableAlias: "response_entities",
                              column: "property"
                            }, "_id"
                          ]
                        }, {
                          type: "op",
                          op: "=",
                          exprs: [
                            {
                              type: "field",
                              tableAlias: "response_entities",
                              column: "value"
                            }, {
                              type: "field",
                              tableAlias: "{from}",
                              column: "_id"
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              };
              reverseJoin = {
                table: "entities." + item.entityType,
                column: {
                  id: tableId + ":data:" + item._id + ":value",
                  name: item.text,
                  type: "join",
                  join: {
                    type: "1-n",
                    toTable: tableId,
                    jsonql: jsonql
                  }
                }
              };
              reverseJoins.push(reverseJoin);
            }
          }
          break;
        case "texts":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "text[]",
            name: item.text,
            code: code,
            jsonql: {
              type: "op",
              op: "#>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "image":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "image",
            name: item.text,
            code: code,
            jsonql: {
              type: "op",
              op: "#>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "images":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            type: "imagelist",
            name: item.text,
            code: code,
            jsonql: {
              type: "op",
              op: "#>",
              exprs: [
                {
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{" + item._id + ",value}"
              ]
            }
          };
          addColumn(column);
          break;
        case "admin_region":
          column = {
            id: dataColumn + ":" + item._id + ":value",
            name: item.text,
            code: code,
            type: "join",
            join: {
              type: "n-1",
              toTable: "admin_regions",
              fromColumn: {
                type: "op",
                op: "::integer",
                exprs: [
                  {
                    type: "op",
                    op: "#>>",
                    exprs: [
                      {
                        type: "field",
                        tableAlias: "{alias}",
                        column: dataColumn
                      }, "{" + item._id + ",value}"
                    ]
                  }
                ]
              },
              toColumn: "_id"
            }
          };
          addColumn(column);
          break;
        case "items_choices":
          section = {
            type: "section",
            name: item.text,
            contents: []
          };
          ref5 = item.items;
          for (k = 0, len2 = ref5.length; k < len2; k++) {
            itemItem = ref5[k];
            itemCode = code && itemItem.code ? code + " - " + itemItem.code : void 0;
            section.contents.push({
              id: dataColumn + ":" + item._id + ":value:" + itemItem.id,
              type: "enum",
              name: appendStr(appendStr(item.text, ": "), itemItem.label),
              code: itemCode,
              enumValues: _.map(item.choices, function(c) {
                return {
                  id: c.id,
                  name: c.label,
                  code: c.code
                };
              }),
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{" + item._id + ",value," + itemItem.id + "}"
                ]
              }
            });
          }
          addColumn(section);
          break;
        case "matrix":
          sections = [];
          ref6 = item.items;
          for (l = 0, len3 = ref6.length; l < len3; l++) {
            itemItem = ref6[l];
            section = {
              type: "section",
              name: itemItem.label,
              contents: []
            };
            sections.push(section);
            ref7 = item.columns;
            for (m = 0, len4 = ref7.length; m < len4; m++) {
              itemColumn = ref7[m];
              cellCode = code && itemItem.code && itemColumn.code ? code + " - " + itemItem.code + " - " + itemColumn.code : void 0;
              if (itemColumn._type === "TextColumnQuestion") {
                section.contents.push({
                  id: dataColumn + ":" + item._id + ":value:" + itemItem.id + ":" + itemColumn._id + ":value",
                  type: "text",
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                  code: cellCode,
                  jsonql: {
                    type: "op",
                    op: "nullif",
                    exprs: [
                      {
                        type: "op",
                        op: "#>>",
                        exprs: [
                          {
                            type: "field",
                            tableAlias: "{alias}",
                            column: dataColumn
                          }, "{" + item._id + ",value," + itemItem.id + "," + itemColumn._id + ",value}"
                        ]
                      }, ""
                    ]
                  }
                });
              }
              if (itemColumn._type === "NumberColumnQuestion") {
                section.contents.push({
                  id: dataColumn + ":" + item._id + ":value:" + itemItem.id + ":" + itemColumn._id + ":value",
                  type: "number",
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                  code: cellCode,
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
                            column: dataColumn
                          }, "{" + item._id + ",value," + itemItem.id + "," + itemColumn._id + ",value}"
                        ]
                      }
                    ]
                  }
                });
              }
              if (itemColumn._type === "CheckColumnQuestion") {
                section.contents.push({
                  id: dataColumn + ":" + item._id + ":value:" + itemItem.id + ":" + itemColumn._id + ":value",
                  type: "boolean",
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                  code: cellCode,
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
                            column: dataColumn
                          }, "{" + item._id + ",value," + itemItem.id + "," + itemColumn._id + ",value}"
                        ]
                      }
                    ]
                  }
                });
              }
              if (itemColumn._type === "DropdownColumnQuestion") {
                section.contents.push({
                  id: dataColumn + ":" + item._id + ":value:" + itemItem.id + ":" + itemColumn._id + ":value",
                  type: "enum",
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                  code: cellCode,
                  enumValues: _.map(itemColumn.choices, function(c) {
                    return {
                      id: c.id,
                      code: c.code,
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
                        column: dataColumn
                      }, "{" + item._id + ",value," + itemItem.id + "," + itemColumn._id + ",value}"
                    ]
                  }
                });
              }
              if (itemColumn._type === "UnitsColumnQuestion") {
                section.contents.push({
                  id: dataColumn + ":" + item._id + ":value:" + itemItem.id + ":" + itemColumn._id + ":value:quantity",
                  type: "number",
                  name: appendStr(appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text), " (magnitude)"),
                  code: cellCode ? cellCode + " (magnitude)" : void 0,
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
                            column: dataColumn
                          }, "{" + item._id + ",value," + itemItem.id + "," + itemColumn._id + ",value,quantity}"
                        ]
                      }
                    ]
                  }
                });
                section.contents.push({
                  id: dataColumn + ":" + item._id + ":value:" + itemItem.id + ":" + itemColumn._id + ":value:units",
                  type: "enum",
                  code: cellCode ? cellCode + " (units)" : void 0,
                  name: appendStr(appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text), " (units)"),
                  enumValues: _.map(itemColumn.units, function(c) {
                    return {
                      id: c.id,
                      code: c.code,
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
                        column: dataColumn
                      }, "{" + item._id + ",value," + itemItem.id + "," + itemColumn._id + ",value,units}"
                    ]
                  }
                });
              }
              if (itemColumn._type === "SiteColumnQuestion") {
                section.contents.push({
                  id: dataColumn + ":" + item._id + ":value:" + itemItem.id + ":" + itemColumn._id + ":value",
                  type: "join",
                  name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                  code: cellCode,
                  join: {
                    type: "n-1",
                    toTable: "entities." + itemColumn.siteType,
                    fromColumn: {
                      type: "op",
                      op: "#>>",
                      exprs: [
                        {
                          type: "field",
                          tableAlias: "{alias}",
                          column: dataColumn
                        }, "{" + item._id + ",value," + itemItem.id + "," + itemColumn._id + ",value,code}"
                      ]
                    },
                    toColumn: "code"
                  }
                });
              }
            }
          }
          addColumn({
            type: "section",
            name: item.text,
            contents: sections
          });
      }
      if (answerType === 'choice' || answerType === 'choices') {
        ref8 = item.choices;
        for (n = 0, len5 = ref8.length; n < len5; n++) {
          choice = ref8[n];
          if (choice.specify) {
            column = {
              id: dataColumn + ":" + item._id + ":specify:" + choice.id,
              type: "text",
              name: appendStr(appendStr(appendStr(item.text, " ("), choice.label), ") - specify"),
              code: code ? code + (" (" + (choice.code ? choice.code : formUtils.localizeString(choice.label)) + ")") + " - specify" : void 0,
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [
                  {
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
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
          code: code ? code + " (Comments)" : void 0,
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
          code: code ? code + " (Time Answered)" : void 0,
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
          code: code ? code + " (Location Answered)" : void 0,
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
          code: code ? code + " (Location Answered - accuracy)" : void 0,
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
          code: code ? code + " (Location Answered - altitude)" : void 0,
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
          code: code ? code + " (Not Applicable)" : void 0,
          jsonql: {
            type: "op",
            op: "nullif",
            exprs: [
              {
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
              }, false
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
          code: code ? code + " (Don't Know)" : void 0,
          jsonql: {
            type: "op",
            op: "nullif",
            exprs: [
              {
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
              }, false
            ]
          }
        };
        addColumn(column);
      }
      if (item.randomAskProbability != null) {
        column = {
          id: "data:" + item._id + ":randomAsked",
          type: "boolean",
          name: appendStr(item.text, " (Randomly Asked)"),
          code: code ? code + " (Randomly Asked)" : void 0,
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
                  }, "{" + item._id + ",randomAsked}"
                ]
              }
            ]
          }
        };
        addColumn(column);
      }
      if ((item.randomAskProbability == null) && (conditionsExprCompiler && ((item.conditions && item.conditions.length > 0) || existingConditionExpr))) {
        conditionExpr = ExprUtils.andExprs(existingConditionExpr, conditionsExprCompiler.compileConditions(item.conditions, tableId));
        if (conditionExpr) {
          conditionExpr = {
            type: "op",
            op: "and",
            table: tableId,
            exprs: [
              {
                type: "op",
                table: tableId,
                op: "is not null",
                exprs: [conditionExpr]
              }, conditionExpr
            ]
          };
          column = {
            id: "data:" + item._id + ":visible",
            type: "boolean",
            name: appendStr(item.text, " (Asked)"),
            code: code ? code + " (Asked)" : void 0,
            expr: conditionExpr
          };
          return addColumn(column);
        }
      }
    }
  };

  FormSchemaBuilder.prototype.addCalculations = function(schema, form) {
    var calculation, calculationsSection, calculationsSectionContents, contents, i, len, ref, tableId;
    if (!form.design.calculations || form.design.calculations.length === 0) {
      return schema;
    }
    ref = form.design.calculations;
    for (i = 0, len = ref.length; i < len; i++) {
      calculation = ref[i];
      tableId = "responses:" + form._id;
      if (calculation.roster) {
        tableId += ":roster:" + calculation.roster;
      }
      calculationsSection = _.last(schema.getTable(tableId).contents);
      if (calculationsSection.id !== "calculations") {
        calculationsSection = {
          id: "calculations",
          type: "section",
          name: {
            _base: "en",
            en: "Calculations"
          },
          contents: []
        };
        schema = schema.addTable(update(schema.getTable(tableId), {
          contents: {
            $push: [calculationsSection]
          }
        }));
      }
      calculationsSectionContents = calculationsSection.contents.slice();
      calculationsSectionContents.push({
        id: "calculation:" + calculation._id,
        type: "number",
        name: calculation.name,
        desc: calculation.desc,
        expr: calculation.expr
      });
      contents = schema.getTable(tableId).contents.slice();
      contents[contents.length - 1] = update(calculationsSection, {
        contents: {
          $set: calculationsSectionContents
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
