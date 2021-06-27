// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
let ConditionsExprCompiler
import _ from "lodash"
import * as formUtils from "./formUtils"
import * as conditionUtils from "./conditionUtils"

// Compiles conditions into mWater expressions
export default ConditionsExprCompiler = class ConditionsExprCompiler {
  constructor(formDesign: any) {
    this.formDesign = formDesign

    // Index all items
    this.itemMap = {}
    for (let item of formUtils.allItems(formDesign)) {
      if (item._id) {
        this.itemMap[item._id] = item
      }
    }
  }

  compileConditions(conditions: any, tableId: any) {
    let type
    if (!conditions || conditions.length === 0) {
      return null
    }

    // Expressions to be and-ed
    const exprs = []
    for (let cond of conditions) {
      var alt, alternates, rhsType, subexprs, value, values
      var item = this.itemMap[cond.lhs.question]
      if (!item) {
        continue
      }

      // Ignore if invalid condition
      if (!conditionUtils.validateCondition(cond, this.formDesign)) {
        continue
      }

      type = formUtils.getAnswerType(item)

      if (cond.op === "present") {
        switch (type) {
          case "text":
            exprs.push({
              table: tableId,
              type: "op",
              op: "and",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: "<>",
                  exprs: [
                    { table: tableId, type: "field", column: `data:${item._id}:value` },
                    { type: "literal", valueType: "text", value: "" }
                  ]
                }
              ]
            })
            break
          case "choices":
          case "images":
            exprs.push({
              table: tableId,
              type: "op",
              op: "and",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: ">",
                  exprs: [
                    {
                      table: tableId,
                      type: "op",
                      op: "length",
                      exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                    },
                    { type: "literal", valueType: "number", value: 0 }
                  ]
                }
              ]
            })
            break
          case "aquagenx_cbt":
            exprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:cbt:mpn` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:image` }]
                }
              ]
            })
            break
          case "units":
            exprs.push({
              table: tableId,
              type: "op",
              op: "is not null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:quantity` }]
            })
            break
          default:
            exprs.push({
              table: tableId,
              type: "op",
              op: "is not null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
            })
        }
      } else if (cond.op === "!present") {
        switch (type) {
          case "text":
            exprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: "=",
                  exprs: [
                    { table: tableId, type: "field", column: `data:${item._id}:value` },
                    { type: "literal", valueType: "text", value: "" }
                  ]
                }
              ]
            })
            break
          case "choices":
          case "images":
            exprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: "=",
                  exprs: [
                    {
                      table: tableId,
                      type: "op",
                      op: "length",
                      exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                    },
                    { type: "literal", valueType: "number", value: 0 }
                  ]
                }
              ]
            })
            break
          case "aquagenx_cbt":
            exprs.push({
              table: tableId,
              type: "op",
              op: "and",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:cbt:mpn` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:image` }]
                }
              ]
            })
            break
          case "units":
            exprs.push({
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:quantity` }]
            })
            break
          default:
            exprs.push({
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
            })
        }
      } else if (cond.op === "contains") {
        exprs.push({
          table: tableId,
          type: "op",
          op: "~*",
          exprs: [
            { table: tableId, type: "field", column: `data:${item._id}:value` },
            { type: "literal", valueType: "text", value: _.escapeRegExp(cond.rhs.literal || "") }
          ]
        })
      } else if (cond.op === "!contains") {
        exprs.push({
          table: tableId,
          type: "op",
          op: "or",
          exprs: [
            {
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
            },
            {
              table: tableId,
              type: "op",
              op: "not",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "~*",
                  exprs: [
                    { table: tableId, type: "field", column: `data:${item._id}:value` },
                    { type: "literal", valueType: "text", value: _.escapeRegExp(cond.rhs.literal || "") }
                  ]
                }
              ]
            }
          ]
        })
      } else if (cond.op === "=") {
        exprs.push({
          table: tableId,
          type: "op",
          op: "=",
          exprs: [
            { table: tableId, type: "field", column: `data:${item._id}:value` },
            { type: "literal", valueType: "number", value: cond.rhs.literal }
          ]
        })
      } else if (cond.op === "!=") {
        exprs.push({
          table: tableId,
          type: "op",
          op: "or",
          exprs: [
            {
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
            },
            {
              table: tableId,
              type: "op",
              op: "<>",
              exprs: [
                { table: tableId, type: "field", column: `data:${item._id}:value` },
                { type: "literal", valueType: "number", value: cond.rhs.literal }
              ]
            }
          ]
        })
      } else if (cond.op === ">") {
        exprs.push({
          table: tableId,
          type: "op",
          op: ">",
          exprs: [
            { table: tableId, type: "field", column: `data:${item._id}:value` },
            { type: "literal", valueType: "number", value: cond.rhs.literal }
          ]
        })
      } else if (cond.op === "<") {
        exprs.push({
          table: tableId,
          type: "op",
          op: "<",
          exprs: [
            { table: tableId, type: "field", column: `data:${item._id}:value` },
            { type: "literal", valueType: "number", value: cond.rhs.literal }
          ]
        })
      } else if (cond.op === "is") {
        // Special case for alternates
        if (["na", "dontknow"].includes(cond.rhs.literal)) {
          exprs.push({
            table: tableId,
            type: "op",
            op: "is not null",
            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
          })
        } else {
          exprs.push({
            table: tableId,
            type: "op",
            op: "=",
            exprs: [
              { table: tableId, type: "field", column: `data:${item._id}:value` },
              { type: "literal", valueType: "enum", value: cond.rhs.literal }
            ]
          })
        }
      } else if (cond.op === "isnt") {
        // Special case for alternates
        if (["na", "dontknow"].includes(cond.rhs.literal)) {
          exprs.push({
            table: tableId,
            type: "op",
            op: "is null",
            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
          })
        } else {
          // Null or not equal
          exprs.push({
            table: tableId,
            type: "op",
            op: "or",
            exprs: [
              {
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
              },
              {
                table: tableId,
                type: "op",
                op: "<>",
                exprs: [
                  { table: tableId, type: "field", column: `data:${item._id}:value` },
                  { type: "literal", valueType: "enum", value: cond.rhs.literal }
                ]
              }
            ]
          })
        }
      } else if (cond.op === "includes") {
        // Special case for alternates
        if (["na", "dontknow"].includes(cond.rhs.literal)) {
          exprs.push({
            table: tableId,
            type: "op",
            op: "is not null",
            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
          })
        } else {
          exprs.push({
            table: tableId,
            type: "op",
            op: "contains",
            exprs: [
              { table: tableId, type: "field", column: `data:${item._id}:value` },
              { type: "literal", valueType: "enumset", value: [cond.rhs.literal] }
            ]
          })
        }
      } else if (cond.op === "!includes") {
        // Special case for alternates
        if (["na", "dontknow"].includes(cond.rhs.literal)) {
          exprs.push({
            table: tableId,
            type: "op",
            op: "is null",
            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
          })
        } else {
          // Null value or not contains
          exprs.push({
            table: tableId,
            type: "op",
            op: "or",
            exprs: [
              {
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
              },
              {
                table: tableId,
                type: "op",
                op: "not",
                exprs: [
                  {
                    table: tableId,
                    type: "op",
                    op: "contains",
                    exprs: [
                      { table: tableId, type: "field", column: `data:${item._id}:value` },
                      { type: "literal", valueType: "enumset", value: [cond.rhs.literal] }
                    ]
                  }
                ]
              }
            ]
          })
        }
      } else if (cond.op === "before") {
        rhsType = item.format.match(/ss|LLL|lll|m|h|H/) ? "datetime" : "date"

        exprs.push({
          table: tableId,
          type: "op",
          op: "<",
          exprs: [
            { table: tableId, type: "field", column: `data:${item._id}:value` },
            { type: "literal", valueType: rhsType, value: cond.rhs.literal }
          ]
        })
      } else if (cond.op === "after") {
        rhsType = item.format.match(/ss|LLL|lll|m|h|H/) ? "datetime" : "date"

        exprs.push({
          table: tableId,
          type: "op",
          op: ">",
          exprs: [
            { table: tableId, type: "field", column: `data:${item._id}:value` },
            { type: "literal", valueType: rhsType, value: cond.rhs.literal }
          ]
        })
      } else if (cond.op === "true") {
        exprs.push({ table: tableId, type: "field", column: `data:${item._id}:value` })
      } else if (cond.op === "false") {
        exprs.push({
          table: tableId,
          type: "op",
          op: "or",
          exprs: [
            {
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
            },
            {
              table: tableId,
              type: "op",
              op: "not",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
            }
          ]
        })
      } else if (cond.op === "isoneof") {
        // Get alternates and values
        values = _.filter(cond.rhs.literal, (v) => !["na", "dontknow"].includes(v))
        alternates = _.filter(cond.rhs.literal, (v) => ["na", "dontknow"].includes(v))

        // Handle special case for just na/dontknow
        if (type === "choice" || values.length === 0) {
          if (values.length === 0 && alternates.length === 1) {
            exprs.push({
              table: tableId,
              type: "op",
              op: "is not null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alternates[0]}` }]
            })
          } else if (values.length === 0 && alternates.length > 1) {
            exprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: _.map(alternates, (alt) => ({
                table: tableId,
                type: "op",
                op: "is not null",
                exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
              }))
            })
          } else {
            subexprs = [
              {
                table: tableId,
                type: "op",
                op: "= any",
                exprs: [
                  { table: tableId, type: "field", column: `data:${item._id}:value` },
                  { type: "literal", valueType: "enumset", value: values }
                ]
              }
            ]
            for (alt of alternates) {
              subexprs.push({
                table: tableId,
                type: "op",
                op: "is not null",
                exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
              })
            }

            if (subexprs.length === 1) {
              exprs.push(subexprs[0])
            } else {
              exprs.push({ table: tableId, type: "op", op: "or", exprs: subexprs })
            }
          }
        } else if (type === "choices") {
          subexprs = []
          for (value of values) {
            subexprs.push({
              table: tableId,
              type: "op",
              op: "contains",
              exprs: [
                { table: tableId, type: "field", column: `data:${item._id}:value` },
                { type: "literal", valueType: "enumset", value: [value] }
              ]
            })
          }
          for (alt of alternates) {
            subexprs.push({
              table: tableId,
              type: "op",
              op: "is not null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
            })
          }

          if (subexprs.length === 1) {
            exprs.push(subexprs[0])
          } else {
            exprs.push({ table: tableId, type: "op", op: "or", exprs: subexprs })
          }
        }
      } else if (cond.op === "isntoneof") {
        // Get alternates and values
        values = _.filter(cond.rhs.literal, (v) => !["na", "dontknow"].includes(v))
        alternates = _.filter(cond.rhs.literal, (v) => ["na", "dontknow"].includes(v))

        // Handle special case for just na/dontknow
        if (type === "choice" || values.length === 0) {
          subexprs = []

          // All alternates have to be null
          for (alt of alternates) {
            subexprs.push({
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
            })
          }

          // If values, value has to be null or not = any
          if (values.length > 0) {
            subexprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: "not",
                  exprs: [
                    {
                      table: tableId,
                      type: "op",
                      op: "= any",
                      exprs: [
                        { table: tableId, type: "field", column: `data:${item._id}:value` },
                        { type: "literal", valueType: "enumset", value: values }
                      ]
                    }
                  ]
                }
              ]
            })
          }

          if (subexprs.length === 1) {
            exprs.push(subexprs[0])
          } else {
            exprs.push({ table: tableId, type: "op", op: "and", exprs: subexprs })
          }
        } else if (type === "choices") {
          subexprs = []

          // All alternates have to be null
          for (alt of alternates) {
            subexprs.push({
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
            })
          }

          // If values, value has to be null or not contains for each one
          if (values.length > 0) {
            subexprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: [
                {
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                },
                {
                  table: tableId,
                  type: "op",
                  op: "and",
                  exprs: _.map(values, (value) => {
                    return {
                      table: tableId,
                      type: "op",
                      op: "not",
                      exprs: [
                        {
                          table: tableId,
                          type: "op",
                          op: "contains",
                          exprs: [
                            { table: tableId, type: "field", column: `data:${item._id}:value` },
                            { type: "literal", valueType: "enumset", value: [value] }
                          ]
                        }
                      ]
                    }
                  })
                }
              ]
            })
          }

          if (subexprs.length === 1) {
            exprs.push(subexprs[0])
          } else {
            exprs.push({ table: tableId, type: "op", op: "and", exprs: subexprs })
          }
        }
      }
    }

    // Make into big and
    if (exprs.length === 0) {
      return null
    }
    if (exprs.length === 1) {
      return exprs[0]
    }

    return { table: tableId, type: "op", op: "and", exprs }
  }
}
