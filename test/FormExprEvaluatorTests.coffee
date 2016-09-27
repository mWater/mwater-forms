assert = require("chai").assert
FormExprEvaluator = require '../src/FormExprEvaluator'

describe "FormExprEvaluator", ->
  describe "renderString", ->
    beforeEach ->
      @testEval = (question, data, parentData, localizedStr, exprs, locale, expected) =>
        formDesign = {
          _type: "Form"
          contents: []
        }

        # Create questions
        question = _.defaults(question, { _id: "a", _type: "TextQuestion", text: { en: "Question" }, conditions: [], validations: [] })

        # Add to form
        formDesign.contents.push(question)

        # Create evaluator
        evl = new FormExprEvaluator(formDesign)

        # Evaluate a simple field
        assert.deepEqual evl.renderString(localizedStr, exprs, data, parentData, locale), expected

    it "uses locale if present", ->
      @testEval({}, {}, null, { _base: "en", en: "test", es: "prueba" }, [], "es", "prueba")

    it "falls back to base", ->
      @testEval({}, {}, null, { _base: "en", en: "test", es: "prueba" }, [], "fr", "test")

    it "uses blank if no expression", ->
      @testEval({}, {}, null, { _base: "en", en: "test{0}" }, [], "en", "test")

    it "renders null as empty", ->
      @testEval({}, {}, null, { _base: "en", en: "test{0}" }, [{ type: "field", table: "responses:1234", column: "a" }], "en", "test")

    it "renders text expressions", ->
      @testEval({}, { a: { value: "xyz" }}, null, { _base: "en", en: "test{0}" }, [{ type: "field", table: "responses:1234", column: "data:a:value" }], "en", "testxyz")

    it "renders number expressions", ->
      @testEval({ _type: "NumberQuestion" }, { a: { value: 123 }}, null, { _base: "en", en: "test{0}" }, [{ type: "field", table: "responses:1234", column: "data:a:value" }], "en", "test123")

    it "renders localized enum expressions", ->
      @testEval({ _type: "RadioQuestion", choices: [{ id: "yes", label: { _base:"en", en: "Yes", fr: "Oui"}}, { id: "no", label: { _base:"en", en: "No"}}] },
        { a: { value: "yes" }}, null, { _base: "en", en: "test{0}" }, [{ type: "field", table: "responses:1234", column: "data:a:value" }], "fr", "testOui")

  describe "evaluateExpr", ->
    beforeEach ->
      @testEval = (question, data, parentData, column, expected) =>
        formDesign = {
          _type: "Form"
          contents: []
        }

        # Create question
        question = _.defaults(question, { _id: "a", _type: "TextQuestion", text: { en: "Question" }, conditions: [], validations: [] })

        # Add to form
        formDesign.contents.push(question)

        # Create evaluator
        evl = new FormExprEvaluator(formDesign)

        # Evaluate a simple field
        assert.deepEqual evl.evaluateExpr({ type: "field", table: "responses:1234", column: column }, data, parentData), expected

    it "evaluates text", ->
      @testEval({ _type: "TextQuestion" }, { a: { value: "xyz" } }, null, "data:a:value", "xyz")

    it "evaluates number", ->
      @testEval({ _type: "NumberQuestion" }, { a: { value: 123 } }, null, "data:a:value", 123)

    it "evaluates choice", ->
      @testEval({ _type: "RadioQuestion", choices: [{ id: "yes", label: { _base:"en", en: "Yes"}}, { id: "no", label: { _base:"en", en: "No"}}] },
        { a: { value: "yes" }}, null, "data:a:value", "Yes")

    it "evaluates choices", ->
      @testEval({ _type: "MulticheckQuestion", choices: [{ id: "yes", label: { _base:"en", en: "Yes"}}, { id: "no", label: { _base:"en", en: "No"}}] },
        { a: { value: ["yes", "no"] }}, null, "data:a:value", "Yes, No")

    it "evaluates location as geojson", ->
      @testEval({ _type: "LocationQuestion" }, { a: { value: { longitude: 12, latitude: 34 } } }, null, "data:a:value", { type: "Point", coordinates: [12, 34] })

    it "evaluates location accuracy", ->
      @testEval({ _type: "LocationQuestion" }, { a: { value: { accuracy: 12 } } }, null, "data:a:value:accuracy", 12)

    it "evaluates location altitude", ->
      @testEval({ _type: "LocationQuestion" }, { a: { value: { altitude: 12 } } }, null, "data:a:value:altitude", 12)

    it "evaluates units quantity", ->
      @testEval({ _type: "UnitsQuestion" }, { a: { value: { quantity: 123, units: "abc" } } }, null, "data:a:value:quantity", 123)

    it "evaluates units unit", ->
      @testEval({ _type: "UnitsQuestion", units: [
          { id: "m", label: { _base:"en", en: "M"}}
          { id: "ft", label: { _base:"en", en: "Ft"}}
        ] }, { a: { value: { quantity: 123, units: "m" } } }, null, "data:a:value:units", "M")

    it "evaluates na", ->
      @testEval({ _type: "TextQuestion", alternates: { na: true } }, { a: { alternate: "na" } }, null, "data:a:na", true)
      @testEval({ _type: "TextQuestion", alternates: { na: true } }, { a: { alternate: "na" } }, null, "data:a:dontknow", false)

    it "evaluates dontknow", ->
      @testEval({ _type: "TextQuestion", alternates: { dontknow: true } }, { a: { alternate: "dontknow" } }, null, "data:a:dontknow", true)
      @testEval({ _type: "TextQuestion", alternates: { dontknow: true } }, { a: { alternate: "dontknow" } }, null, "data:a:na", false)

    it "evaluates recorded timestamp", ->
      @testEval({ recordTimestamp: true }, { a: { timestamp: "2015-12-31" } }, null, "data:a:timestamp", "2015-12-31")

    it "evaluates recorded GPS as geojson", ->
      @testEval({ recordLocation: true }, { a: { location: { longitude: 12, latitude: 34 } } }, null, "data:a:location", { type: "Point", coordinates: [12, 34] })

    it "evaluates recorded GPS accuracy", ->
      @testEval({ recordLocation: true }, { a: { location: { accuracy: 12 } } }, null, "data:a:location:accuracy", 12)

    it "evaluates recorded GPS altitude", ->
      @testEval({ recordLocation: true }, { a: { location: { altitude: 12 } } }, null, "data:a:location:altitude", 12)

    it "evaluates entity and site types as null", ->
      @testEval({ _type: "EntityQuestion" }, { a: { value: "1234" }}, null, "data:a:value", null)
      @testEval({ _type: "SiteQuestion" }, { a: { value: { code: "1234" } } }, null, "data:a:value", null)

    it "evaluates other as null", ->
      @testEval({ _type: "TextQuestion" }, { }, null, "nosuchcolumn", null)

    it "gets data from parentData (response join)", ->
      formDesign = {
        _type: "Form"
        contents: [
          { _id: "a", _type: "TextQuestion", text: { en: "Question" }, conditions: [], validations: [] }
        ]
      }

      # Create evaluator
      evl = new FormExprEvaluator(formDesign)

      # Evaluate a scalar join through response join
      expr = { 
        type: "scalar"
        table: "responses:1234:roster:abcd"
        joins: ['response']
        expr: { type: "field", table: "responses:1234", column: "data:a:value" }
      }
      assert.deepEqual evl.evaluateExpr(expr, { }, { a: { value: "abc" } }), "abc"
