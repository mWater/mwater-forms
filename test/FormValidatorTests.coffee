assert = require('chai').assert
ResponseDataExprValueUpdater = require '../src/ResponseDataExprValueUpdater'
Schema = require('mwater-expressions').Schema
canonical = require 'canonical-json'

compare = (actual, expected) ->
  assert.equal canonical(actual), canonical(expected), "\n" + canonical(actual) + "\n" + canonical(expected) + "\n"

describe "ResponseDataExprValueUpdater", ->
  describe "updates simple question values", ->
    beforeEach ->
      # Test updating a single value. newValue is optional different resulting value
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
          compare data, { q1234: { value: newValue or value } }
          done()
        )

    it "TextQuestion, TextColumnQuestion", (done) ->
      @testUpdate("TextQuestion", {}, "abc", done)

    it "NumberQuestion, NumberColumnQuestion", (done) ->
      @testUpdate("NumberQuestion", {}, 123, =>
        @testUpdate("NumberColumnQuestion", {}, 123, done)
      )

    it "DropdownQuestion, DropdownColumnQuestion, RadioQuestion", (done) ->
      choices = [{ id: "a" }, { id: "b" }]
      @testUpdate("NumberQuestion", { choices: choices }, "a", done)

    it "MulticheckQuestion", (done) ->
      choices = [{ id: "a" }, { id: "b" }]
      @testUpdate("NumberQuestion", { choices: choices }, ["a", "b"], done)

    it "DateQuestion (date and datetime)", (done) ->
      @testUpdate("DateQuestion", { format: "YYYY-MM-DD" }, "2015-12-25", =>
        @testUpdate("DateQuestion", { format: "lll" }, "2015-12-25T12:34:56Z", done)
      )

    it "CheckQuestion, CheckColumnQuestion", (done) ->
      @testUpdate("CheckQuestion", {}, true, =>
        @testUpdate("CheckColumnQuestion", {}, true, done)
      )

    it "ImageQuestion", (done) ->
      @testUpdate("ImageQuestion", {}, { id: "1234" }, done)

    it "ImagesQuestion", (done) ->
      @testUpdate("ImagesQuestion", {}, [{ id: "1234" }, { id: "1235" }], done)

    it "TextListQuestion", (done) ->
      @testUpdate("TextListQuestion", {}, ["a", "b"], done)

    it "BarcodeQuestion", (done) ->
      @testUpdate("BarcodeQuestion", {}, "abc", done)
      
    it "LocationQuestion value", (done) ->
      @testUpdate("LocationQuestion", {}, { type: "Point", coordinates: [2, 3] }, =>
        @testUpdate("LocationQuestion", {}, null, done, null)
      , { latitude: 3, longitude: 2 })

  describe "Complex questions", ->
    before ->
      # Test updating a single expression. answer is expected answer
      @testUpdate = (questionType, options, column, value, oldAnswer, newAnswer, done) ->
        # Make simple question
        question = {
          _id: "q1234"
          _type: questionType
          text: { en: "Q1234" }
        }
        _.extend(question, options)

        formDesign = {
          _type: "Form"
          contents: [question]
        }

        updater = new ResponseDataExprValueUpdater(formDesign, null, null)

        # Simple field
        expr = { type: "field", table: "responses:form1234", column: column }

        updater.updateData({ q1234: oldAnswer }, expr, value, (error, data) =>
          assert not error
          compare data, { q1234: newAnswer }
          done()
        )

    describe "LikertQuestion", ->
      it "creates new answer", (done) ->
        @testUpdate("LikertQuestion", { 
            items: [
              { id: "item1", label: { _base:"en", en: "Item 1" } }
              { id: "item2", label: { _base:"en", en: "Item 2" } }
            ]
            choices: [
              { id: "yes", label: { _base:"en", en: "Yes"}}
              { id: "no", label: { _base:"en", en: "No"}}
            ]
          },
          "data:q1234:value:item1",
          "yes"
          null
          { value: { item1: "yes" } }
          done
        )

      it "keeps existing answer", (done) ->
        @testUpdate("LikertQuestion", { 
            items: [
              { id: "item1", label: { _base:"en", en: "Item 1" } }
              { id: "item2", label: { _base:"en", en: "Item 2" } }
            ]
            choices: [
              { id: "yes", label: { _base:"en", en: "Yes"}}
              { id: "no", label: { _base:"en", en: "No"}}
            ]
          },
          "data:q1234:value:item1",
          "yes"
          { value: { item2: "no" } }
          { value: { item1: "yes", item2: "no" } }
          done
        )

    describe "MatrixQuestion", ->
      it "updates simple column", (done) ->
        @testUpdate("MatrixQuestion", { 
            items: [
              { id: "item1", label: { _base:"en", en: "Item 1" } }
              { id: "item2", label: { _base:"en", en: "Item 2" } }
            ]
            columns: [
              { _id: "col1", _type: "TextColumnQuestion" }
            ]
          },
          "data:q1234:value:item1:col1:value",
          "sometext"
          { value: { item2: { col1: { value: "xyz" } } } }
          { value: { item1: { col1: { value: "sometext" } }, item2: { col1: { value: "xyz" } } } }
          done
        )

      it "updates units magnitude column", (done) ->
        @testUpdate("MatrixQuestion", { 
            items: [
              { id: "item1", label: { _base:"en", en: "Item 1" } }
              { id: "item2", label: { _base:"en", en: "Item 2" } }
            ]
            columns: [
              { _id: "col1", _type: "DropdownColumnQuestion", units: [{ id: "a" }, { id: "b" }] }
            ]
          },
          "data:q1234:value:item1:col1:value:quantity",
          123
          { value: { item2: { col1: { value: "xyz" } } } }
          { value: { item1: { col1: { value: { quantity: 123 } } }, item2: { col1: { value: "xyz" } } } } 
          done
        )

      it "updates units units column", (done) ->
        @testUpdate("MatrixQuestion", { 
            items: [
              { id: "item1", label: { _base:"en", en: "Item 1" } }
              { id: "item2", label: { _base:"en", en: "Item 2" } }
            ]
            columns: [
              { _id: "col1", _type: "DropdownColumnQuestion", units: [{ id: "a" }, { id: "b" }] }
            ]
          },
          "data:q1234:value:item1:col1:value:units",
          "a"
          { value: { item2: { col1: { value: "xyz" } } } }
          { value: { item1: { col1: { value: { units: "a" } } }, item2: { col1: { value: "xyz" } } } } 
          done
        )


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
          compare data, { q1234: { value: { quantity: 4 } } }
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
          compare data, { q1234: { value: { quantity: 4, units: "a" } } }
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
          compare data, { q1234: { value: { quantity: 3, units: "b" } } }
          done()
        )

    describe "SiteQuestion", ->
      beforeEach ->
        # Create form
        question = {
          _id: "q1234"
          _type: "SiteQuestion"
          text: { en: "Q1234" }
          siteTypes: ["Community"]
        }

        @formDesign = { _type: "Form", contents: [question] }

      it "nulls", (done) ->
        # Create updater
        updater = new ResponseDataExprValueUpdater(@formDesign, null, null)

        # Update by name
        expr = { type: "scalar", table: "responses:form123", joins: ["data:q1234:value"], expr: { type: "field", table: "entities.community", column: "name" }}

        updater.updateData({ q1234: { value: { code: "somecode" } } }, expr, null, (error, data) =>
          assert not error
          assert.equal data.q1234.value, null
          done()
        )

      it "searches", (done) ->
        # Mock data source
        dataSource = {
          performQuery: (query, callback) =>
            # Should query for communities, getting the code and searching by name
            compare query, {
              type: "query"
              selects: [
                { type: "select", expr: { type: "field", tableAlias: "main", column: "code" }, alias: "value" }
              ]
              from: { type: "table", table: "entities.community", alias: "main" }
              where: {
                type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "name" }, "Name1"]
              }
              limit: 2
            }
            callback(null, [{ value: "code1" }])
        }

        # Create schema with communities
        schema = new Schema()
        schema = schema.addTable({
          id: "entities.community"
          name: { en: "Communities" }
          primaryKey: "_id"
          contents: [
            { id: "code", type: "text", name: { en: "Code" } }
            { id: "name", type: "text", name: { en: "Name" } }
          ]
        })

        # Create updater
        updater = new ResponseDataExprValueUpdater(@formDesign, schema, dataSource)

        # Update by name
        expr = { type: "scalar", table: "responses:form123", joins: ["data:q1234:value"], expr: { type: "field", table: "entities.community", column: "name" }}

        assert.isTrue updater.canUpdate(expr), "Should be able to update"

        updater.updateData({}, expr, "Name1", (error, data) =>
          assert not error

          compare data.q1234.value, { code: "code1" }
          done()
        )

    describe "EntityQuestion", ->
      beforeEach ->
        # Create form
        question = {
          _id: "q1234"
          _type: "EntityQuestion"
          text: { en: "Q1234" }
          entityType: "community"
        }

        @formDesign = { _type: "Form", contents: [question] }

      it "nulls", (done) ->
        # Create updater
        updater = new ResponseDataExprValueUpdater(@formDesign, null, null)

        # Update by name
        expr = { type: "scalar", table: "responses:form123", joins: ["data:q1234:value"], expr: { type: "field", table: "entities.community", column: "name" }}

        updater.updateData({ q1234: { value: "12345" } }, expr, null, (error, data) =>
          assert not error
          assert.equal data.q1234.value, null
          done()
        )

      it "searches", (done) ->
        # Mock data source
        dataSource = {
          performQuery: (query, callback) =>
            # Should query for communities, getting the code and searching by name
            compare query, {
              type: "query"
              selects: [
                { type: "select", expr: { type: "field", tableAlias: "main", column: "_id" }, alias: "value" }
              ]
              from: { type: "table", table: "entities.community", alias: "main" }
              where: {
                type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "name" }, "Name1"]
              }
              limit: 2
            }
            callback(null, [{ value: "12345" }])
        }

        # Create schema with communities
        schema = new Schema()
        schema = schema.addTable({
          id: "entities.community"
          name: { en: "Communities" }
          primaryKey: "_id"
          contents: [
            { id: "name", type: "text", name: { en: "Name" } }
          ]
        })

        # Create updater
        updater = new ResponseDataExprValueUpdater(@formDesign, schema, dataSource)

        # Update by name
        expr = { type: "scalar", table: "responses:form123", joins: ["data:q1234:value"], expr: { type: "field", table: "entities.community", column: "name" }}

        assert.isTrue updater.canUpdate(expr), "Should be able to update"

        updater.updateData({}, expr, "Name1", (error, data) =>
          assert not error

          compare data.q1234.value, "12345"
          done()
        )

    describe "AdminRegionQuestion", ->
      beforeEach ->
        # Create form
        question = {
          _id: "q1234"
          _type: "AdminRegionQuestion"
          text: { en: "Q1234" }
          entityType: "community"
        }

        @formDesign = { _type: "Form", contents: [question] }

      it "nulls", (done) ->
        # Create updater
        updater = new ResponseDataExprValueUpdater(@formDesign, null, null)

        # Update by name
        expr = { type: "scalar", table: "responses:form123", joins: ["data:q1234:value"], expr: { type: "field", table: "entities.community", column: "name" }}

        updater.updateData({ q1234: { value: "12345" } }, expr, null, (error, data) =>
          assert not error
          assert.equal data.q1234.value, null
          done()
        )

      it "searches", (done) ->
        # Mock data source
        dataSource = {
          performQuery: (query, callback) =>
            # Should query for communities, getting the code and searching by name
            compare query, {
              type: "query"
              selects: [
                { type: "select", expr: { type: "field", tableAlias: "main", column: "_id" }, alias: "value" }
              ]
              from: { type: "table", table: "admin_regions", alias: "main" }
              where: {
                type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "full_name" }, "Name1"]
              }
              limit: 2
            }
            callback(null, [{ value: "12345" }])
        }

        # Create schema with communities
        schema = new Schema()
        schema = schema.addTable({
          id: "admin_regions"
          primaryKey: "_id"
          name: { _base: "en", en: "Administrative Regions" }
          contents: [
            { id: "full_name", name: { _base: "en", en: "Name"}, type: "text" }
          ]
        })

        # Create updater
        updater = new ResponseDataExprValueUpdater(@formDesign, schema, dataSource)

        # Update by name
        expr = { type: "scalar", table: "responses:form123", joins: ["data:q1234:value"], expr: { type: "field", table: "admin_regions", column: "full_name" }}

        assert.isTrue updater.canUpdate(expr), "Should be able to update"

        updater.updateData({}, expr, "Name1", (error, data) =>
          assert not error

          compare data.q1234.value, "12345"
          done()
        )

  describe "locations", ->
    beforeEach ->
      formDesign = {
        _type: "Form"
        contents: [
          {
            _id: "q1234"
            _type: "LocationQuestion"
            text: { en: "Q1234" }
          }
        ]
      }

      @updater = new ResponseDataExprValueUpdater(formDesign, null, null)

    it "updates latitude individually", (done) ->
      # Latitude
      expr = { type: "op", op: "latitude", exprs: [{ type: "field", table: "responses:form1234", column: "data:q1234:value" }] }

      @updater.updateData({ q1234: { value: { latitude: 2, longitude: 3, altitude: 4 }}}, expr, 45, (error, data) =>
        assert not error
        compare data, { q1234: { value: { latitude: 45, longitude: 3, altitude: 4 }}}
        done()
      )

    it "updates longitude individually", (done) ->
      # Latitude
      expr = { type: "op", op: "longitude", exprs: [{ type: "field", table: "responses:form1234", column: "data:q1234:value" }] }

      @updater.updateData({ q1234: { value: { latitude: 2, longitude: 3, altitude: 4 }}}, expr, 45, (error, data) =>
        assert not error
        compare data, { q1234: { value: { latitude: 2, longitude: 45, altitude: 4 }}}
        done()
      )

    it "updates accuracy", (done) ->
      expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:accuracy" }

      @updater.updateData({ q1234: { value: { latitude: 2, longitude: 3, altitude: 4 }}}, expr, 45, (error, data) =>
        assert not error
        compare data, { q1234: { value: { latitude: 2, longitude: 3, accuracy: 45, altitude: 4 }}}
        done()
      )

    it "updates altitude", (done) ->
      expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:altitude" }

      @updater.updateData({ q1234: { value: { latitude: 2, longitude: 3, altitude: 4 }}}, expr, 45, (error, data) =>
        assert not error
        compare data, { q1234: { value: { latitude: 2, longitude: 3, altitude: 45 }}}
        done()
      )

  it "updates na/don't know", (done) ->
    formDesign = {
      _type: "Form"
      contents: [
        {
          _id: "q1234"
          _type: "TextQuestion"
          text: { en: "Q1234" }
          alternates: { na: true }
        }
      ]
    }

    updater = new ResponseDataExprValueUpdater(formDesign, null, null)
    expr = { type: "field", table: "responses:form1234", column: "data:q1234:na" }
    
    updater.updateData({ }, expr, true, (error, data) =>
      assert not error
      compare data, { q1234: { alternate: "na" } }
      done()
    )

  it "updates contains with one value", (done) ->
    formDesign = {
      _type: "Form"
      contents: [
        {
          _id: "q1234"
          _type: "MulticheckQuestion"
          text: { en: "Q1234" }
          choices: [{ id: "a" }, { id: "b" }, { id: "c" }]
        }
      ]
    }

    # Contains expression
    expr = { type: "op", op: "contains", exprs: [{ type: "field", table: "responses:form1234", column: "data:q1234:value" }, { type: "literal", valueType: "enumset", value: ['b'] } ] }
    updater = new ResponseDataExprValueUpdater(formDesign, null, null)

    # Set contains to true
    updater.updateData { }, expr, true, (error, data) =>
      assert not error
      compare data, { q1234: { value: ['b'] } }

      # Set it to false
      updater.updateData { q1234: { value: ['b', 'c'] } }, expr, false, (error, data) =>
        assert not error
        compare data, { q1234: { value: ['c'] } }
        done()

  it "updates specify", (done) ->
    formDesign = {
      _type: "Form"
      contents: [
        {
          _id: "q1234"
          _type: "RadioQuestion"
          text: { en: "Q1234" }
          choices: [{ id: "a" }, { id: "b", specify: true }]
        }
      ]
    }

    expr = { type: "field", table: "responses:form1234", column: "data:q1234:specify:b" }
    updater = new ResponseDataExprValueUpdater(formDesign, null, null)

    updater.updateData({ }, expr, "apple", (error, data) =>
      assert not error
      compare data, { q1234: { specify: { b: "apple" } } }
      done()
    )
    
  it "updates comments", (done) ->
    formDesign = {
      _type: "Form"
      contents: [
        {
          _id: "q1234"
          _type: "TextQuestion"
          text: { en: "Q1234" }
          commentsField: true
        }
      ]
    }

    expr = { type: "field", table: "responses:form1234", column: "data:q1234:comments" }
    updater = new ResponseDataExprValueUpdater(formDesign, null, null)

    updater.updateData({ }, expr, "apple", (error, data) =>
      assert not error
      compare data, { q1234: { comments: "apple" } }
      done()
    )

  it "cleans data", (done) ->
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
      data = updater.cleanData(data)
      compare data, { q1: { value: null } }, JSON.stringify(data)
      done()
    )


  describe.only "validations", ->
    it "validates data without sections", () ->
      # Make a form with a condition
      design = {
        _type: "Form"
        contents: [
          {
            _id: "q1"
            _type: "TextQuestion"
            text: { en: "Q1" }
            conditions: []
            validations: [{
              "op": "lengthRange",
              "rhs": {
                "literal": {
                  "max": 5
                }
              },
              "message": {
                "en": "String is too long",
                "_base": "en"
              }
            }]
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

      data = { q1: { value: "court" }}
      [questionId, validationError] = updater.validate(data)
      assert.isNull questionId
      assert.isNull validationError

      data = { q1: { value: "trop long" }}
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'q1'
      assert.equal "String is too long", validationError

    it "validates data with sections", () ->
      # Make a form with a condition
      design = {
        _type: "Form"
        contents: [
          {
            "_id": "fc6f23bd07cb4f05b8508b9a5d9e6107",
            "name": {
              "en": "Main Section",
              "_base": "en"
            },
            "_type": "Section",
            "contents": [
              {
                _id: "q1"
                _type: "TextQuestion"
                text: {en: "Q1"}
                conditions: []
                validations: [{
                  "op": "lengthRange",
                  "rhs": {
                    "literal": {
                      "max": 5
                    }
                  },
                  "message": {
                    "en": "String is too long",
                    "_base": "en"
                  }
                }]
              }
              {
                _id: "q2"
                _type: "TextQuestion"
                text: {en: "Q2"}
                # Conditional on q1
                conditions: [{lhs: {question: "q1"}, op: "present"}]
                validations: []
              }
            ]
          }
        ]
      }

      updater = new ResponseDataExprValueUpdater(design, null, null)

      data = { q1: { value: "court" }}
      [questionId, validationError] = updater.validate(data)
      assert.isNull questionId
      assert.isNull validationError

      data = { q1: { value: "trop long" }}
      [questionId, validationError] = updater.validate(data)
      assert.equal "q1", questionId
      assert.equal "String is too long", validationError


    it "validates RosterMatrix", () ->
      design = {
        "_type": "Form",
        _id: "form123"
        "_schema": 11,
        "name": {
          "_base": "en",
          "en": "Sample Form"
        },
        "contents": [
          {
            _id: "matrix01"
            _type: "RosterMatrix"
            "name": {
              "_base": "en",
              "en": "Roster Matrix"
            },
            allowAdd: true,
            allowRemove: true,
            contents: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true}
              { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false }
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } }
              { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
            ]
          },
          {
            _id: "matrix02"
            _type: "RosterMatrix"
            "name": {
              "_base": "en",
              "en": "Roster Matrix 2"
            },
            rosterId: "matrix01",
            contents: [
              { _id: "a2", _type: "TextColumnQuestion", text: { en: "Name" }, validations: [{
                "op": "lengthRange",
                "rhs": {
                  "literal": {
                    "max": 5
                  }
                },
                "message": {
                  "en": "String is too long",
                  "_base": "en"
                }
              }]}
            ]
          }
        ]
      }

      updater = new ResponseDataExprValueUpdater(design, null, null)

      # Question a should be complaining (answer to a required)
      data = {matrix01: [data: {b: {value: 33}}]}
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'matrix01_0_a'
      assert.equal validationError, 'column required'

      # Question a2 should be complaining (answer to a is too long)
      data = {matrix01: [data: {a: {value: 'something'}, a2: {value: 'too long'}, b: {value: 33}}]}
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'matrix02_0_a2'
      assert.equal validationError, 'String is too long'

      # Everything should be fine
      data = {matrix01: [data: {a: {value: 'something'}, a2: {value: 'court'}, b: {value: 33}}]}
      [questionId, validationError] = updater.validate(data)
      assert.isNull questionId
      assert.isNull validationError

    it "validates MatrixQuestion", () ->
      design = {
        _type: "Form"
        _id: "form123"
        "_schema": 11,
        "name": {
          "_base": "en",
          "en": "Sample Form"
        },
        "contents": [
          {
            _id: "matrix01"
            _type: "MatrixQuestion"
            "name": {
              "_base": "en",
              "en": "Matrix"
            },
            items: [
              { "id": "item1", "label": { "en": "First", "_base": "en" } }
              { "id": "item2", "label": { "en": "Second", "_base": "en" } }
              { "id": "item3", "label": { "en": "Third", "_base": "en" }, hint: { en: "Some hint"} }
            ]
            columns: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true, validations: [{
                "op": "lengthRange",
                "rhs": {
                  "literal": {
                    "max": 10
                  }
                },
                "message": {
                  "en": "String is too long",
                  "_base": "en"
                }
              }] }
              { _id: "b", _type: "NumberColumnQuestion", text: { en: "Age" }, decimal: false }
              { _id: "c", _type: "CheckColumnQuestion", text: { en: "Present" } }
              { _id: "d", _type: "DropdownColumnQuestion", text: { en: "Gender" }, choices: [{ label: { en: "Male"}, id: "male" }, { label: { en: "Female"}, id: "female" }] }
              { _id: "e", _type: "UnitsColumnQuestion", text: { en: "Unit" }, units: [{ label: { en: "CM"}, id: "cm" }, { label: { en: "INCH"}, id: "inch" }] }
            ]
          }
        ]
      }

      updater = new ResponseDataExprValueUpdater(design, null, null)

      # Item1 should be complaining (answoer to a is too long)
      data = {matrix01: {item1: {a: {value: 'data too long'}}}}
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'matrix01_item1_a'
      assert.equal validationError, 'String is too long'

      # Item1 should be complaining (missing required field)
      data = { }
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'matrix01_item1_a'
      assert.equal validationError, 'data required'

      # Now Item2 should be complaining (missing required field)
      data = { matrix01: {item1: {a: {value: 'data'}}}}
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'matrix01_item2_a'
      assert.equal validationError, 'data required'

      # Now there shouldn't be any error
      data = {
        matrix01: {
          item1: {a: {value: 'data'}}
          item2: {a: {value: 'data'}}
          item3: {a: {value: 'data'}}
        }
      }
      [questionId, validationError] = updater.validate(data)
      assert.isNull questionId
      assert.isNull validationError

    it "validates RosterGroup", () ->
      design = {
        _type: "Form"
        _id: "form123"
        "_schema": 11,
        "name": {
          "_base": "en",
          "en": "Sample Form"
        },
        "contents": [
          {
            _id: "firstRosterGroupId",
            name: {"en":"First Roster Group","_base":"en"},
            _type: "RosterGroup",
            required: false,
            contents: []
          },
          {
            _id: "secondRosterGroupId",
            rosterId: "firstRosterGroupId",
            name: {"en":"Second Roster Group","_base":"en"},
            _type: "RosterGroup",
            required: false,
            contents: [
              { _id: "a", _type: "TextColumnQuestion", text: { en: "Name" }, required: true, validations: [{
                "op": "lengthRange",
                "rhs": {
                  "literal": {
                    "max": 5
                  }
                },
                "message": {
                  "en": "String is too long",
                  "_base": "en"
                }
              }] }
            ]
          }
        ]
      }

      updater = new ResponseDataExprValueUpdater(design, null, null)

      data = {
        firstRosterGroupId: [{
          data: {a: {value: 'trop long'}}
        }]
      }
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'secondRosterGroupId_0_a'
      assert.equal validationError, 'String is too long'

      data = {
        firstRosterGroupId: [
          data: {}
        ]
      }
      [questionId, validationError] = updater.validate(data)
      assert.equal questionId, 'secondRosterGroupId_0_a'
      # TODO, Should give a better error than that!
      assert.equal validationError, true

      # Now there shouldn't be any error
      data = {
        firstRosterGroupId: [{
          data: {a: {value: 'court'}}
        }]
      }
      [questionId, validationError] = updater.validate(data)
      assert.isNull questionId
      assert.isNull validationError


