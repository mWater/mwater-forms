import _ from 'lodash';
import { assert } from "chai";
import ConditionsExprCompiler from '../src/ConditionsExprCompiler';
import canonical from 'canonical-json';
const compare = (actual, expected) => assert.equal(canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n");

// NOTE: A thorough check can be done with mwater-server/scripts/form_condition_tests.coffee

describe("ConditionsExprCompiler", function() {
  before(function() {
    this.tableId = "responses:f1";
    this.valueField = { type: "field", table: this.tableId, column: "data:q1:value" };

    return this.checkCondition = function(questionType, questionOptions, op, rhs, expected) {
      const formDesign = {
        _type: "Form",
        contents: [
          _.extend({ _id: "q1", _type: questionType, conditions: [] }, questionOptions)
        ]
      };

      const conditions = [
        { lhs: { question: "q1" }, op, rhs: { literal: rhs } }
      ];

      const compiler = new ConditionsExprCompiler(formDesign);
      const results = compiler.compileConditions(conditions, this.tableId);
      return compare(results, expected);
    };
  });

  describe("present", function() {
    it("text", function() {
      return this.checkCondition("TextQuestion", {}, "present", null,
        { table: this.tableId, type: "op", op: "and", exprs: [
          { table: this.tableId, type: "op", op: "is not null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "<>", exprs: [this.valueField, { type: "literal", valueType: "text", value: "" }] }
        ] }
      );
    });

    it("number", function() {
      return this.checkCondition("NumberQuestion", {}, "present", null,
        { table: this.tableId, type: "op", op: "is not null", exprs: [this.valueField] }
      );
    });

    it("choices", function() {
      return this.checkCondition("MulticheckQuestion", {}, "present", null,
        { table: this.tableId, type: "op", op: "and", exprs: [
          { table: this.tableId, type: "op", op: "is not null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: ">", exprs: [
            { table: this.tableId, type: "op", op: "length", exprs: [this.valueField] },
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      );
    });

    it("aquagenx_cbt", function() {
      return this.checkCondition("AquagenxCBTQuestion", {}, "present", null,
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:value:cbt:mpn" }] },
          { table: this.tableId, type: "op", op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:value:image" }] }
        ] }
      );
    });

    return it("images", function() {
      return this.checkCondition("ImagesQuestion", {}, "present", null,
        { table: this.tableId, type: "op", op: "and", exprs: [
          { table: this.tableId, type: "op", op: "is not null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: ">", exprs: [
            { table: this.tableId, type: "op", op: "length", exprs: [this.valueField] },
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      );
    });
  });

  describe("!present", function() {
    it("text", function() {
      return this.checkCondition("TextQuestion", {}, "!present", null,
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "=", exprs: [this.valueField, { type: "literal", valueType: "text", value: "" }] }
        ] }
      );
    });

    it("number", function() {
      return this.checkCondition("NumberQuestion", {}, "!present", null,
        { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] }
      );
    });

    it("choices", function() {
      return this.checkCondition("MulticheckQuestion", {}, "!present", null,
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "=", exprs: [
            { table: this.tableId, type: "op", op: "length", exprs: [this.valueField] },
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      );
    });

    it("aquagenx_cbt", function() {
      return this.checkCondition("AquagenxCBTQuestion", {}, "!present", null,
        { table: this.tableId, type: "op", op: "and", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:value:cbt:mpn" }] },
          { table: this.tableId, type: "op", op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:value:image" }] }
        ] }
      );
    });

    return it("images", function() {
      return this.checkCondition("ImagesQuestion", {}, "!present", null,
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "=", exprs: [
            { table: this.tableId, type: "op", op: "length", exprs: [this.valueField] },
            { type: "literal", valueType: "number", value: 0 }
          ] }
        ] }
      );
    });
  });

  describe("contains", () => it("text", function() {
    return this.checkCondition("TextQuestion", {}, "contains", "a.b",
      { table: this.tableId, type: "op", op: "~*", exprs: [this.valueField, { type: "literal", valueType: "text", value: "\\x61\\.b"} ] }
    );
  }));

  describe("!contains", () => it("text", function() {
    return this.checkCondition("TextQuestion", {}, "!contains", "a.b",
      { table: this.tableId, type: "op", op: "or", exprs: [
        { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
        { table: this.tableId, type: "op", op: "not", exprs: [
          { table: this.tableId, type: "op", op: "~*", exprs: [this.valueField, { type: "literal", valueType: "text", value: "\\x61\\.b"} ] }
        ]}
      ]}
    );
  }));

  describe("=", () => it("number", function() {
    return this.checkCondition("NumberQuestion", {}, "=", 3,
      { table: this.tableId, type: "op", op: "=", exprs: [this.valueField, { type: "literal", valueType: "number", value: 3} ] }
    );
  }));

  describe("<>", () => it("number", function() {
    return this.checkCondition("NumberQuestion", {}, "!=", 3,
      { table: this.tableId, type: "op", op: "or", exprs: [
        { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
        { table: this.tableId, type: "op", op: "<>", exprs: [this.valueField, { type: "literal", valueType: "number", value: 3} ] }
      ]}
    );
  }));

  describe(">", () => it("number", function() {
    return this.checkCondition("NumberQuestion", {}, ">", 3,
      { table: this.tableId, type: "op", op: ">", exprs: [this.valueField, { type: "literal", valueType: "number", value: 3} ] }
    );
  }));

  describe("<", () => it("number", function() {
    return this.checkCondition("NumberQuestion", {}, "<", 3,
      { table: this.tableId, type: "op", op: "<", exprs: [this.valueField, { type: "literal", valueType: "number", value: 3} ] }
    );
  }));

  describe("is", function() {
    it("choice", function() {
      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }] }, "is", "abc",
        { table: this.tableId, type: "op", op: "=", exprs: [this.valueField, { type: "literal", valueType: "enum", value: "abc" } ] }
      );
    });

    return it("alternate", function() {
      this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "is", "dontknow",
        { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
      );

      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "is", "na",
        { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:na" }] }
      );
    });
  });

  describe("isnt", function() {
    it("choice", function() {
      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }] }, "isnt", "abc",
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "<>", exprs: [this.valueField, { type: "literal", valueType: "enum", value: "abc" } ] }
        ]}
      );
    });

    return it("alternate", function() {
      this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "isnt", "dontknow",
        { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
      );

      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "isnt", "na",
        { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:na" }] }
      );
    });
  });

  describe("includes", function() {
    it("choices", function() {
      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }] }, "includes", "abc",
        { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
      );
    });

    return it("alternate", function() {
      this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "includes", "dontknow",
        { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
      );

      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "includes", "na",
        { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:na" }] }
      );
    });
  });

  describe("!includes", function() {
    it("choices", function() {
      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }] }, "!includes", "abc",
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "not", exprs: [
            { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
          ]}
        ]}
      );
    });

    return it("alternate", function() {
      this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "!includes", "dontknow",
        { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
      );

      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }], alternates: { na: true, dontknow: true } }, "!includes", "na",
        { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:na" }] }
      );
    });
  });

  describe("before", function() {
    it("date", function() {
      return this.checkCondition("DateQuestion", { format: "MM/DD/YYYY" }, "before", "2014-12-31",
        { table: this.tableId, type: "op", op: "<", exprs: [this.valueField, { type: "literal", valueType: "date", value: "2014-12-31" } ] }
      );
    });

    return it("datetime", function() {
      return this.checkCondition("DateQuestion", { format: "MM/DD/YYYY HH:mm" }, "before", "2014-12-31",
        { table: this.tableId, type: "op", op: "<", exprs: [this.valueField, { type: "literal", valueType: "datetime", value: "2014-12-31" } ] }
      );
    });
  });

  describe("after", function() {
    it("date", function() {
      return this.checkCondition("DateQuestion", { format: "MM/DD/YYYY" }, "after", "2014-12-31",
        { table: this.tableId, type: "op", op: ">", exprs: [this.valueField, { type: "literal", valueType: "date", value: "2014-12-31" } ] }
      );
    });

    return it("datetime", function() {
      return this.checkCondition("DateQuestion", { format: "MM/DD/YYYY HH:mm" }, "after", "2014-12-31",
        { table: this.tableId, type: "op", op: ">", exprs: [this.valueField, { type: "literal", valueType: "datetime", value: "2014-12-31" } ] }
      );
    });
  });

  describe("true", () => it("boolean", function() {
    return this.checkCondition("CheckQuestion", { }, "true", null,
      this.valueField
    );
  }));

  describe("false", () => it("boolean", function() {
    return this.checkCondition("CheckQuestion", { }, "false", null,
      { table: this.tableId, type: "op", op: "or", exprs: [
        { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
        { table: this.tableId, type: "op", op: "not", exprs: [this.valueField] }
      ]}
    );
  }));

  describe("isoneof", function() {
    it("choice", function() {
      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "def"],
        { table: this.tableId, type: "op", op: "= any", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc", "def"] } ] }
      );
    });

    it("choice alternate only", function() {
      this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["dontknow"],
        { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
      );

      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["dontknow", "na"],
        { table: this.tableId, type: "op", op: "or", exprs: [
          { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] },
          { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:na" }] }
        ]}
      );
    });

    it("choice and alternate", function() {
      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "dontknow"],
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "= any", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] },
          { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
        ] }
      );
    });

    it("choices", function() {
      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "def"],
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] },
          { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] }
        ]}
      );
    });

    return it("choices with alternate", function() {
      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isoneof", ["abc", "def", "dontknow"],
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] },
          { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] },
          { type: "op", table: this.tableId, op: "is not null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
        ]}
      );
    });
  });


  return describe("isntoneof", function() {
    it("choice", function() {
      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "def"],
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "not", exprs: [
            { table: this.tableId, type: "op", op: "= any", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc", "def"] } ] }
          ]}
        ]}
      );
    });

    it("choice alternate only", function() {
      this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["dontknow"],
        { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] }
      );

      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["dontknow", "na"],
        { type: "op", table: this.tableId, op: "and", exprs: [
          { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] },
          { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:na" }] }
        ]}
      );
    });

    it("choice and alternate", function() {
      return this.checkCondition("RadioQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "dontknow"],
        { table: this.tableId, type: "op", op: "and", exprs: [
          { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] },
          { table: this.tableId, type: "op", op: "or", exprs: [
            { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
            { table: this.tableId, type: "op", op: "not", exprs: [
              { table: this.tableId, type: "op", op: "= any", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
            ]}
          ]}
        ]}
      );
    });

    it("choices", function() {
      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "def"],
        { table: this.tableId, type: "op", op: "or", exprs: [
          { table: this.tableId, type: "op", op: "is null", exprs: [this.valueField] },
          { table: this.tableId, type: "op", op: "and", exprs: [
            { table: this.tableId, type: "op", op: "not", exprs: [
              { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
            ]},
            { table: this.tableId, type: "op", op: "not", exprs: [
              { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] }
            ]}
          ]}
        ]}
      );
    });

    return it("choices with alternate", function() {
      return this.checkCondition("MulticheckQuestion", { choices: [{ id: "abc" }, { id: "def" }], alternates: { na: true, dontknow: true } }, "isntoneof", ["abc", "def", "dontknow"],
        { table: this.tableId, type: "op", op: "and", exprs: [
          { type: "op", table: this.tableId, op: "is null", exprs: [{ type: "field", table: this.tableId, column: "data:q1:dontknow" }] },
          { table: this.tableId, type: "op", op: "or", exprs: [
            { type: "op", table: this.tableId, op: "is null", exprs: [this.valueField] },
            { table: this.tableId, type: "op", op: "and", exprs: [
              { table: this.tableId, type: "op", op: "not", exprs: [
                { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["abc"] } ] }
              ]},
              { table: this.tableId, type: "op", op: "not", exprs: [
                { table: this.tableId, type: "op", op: "contains", exprs: [this.valueField, { type: "literal", valueType: "enumset", value: ["def"] } ] }
              ]}
            ]}
          ]}
        ]}
      );
    });
  });
});
