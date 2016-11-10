assert = require("chai").assert
ConditionsExprCompiler = require '../src/ConditionsExprCompiler'

canonical = require 'canonical-json'
compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

# NOTE: A thorough check can be done with mwater-server/scripts/form_condition_tests.coffee

describe "ConditionsExprCompiler", ->
  before ->
    @tableId = "responses:f1"
    @valueField = { type: "field", table: @tableId, column: "data:q1:value" }

    @checkCondition = (questionType, questionOptions, op, rhs, expected) ->
      formDesign = {
        _type: "Form"
        contents: [
          _.extend({ _id: "q1", _type: questionType, conditions: [] }, questionOptions)
        ]
      }

      conditions = [
        { lhs: { question: "q1" }, op: op, rhs: { literal: rhs } }
      ]

      compiler = new ConditionsExprCompiler(formDesign)
      results = compiler.compileConditions(conditions, @tableId)
      compare(results, expected)

  describe "present", ->
    it "text", ->
      @checkCondition("TextQuestion", {}, "present", null,
        { table: @tableId, type: "op", op: "and", exprs: [
          { table: @tableId, type: "op", op: "is not null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "<>", exprs: [@valueField, { type: "literal", valueType: "text", value: "" }] }
        ] }
      )

    it "number", ->
      @checkCondition("NumberQuestion", {}, "present", null,
        { table: @tableId, type: "op", op: "is not null", exprs: [@valueField] }
      )

    it "choices", ->
      @checkCondition("MulticheckQuestion", {}, "present", null,
        { table: @tableId, type: "op", op: "and", exprs: [
          { table: @tableId, type: "op", op: "is not null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: ">", exprs: [
            { table: @tableId, type: "op", op: "length", exprs: [@valueField] }
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      )

    it "aquagenx_cbt", ->
      @checkCondition("AquagenxCBTQuestion", {}, "present", null,
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:value:cbt:mpn" }] }
          { table: @tableId, type: "op", op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:value:image" }] }
        ] }
      )

    it "images", ->
      @checkCondition("ImagesQuestion", {}, "present", null,
        { table: @tableId, type: "op", op: "and", exprs: [
          { table: @tableId, type: "op", op: "is not null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: ">", exprs: [
            { table: @tableId, type: "op", op: "length", exprs: [@valueField] }
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      )

  describe "!present", ->
    it "text", ->
      @checkCondition("TextQuestion", {}, "!present", null,
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "=", exprs: [@valueField, { type: "literal", valueType: "text", value: "" }] }
        ] }
      )

    it "number", ->
      @checkCondition("NumberQuestion", {}, "!present", null,
        { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
      )

    it "choices", ->
      @checkCondition("MulticheckQuestion", {}, "!present", null,
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "=", exprs: [
            { table: @tableId, type: "op", op: "length", exprs: [@valueField] }
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      )

    it "aquagenx_cbt", ->
      @checkCondition("AquagenxCBTQuestion", {}, "!present", null,
        { table: @tableId, type: "op", op: "and", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:value:cbt:mpn" }] }
          { table: @tableId, type: "op", op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:value:image" }] }
        ] }
      )

    it "images", ->
      @checkCondition("ImagesQuestion", {}, "!present", null,
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "=", exprs: [
            { table: @tableId, type: "op", op: "length", exprs: [@valueField] }
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      )

  describe "contains", ->
    it "text", ->
      @checkCondition("TextQuestion", {}, "contains", "a.b",
        { table: @tableId, type: "op", op: "~*", exprs: [@valueField, { type: "literal", valueType: "text", value: "\\x61\\.b"} ] }
      )

  describe "!contains", ->
    it "text", ->
      @checkCondition("TextQuestion", {}, "!contains", "a.b",
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "not", exprs: [
            { table: @tableId, type: "op", op: "~*", exprs: [@valueField, { type: "literal", valueType: "text", value: "\\x61\\.b"} ] }
          ]}
        ]}
      )

  describe "=", ->
    it "number", ->
      @checkCondition("NumberQuestion", {}, "=", 3,
        { table: @tableId, type: "op", op: "=", exprs: [@valueField, { type: "literal", valueType: "number", value: 3} ] }
      )

  describe "<>", ->
    it "number", ->
      @checkCondition("NumberQuestion", {}, "!=", 3,
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "<>", exprs: [@valueField, { type: "literal", valueType: "number", value: 3} ] }
        ]}
      )

  describe ">", ->
    it "number", ->
      @checkCondition("NumberQuestion", {}, ">", 3,
        { table: @tableId, type: "op", op: ">", exprs: [@valueField, { type: "literal", valueType: "number", value: 3} ] }
      )

  describe "<", ->
    it "number", ->
      @checkCondition("NumberQuestion", {}, "<", 3,
        { table: @tableId, type: "op", op: "<", exprs: [@valueField, { type: "literal", valueType: "number", value: 3} ] }
      )

  describe "is", ->
    it "choice", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }] }, "is", "abc",
        { table: @tableId, type: "op", op: "=", exprs: [@valueField, { type: "literal", valueType: "enum", value: "abc" } ] }
      )

    it "alternate", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "is", "dontknow",
        { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
      )

      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "is", "na",
        { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:na" }] }
      )

  describe "isnt", ->
    it "choice", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }] }, "isnt", "abc",
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "<>", exprs: [@valueField, { type: "literal", valueType: "enum", value: "abc" } ] }
        ]}
      )

    it "alternate", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "isnt", "dontknow",
        { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
      )

      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "isnt", "na",
        { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:na" }] }
      )

  describe "includes", ->
    it "choices", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }] }, "includes", "abc",
        { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
      )

    it "alternate", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "includes", "dontknow",
        { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
      )

      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "includes", "na",
        { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:na" }] }
      )

  describe "!includes", ->
    it "choices", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }] }, "!includes", "abc",
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "not", exprs: [
            { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
          ]}
        ]}
      )

    it "alternate", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "!includes", "dontknow",
        { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
      )

      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "!includes", "na",
        { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:na" }] }
      )

  describe "before", ->
    it "date", ->
      @checkCondition("DateQuestion", { format: "MM/DD/YYYY" }, "before", "2014-12-31",
        { table: @tableId, type: "op", op: "<", exprs: [@valueField, { type: "literal", valueType: "date", value: "2014-12-31" } ] }
      )

    it "datetime", ->
      @checkCondition("DateQuestion", { format: "MM/DD/YYYY HH:mm" }, "before", "2014-12-31",
        { table: @tableId, type: "op", op: "<", exprs: [@valueField, { type: "literal", valueType: "datetime", value: "2014-12-31" } ] }
      )

  describe "after", ->
    it "date", ->
      @checkCondition("DateQuestion", { format: "MM/DD/YYYY" }, "after", "2014-12-31",
        { table: @tableId, type: "op", op: ">", exprs: [@valueField, { type: "literal", valueType: "date", value: "2014-12-31" } ] }
      )

    it "datetime", ->
      @checkCondition("DateQuestion", { format: "MM/DD/YYYY HH:mm" }, "after", "2014-12-31",
        { table: @tableId, type: "op", op: ">", exprs: [@valueField, { type: "literal", valueType: "datetime", value: "2014-12-31" } ] }
      )

  describe "true", ->
    it "boolean", ->
      @checkCondition("CheckQuestion", { }, "true", null,
        @valueField
      )

  describe "false", ->
    it "boolean", ->
      @checkCondition("CheckQuestion", { }, "false", null,
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "not", exprs: [@valueField] }
        ]}
      )

  describe "isoneof", ->
    it "choice", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "def"],
        { table: @tableId, type: "op", op: "= any", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc", "def"] } ] }
      )

    it "choice alternate only", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["dontknow"],
        { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
      )

      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["dontknow", "na"],
        { table: @tableId, type: "op", op: "or", exprs: [
          { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
          { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:na" }] }
        ]}
      )

    it "choice and alternate", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "dontknow"],
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "= any", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
          { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
        ] }
      )

    it "choices", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "def"],
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
          { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] }
        ]}
      )

    it "choices with alternate", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "def", "dontknow"],
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
          { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] }
          { type: "op", table: @tableId, op: "is not null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
        ]}
      )


  describe "isntoneof", ->
    it "choice", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "def"],
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "not", exprs: [
            { table: @tableId, type: "op", op: "= any", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc", "def"] } ] }
          ]}
        ]}
      )

    it "choice alternate only", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["dontknow"],
        { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
      )

      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["dontknow", "na"],
        { type: "op", table: @tableId, op: "and", exprs: [
          { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
          { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:na" }] }
        ]}
      )

    it "choice and alternate", ->
      @checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "dontknow"],
        { table: @tableId, type: "op", op: "and", exprs: [
          { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
          { table: @tableId, type: "op", op: "or", exprs: [
            { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
            { table: @tableId, type: "op", op: "not", exprs: [
              { table: @tableId, type: "op", op: "= any", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
            ]}
          ]}
        ]}
      )

    it "choices", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "def"],
        { table: @tableId, type: "op", op: "or", exprs: [
          { table: @tableId, type: "op", op: "is null", exprs: [@valueField] }
          { table: @tableId, type: "op", op: "and", exprs: [
            { table: @tableId, type: "op", op: "not", exprs: [
              { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
            ]}
            { table: @tableId, type: "op", op: "not", exprs: [
              { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] }
            ]}
          ]}
        ]}
      )

    it "choices with alternate", ->
      @checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "def", "dontknow"],
        { table: @tableId, type: "op", op: "and", exprs: [
          { type: "op", table: @tableId, op: "is null", exprs: [{ type: "field", table: @tableId, column: "data:q1:dontknow" }] }
          { table: @tableId, type: "op", op: "or", exprs: [
            { type: "op", table: @tableId, op: "is null", exprs: [@valueField] }
            { table: @tableId, type: "op", op: "and", exprs: [
              { table: @tableId, type: "op", op: "not", exprs: [
                { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
              ]}
              { table: @tableId, type: "op", op: "not", exprs: [
                { table: @tableId, type: "op", op: "contains", exprs: [@valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] }
              ]}
            ]}
          ]}
        ]}
      )
