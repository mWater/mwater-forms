assert = require('chai').assert
ResponseDataExprValueUpdater = require '../src/ResponseDataExprValueUpdater'

describe "ResponseDataExprValueUpdater", ->
  describe "updates simple question values", ->
    beforeEach ->
      # Test updating a single value. newValue is optional different form
      @testUpdate = (type, options, value, done, newValue) ->
        # Make simple question
        question = {
          _id: "q1234"
          _type: type
          text: { en: "Q1234" }
        }
        _.extend(question, options)

        formDesign = {
          _type: "Form"
          contents: [question]
        }

        updater = new ResponseDataExprValueUpdater(formDesign, null, null)

        # Simple field
        expr = { type: "field", table: "responses:form1234", column: "data:q1234:value" }

        updater.updateData({}, expr, value, (error, data) =>
          assert not error
          assert.deepEqual data, { q1234: { value: newValue or value } }
          done()
        )

    it "TextQuestion, TextColumnQuestion", (done) ->
      @testUpdate("TextQuestion", {}, "abc", done)

    it "NumberQuestion, NumberColumnQuestion", (done) ->
      @testUpdate("NumberQuestion", {}, 123, done)
      @testUpdate("NumberColumnQuestion", {}, 123, done)

    it "DropdownQuestion, DropdownColumnQuestion, RadioQuestion", (done) ->
      choices = [{ id: "a" }, { id: "b" }]
      @testUpdate("NumberQuestion", { choices: choices }, "a", done)

    it "MulticheckQuestion", (done) ->
      choices = [{ id: "a" }, { id: "b" }]
      @testUpdate("NumberQuestion", { choices: choices }, ["a", "b"], done)

    it "DateQuestion (date and datetime)", (done) ->
      @testUpdate("DateQuestion", { format: "YYYY-MM-DD" }, "2015-12-25", done)
      @testUpdate("DateQuestion", { format: "lll" }, "2015-12-25T12:34:56Z", done)

    it "CheckQuestion, CheckColumnQuestion", (done) ->
      @testUpdate("CheckQuestion", {}, true, done)
      @testUpdate("CheckColumnQuestion", {}, true, done)

    it "ImageQuestion", (done) ->
      @testUpdate("ImageQuestion", {}, { id: "1234" }, done)

    it "ImagesQuestion", (done) ->
      @testUpdate("ImagesQuestion", {}, [{ id: "1234" }, { id: "1235" }], done)

    it "TextListQuestion", (done) ->
      @testUpdate("TextListQuestion", {}, ["a", "b"], done)

    it "BarcodeQuestion", (done) ->
      @testUpdate("BarcodeQuestion", {}, "abc", done)
      
    it "LocationQuestion value", (done) ->
      @testUpdate("LocationQuestion", {}, { type: "Point", coordinates: [2, 3] }, done, { latitude: 3, longitude: 2 })
      @testUpdate("LocationQuestion", {}, null, done, null)

    it "LikertQuestion"
    it "MatrixQuestion"


  describe "special cases", ->
    beforeEach ->
      # Make simple question
      @question = {
        _id: "q1234"
        text: { en: "Q1234" }
      }

      @formDesign = {
        _type: "Form"
        contents: [@question]
      }


    describe "UnitsQuestion", ->
      it "quantity from empty", (done) ->
        @question._type = "UnitsQuestion"
        @question.units = [{ id: "a" }, { id: "b" }]
        updater = new ResponseDataExprValueUpdater(@formDesign, null, null)

        # Quantity
        expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:quantity" }

        updater.updateData({}, expr, 4, (error, data) =>
          assert not error
          assert.deepEqual data, { q1234: { value: { quantity: 4 } } }
          done()
        )

      it "quantity with existing data", (done) ->
        @question._type = "UnitsQuestion"
        @question.units = [{ id: "a" }, { id: "b" }]
        updater = new ResponseDataExprValueUpdater(@formDesign, null, null)

        # Quantity
        expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:quantity" }

        updater.updateData({ q1234: { value: { quantity: 3, units: "a" }} }, expr, 4, (error, data) =>
          assert not error
          assert.deepEqual data, { q1234: { value: { quantity: 4, units: "a" } } }
          done()
        )

      it "units with existing data", (done) ->
        @question._type = "UnitsQuestion"
        @question.units = [{ id: "a" }, { id: "b" }]
        updater = new ResponseDataExprValueUpdater(@formDesign, null, null)

        # Quantity
        expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:units" }

        updater.updateData({ q1234: { value: { quantity: 3, units: "a" }} }, expr, "b", (error, data) =>
          assert not error
          assert.deepEqual data, { q1234: { value: { quantity: 3, units: "b" } } }
          done()
        )

    it "SiteQuestion" #, (done) ->
      # # Create form
      # question = {
      #   _id: "q1234"
      #   _type: "SiteQuestion"
      #   text: { en: "Q1234" }
      #   siteTypes: ["Community"]
      # }

      # formDesign = { _type: "Form", contents: [question] }

      # # Mock data source
      # # TODO
      # assert.fail()

    it "EntityQuestion"
    it "AdminRegionQuestion"

  it "updates latitude and longitude"
  it "updates accuracy"
  it "updates altitude"
  it "updates na/don't know"
  it "updates contains with one value"
  it "updates specify"
  it "updates comments"

  it "cannot update expressions in general"

  it "cleans after update", (done) ->
    # Make a form with a condition
    design = {
      _type: "Form"
      contents: [
        {
          _id: "q1"
          _type: "TextQuestion"
          text: { en: "Q1" }
          conditions: []
          validations: []
        }      
        {
          _id: "q2"
          _type: "TextQuestion"
          text: { en: "Q2" }
          # Conditional on q1
          conditions: [{ lhs: { question: "q1" }, op: "present" }]
          validations: []
        }      
      ]
    }

    updater = new ResponseDataExprValueUpdater(design, null, null)

    # q1
    expr = { type: "field", table: "responses:form1234", column: "data:q1:value" }

    # Set q1 = null
    updater.updateData({ q1: { value: "a" }, q2: { value: "b" }}, expr, null, (error, data) =>
      assert not error
      assert.deepEqual data, { q1: { value: null } }, JSON.stringify(data)
      done()
    )



