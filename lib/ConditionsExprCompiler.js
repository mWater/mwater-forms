'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConditionsExprCompiler, _, conditionUtils, formUtils;

_ = require('lodash');

formUtils = require('./formUtils');

conditionUtils = require('./conditionUtils');

// Compiles conditions into mWater expressions
module.exports = ConditionsExprCompiler = function () {
  function ConditionsExprCompiler(formDesign) {
    (0, _classCallCheck3.default)(this, ConditionsExprCompiler);

    var i, item, len, ref;
    this.formDesign = formDesign;
    // Index all items
    this.itemMap = {};
    ref = formUtils.allItems(formDesign);
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      if (item._id) {
        this.itemMap[item._id] = item;
      }
    }
  }

  (0, _createClass3.default)(ConditionsExprCompiler, [{
    key: 'compileConditions',
    value: function compileConditions(conditions, tableId) {
      var alt, alternates, cond, exprs, i, item, j, k, l, len, len1, len2, len3, len4, len5, m, n, ref, ref1, ref2, ref3, rhsType, subexprs, type, value, values;
      if (!conditions || conditions.length === 0) {
        return null;
      }
      // Expressions to be and-ed
      exprs = [];
      for (i = 0, len = conditions.length; i < len; i++) {
        cond = conditions[i];
        item = this.itemMap[cond.lhs.question];
        if (!item) {
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
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: "<>",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }, {
                    type: "literal",
                    valueType: "text",
                    value: ""
                  }]
                }]
              });
              break;
            case "choices":
            case "images":
              exprs.push({
                table: tableId,
                type: "op",
                op: "and",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: ">",
                  exprs: [{
                    table: tableId,
                    type: "op",
                    op: "length",
                    exprs: [{
                      table: tableId,
                      type: "field",
                      column: 'data:' + item._id + ':value'
                    }]
                  }, {
                    type: "literal",
                    valueType: "number",
                    value: 0
                  }]
                }]
              });
              break;
            case "aquagenx_cbt":
              exprs.push({
                table: tableId,
                type: "op",
                op: "or",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value:cbt:mpn'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value:image'
                  }]
                }]
              });
              break;
            case "units":
              exprs.push({
                table: tableId,
                type: "op",
                op: "is not null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value:quantity'
                }]
              });
              break;
            default:
              exprs.push({
                table: tableId,
                type: "op",
                op: "is not null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }]
              });
          }
        } else if (cond.op === "!present") {
          switch (type) {
            case "text":
              exprs.push({
                table: tableId,
                type: "op",
                op: "or",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: "=",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }, {
                    type: "literal",
                    valueType: "text",
                    value: ""
                  }]
                }]
              });
              break;
            case "choices":
            case "images":
              exprs.push({
                table: tableId,
                type: "op",
                op: "or",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: "=",
                  exprs: [{
                    table: tableId,
                    type: "op",
                    op: "length",
                    exprs: [{
                      table: tableId,
                      type: "field",
                      column: 'data:' + item._id + ':value'
                    }]
                  }, {
                    type: "literal",
                    valueType: "number",
                    value: 0
                  }]
                }]
              });
              break;
            case "aquagenx_cbt":
              exprs.push({
                table: tableId,
                type: "op",
                op: "and",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value:cbt:mpn'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value:image'
                  }]
                }]
              });
              break;
            case "units":
              exprs.push({
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value:quantity'
                }]
              });
              break;
            default:
              exprs.push({
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }]
              });
          }
        } else if (cond.op === "contains") {
          exprs.push({
            table: tableId,
            type: "op",
            op: "~*",
            exprs: [{
              table: tableId,
              type: "field",
              column: 'data:' + item._id + ':value'
            }, {
              type: "literal",
              valueType: "text",
              value: _.escapeRegExp(cond.rhs.literal || "")
            }]
          });
        } else if (cond.op === "!contains") {
          exprs.push({
            table: tableId,
            type: "op",
            op: "or",
            exprs: [{
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':value'
              }]
            }, {
              table: tableId,
              type: "op",
              op: "not",
              exprs: [{
                table: tableId,
                type: "op",
                op: "~*",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }, {
                  type: "literal",
                  valueType: "text",
                  value: _.escapeRegExp(cond.rhs.literal || "")
                }]
              }]
            }]
          });
        } else if (cond.op === "=") {
          exprs.push({
            table: tableId,
            type: "op",
            op: "=",
            exprs: [{
              table: tableId,
              type: "field",
              column: 'data:' + item._id + ':value'
            }, {
              type: "literal",
              valueType: "number",
              value: cond.rhs.literal
            }]
          });
        } else if (cond.op === "!=") {
          exprs.push({
            table: tableId,
            type: "op",
            op: "or",
            exprs: [{
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':value'
              }]
            }, {
              table: tableId,
              type: "op",
              op: "<>",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':value'
              }, {
                type: "literal",
                valueType: "number",
                value: cond.rhs.literal
              }]
            }]
          });
        } else if (cond.op === ">") {
          exprs.push({
            table: tableId,
            type: "op",
            op: ">",
            exprs: [{
              table: tableId,
              type: "field",
              column: 'data:' + item._id + ':value'
            }, {
              type: "literal",
              valueType: "number",
              value: cond.rhs.literal
            }]
          });
        } else if (cond.op === "<") {
          exprs.push({
            table: tableId,
            type: "op",
            op: "<",
            exprs: [{
              table: tableId,
              type: "field",
              column: 'data:' + item._id + ':value'
            }, {
              type: "literal",
              valueType: "number",
              value: cond.rhs.literal
            }]
          });
        } else if (cond.op === "is") {
          // Special case for alternates
          if ((ref = cond.rhs.literal) === 'na' || ref === 'dontknow') {
            exprs.push({
              table: tableId,
              type: "op",
              op: "is not null",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':' + cond.rhs.literal
              }]
            });
          } else {
            exprs.push({
              table: tableId,
              type: "op",
              op: "=",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':value'
              }, {
                type: "literal",
                valueType: "enum",
                value: cond.rhs.literal
              }]
            });
          }
        } else if (cond.op === "isnt") {
          // Special case for alternates
          if ((ref1 = cond.rhs.literal) === 'na' || ref1 === 'dontknow') {
            exprs.push({
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':' + cond.rhs.literal
              }]
            });
          } else {
            // Null or not equal
            exprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: [{
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }]
              }, {
                table: tableId,
                type: "op",
                op: "<>",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }, {
                  type: "literal",
                  valueType: "enum",
                  value: cond.rhs.literal
                }]
              }]
            });
          }
        } else if (cond.op === "includes") {
          // Special case for alternates
          if ((ref2 = cond.rhs.literal) === 'na' || ref2 === 'dontknow') {
            exprs.push({
              table: tableId,
              type: "op",
              op: "is not null",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':' + cond.rhs.literal
              }]
            });
          } else {
            exprs.push({
              table: tableId,
              type: "op",
              op: "contains",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':value'
              }, {
                type: "literal",
                valueType: "enumset",
                value: [cond.rhs.literal]
              }]
            });
          }
        } else if (cond.op === "!includes") {
          // Special case for alternates
          if ((ref3 = cond.rhs.literal) === 'na' || ref3 === 'dontknow') {
            exprs.push({
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':' + cond.rhs.literal
              }]
            });
          } else {
            // Null value or not contains
            exprs.push({
              table: tableId,
              type: "op",
              op: "or",
              exprs: [{
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }]
              }, {
                table: tableId,
                type: "op",
                op: "not",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "contains",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }, {
                    type: "literal",
                    valueType: "enumset",
                    value: [cond.rhs.literal]
                  }]
                }]
              }]
            });
          }
        } else if (cond.op === "before") {
          rhsType = item.format.match(/ss|LLL|lll|m|h|H/) ? "datetime" : "date";
          exprs.push({
            table: tableId,
            type: "op",
            op: "<",
            exprs: [{
              table: tableId,
              type: "field",
              column: 'data:' + item._id + ':value'
            }, {
              type: "literal",
              valueType: rhsType,
              value: cond.rhs.literal
            }]
          });
        } else if (cond.op === "after") {
          rhsType = item.format.match(/ss|LLL|lll|m|h|H/) ? "datetime" : "date";
          exprs.push({
            table: tableId,
            type: "op",
            op: ">",
            exprs: [{
              table: tableId,
              type: "field",
              column: 'data:' + item._id + ':value'
            }, {
              type: "literal",
              valueType: rhsType,
              value: cond.rhs.literal
            }]
          });
        } else if (cond.op === "true") {
          exprs.push({
            table: tableId,
            type: "field",
            column: 'data:' + item._id + ':value'
          });
        } else if (cond.op === "false") {
          exprs.push({
            table: tableId,
            type: "op",
            op: "or",
            exprs: [{
              table: tableId,
              type: "op",
              op: "is null",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':value'
              }]
            }, {
              table: tableId,
              type: "op",
              op: "not",
              exprs: [{
                table: tableId,
                type: "field",
                column: 'data:' + item._id + ':value'
              }]
            }]
          });
        } else if (cond.op === "isoneof") {
          // Get alternates and values
          values = _.filter(cond.rhs.literal, function (v) {
            return v !== 'na' && v !== 'dontknow';
          });
          alternates = _.filter(cond.rhs.literal, function (v) {
            return v === 'na' || v === 'dontknow';
          });
          // Handle special case for just na/dontknow
          if (type === "choice" || values.length === 0) {
            if (values.length === 0 && alternates.length === 1) {
              exprs.push({
                table: tableId,
                type: "op",
                op: "is not null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':' + alternates[0]
                }]
              });
            } else if (values.length === 0 && alternates.length > 1) {
              exprs.push({
                table: tableId,
                type: "op",
                op: "or",
                exprs: _.map(alternates, function (alt) {
                  return {
                    table: tableId,
                    type: "op",
                    op: "is not null",
                    exprs: [{
                      table: tableId,
                      type: "field",
                      column: 'data:' + item._id + ':' + alt
                    }]
                  };
                })
              });
            } else {
              subexprs = [{
                table: tableId,
                type: "op",
                op: "= any",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }, {
                  type: "literal",
                  valueType: "enumset",
                  value: values
                }]
              }];
              for (j = 0, len1 = alternates.length; j < len1; j++) {
                alt = alternates[j];
                subexprs.push({
                  table: tableId,
                  type: "op",
                  op: "is not null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':' + alt
                  }]
                });
              }
              if (subexprs.length === 1) {
                exprs.push(subexprs[0]);
              } else {
                exprs.push({
                  table: tableId,
                  type: "op",
                  op: "or",
                  exprs: subexprs
                });
              }
            }
          } else if (type === "choices") {
            subexprs = [];
            for (k = 0, len2 = values.length; k < len2; k++) {
              value = values[k];
              subexprs.push({
                table: tableId,
                type: "op",
                op: "contains",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':value'
                }, {
                  type: "literal",
                  valueType: "enumset",
                  value: [value]
                }]
              });
            }
            for (l = 0, len3 = alternates.length; l < len3; l++) {
              alt = alternates[l];
              subexprs.push({
                table: tableId,
                type: "op",
                op: "is not null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':' + alt
                }]
              });
            }
            if (subexprs.length === 1) {
              exprs.push(subexprs[0]);
            } else {
              exprs.push({
                table: tableId,
                type: "op",
                op: "or",
                exprs: subexprs
              });
            }
          }
        } else if (cond.op === "isntoneof") {
          // Get alternates and values
          values = _.filter(cond.rhs.literal, function (v) {
            return v !== 'na' && v !== 'dontknow';
          });
          alternates = _.filter(cond.rhs.literal, function (v) {
            return v === 'na' || v === 'dontknow';
          });
          // Handle special case for just na/dontknow
          if (type === "choice" || values.length === 0) {
            subexprs = [];
            // All alternates have to be null
            for (m = 0, len4 = alternates.length; m < len4; m++) {
              alt = alternates[m];
              subexprs.push({
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':' + alt
                }]
              });
            }
            // If values, value has to be null or not = any
            if (values.length > 0) {
              subexprs.push({
                table: tableId,
                type: "op",
                op: "or",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: "not",
                  exprs: [{
                    table: tableId,
                    type: "op",
                    op: "= any",
                    exprs: [{
                      table: tableId,
                      type: "field",
                      column: 'data:' + item._id + ':value'
                    }, {
                      type: "literal",
                      valueType: "enumset",
                      value: values
                    }]
                  }]
                }]
              });
            }
            if (subexprs.length === 1) {
              exprs.push(subexprs[0]);
            } else {
              exprs.push({
                table: tableId,
                type: "op",
                op: "and",
                exprs: subexprs
              });
            }
          } else if (type === "choices") {
            subexprs = [];
            // All alternates have to be null
            for (n = 0, len5 = alternates.length; n < len5; n++) {
              alt = alternates[n];
              subexprs.push({
                table: tableId,
                type: "op",
                op: "is null",
                exprs: [{
                  table: tableId,
                  type: "field",
                  column: 'data:' + item._id + ':' + alt
                }]
              });
            }
            // If values, value has to be null or not contains for each one
            if (values.length > 0) {
              subexprs.push({
                table: tableId,
                type: "op",
                op: "or",
                exprs: [{
                  table: tableId,
                  type: "op",
                  op: "is null",
                  exprs: [{
                    table: tableId,
                    type: "field",
                    column: 'data:' + item._id + ':value'
                  }]
                }, {
                  table: tableId,
                  type: "op",
                  op: "and",
                  exprs: _.map(values, function (value) {
                    return {
                      table: tableId,
                      type: "op",
                      op: "not",
                      exprs: [{
                        table: tableId,
                        type: "op",
                        op: "contains",
                        exprs: [{
                          table: tableId,
                          type: "field",
                          column: 'data:' + item._id + ':value'
                        }, {
                          type: "literal",
                          valueType: "enumset",
                          value: [value]
                        }]
                      }]
                    };
                  })
                }]
              });
            }
            if (subexprs.length === 1) {
              exprs.push(subexprs[0]);
            } else {
              exprs.push({
                table: tableId,
                type: "op",
                op: "and",
                exprs: subexprs
              });
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
      return {
        table: tableId,
        type: "op",
        op: "and",
        exprs: exprs
      };
    }
  }]);
  return ConditionsExprCompiler;
}();