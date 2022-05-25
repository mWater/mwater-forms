"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const formUtils = __importStar(require("./formUtils"));
const conditionUtils = __importStar(require("./conditionUtils"));
// Compiles conditions into mWater expressions
class ConditionsExprCompiler {
    constructor(formDesign) {
        this.itemMap = {};
        this.formDesign = formDesign;
        // Index all items
        this.itemMap = {};
        for (let item of formUtils.allItems(formDesign)) {
            if (item._type != "Form" && item._id) {
                this.itemMap[item._id] = item;
            }
        }
    }
    compileConditions(conditions, tableId) {
        let type;
        if (!conditions || conditions.length === 0) {
            return null;
        }
        // Expressions to be and-ed
        const exprs = [];
        for (let cond of conditions) {
            var alt, alternates, rhsType, subexprs, value, values;
            var item = this.itemMap[cond.lhs.question];
            if (!item || !formUtils.isQuestion(item)) {
                continue;
            }
            // Ignore if invalid condition
            if (!conditionUtils.validateCondition(cond, this.formDesign)) {
                continue;
            }
            type = formUtils.getAnswerType(item);
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
                        });
                        break;
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
                        });
                        break;
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
                        });
                        break;
                    case "units":
                        exprs.push({
                            table: tableId,
                            type: "op",
                            op: "is not null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:quantity` }]
                        });
                        break;
                    default:
                        exprs.push({
                            table: tableId,
                            type: "op",
                            op: "is not null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                        });
                }
            }
            else if (cond.op === "!present") {
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
                        });
                        break;
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
                        });
                        break;
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
                        });
                        break;
                    case "units":
                        exprs.push({
                            table: tableId,
                            type: "op",
                            op: "is null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value:quantity` }]
                        });
                        break;
                    default:
                        exprs.push({
                            table: tableId,
                            type: "op",
                            op: "is null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:value` }]
                        });
                }
            }
            else if (cond.op === "contains") {
                exprs.push({
                    table: tableId,
                    type: "op",
                    op: "~*",
                    exprs: [
                        { table: tableId, type: "field", column: `data:${item._id}:value` },
                        { type: "literal", valueType: "text", value: lodash_1.default.escapeRegExp(cond.rhs.literal || "") }
                    ]
                });
            }
            else if (cond.op === "!contains") {
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
                                        { type: "literal", valueType: "text", value: lodash_1.default.escapeRegExp(cond.rhs.literal || "") }
                                    ]
                                }
                            ]
                        }
                    ]
                });
            }
            else if (cond.op === "=") {
                exprs.push({
                    table: tableId,
                    type: "op",
                    op: "=",
                    exprs: [
                        { table: tableId, type: "field", column: `data:${item._id}:value` },
                        { type: "literal", valueType: "number", value: cond.rhs.literal }
                    ]
                });
            }
            else if (cond.op === "!=") {
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
                });
            }
            else if (cond.op === ">") {
                exprs.push({
                    table: tableId,
                    type: "op",
                    op: ">",
                    exprs: [
                        { table: tableId, type: "field", column: `data:${item._id}:value` },
                        { type: "literal", valueType: "number", value: cond.rhs.literal }
                    ]
                });
            }
            else if (cond.op === "<") {
                exprs.push({
                    table: tableId,
                    type: "op",
                    op: "<",
                    exprs: [
                        { table: tableId, type: "field", column: `data:${item._id}:value` },
                        { type: "literal", valueType: "number", value: cond.rhs.literal }
                    ]
                });
            }
            else if (cond.op === "is") {
                // Special case for alternates
                if (["na", "dontknow"].includes(cond.rhs.literal)) {
                    exprs.push({
                        table: tableId,
                        type: "op",
                        op: "is not null",
                        exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
                    });
                }
                else {
                    exprs.push({
                        table: tableId,
                        type: "op",
                        op: "=",
                        exprs: [
                            { table: tableId, type: "field", column: `data:${item._id}:value` },
                            { type: "literal", valueType: "enum", value: cond.rhs.literal }
                        ]
                    });
                }
            }
            else if (cond.op === "isnt") {
                // Special case for alternates
                if (["na", "dontknow"].includes(cond.rhs.literal)) {
                    exprs.push({
                        table: tableId,
                        type: "op",
                        op: "is null",
                        exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
                    });
                }
                else {
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
                    });
                }
            }
            else if (cond.op === "includes") {
                // Special case for alternates
                if (["na", "dontknow"].includes(cond.rhs.literal)) {
                    exprs.push({
                        table: tableId,
                        type: "op",
                        op: "is not null",
                        exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
                    });
                }
                else {
                    exprs.push({
                        table: tableId,
                        type: "op",
                        op: "contains",
                        exprs: [
                            { table: tableId, type: "field", column: `data:${item._id}:value` },
                            { type: "literal", valueType: "enumset", value: [cond.rhs.literal] }
                        ]
                    });
                }
            }
            else if (cond.op === "!includes") {
                // Special case for alternates
                if (["na", "dontknow"].includes(cond.rhs.literal)) {
                    exprs.push({
                        table: tableId,
                        type: "op",
                        op: "is null",
                        exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${cond.rhs.literal}` }]
                    });
                }
                else {
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
                    });
                }
            }
            else if (cond.op === "before" && (item._type == "DateQuestion" || item._type == "DateColumnQuestion")) {
                rhsType = (item.format || "").match(/ss|LLL|lll|m|h|H/) ? "datetime" : "date";
                exprs.push({
                    table: tableId,
                    type: "op",
                    op: "<",
                    exprs: [
                        { table: tableId, type: "field", column: `data:${item._id}:value` },
                        { type: "literal", valueType: rhsType, value: cond.rhs.literal }
                    ]
                });
            }
            else if (cond.op === "after" && (item._type == "DateQuestion" || item._type == "DateColumnQuestion")) {
                rhsType = (item.format || "").match(/ss|LLL|lll|m|h|H/) ? "datetime" : "date";
                exprs.push({
                    table: tableId,
                    type: "op",
                    op: ">",
                    exprs: [
                        { table: tableId, type: "field", column: `data:${item._id}:value` },
                        { type: "literal", valueType: rhsType, value: cond.rhs.literal }
                    ]
                });
            }
            else if (cond.op === "true") {
                exprs.push({ table: tableId, type: "field", column: `data:${item._id}:value` });
            }
            else if (cond.op === "false") {
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
                });
            }
            else if (cond.op === "isoneof") {
                // Get alternates and values
                values = lodash_1.default.filter(cond.rhs.literal, (v) => !["na", "dontknow"].includes(v));
                alternates = lodash_1.default.filter(cond.rhs.literal, (v) => ["na", "dontknow"].includes(v));
                // Handle special case for just na/dontknow
                if (type === "choice" || values.length === 0) {
                    if (values.length === 0 && alternates.length === 1) {
                        exprs.push({
                            table: tableId,
                            type: "op",
                            op: "is not null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alternates[0]}` }]
                        });
                    }
                    else if (values.length === 0 && alternates.length > 1) {
                        exprs.push({
                            table: tableId,
                            type: "op",
                            op: "or",
                            exprs: lodash_1.default.map(alternates, (alt) => ({
                                table: tableId,
                                type: "op",
                                op: "is not null",
                                exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
                            }))
                        });
                    }
                    else {
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
                        ];
                        for (alt of alternates) {
                            subexprs.push({
                                table: tableId,
                                type: "op",
                                op: "is not null",
                                exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
                            });
                        }
                        if (subexprs.length === 1) {
                            exprs.push(subexprs[0]);
                        }
                        else {
                            exprs.push({ table: tableId, type: "op", op: "or", exprs: subexprs });
                        }
                    }
                }
                else if (type === "choices") {
                    subexprs = [];
                    for (value of values) {
                        subexprs.push({
                            table: tableId,
                            type: "op",
                            op: "contains",
                            exprs: [
                                { table: tableId, type: "field", column: `data:${item._id}:value` },
                                { type: "literal", valueType: "enumset", value: [value] }
                            ]
                        });
                    }
                    for (alt of alternates) {
                        subexprs.push({
                            table: tableId,
                            type: "op",
                            op: "is not null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
                        });
                    }
                    if (subexprs.length === 1) {
                        exprs.push(subexprs[0]);
                    }
                    else {
                        exprs.push({ table: tableId, type: "op", op: "or", exprs: subexprs });
                    }
                }
            }
            else if (cond.op === "isntoneof") {
                // Get alternates and values
                values = lodash_1.default.filter(cond.rhs.literal, (v) => !["na", "dontknow"].includes(v));
                alternates = lodash_1.default.filter(cond.rhs.literal, (v) => ["na", "dontknow"].includes(v));
                // Handle special case for just na/dontknow
                if (type === "choice" || values.length === 0) {
                    subexprs = [];
                    // All alternates have to be null
                    for (alt of alternates) {
                        subexprs.push({
                            table: tableId,
                            type: "op",
                            op: "is null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
                        });
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
                        });
                    }
                    if (subexprs.length === 1) {
                        exprs.push(subexprs[0]);
                    }
                    else {
                        exprs.push({ table: tableId, type: "op", op: "and", exprs: subexprs });
                    }
                }
                else if (type === "choices") {
                    subexprs = [];
                    // All alternates have to be null
                    for (alt of alternates) {
                        subexprs.push({
                            table: tableId,
                            type: "op",
                            op: "is null",
                            exprs: [{ table: tableId, type: "field", column: `data:${item._id}:${alt}` }]
                        });
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
                                    exprs: lodash_1.default.map(values, (value) => {
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
                                        };
                                    })
                                }
                            ]
                        });
                    }
                    if (subexprs.length === 1) {
                        exprs.push(subexprs[0]);
                    }
                    else {
                        exprs.push({ table: tableId, type: "op", op: "and", exprs: subexprs });
                    }
                }
            }
        }
        // Make into big and
        if (exprs.length === 0) {
            return null;
        }
        if (exprs.length === 1) {
            return exprs[0];
        }
        return { table: tableId, type: "op", op: "and", exprs };
    }
}
exports.default = ConditionsExprCompiler;
