assert = require("chai").assert
FormExprEvaluator = require '../src/FormExprEvaluator'

describe "FormExprEvaluator", ->
  describe "renderString", ->
    beforeEach ->
      @testEval = (question, data, localizedStr, exprs, locale, expected) =>
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
        assert.deepEqual evl.renderString(localizedStr, exprs, data, locale), expected

    it "uses locale if present", ->
      @testEval({}, {}, { _base: "en", en: "test", es: "prueba" }, [], "es", "prueba")

    it "falls back to base", ->
      @testEval({}, {}, { _base: "en", en: "test", es: "prueba" }, [], "fr", "test")

    it "uses blank if no expression", ->
      @testEval({}, {}, { _base: "en", en: "test{0}" }, [], "en", "test")

    it "renders null as empty", ->
      @testEval({}, {}, { _base: "en", en: "test{0}" }, [{ type: "field", table: "responses:1234", column: "a" }], "en", "test")

    it "renders text expressions", ->
      @testEval({}, { a: { value: "xyz" }}, { _base: "en", en: "test{0}" }, [{ type: "field", table: "responses:1234", column: "data:a:value" }], "en", "testxyz")

    it "renders number expressions", ->
      @testEval({ _type: "NumberQuestion" }, { a: { value: 123 }}, { _base: "en", en: "test{0}" }, [{ type: "field", table: "responses:1234", column: "data:a:value" }], "en", "test123")

  describe "evaluateExpr", ->
    beforeEach ->
      @testEval = (question, data, column, expected) =>
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
        assert.deepEqual evl.evaluateExpr({ type: "field", table: "responses:1234", column: column }, data), expected

    it "evaluates text", ->
      @testEval({ _type: "TextQuestion" }, { a: { value: "xyz" } }, "data:a:value", "xyz")

    it "evaluates number", ->
      @testEval({ _type: "NumberQuestion" }, { a: { value: 123 } }, "data:a:value", 123)

    it "evaluates choice"
    it "evaluates choices"

    it "evaluates location as geojson", ->
      @testEval({ _type: "LocationQuestion" }, { a: { value: { longitude: 12, latitude: 34 } } }, "data:a:value", { type: "Point", coordinates: [12, 34] })

    it "evaluates location accuracy", ->
      @testEval({ _type: "LocationQuestion" }, { a: { value: { accuracy: 12 } } }, "data:a:value:accuracy", 12)

    it "evaluates location altitude", ->
      @testEval({ _type: "LocationQuestion" }, { a: { value: { altitude: 12 } } }, "data:a:value:altitude", 12)

    it "evaluates units quantity", ->
      @testEval({ _type: "UnitsQuestion" }, { a: { value: { quantity: 123, units: "abc" } } }, "data:a:value:quantity", 123)

    it "evaluates units unit", ->
      @testEval({ _type: "UnitsQuestion" }, { a: { value: { quantity: 123, units: "abc" } } }, "data:a:value:units", "abc")

    it "evaluates na", ->
      @testEval({ _type: "TextQuestion", alternates: { na: true } }, { a: { alternate: "na" } }, "data:a:na", true)
      @testEval({ _type: "TextQuestion", alternates: { na: true } }, { a: { alternate: "na" } }, "data:a:dontknow", false)

    it "evaluates dontknow", ->
      @testEval({ _type: "TextQuestion", alternates: { dontknow: true } }, { a: { alternate: "dontknow" } }, "data:a:dontknow", true)
      @testEval({ _type: "TextQuestion", alternates: { dontknow: true } }, { a: { alternate: "dontknow" } }, "data:a:na", false)

    it "evaluates recorded timestamp", ->
      @testEval({ recordTimestamp: true }, { a: { timestamp: "2015-12-31" } }, "data:a:timestamp", "2015-12-31")

    it "evaluates recorded GPS as geojson", ->
      @testEval({ recordLocation: true }, { a: { location: { longitude: 12, latitude: 34 } } }, "data:a:location", { type: "Point", coordinates: [12, 34] })

    it "evaluates recorded GPS accuracy", ->
      @testEval({ recordLocation: true }, { a: { location: { accuracy: 12 } } }, "data:a:location:accuracy", 12)

    it "evaluates recorded GPS altitude", ->
      @testEval({ recordLocation: true }, { a: { location: { altitude: 12 } } }, "data:a:location:altitude", 12)

    it "evaluates entity and site types as null", ->
      @testEval({ _type: "EntityQuestion" }, { a: { value: "1234" }}, "data:a:value", null)
      @testEval({ _type: "SiteQuestion" }, { a: { value: { code: "1234" } } }, "data:a:value", null)

    it "evaluates other as null", ->
      @testEval({ _type: "TextQuestion" }, { }, "nosuchcolumn", null)
