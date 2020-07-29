"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var ColumnNotFoundException, ConditionsExprCompiler, ExprCompiler, ExprUtils, FormSchemaBuilder, TopoSort, _, appendStr, formUtils, _formizeIndicatorPropertyExpr, healthRiskEnum, _mapTree, update;

_ = require('lodash');
formUtils = require('./formUtils');
ExprUtils = require('mwater-expressions').ExprUtils;
ExprCompiler = require('mwater-expressions').ExprCompiler;
update = require('update-object');
ColumnNotFoundException = require('mwater-expressions').ColumnNotFoundException;
TopoSort = require('topo-sort');
ConditionsExprCompiler = require('./ConditionsExprCompiler');
healthRiskEnum = require('./answers/aquagenxCBTUtils').healthRiskEnum; // Adds a form to a mwater-expressions schema

module.exports = FormSchemaBuilder =
/*#__PURE__*/
function () {
  function FormSchemaBuilder() {
    (0, _classCallCheck2["default"])(this, FormSchemaBuilder);
  }

  (0, _createClass2["default"])(FormSchemaBuilder, [{
    key: "addForm",
    // indicators is at least all indicators referenced in indicator calculations. Can be empty and indicator calculations will be omitted
    value: function addForm(schema, form, cloneFormsDeprecated) {
      var isAdmin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var indicators = arguments.length > 4 ? arguments[4] : undefined;
      var conditionsExprCompiler, contents, deploymentValues, jsonql, metadata, reverseJoins;
      contents = [];
      metadata = []; // Get deployments

      deploymentValues = _.map(form.deployments, function (dep) {
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
      }); // Add user

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
      }); // Add status

      metadata.push({
        id: "status",
        type: "enum",
        name: {
          en: "Status"
        },
        enumValues: [{
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
        }]
      }); // Add code

      metadata.push({
        id: "code",
        type: "text",
        name: {
          en: "Response Code"
        }
      }); // Add startedOn

      metadata.push({
        id: "startedOn",
        type: "datetime",
        name: {
          en: "Drafted On"
        }
      }); // Add submitted on

      metadata.push({
        id: "submittedOn",
        type: "datetime",
        name: {
          en: "Submitted On"
        }
      }); // Add approvalLevel. Only has value if pending

      jsonql = {
        type: "case",
        cases: [{
          when: {
            type: "op",
            op: "=",
            exprs: [{
              type: "field",
              tableAlias: "{alias}",
              column: "status"
            }, {
              type: "literal",
              value: "pending"
            }]
          },
          then: {
            type: "op",
            op: "::text",
            exprs: [{
              type: "op",
              op: "jsonb_array_length",
              exprs: [{
                type: "field",
                tableAlias: "{alias}",
                column: "approvals"
              }]
            }]
          }
        }]
      };
      metadata.push({
        id: "approvalLevel",
        type: "enum",
        name: {
          en: "Approval Level"
        },
        jsonql: jsonql,
        enumValues: [{
          id: "0",
          name: {
            en: "Pending Level 1"
          }
        }, {
          id: "1",
          name: {
            en: "Pending Level 2"
          }
        }, {
          id: "2",
          name: {
            en: "Pending Level 3"
          }
        }, {
          id: "3",
          name: {
            en: "Pending Level 4"
          }
        }]
      }); // Add number of rejections

      jsonql = {
        type: "scalar",
        expr: {
          type: "op",
          op: "count",
          exprs: []
        },
        from: {
          type: "subexpr",
          expr: {
            type: "op",
            op: "jsonb_array_elements",
            exprs: [{
              type: "field",
              tableAlias: "{alias}",
              column: "events"
            }]
          },
          alias: "events_subexpr"
        },
        where: {
          type: "op",
          op: "=",
          exprs: [{
            type: "op",
            op: "->>",
            exprs: [{
              type: "field",
              tableAlias: "events_subexpr"
            }, "type"]
          }, "reject"]
        }
      };
      metadata.push({
        id: "numRejections",
        type: "number",
        name: {
          _base: "en",
          en: "Number of Rejections"
        },
        jsonql: jsonql
      }); // Add number of edits

      jsonql = {
        type: "scalar",
        expr: {
          type: "op",
          op: "count",
          exprs: []
        },
        from: {
          type: "subexpr",
          expr: {
            type: "op",
            op: "jsonb_array_elements",
            exprs: [{
              type: "field",
              tableAlias: "{alias}",
              column: "events"
            }]
          },
          alias: "events_subexpr"
        },
        where: {
          type: "op",
          op: "=",
          exprs: [{
            type: "op",
            op: "->>",
            exprs: [{
              type: "field",
              tableAlias: "events_subexpr"
            }, "type"]
          }, "edit"]
        }
      };
      metadata.push({
        id: "numEdits",
        type: "number",
        name: {
          _base: "en",
          en: "Number of Edits"
        },
        desc: {
          _base: "en",
          en: "Number of times survey was edited outside of normal submissions"
        },
        jsonql: jsonql
      }); // Add IpAddress

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
      conditionsExprCompiler = new ConditionsExprCompiler(form.design); // List of joins in format: { table: destination table, column: join column to add }

      reverseJoins = [];
      this.addFormItem(form.design, contents, "responses:".concat(form._id), conditionsExprCompiler, null, reverseJoins); // Add to schema

      schema = schema.addTable({
        id: "responses:".concat(form._id),
        name: form.design.name,
        primaryKey: "_id",
        contents: contents,
        ordering: "submittedOn",
        label: "code"
      }); // Add any roster tables

      schema = this.addRosterTables(schema, form.design, conditionsExprCompiler, reverseJoins, "responses:".concat(form._id)); // Add reverse joins from entity and site questions

      schema = this.addReverseJoins(schema, form, reverseJoins);

      if (isAdmin) {
        schema = this.addConfidentialData(schema, form, conditionsExprCompiler);
        schema = this.addConfidentialDataForRosters(schema, form, conditionsExprCompiler);
      }

      schema = this.addCalculations(schema, form);
      schema = this.addIndicatorCalculations(schema, form, indicators, false); // Create table

      return schema;
    } // Add joins back from entities to site and entity questions
    // reverseJoins: list of joins in format: { table: destination table, column: join column to add }
    // Adds to section with id "!related_forms" with name "Related Forms"

  }, {
    key: "addReverseJoins",
    value: function addReverseJoins(schema, form, reverseJoins) {
      var column, i, len, reverseJoin, section, sectionIndex, table;

      for (i = 0, len = reverseJoins.length; i < len; i++) {
        reverseJoin = reverseJoins[i];
        column = _.clone(reverseJoin.column); // Determine if is the only join to a table, in which case use the form name to be less confusing

        if (_.where(reverseJoins, {
          table: reverseJoin.table
        }).length === 1) {
          column.name = form.design.name;
        } else {
          // Prefix form name, since it was not available when join was created
          column.name = appendStr(appendStr(form.design.name, ": "), column.name);
        } // Add to entities table if it exists


        if (schema.getTable(reverseJoin.table)) {
          table = schema.getTable(reverseJoin.table); // Create related forms section

          sectionIndex = _.findIndex(table.contents, function (item) {
            return item.id === "!related_forms";
          });

          if (sectionIndex < 0) {
            // Add section (this should already be added in for all entities. Add to be safe)
            section = {
              type: "section",
              id: "!related_forms",
              name: {
                en: "Related Surveys"
              },
              desc: {
                en: "Surveys that are linked by a question to ".concat(table.name.en)
              },
              contents: []
            };
            table = update(table, {
              contents: {
                $push: [section]
              }
            });
            sectionIndex = _.findIndex(table.contents, function (item) {
              return item.id === "!related_forms";
            });
          } // Add join


          section = update(table.contents[sectionIndex], {
            contents: {
              $push: [column]
            }
          });
          table = update(table, {
            contents: {
              $splice: [[sectionIndex, 1, section]]
            }
          }); // Replace table

          schema = schema.addTable(table);
        }
      }

      return schema;
    } // tableId is form table, not roster table

  }, {
    key: "addRosterTables",
    value: function addRosterTables(schema, design, conditionsExprCompiler, reverseJoins, tableId) {
      var contents, i, item, j, len, len1, name, ref, ref1, ref2, rosterItem;
      ref = formUtils.allItems(design); // For each item

      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];

        if ((ref1 = item._type) === "RosterGroup" || ref1 === "RosterMatrix") {
          // If new, create table with single join back to responses
          if (!item.rosterId) {
            contents = [{
              id: "response",
              type: "join",
              name: {
                en: "Response"
              },
              join: {
                type: "n-1",
                toTable: tableId,
                fromColumn: "response",
                toColumn: "_id"
              }
            }, {
              id: "index",
              type: "number",
              name: {
                en: "Index"
              }
            }];
            name = appendStr(appendStr(schema.getTable(tableId).name, ": "), item.name);
          } else {
            // Use existing contents
            contents = schema.getTable("".concat(tableId, ":roster:").concat(item.rosterId)).contents.slice();
            name = schema.getTable("".concat(tableId, ":roster:").concat(item.rosterId)).name;
          }

          ref2 = item.contents; // Add contents

          for (j = 0, len1 = ref2.length; j < len1; j++) {
            rosterItem = ref2[j];
            this.addFormItem(rosterItem, contents, "".concat(tableId, ":roster:").concat(item.rosterId || item._id), conditionsExprCompiler, null, reverseJoins);
          }

          schema = schema.addTable({
            id: "".concat(tableId, ":roster:").concat(item.rosterId || item._id),
            name: name,
            primaryKey: "_id",
            ordering: "index",
            contents: contents
          });
        }
      }

      return schema;
    } // Create a section in schema called Indicators with one subsection for each indicator calculated

  }, {
    key: "addIndicatorCalculations",
    value: function addIndicatorCalculations(schema, form, indicators) {
      var contents, i, indicatorCalculation, indicatorCalculationSection, indicatorSectionContents, indicatorsSection, len, ref, tableId; // If not calculations, don't add indicators section

      if (!form.indicatorCalculations || form.indicatorCalculations.length === 0) {
        return schema;
      }

      ref = form.indicatorCalculations; // Process indicator calculations 

      for (i = 0, len = ref.length; i < len; i++) {
        indicatorCalculation = ref[i];
        tableId = "responses:".concat(form._id);

        if (indicatorCalculation.roster) {
          tableId += ":roster:".concat(indicatorCalculation.roster);
        } // Add indicator section


        indicatorsSection = _.last(schema.getTable(tableId).contents);

        if (indicatorsSection.id !== "indicators") {
          // Add indicator section
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
        } // Add to indicators section


        indicatorSectionContents = indicatorsSection.contents.slice();
        indicatorCalculationSection = this.createIndicatorCalculationSection(indicatorCalculation, schema, indicators, form);

        if (indicatorCalculationSection) {
          indicatorSectionContents.push(indicatorCalculationSection);
        } // Update in original


        contents = schema.getTable(tableId).contents.slice();
        contents[contents.length - 1] = update(indicatorsSection, {
          contents: {
            $set: indicatorSectionContents
          }
        }); // Re-add table

        schema = schema.addTable(update(schema.getTable(tableId), {
          contents: {
            $set: contents
          }
        }));
      }

      return schema;
    } // Create a subsection of Indicators for an indicator calculation.

  }, {
    key: "createIndicatorCalculationSection",
    value: function createIndicatorCalculationSection(indicatorCalculation, schema, indicators, form) {
      var column, condition, contents, exprCompiler, expression, fromColumn, i, indicator, j, len, len1, properties, property, ref, section, toColumn; // Find indicator

      indicator = _.findWhere(indicators, {
        _id: indicatorCalculation.indicator
      }); // If not found, probably don't have permission

      if (!indicator) {
        return null;
      } // Create compiler


      exprCompiler = new ExprCompiler(schema); // Map properties

      contents = [];
      ref = _.values(indicator.design.properties);

      for (i = 0, len = ref.length; i < len; i++) {
        properties = ref[i];

        for (j = 0, len1 = properties.length; j < len1; j++) {
          property = properties[j]; // If has expression already, we need to replace the references to this indicator with the indicator calculations

          if (property.expr) {
            expression = _formizeIndicatorPropertyExpr(property.expr, form, indicatorCalculation, indicator);
          } else {
            expression = indicatorCalculation.expressions[property.id];
          }

          condition = indicatorCalculation.condition; // Create column from property

          column = _.extend({}, property, {
            id: "indicator_calculation:".concat(indicatorCalculation._id, ":").concat(property.id)
          }); // ids are special

          if (property.type === "id") {
            // Compile to an jsonql of the id of the "to" table
            fromColumn = exprCompiler.compileExpr({
              expr: expression,
              tableAlias: "{alias}"
            }); // Create a join expression

            toColumn = schema.getTable(property.idTable).primaryKey;
            column.type = "join";
            column.join = {
              type: "n-1",
              toTable: property.idTable,
              fromColumn: fromColumn,
              toColumn: toColumn
            };
            contents.push(column);
            continue;
          } // If no expression, jsonql null should be explicit so it doesn't just think there is no jsonql specified


          if (!expression) {
            column.jsonql = {
              type: "literal",
              value: null
            };
          } else {
            // Add condition if present
            if (condition) {
              // Wrap in case statement
              expression = {
                type: "case",
                table: expression.table,
                cases: [{
                  when: condition,
                  then: expression
                }]
              };
            }

            column.expr = expression;
          }

          contents.push(column);
        }
      } // Create section


      section = {
        type: "section",
        name: indicator.design.name,
        contents: contents
      };
      return section;
    }
  }, {
    key: "addConfidentialDataForRosters",
    value: function addConfidentialDataForRosters(schema, form, conditionsExprCompiler) {
      var confidentialDataSection, confidentialDataSectionContents, contents, i, index, item, j, len, len1, ref, ref1, ref2, rosterItem, tableId;
      ref = formUtils.allItems(form.design);

      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];

        if ((ref1 = item._type) === "RosterGroup" || ref1 === "RosterMatrix") {
          tableId = "responses:".concat(form._id, ":roster:").concat(item.rosterId || item._id);
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
              this.addFormItem(rosterItem, confidentialDataSectionContents, tableId, conditionsExprCompiler, null, [], true); // Update in original

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
    }
  }, {
    key: "addConfidentialData",
    value: function addConfidentialData(schema, form, conditionsExprCompiler) {
      var _this = this;

      var addData, i, item, j, len, len1, ref, ref1, ref2, subItem, tableId;
      tableId = "responses:".concat(form._id);

      addData = function addData(question) {
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

          _this.addFormItem(question, confidentialDataSectionContents, "responses:".concat(form._id), conditionsExprCompiler, null, [], true); // Update in original


          contents = schema.getTable(tableId).contents.slice();
          index = _.findIndex(contents, {
            id: "confidentialData"
          });
          contents[index] = update(confidentialDataSection, {
            contents: {
              $set: confidentialDataSectionContents
            }
          }); // Re-add table

          schema = schema.addTable(update(schema.getTable(tableId), {
            contents: {
              $set: contents
            }
          }));
        }

        return schema;
      };

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
    } // Adds a form item. existingConditionExpr is any conditions that already condition visibility of the form item. This does not cross roster boundaries.
    // That is, if a roster is entirely invisible, roster items will not be conditioned on the overall visibility, as they simply won't exist
    // reverseJoins: list of reverse joins to add to. In format: { table: destination table, column: join column to add }. This list will be mutated. Pass in empty list in general.

  }, {
    key: "addFormItem",
    value: function addFormItem(item, contents, tableId, conditionsExprCompiler, existingConditionExpr) {
      var reverseJoins = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
      var confidentialData = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
      var addColumn, addCxColumn, answerType, cellCode, choice, code, codeExpr, column, columnCode, conditionExpr, dataColumn, entityType, formId, i, itemCode, itemColumn, itemItem, j, jsonql, k, l, len, len1, len2, len3, len4, len5, len6, m, n, name, o, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, reverseJoin, rosterId, section, sectionConditionExpr, sectionContents, sections, subitem, webmercatorLocation;

      addColumn = function addColumn(column) {
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
      }; // Add sub-items


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
          // Create section contents
          sectionContents = [];

          if (conditionsExprCompiler) {
            sectionConditionExpr = ExprUtils.andExprs(tableId, existingConditionExpr, conditionsExprCompiler.compileConditions(item.conditions, tableId));
          } else {
            sectionConditionExpr = existingConditionExpr;
          }

          ref2 = item.contents;

          for (j = 0, len1 = ref2.length; j < len1; j++) {
            subitem = ref2[j]; // TODO add conditions of section/group

            this.addFormItem(subitem, sectionContents, tableId, conditionsExprCompiler, sectionConditionExpr, reverseJoins);
          }

          return contents.push({
            type: "section",
            name: item.name,
            contents: sectionContents
          });
        } else if ((ref3 = item._type) === "RosterGroup" || ref3 === "RosterMatrix") {
          // Add join to roster table if original (no rosterId specified)
          if (!item.rosterId) {
            return contents.push({
              id: "data:".concat(item._id),
              type: "join",
              name: item.name,
              join: {
                type: "1-n",
                toTable: "".concat(tableId, ":roster:").concat(item._id),
                fromColumn: "_id",
                toColumn: "response"
              }
            });
          }
        }
      } else if (formUtils.isQuestion(item)) {
        // Get type of answer
        answerType = formUtils.getAnswerType(item); // Get code

        code = item.exportId || item.code;
        dataColumn = confidentialData ? "confidentialData" : "data";

        switch (answerType) {
          case "text":
            // Get a simple text column. Null if empty
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "text",
              name: item.text,
              code: code,
              jsonql: {
                type: "op",
                op: "nullif",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value}")]
                }, ""]
              }
            };
            addColumn(column);
            break;

          case "number":
            // Get a decimal column always as integer can run out of room
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "number",
              name: item.text,
              code: code,
              jsonql: {
                type: "op",
                op: "convert_to_decimal",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value}")]
                }]
              }
            };
            addColumn(column);
            break;

          case "choice":
            // Get a simple text column
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "enum",
              name: item.text,
              code: code,
              enumValues: _.map(item.choices, function (c) {
                return {
                  id: c.id,
                  name: c.label,
                  code: c.code
                };
              }),
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value}")]
              }
            };
            addColumn(column);
            break;

          case "choices":
            // Null if empty or null for simplicity
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "enumset",
              name: item.text,
              code: code,
              enumValues: _.map(item.choices, function (c) {
                return {
                  id: c.id,
                  name: c.label,
                  code: c.code
                };
              }),
              jsonql: {
                type: "op",
                op: "nullif",
                exprs: [{
                  type: "op",
                  op: "nullif",
                  exprs: [{
                    type: "op",
                    op: "#>",
                    exprs: [{
                      type: "field",
                      tableAlias: "{alias}",
                      column: dataColumn
                    }, "{".concat(item._id, ",value}")]
                  }, {
                    type: "op",
                    op: "::jsonb",
                    exprs: ["[]"]
                  }]
                }, "null"]
              }
            };
            addColumn(column);
            break;

          case "date":
            // If date-time
            if (item.format.match(/ss|LLL|lll|m|h|H/)) {
              // Fill in month and year and remove timestamp
              column = {
                id: "".concat(dataColumn, ":").concat(item._id, ":value"),
                type: "datetime",
                name: item.text,
                code: code,
                jsonql: {
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value}")]
                }
              };
              addColumn(column);
            } else {
              // Fill in month and year and remove timestamp
              column = {
                id: "".concat(dataColumn, ":").concat(item._id, ":value"),
                type: "date",
                name: item.text,
                code: code,
                // substr(rpad(data#>>'{questionid,value}',10, '-01-01'), 1, 10)
                jsonql: {
                  type: "op",
                  op: "substr",
                  exprs: [{
                    type: "op",
                    op: "rpad",
                    exprs: [{
                      type: "op",
                      op: "#>>",
                      exprs: [{
                        type: "field",
                        tableAlias: "{alias}",
                        column: dataColumn
                      }, "{".concat(item._id, ",value}")]
                    }, 10, '-01-01']
                  }, 1, 10]
                }
              };
              addColumn(column);
            }

            break;

          case "boolean":
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "boolean",
              name: item.text,
              code: code,
              jsonql: {
                type: "op",
                op: "::boolean",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value}")]
                }]
              }
            };
            addColumn(column);
            break;

          case "units":
            // Get a decimal column as integer can run out of room
            name = appendStr(item.text, " (magnitude)");
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value:quantity"),
              type: "number",
              name: name,
              code: code ? code + " (magnitude)" : void 0,
              jsonql: {
                type: "op",
                op: "convert_to_decimal",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value,quantity}")]
                }]
              }
            };
            addColumn(column);
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value:units"),
              type: "enum",
              name: appendStr(item.text, " (units)"),
              code: code ? code + " (units)" : void 0,
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value,units}")]
              },
              enumValues: _.map(item.units, function (c) {
                return {
                  id: c.id,
                  name: c.label
                };
              })
            };
            addColumn(column);
            break;

          case "aquagenx_cbt":
            // Create section
            section = {
              type: "section",
              name: item.text,
              contents: []
            };
            section.contents.push({
              id: "".concat(dataColumn, ":").concat(item._id, ":value:cbt:mpn"),
              type: "number",
              name: appendStr(item.text, " (MPN/100ml)"),
              code: code ? code + " (mpn)" : void 0,
              jsonql: {
                type: "op",
                op: "::decimal",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value,cbt,mpn}")]
                }]
              }
            });
            section.contents.push({
              id: "".concat(dataColumn, ":").concat(item._id, ":value:cbt:confidence"),
              type: "number",
              name: appendStr(item.text, " (Upper 95% Confidence Interval/100ml)"),
              code: code ? code + " (confidence)" : void 0,
              jsonql: {
                type: "op",
                op: "::decimal",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value,cbt,confidence}")]
                }]
              }
            });
            section.contents.push({
              id: "".concat(dataColumn, ":").concat(item._id, ":value:cbt:healthRisk"),
              type: "enum",
              enumValues: healthRiskEnum,
              name: appendStr(item.text, " (Health Risk Category)"),
              code: code ? code + " (health_risk)" : void 0,
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value,cbt,healthRisk}")]
              }
            }); // Get image

            section.contents.push({
              id: "".concat(dataColumn, ":").concat(item._id, ":value:image"),
              type: "image",
              name: appendStr(item.text, " (image)"),
              code: code ? code + " (image)" : void 0,
              jsonql: {
                type: "op",
                op: "#>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value,image}")]
              }
            });

            addCxColumn = function addCxColumn(label, v) {
              return section.contents.push({
                id: "".concat(dataColumn, ":").concat(item._id, ":value:cbt:").concat(v),
                type: "boolean",
                name: appendStr(item.text, " (".concat(label, ")")),
                code: code ? code + " (".concat(v, ")") : void 0,
                jsonql: {
                  type: "op",
                  op: "::boolean",
                  exprs: [{
                    type: "op",
                    op: "#>>",
                    exprs: [{
                      type: "field",
                      tableAlias: "{alias}",
                      column: dataColumn
                    }, "{".concat(item._id, ",value,cbt,").concat(v, "}")]
                  }]
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

          case "cascading_list":
            // Create section
            section = {
              type: "section",
              name: item.text,
              contents: []
            };
            ref4 = item.columns; // For each column

            for (k = 0, len2 = ref4.length; k < len2; k++) {
              column = ref4[k];
              section.contents.push({
                id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(column.id),
                type: "enum",
                name: column.name,
                enumValues: column.enumValues,
                jsonql: {
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value,").concat(column.id, "}")]
                }
              });
            }

            addColumn(section);
            break;

          case "cascading_ref":
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "join",
              name: item.text,
              code: code,
              join: {
                type: "n-1",
                toTable: item.tableId,
                fromColumn: {
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value}")]
                },
                toColumn: "_id"
              }
            };
            addColumn(column);
            break;

          case "location":
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "geometry",
              name: item.text,
              code: code,
              // ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326)
              jsonql: {
                type: "op",
                op: "ST_SetSRID",
                exprs: [{
                  type: "op",
                  op: "ST_MakePoint",
                  exprs: [{
                    type: "op",
                    op: "::decimal",
                    exprs: [{
                      type: "op",
                      op: "#>>",
                      exprs: [{
                        type: "field",
                        tableAlias: "{alias}",
                        column: dataColumn
                      }, "{".concat(item._id, ",value,longitude}")]
                    }]
                  }, {
                    type: "op",
                    op: "::decimal",
                    exprs: [{
                      type: "op",
                      op: "#>>",
                      exprs: [{
                        type: "field",
                        tableAlias: "{alias}",
                        column: dataColumn
                      }, "{".concat(item._id, ",value,latitude}")]
                    }]
                  }]
                }, 4326]
              }
            };
            addColumn(column);
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value:method"),
              type: "enum",
              name: appendStr(item.text, " (method)"),
              code: code ? code + " (method)" : void 0,
              enumValues: [{
                id: "gps",
                name: {
                  _base: "en",
                  en: "GPS"
                }
              }, {
                id: "map",
                name: {
                  _base: "en",
                  en: "Map"
                }
              }, {
                id: "manual",
                name: {
                  _base: "en",
                  en: "Manual"
                }
              }],
              jsonql: {
                type: "op",
                op: "#>>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value,method}")]
              }
            };
            addColumn(column); // Add admin region

            if (item.calculateAdminRegion) {
              // ST_Transform(ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326), 3857)
              webmercatorLocation = {
                type: "op",
                op: "ST_Transform",
                exprs: [{
                  type: "op",
                  op: "ST_SetSRID",
                  exprs: [{
                    type: "op",
                    op: "ST_MakePoint",
                    exprs: [{
                      type: "op",
                      op: "::decimal",
                      exprs: [{
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{from}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,longitude}")]
                      }]
                    }, {
                      type: "op",
                      op: "::decimal",
                      exprs: [{
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{from}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,latitude}")]
                      }]
                    }]
                  }, 4326]
                }, 3857]
              };
              column = {
                id: "".concat(dataColumn, ":").concat(item._id, ":value:admin_region"),
                type: "join",
                name: appendStr(item.text, " (administrative region)"),
                code: code ? code + " (administrative region)" : void 0,
                join: {
                  type: "n-1",
                  toTable: "admin_regions",
                  jsonql: {
                    type: "op",
                    op: "and",
                    exprs: [{
                      // Make sure leaf node
                      type: "field",
                      tableAlias: "{to}",
                      column: "leaf"
                    }, {
                      type: "op",
                      op: "&&",
                      exprs: [webmercatorLocation, {
                        type: "field",
                        tableAlias: "{to}",
                        column: "shape"
                      }]
                    }, {
                      type: "op",
                      op: "ST_Intersects",
                      exprs: [webmercatorLocation, {
                        type: "field",
                        tableAlias: "{to}",
                        column: "shape"
                      }]
                    }]
                  }
                }
              };
              addColumn(column);
            } // TOO SLOW TO BE USEFUL
            // # Add reverse join if directly from responses table
            // if tableId.match(/^responses:[^:]+$/)
            //   jsonql = {
            //     type: "op"
            //     op: "and"
            //     exprs: [
            //       { type: "op", op: "&&", exprs: [
            //         # Flip from/to for reverse
            //         JSON.parse(JSON.stringify(webmercatorLocation).replace(/\{from\}/g, "{to}"))
            //         { type: "field", tableAlias: "{from}", column: "shape" }
            //       ]}
            //       { type: "op", op: "ST_Intersects", exprs: [
            //         # Flip from/to for reverse
            //         JSON.parse(JSON.stringify(webmercatorLocation).replace(/\{from\}/g, "{to}"))
            //         { type: "field", tableAlias: "{from}", column: "shape" }
            //       ]}
            //     ]
            //   }
            //   formId = tableId.split(":")[1]
            //   reverseJoin = {
            //     table: "admin_regions"
            //     column: {
            //       id: "!#{tableId}:data:#{item._id}:value"
            //       # Form name is not available here. Prefix later.
            //       name: item.text
            //       type: "join"
            //       join: {
            //         type: "1-n"
            //         toTable: tableId
            //         inverse: column.id
            //         jsonql: jsonql
            //       }
            //     }
            //   }
            //   reverseJoins.push(reverseJoin)


            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value:accuracy"),
              type: "number",
              name: appendStr(item.text, " (accuracy)"),
              code: code ? code + " (accuracy)" : void 0,
              // data#>>'{questionid,value,accuracy}'::decimal
              jsonql: {
                type: "op",
                op: "::decimal",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value,accuracy}")]
                }]
              }
            };
            addColumn(column);
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value:altitude"),
              type: "number",
              name: appendStr(item.text, " (altitude)"),
              code: code ? code + " (altitude)" : void 0,
              // data#>>'{questionid,value,accuracy}'::decimal
              jsonql: {
                type: "op",
                op: "::decimal",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value,altitude}")]
                }]
              }
            };
            addColumn(column);
            break;

          case "site":
            // { code: "somecode" }
            codeExpr = {
              type: "op",
              op: "#>>",
              exprs: [{
                type: "field",
                tableAlias: "{alias}",
                column: dataColumn
              }, "{".concat(item._id, ",value,code}")]
            };
            entityType = ((ref5 = item.siteTypes) != null ? ref5[0] : void 0) ? _.first(item.siteTypes).toLowerCase().replace(new RegExp(' ', 'g'), "_") : "water_point";
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "join",
              name: item.text,
              code: code,
              join: {
                type: "n-1",
                toTable: "entities.".concat(entityType),
                fromColumn: codeExpr,
                toColumn: "code"
              }
            };
            addColumn(column); // Add reverse join if directly from responses table

            if (tableId.match(/^responses:[^:]+$/)) {
              formId = tableId.split(":")[1]; // Use exists (select response from response_entities where response = {to}._id and question = 'site1' and "entityType" = 'water_point' and property = 'code' and value = {from}."code")
              // for indexed speed

              jsonql = {
                type: "op",
                op: "exists",
                exprs: [{
                  type: "scalar",
                  expr: null,
                  from: {
                    type: "table",
                    table: "response_entities",
                    alias: "response_entities"
                  },
                  where: {
                    type: "op",
                    op: "and",
                    exprs: [{
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "response"
                      }, {
                        type: "field",
                        tableAlias: "{to}",
                        column: "_id"
                      }]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "question"
                      }, item._id]
                    }, {
                      type: "op",
                      op: "is null",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "roster"
                      }]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "entityType"
                      }, entityType]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "property"
                      }, "code"]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "value"
                      }, {
                        type: "field",
                        tableAlias: "{from}",
                        column: "code"
                      }]
                    }]
                  }
                }]
              };
              reverseJoin = {
                table: "entities.".concat(entityType),
                column: {
                  id: "".concat(tableId, ":data:").concat(item._id, ":value"),
                  // Form name is not available here. Prefix later.
                  name: item.text,
                  type: "join",
                  join: {
                    type: "1-n",
                    toTable: tableId,
                    inverse: column.id,
                    jsonql: jsonql
                  }
                }
              };
              reverseJoins.push(reverseJoin);
            } // Add reverse join if from responses roster table


            if (tableId.match(/^responses:[^:]+:roster:[^:]+$/)) {
              formId = tableId.split(":")[1];
              rosterId = tableId.split(":")[3]; // Use exists (select null from response_entities where roster = {to}._id and question = 'site1' and "entityType" = 'water_point' and property = 'code' and value = {from}."code")
              // for indexed speed

              jsonql = {
                type: "op",
                op: "exists",
                exprs: [{
                  type: "scalar",
                  expr: null,
                  from: {
                    type: "table",
                    table: "response_entities",
                    alias: "response_entities"
                  },
                  where: {
                    type: "op",
                    op: "and",
                    exprs: [{
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "roster"
                      }, {
                        type: "field",
                        tableAlias: "{to}",
                        column: "_id"
                      }]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "question"
                      }, item._id]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "entityType"
                      }, entityType]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "property"
                      }, "code"]
                    }, {
                      type: "op",
                      op: "=",
                      exprs: [{
                        type: "field",
                        tableAlias: "response_entities",
                        column: "value"
                      }, {
                        type: "field",
                        tableAlias: "{from}",
                        column: "code"
                      }]
                    }]
                  }
                }]
              };
              reverseJoin = {
                table: "entities.".concat(entityType),
                column: {
                  id: "".concat(tableId, ":data:").concat(item._id, ":value"),
                  // Form name is not available here. Prefix later.
                  name: item.text,
                  type: "join",
                  join: {
                    type: "1-n",
                    toTable: tableId,
                    inverse: column.id,
                    jsonql: jsonql
                  }
                }
              };
              reverseJoins.push(reverseJoin);
            }

            break;

          case "entity":
            // Do not add if no entity type
            if (item.entityType) {
              column = {
                id: "".concat(dataColumn, ":").concat(item._id, ":value"),
                type: "join",
                name: item.text,
                code: code,
                join: {
                  type: "n-1",
                  toTable: "entities.".concat(item.entityType),
                  fromColumn: {
                    type: "op",
                    op: "#>>",
                    exprs: [{
                      type: "field",
                      tableAlias: "{alias}",
                      column: dataColumn
                    }, "{".concat(item._id, ",value}")]
                  },
                  toColumn: "_id"
                }
              };
              addColumn(column); // Add reverse join if directly from responses table

              if (tableId.match(/^responses:[^:]+$/)) {
                formId = tableId.split(":")[1]; // Use exists (select null from response_entities where response = {to}._id and question = 'site1' and "entityType" = 'water_point' and property = '_id' and value = {from}."_id"))
                // for indexed speed

                jsonql = {
                  type: "op",
                  op: "exists",
                  exprs: [{
                    type: "scalar",
                    expr: null,
                    from: {
                      type: "table",
                      table: "response_entities",
                      alias: "response_entities"
                    },
                    where: {
                      type: "op",
                      op: "and",
                      exprs: [{
                        type: "op",
                        op: "=",
                        exprs: [{
                          type: "field",
                          tableAlias: "response_entities",
                          column: "response"
                        }, {
                          type: "field",
                          tableAlias: "{to}",
                          column: "_id"
                        }]
                      }, {
                        type: "op",
                        op: "=",
                        exprs: [{
                          type: "field",
                          tableAlias: "response_entities",
                          column: "question"
                        }, item._id]
                      }, {
                        type: "op",
                        op: "is null",
                        exprs: [{
                          type: "field",
                          tableAlias: "response_entities",
                          column: "roster"
                        }]
                      }, {
                        type: "op",
                        op: "=",
                        exprs: [{
                          type: "field",
                          tableAlias: "response_entities",
                          column: "entityType"
                        }, item.entityType]
                      }, {
                        type: "op",
                        op: "=",
                        exprs: [{
                          type: "field",
                          tableAlias: "response_entities",
                          column: "property"
                        }, "_id"]
                      }, {
                        type: "op",
                        op: "=",
                        exprs: [{
                          type: "field",
                          tableAlias: "response_entities",
                          column: "value"
                        }, {
                          type: "field",
                          tableAlias: "{from}",
                          column: "_id"
                        }]
                      }]
                    }
                  }]
                };
                reverseJoin = {
                  table: "entities.".concat(item.entityType),
                  column: {
                    id: "".concat(tableId, ":data:").concat(item._id, ":value"),
                    // Form name is not available here. Prefix later.
                    name: item.text,
                    type: "join",
                    join: {
                      type: "1-n",
                      inverse: column.id,
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
            // Get image
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "text[]",
              name: item.text,
              code: code,
              jsonql: {
                type: "op",
                op: "#>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value}")]
              }
            };
            addColumn(column);
            break;

          case "image":
            // Get image
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "image",
              name: item.text,
              code: code,
              jsonql: {
                type: "op",
                op: "#>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value}")]
              }
            };
            addColumn(column);
            break;

          case "images":
            // Get images
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              type: "imagelist",
              name: item.text,
              code: code,
              jsonql: {
                type: "op",
                op: "#>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: dataColumn
                }, "{".concat(item._id, ",value}")]
              }
            };
            addColumn(column);
            break;

          case "admin_region":
            // Add join to admin region
            column = {
              id: "".concat(dataColumn, ":").concat(item._id, ":value"),
              name: item.text,
              code: code,
              type: "join",
              join: {
                type: "n-1",
                toTable: "admin_regions",
                fromColumn: {
                  type: "op",
                  op: "::integer",
                  exprs: [{
                    type: "op",
                    op: "#>>",
                    exprs: [{
                      type: "field",
                      tableAlias: "{alias}",
                      column: dataColumn
                    }, "{".concat(item._id, ",value}")]
                  }]
                },
                toColumn: "_id"
              }
            };
            addColumn(column);
            break;

          case "items_choices":
            // Create section
            section = {
              type: "section",
              name: item.text,
              contents: []
            };
            ref6 = item.items; // For each item

            for (l = 0, len3 = ref6.length; l < len3; l++) {
              itemItem = ref6[l];
              itemCode = code && itemItem.code ? code + " - " + itemItem.code : void 0;
              section.contents.push({
                id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id),
                type: "enum",
                name: appendStr(appendStr(item.text, ": "), itemItem.label),
                code: itemCode,
                enumValues: _.map(item.choices, function (c) {
                  return {
                    id: c.id,
                    name: c.label,
                    code: c.code
                  };
                }),
                jsonql: {
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",value,").concat(itemItem.id, "}")]
                }
              });
            }

            addColumn(section);
            break;

          case "matrix":
            sections = [];
            ref7 = item.items; // For each item

            for (m = 0, len4 = ref7.length; m < len4; m++) {
              itemItem = ref7[m]; // Create section

              section = {
                type: "section",
                name: itemItem.label,
                contents: []
              };
              sections.push(section);
              ref8 = item.columns; // For each column

              for (n = 0, len5 = ref8.length; n < len5; n++) {
                itemColumn = ref8[n];
                itemCode = itemItem.exportId || itemItem.code;
                columnCode = itemColumn.exportId || itemColumn.code;
                cellCode = code && itemCode && columnCode ? code + " - " + itemCode + " - " + columnCode : void 0; // TextColumnQuestion

                if (itemColumn._type === "TextColumnQuestion") {
                  section.contents.push({
                    id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value"),
                    type: "text",
                    name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                    code: cellCode,
                    jsonql: {
                      type: "op",
                      op: "nullif",
                      exprs: [{
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{alias}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value}")]
                      }, ""]
                    }
                  });
                } // NumberColumnQuestion


                if (itemColumn._type === "NumberColumnQuestion") {
                  section.contents.push({
                    id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value"),
                    type: "number",
                    name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                    code: cellCode,
                    jsonql: {
                      type: "op",
                      op: "convert_to_decimal",
                      exprs: [{
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{alias}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value}")]
                      }]
                    }
                  });
                } // CheckColumnQuestion


                if (itemColumn._type === "CheckColumnQuestion") {
                  section.contents.push({
                    id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value"),
                    type: "boolean",
                    name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                    code: cellCode,
                    jsonql: {
                      type: "op",
                      op: "::boolean",
                      exprs: [{
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{alias}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value}")]
                      }]
                    }
                  });
                } // DropdownColumnQuestion


                if (itemColumn._type === "DropdownColumnQuestion") {
                  section.contents.push({
                    id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value"),
                    type: "enum",
                    name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                    code: cellCode,
                    enumValues: _.map(itemColumn.choices, function (c) {
                      return {
                        id: c.id,
                        code: c.code,
                        name: c.label
                      };
                    }),
                    jsonql: {
                      type: "op",
                      op: "#>>",
                      exprs: [{
                        type: "field",
                        tableAlias: "{alias}",
                        column: dataColumn
                      }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value}")]
                    }
                  });
                } // UnitsColumnQuestion


                if (itemColumn._type === "UnitsColumnQuestion") {
                  section.contents.push({
                    id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value:quantity"),
                    type: "number",
                    name: appendStr(appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text), " (magnitude)"),
                    code: cellCode ? cellCode + " (magnitude)" : void 0,
                    jsonql: {
                      type: "op",
                      op: "convert_to_decimal",
                      exprs: [{
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{alias}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value,quantity}")]
                      }]
                    }
                  });
                  section.contents.push({
                    id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value:units"),
                    type: "enum",
                    code: cellCode ? cellCode + " (units)" : void 0,
                    name: appendStr(appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text), " (units)"),
                    enumValues: _.map(itemColumn.units, function (c) {
                      return {
                        id: c.id,
                        code: c.code,
                        name: c.label
                      };
                    }),
                    jsonql: {
                      type: "op",
                      op: "#>>",
                      exprs: [{
                        type: "field",
                        tableAlias: "{alias}",
                        column: dataColumn
                      }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value,units}")]
                    }
                  });
                }

                if (itemColumn._type === "DateColumnQuestion") {
                  // If date-time
                  if (itemColumn.format.match(/ss|LLL|lll|m|h|H/)) {
                    // Take as it is
                    column = {
                      id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value"),
                      type: "datetime",
                      name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                      code: cellCode,
                      jsonql: {
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{alias}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value}")]
                      }
                    };
                    section.contents.push(column);
                  } else {
                    // Fill in month and year and remove timestamp
                    column = {
                      id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value"),
                      type: "date",
                      name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                      code: cellCode,
                      // substr(rpad(data#>>'{questionid,value}',10, '-01-01'), 1, 10)
                      jsonql: {
                        type: "op",
                        op: "substr",
                        exprs: [{
                          type: "op",
                          op: "rpad",
                          exprs: [{
                            type: "op",
                            op: "#>>",
                            exprs: [{
                              type: "field",
                              tableAlias: "{alias}",
                              column: dataColumn
                            }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value}")]
                          }, 10, '-01-01']
                        }, 1, 10]
                      }
                    };
                    section.contents.push(column);
                  }
                } // SiteColumnQuestion


                if (itemColumn._type === "SiteColumnQuestion") {
                  section.contents.push({
                    id: "".concat(dataColumn, ":").concat(item._id, ":value:").concat(itemItem.id, ":").concat(itemColumn._id, ":value"),
                    type: "join",
                    name: appendStr(appendStr(appendStr(appendStr(item.text, ": "), itemItem.label), " - "), itemColumn.text),
                    code: cellCode,
                    join: {
                      type: "n-1",
                      toTable: "entities." + itemColumn.siteType,
                      fromColumn: {
                        type: "op",
                        op: "#>>",
                        exprs: [{
                          type: "field",
                          tableAlias: "{alias}",
                          column: dataColumn
                        }, "{".concat(item._id, ",value,").concat(itemItem.id, ",").concat(itemColumn._id, ",value,code}")]
                      },
                      toColumn: "code"
                    }
                  });
                }
              }
            } // Create section for this question


            addColumn({
              type: "section",
              name: item.text,
              contents: sections
            });
        } // Add specify


        if (answerType === 'choice' || answerType === 'choices') {
          ref9 = item.choices;

          for (o = 0, len6 = ref9.length; o < len6; o++) {
            choice = ref9[o];

            if (choice.specify) {
              column = {
                id: "".concat(dataColumn, ":").concat(item._id, ":specify:").concat(choice.id),
                type: "text",
                name: appendStr(appendStr(appendStr(item.text, " ("), choice.label), ") - specify"),
                code: code ? code + " (".concat(choice.code ? choice.code : formUtils.localizeString(choice.label), ")") + " - specify" : void 0,
                jsonql: {
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: dataColumn
                  }, "{".concat(item._id, ",specify,").concat(choice.id, "}")]
                }
              };
              addColumn(column);
            }
          }
        } // Add comments


        if (item.commentsField) {
          column = {
            id: "data:".concat(item._id, ":comments"),
            type: "text",
            name: appendStr(item.text, " (Comments)"),
            code: code ? code + " (Comments)" : void 0,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [{
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, "{".concat(item._id, ",comments}")]
            }
          };
          addColumn(column);
        } // Add timestamp


        if (item.recordTimestamp) {
          column = {
            id: "data:".concat(item._id, ":timestamp"),
            type: "datetime",
            name: appendStr(item.text, " (Time Answered)"),
            code: code ? code + " (Time Answered)" : void 0,
            jsonql: {
              type: "op",
              op: "#>>",
              exprs: [{
                type: "field",
                tableAlias: "{alias}",
                column: "data"
              }, "{".concat(item._id, ",timestamp}")]
            }
          };
          addColumn(column);
        } // Add GPS stamp


        if (item.recordLocation) {
          column = {
            id: "data:".concat(item._id, ":location"),
            type: "geometry",
            name: appendStr(item.text, " (Location Answered)"),
            code: code ? code + " (Location Answered)" : void 0,
            // ST_SetSRID(ST_MakePoint(data#>>'{questionid,value,longitude}'::decimal, data#>>'{questionid,value,latitude}'::decimal),4326)
            jsonql: {
              type: "op",
              op: "ST_SetSRID",
              exprs: [{
                type: "op",
                op: "ST_MakePoint",
                exprs: [{
                  type: "op",
                  op: "::decimal",
                  exprs: [{
                    type: "op",
                    op: "#>>",
                    exprs: [{
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, "{".concat(item._id, ",location,longitude}")]
                  }]
                }, {
                  type: "op",
                  op: "::decimal",
                  exprs: [{
                    type: "op",
                    op: "#>>",
                    exprs: [{
                      type: "field",
                      tableAlias: "{alias}",
                      column: "data"
                    }, "{".concat(item._id, ",location,latitude}")]
                  }]
                }]
              }, 4326]
            }
          };
          addColumn(column);
          column = {
            id: "data:".concat(item._id, ":location:accuracy"),
            type: "number",
            name: appendStr(item.text, " (Location Answered - accuracy)"),
            code: code ? code + " (Location Answered - accuracy)" : void 0,
            // data#>>'{questionid,location,accuracy}'::decimal
            jsonql: {
              type: "op",
              op: "::decimal",
              exprs: [{
                type: "op",
                op: "#>>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{".concat(item._id, ",location,accuracy}")]
              }]
            }
          };
          addColumn(column);
          column = {
            id: "data:".concat(item._id, ":location:altitude"),
            type: "number",
            name: appendStr(item.text, " (Location Answered - altitude)"),
            code: code ? code + " (Location Answered - altitude)" : void 0,
            // data#>>'{questionid,location,accuracy}'::decimal
            jsonql: {
              type: "op",
              op: "::decimal",
              exprs: [{
                type: "op",
                op: "#>>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{".concat(item._id, ",location,altitude}")]
              }]
            }
          };
          addColumn(column);
        } // Add n/a


        if (item.alternates && item.alternates.na) {
          column = {
            id: "data:".concat(item._id, ":na"),
            type: "boolean",
            name: appendStr(item.text, " (Not Applicable)"),
            code: code ? code + " (Not Applicable)" : void 0,
            // nullif(data#>>'{questionid,alternate}' = 'na', false) (makes null if false)
            jsonql: {
              type: "op",
              op: "nullif",
              exprs: [{
                type: "op",
                op: "=",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{".concat(item._id, ",alternate}")]
                }, "na"]
              }, false]
            }
          };
          addColumn(column);
        }

        if (item.alternates && item.alternates.dontknow) {
          column = {
            id: "data:".concat(item._id, ":dontknow"),
            type: "boolean",
            name: appendStr(item.text, " (Don't Know)"),
            code: code ? code + " (Don't Know)" : void 0,
            // nullif(data#>>'{questionid,alternate}' = 'dontknow', false) (makes null if false)
            jsonql: {
              type: "op",
              op: "nullif",
              exprs: [{
                type: "op",
                op: "=",
                exprs: [{
                  type: "op",
                  op: "#>>",
                  exprs: [{
                    type: "field",
                    tableAlias: "{alias}",
                    column: "data"
                  }, "{".concat(item._id, ",alternate}")]
                }, "dontknow"]
              }, false]
            }
          };
          addColumn(column);
        } // Add randomAsked if randomAsked


        if (item.randomAskProbability != null) {
          column = {
            id: "data:".concat(item._id, ":randomAsked"),
            type: "boolean",
            name: appendStr(item.text, " (Randomly Asked)"),
            code: code ? code + " (Randomly Asked)" : void 0,
            jsonql: {
              type: "op",
              op: "::boolean",
              exprs: [{
                type: "op",
                op: "#>>",
                exprs: [{
                  type: "field",
                  tableAlias: "{alias}",
                  column: "data"
                }, "{".concat(item._id, ",randomAsked}")]
              }]
            }
          };
          addColumn(column);
        } // Add visible if has conditions and not randomly asked


        if (item.randomAskProbability == null && conditionsExprCompiler && (item.conditions && item.conditions.length > 0 || existingConditionExpr)) {
          // Guard against null
          conditionExpr = ExprUtils.andExprs(tableId, existingConditionExpr, conditionsExprCompiler.compileConditions(item.conditions, tableId));

          if (conditionExpr) {
            conditionExpr = {
              type: "op",
              op: "and",
              table: tableId,
              exprs: [{
                type: "op",
                table: tableId,
                op: "is not null",
                exprs: [conditionExpr]
              }, conditionExpr]
            };
            column = {
              id: "data:".concat(item._id, ":visible"),
              type: "boolean",
              name: appendStr(item.text, " (Asked)"),
              code: code ? code + " (Asked)" : void 0,
              expr: conditionExpr
            };
            return addColumn(column);
          }
        }
      }
    }
  }, {
    key: "addCalculations",
    value: function addCalculations(schema, form) {
      var calculation, calculationsSection, calculationsSectionContents, contents, i, len, ref, tableId; // If not calculations, don't add  section

      if (!form.design.calculations || form.design.calculations.length === 0) {
        return schema;
      }

      ref = form.design.calculations; // Process indicator calculations 

      for (i = 0, len = ref.length; i < len; i++) {
        calculation = ref[i];
        tableId = "responses:".concat(form._id);

        if (calculation.roster) {
          tableId += ":roster:".concat(calculation.roster);
        } // Add calculations section


        calculationsSection = _.last(schema.getTable(tableId).contents);

        if (calculationsSection.id !== "calculations") {
          // Add calculations section
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
        } // Add to calculations section


        calculationsSectionContents = calculationsSection.contents.slice();
        calculationsSectionContents.push({
          id: "calculation:".concat(calculation._id),
          type: "number",
          name: calculation.name,
          desc: calculation.desc,
          expr: calculation.expr,
          jsonql: !calculation.expr ? {
            type: "literal",
            value: null // Force null if no expression so it doesn't appear to be a normal column

          } : void 0
        }); // Update in original

        contents = schema.getTable(tableId).contents.slice();
        contents[contents.length - 1] = update(calculationsSection, {
          contents: {
            $set: calculationsSectionContents
          }
        }); // Re-add table

        schema = schema.addTable(update(schema.getTable(tableId), {
          contents: {
            $set: contents
          }
        }));
      }

      return schema;
    }
  }]);
  return FormSchemaBuilder;
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
  var output;

  if (!tree) {
    return tree;
  }

  if (_.isArray(tree)) {
    return _.map(tree, function (item) {
      return _mapTree(item, func);
    });
  } // Map item


  output = func(tree); // Map contents

  if (tree.contents) {
    output.contents = _.compact(_.map(tree.contents, function (item) {
      return func(item);
    }));
  }

  return output;
}; // Convert an expression that is the expr of an indicator property into an expression
// that instead references the indicator calculation columns. This is to allow indicator
// properties that are calculations (have an expr) from the form


_formizeIndicatorPropertyExpr = function formizeIndicatorPropertyExpr(expr, form, indicatorCalculation, indicator) {
  if (!expr) {
    return expr;
  }

  if (!_.isObject(expr)) {
    return expr;
  } // If it is a field, change table and column


  if (expr.type === "field" && expr.table === "indicator_values:".concat(indicator._id)) {
    return {
      type: "field",
      table: "responses:".concat(form._id),
      column: "indicator_calculation:".concat(indicatorCalculation._id, ":").concat(expr.column)
    };
  } // If it has a table, change that


  if (expr.table === "indicator_values:".concat(indicator._id)) {
    expr = _.extend({}, expr, {
      table: "responses:".concat(form._id)
    });
  } // Otherwise replace recursively


  return _.mapValues(expr, function (value, key) {
    if (_.isArray(value)) {
      return _.map(value, function (v) {
        return _formizeIndicatorPropertyExpr(v, form, indicatorCalculation, indicator);
      });
    } else {
      return _formizeIndicatorPropertyExpr(value, form, indicatorCalculation, indicator);
    }
  });
};