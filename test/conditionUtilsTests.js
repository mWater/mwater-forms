// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import _ from 'lodash';
import { assert } from 'chai';
import * as conditionUtils from '../src/conditionUtils';

describe("conditionUtils", function() {
  describe('compileCondition', function() {
    beforeEach(function() {
      this.compileCondition = (lhs, op, rhs) => {
        const cond = {
          lhs: { question: "lhsid" },
          op,
          rhs: (rhs != null) ? { literal: rhs } : undefined
        };
        return conditionUtils.compileCondition(cond);
      };

      // lhsExtras is stuff to add to answer of lhs question
      this.testTrue = (lhs, op, rhs, lhsExtras={}) => {
        const data = {lhsid: _.extend({ value: lhs }, lhsExtras)};
        const condition = this.compileCondition(lhs, op, rhs, lhsExtras);
        return assert.isTrue(condition(data));
      };

      // lhsExtras is stuff to add to answer of lhs question
      return this.testFalse = (lhs, op, rhs, lhsExtras={}) => {
        const data = {lhsid: _.extend({ value: lhs }, lhsExtras)};
        const condition = this.compileCondition(lhs, op, rhs, lhsExtras);
        return assert.isFalse(condition(data));
      };
    });

    describe("present", function() {
      it("handles null", function() {
        return this.testFalse(null, "present");
      });

      it("handles zero", function() {
        return this.testTrue(0, "present");
      });

      it("handles empty string", function() {
        this.testTrue("abc", "present");
        return this.testFalse("", "present");
      });

      it("handles empty list", function() {
        this.testTrue([""], "present");
        return this.testFalse([], "present");
      });

      return it("handles empty objects", function() {
        this.testTrue({something: 'value'}, "present");
        this.testFalse({something: null}, "present");
        return this.testFalse({}, "present");
      });
    });

    describe("!present", function() {
      it("handles zero", function() {
        return this.testFalse(0, "!present");
      });

      it("handles null", function() {
        return this.testTrue(null, "!present");
      });

      it("handles empty string", function() {
        this.testTrue("", "!present");
        return this.testFalse("abc", "!present");
      });

      it("handles empty list", function() {
        this.testTrue([], "!present");
        return this.testFalse([""], "!present");
      });

      return it("handles empty objects", function() {
        this.testFalse({something: 'value'}, "!present");
        this.testTrue({something: null}, "!present");
        return this.testTrue({}, "!present");
      });
    });

    it("compiles contains", function() {
      this.testTrue("abc", "contains", "ab");
      return this.testFalse("abc", "contains", "abcd");
    });

    it("compiles !contains", function() {
      this.testFalse("abc", "!contains", "ab");
      return this.testTrue("abc", "!contains", "abcd");
    });

    it("compiles =", function() {
      this.testTrue(3, "=", 3);
      return this.testFalse(3, "=", 4);
    });

    it("compiles !=", function() {
      this.testTrue(3, "!=", 4);
      return this.testFalse(3, "!=", 3);
    });

    it("compiles >", function() {
      this.testTrue(3, ">", 2);
      return this.testFalse(3, ">", 3);
    });

    it("compiles <", function() {
      this.testTrue(2, "<", 3);
      return this.testFalse(3, "<", 3);
    });

    it("compiles is", function() {
      this.testTrue("id1", "is", "id1");
      return this.testFalse("id1", "is", "id2");
    });

    it("compiles isnt", function() {
      this.testTrue("id1", "isnt", "id2");
      return this.testFalse("id1", "isnt", "id1");
    });

    it("compiles includes", function() {
      this.testTrue(["id1", "id2"], "includes", "id1");
      return this.testFalse(["id1", "id2"], "includes", "id3");
    });

    it("compiles !includes", function() {
      this.testTrue(["id1", "id2"], "!includes", "id3");
      return this.testFalse(["id1", "id2"], "!includes", "id2");
    });

    it("compiles before", function() {
      this.testTrue("2014-03-31", "before", "2014-04-01");
      return this.testFalse("2014-03-31", "before", "2014-03-31");
    });

    it("compiles after", function() {
      this.testTrue("2014-03-31", "after", "2014-03-30");
      return this.testFalse("2014-03-31", "after", "2014-03-31");
    });

    it("compiles true", function() {
      this.testTrue(true, "true");
      return this.testFalse(false, "true");
    });

    it("compiles false", function() {
      this.testTrue(false, "false");
      this.testFalse(true, "false");
      this.testTrue(undefined, "false");
      return this.testTrue(null, "false");
    });

    it("compiles isoneof", function() {
      this.testTrue("abc", "isoneof", ["abc", "def"]);
      this.testTrue("def", "isoneof", ["abc", "def"]);
      return this.testFalse("xyz", "isoneof", ["abc", "def"]);
    });

    it("compiles isntoneof", function() {
      this.testFalse("abc", "isntoneof", ["abc", "def"]);
      return this.testTrue("xyz", "isntoneof", ["abc", "def"]);
    });

    it("compiles isoneof array", function() {
      this.testTrue(["abc"], "isoneof", ["abc", "def"]);
      this.testTrue(["abc", "def"], "isoneof", ["abc", "def"]);
      return this.testFalse(["xyz"], "isoneof", ["abc", "def"]);
    });

    it("compiles isntoneof array", function() {
      this.testFalse(["abc"], "isntoneof", ["abc", "def"]);
      return this.testTrue(["xyz"], "isntoneof", ["abc", "def"]);
    });

    it("compiles is alternate", function() {
      this.testTrue(null, "is", "na", { alternate: "na" });
      this.testTrue(null, "is", "dontknow", { alternate: "dontknow" });
      return this.testFalse(null, "is", "dontknow", { alternate: "na" });
    });

    it("compiles isnt alternate", function() {
      this.testFalse(null, "isnt", "na", { alternate: "na" });
      this.testFalse(null, "isnt", "dontknow", { alternate: "dontknow" });
      return this.testTrue(null, "isnt", "dontknow", { alternate: "na" });
    });

    it("compiles isoneof alternate", function() {
      this.testTrue("abc", "isoneof", ["abc", "def"]);
      this.testTrue(null, "isoneof", ["abc", "na"], { alternate: "na" } );
      return this.testFalse(null, "isoneof", ["abc", "def"], { alternate: "na" } );
    });

    it("compiles isntoneof alternate", function() {
      this.testFalse(null, "isntoneof", ["na", "def"], { alternate: "na"});
      return this.testTrue(null, "isntoneof", ["abc", "def"], { alternate: "na"});
    });

    it("compiles includes alternate", function() {
      this.testTrue(["abc", "def"], "includes", "abc");
      this.testTrue(null, "includes", "na", { alternate: "na" } );
      return this.testFalse(null, "includes", "abc", { alternate: "na" } );
    });

    return it("compiles !includes alternate", function() {
      this.testFalse(["abc", "def"], "!includes", "abc");
      this.testFalse(null, "!includes", "na", { alternate: "na" } );
      return this.testTrue(null, "!includes", "abc", { alternate: "na" } );
    });
  });

  describe("compileConditions", () => it("combines conditions", function() {
    const data = {
      lhsid1: { value: 1 },
      lhsid2: { value: 2 }
    };

    const cond1 = {
      lhs: { question: "lhsid1" },
      op: "=",
      rhs: { literal: 1 }
    };

    const cond2 = {
      lhs: { question: "lhsid2" },
      op: "=",
      rhs: { literal: 2 }
    };

    const cond = conditionUtils.compileConditions([cond1, cond2]);
    assert.isTrue(cond(data));

    data["lhsid2"] = { value: 3 };
    return assert.isFalse(cond(data));
  }));

  describe("applicableOps", function() {
    it('is correct for TextQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"TextQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'contains', '!contains']);
  });

    it('is correct for TextColumnQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"TextColumnQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'contains', '!contains']);
  });

    it('is correct for Question with N/A alternate', function() {
      const ops = conditionUtils.applicableOps({ _type:"TextQuestion", alternates: { na: true } });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'contains', '!contains', 'is', 'isnt', 'isoneof', 'isntoneof']);
  });

    it('is correct for Question with Dont Know alternate', function() {
      const ops = conditionUtils.applicableOps({ _type:"TextQuestion", alternates: { dontknow: true } });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'contains', '!contains', 'is', 'isnt', 'isoneof', 'isntoneof']);
  });

    it('is correct for NumberQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"NumberQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', '=', '!=', '>', '<']);
  });
      
    it('is correct for NumberColumnQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"NumberColumnQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', '=', '!=', '>', '<']);
  });
      
    it('is correct for DropdownQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"DropdownQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']);
  });
      
    it('is correct for DropdowColumnnQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"DropdownColumnQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']);
  });
      
    it('is correct for RadioQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"RadioQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']);
  });

    it('is correct for RadioQuestion with N/A alternate', function() {
      const ops = conditionUtils.applicableOps({ _type:"RadioQuestion", alternates: { na: true }});
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'is', 'isnt', 'isoneof', 'isntoneof']);
  });
      
    it('is correct for MulticheckQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"MulticheckQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof']);
  });

    it('is correct for MulticheckQuestion with N/A alternate', function() {
      const ops = conditionUtils.applicableOps({ _type:"MulticheckQuestion", alternates: { na: true } });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'includes', '!includes', 'isoneof', 'isntoneof'], "Same as does not use is/isn't");
    });
      
    it('is correct for DateQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"DateQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present', 'before', 'after']);
  });
      
    it('is correct for UnitsQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"UnitsQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present']);
  });

    it('is correct for LocationQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"LocationQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present']);
  });

    it('is correct for ImageQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"ImageQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present']);
  });

    it('is correct for ImagesQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"ImagesQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present']);
  });

    it('is correct for TextListQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"TextListQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['present', '!present']);
  });

    // it 'is correct for MultipleTextQuestion', ->
    //   ops = conditionUtils.applicableOps({ _type:"MultipleTextQuestion" })
    //   assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    // it 'is correct for MultipleNumberQuestion', ->
    //   ops = conditionUtils.applicableOps({ _type:"MultipleNumberQuestion" })
    //   assert.deepEqual _.pluck(ops, "id"), ['present', '!present']

    it('is correct for CheckQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"CheckQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['true', 'false']);
  });

    return it('is correct for CheckColumnQuestion', function() {
      const ops = conditionUtils.applicableOps({ _type:"CheckColumnQuestion" });
      return assert.deepEqual(_.pluck(ops, "id"), ['true', 'false']);
  });
});

  describe("rhsType", function() {
    it('is correct for TextQuestion', function() {
      assert.equal(conditionUtils.rhsType({ _type:"TextQuestion" }, "present"), null);
      return assert.equal(conditionUtils.rhsType({ _type:"TextQuestion" }, "contains"), "text");
    });

    it('is correct for NumberQuestion', function() {
      assert.equal(conditionUtils.rhsType({ _type:"NumberQuestion" }, "present"), null);
      return assert.equal(conditionUtils.rhsType({ _type:"NumberQuestion" }, ">"), "number");
    });

    it('is correct for DropdownQuestion', function() {
      assert.equal(conditionUtils.rhsType({ _type:"DropdownQuestion" }, "present"), null);
      assert.equal(conditionUtils.rhsType({ _type:"DropdownQuestion" }, "is"), "choice");
      assert.equal(conditionUtils.rhsType({ _type:"DropdownQuestion" }, "isoneof"), "choices");
      return assert.equal(conditionUtils.rhsType({ _type:"DropdownQuestion" }, "isntoneof"), "choices");
    });

    it('is correct for DropdownColumnQuestion', function() {
      assert.equal(conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "present"), null);
      assert.equal(conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "is"), "choice");
      assert.equal(conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "isoneof"), "choices");
      return assert.equal(conditionUtils.rhsType({ _type:"DropdownColumnQuestion" }, "isntoneof"), "choices");
    });

    return it('is correct for MulticheckQuestion', function() {
      assert.equal(conditionUtils.rhsType({ _type:"MulticheckQuestion" }, "present"), null);
      return assert.equal(conditionUtils.rhsType({ _type:"MulticheckQuestion" }, "includes"), "choice");
    });
  });

  describe("rhsChoices", function() {
    it('is correct for DropdownQuestion', function() {
      const q = { 
        _type:"DropdownQuestion",
        choices: [
          { id: "id1", label: { _base: "en", en: "First" }},
          { id: "id2", label: { _base: "es", en: "Second", es: "Segundo" }}
        ]
      };

      const choices = conditionUtils.rhsChoices(q, "is");
      return assert.deepEqual(choices, [{ id: "id1", text: "First"}, { id: "id2", text: "Segundo"}]);
  });

    it('is correct for DropdownQuestion with N/A', function() {
      const q = { 
        _type:"DropdownQuestion",
        alternates: { na: true },
        choices: [
          { id: "id1", label: { _base: "en", en: "First" }},
          { id: "id2", label: { _base: "es", en: "Second", es: "Segundo" }}
        ]
      };

      const choices = conditionUtils.rhsChoices(q, "is");
      return assert.deepEqual(choices, [{ id: "id1", text: "First"}, { id: "id2", text: "Segundo"}, { id: "na", text: "Not Applicable"}]);
  });

    return it('is correct for TextQuestion with N/A and Dont Know' , function() {
      const q = { 
        _type:"TextQuestion",
        alternates: { na: true, dontknow: true }
      };

      const choices = conditionUtils.rhsChoices(q, "is");
      return assert.deepEqual(choices, [{ id: "dontknow", text: "Don't Know"}, { id: "na", text: "Not Applicable"}]);
  });
});

  describe("validateCondition", function() {
    before(function() {
      return this.form = {
        contents: [
          { _id: "001", _type: "TextQuestion" },
          { _id: "002", _type: "NumberQuestion" },
          { 
            _id: "003",
            _type: "RadioQuestion",
            choices: [
              { id: "dog", label: { _base:"en", en: "Dog"}},
              { id: "cat", label: { _base:"en", en: "Cat"}}
            ],
            alternates: { na: true }
          }
        ]
      };});

    it("fails for no lhs", function() {
      return assert.isFalse(conditionUtils.validateCondition({
      }, this.form)
      );
    });

    it("fails for non-existant question", function() {
      return assert.isFalse(conditionUtils.validateCondition({
        lhs: { question : "xxx" } 
      }, this.form)
      );
    });

    it("fails for no op", function() {
      return assert.isFalse(conditionUtils.validateCondition({
        lhs: { question : "001" } 
      }, this.form)
      );
    });

    it("fails for inappropriate op", function() {
      return assert.isFalse(conditionUtils.validateCondition({
        lhs: { question : "001" },
        op: ">" 
      }, this.form)
      );
    });

    it("fails for no rhs on non-unary", function() {
      return assert.isFalse(conditionUtils.validateCondition({
        lhs: { question : "002" },
        op: ">"
      }, this.form)
      );
    });

    it("fails for wrong rhs type", function() {
      return assert.isFalse(conditionUtils.validateCondition({
        lhs: { question : "002" },
        op: ">",
        rhs: { literal: "xyz" }
      }, this.form)
      );
    });

    it("fails for non-existant id of choice", function() {
      assert.isFalse(conditionUtils.validateCondition({
        lhs: { question : "003" },
        op: "is",
        rhs: { literal: "xyz" }
        }, this.form)
      );

      return assert.isTrue(conditionUtils.validateCondition({
        lhs: { question : "003" },
        op: "is",
        rhs: { literal: "dog" }
        }, this.form)
      );
    });

    it("fails for non-existant id of choices", function() {
      assert.isFalse(conditionUtils.validateCondition({
        lhs: { question : "003" },
        op: "isoneof",
        rhs: { literal: ["xyz"] }
        }, this.form)
      );

      return assert.isTrue(conditionUtils.validateCondition({
        lhs: { question : "003" },
        op: "isoneof",
        rhs: { literal: ["dog"] }
        }, this.form)
      );
    });

    it("true for alternate id of choice", function() {
      return assert.isTrue(conditionUtils.validateCondition({
        lhs: { question : "003" },
        op: "is",
        rhs: { literal: "na" }
        }, this.form)
      );
    });

    it("true for alternate id of choices", function() {
      return assert.isTrue(conditionUtils.validateCondition({
        lhs: { question : "003" },
        op: "isoneof",
        rhs: { literal: ["na"] }
        }, this.form)
      );
    });

    return it("succeeds if ok", function() {
      return assert.isTrue(conditionUtils.validateCondition({
        lhs: { question : "002" },
        op: ">",
        rhs: { literal: 4 }
      }, this.form)
      );
    });
  });


  return describe("summarizeConditions", function() {
    before(function() {
      return this.form = {
        contents: [
          { _id: "001", _type: "TextQuestion", text: { en: "Q1" } },
          { _id: "002", _type: "NumberQuestion", text: { en: "Q2" } },
          { 
            _id: "003",
            _type: "RadioQuestion",
            text: { en: "Q3" },
            choices: [
              { id: "dog", label: { _base:"en", en: "Dog"}},
              { id: "cat", label: { _base:"en", en: "Cat"}}
            ],
            alternates: { na: true }
          }
        ]
      };});

    it("none", function() {
      return assert.equal(conditionUtils.summarizeConditions([], this.form), "");
    });

    it("unary condition", function() {
      return assert.equal(conditionUtils.summarizeConditions([{
        lhs: { question : "002" },
        op: "present"
      }], this.form), "Q2 was answered");
    });

    it("value rhs", function() {
      return assert.equal(conditionUtils.summarizeConditions([{
        lhs: { question : "002" },
        op: ">",
        rhs: { literal: 4 }
      }], this.form), "Q2 is greater than 4");
    });

    it("choice rhs", function() {
      return assert.equal(conditionUtils.summarizeConditions([{
        lhs: { question : "003" },
        op: "is",
        rhs: { literal: "dog" }
      }], this.form), "Q3 is Dog");
    });

    return it("choices rhs", function() {
      return assert.equal(conditionUtils.summarizeConditions([{
        lhs: { question : "003" },
        op: "isoneof",
        rhs: { literal: ["dog", "cat"] }
      }], this.form), "Q3 is one of Dog, Cat");
    });
  });
});
