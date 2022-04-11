import _ from "lodash"
import { assert } from "chai"
import { default as ResponseDataExprValueUpdater } from "../src/ResponseDataExprValueUpdater"
import { Expr, Schema } from "mwater-expressions"
import canonical from "canonical-json"

function compare(actual: any, expected: any) {
  return assert.equal(
    canonical(actual),
    canonical(expected),
    "\ngot:" + canonical(actual) + "\nexp:" + canonical(expected) + "\n"
  )
}

describe("ResponseDataExprValueUpdater", function () {
  describe("updates simple question values", function () {
    beforeEach(function () {
      // Test updating a single value. newValue is optional different resulting value
      this.testUpdate = function (type: any, options: any, value: any, done: any, newValue: any) {
        // Make simple question
        const question = {
          _id: "q1234",
          _type: type,
          text: { en: "Q1234" }
        }
        _.extend(question, options)

        const formDesign = {
          _type: "Form",
          contents: [question]
        } as any

        const updater = new ResponseDataExprValueUpdater(formDesign, null as any, null as any)

        // Simple field
        const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value" }

        const oldData = {}
        updater.updateData(oldData, expr, value, (error, data) => {
          assert(!error)
          compare(data, { q1234: { value: newValue || value } })
          compare(oldData, {})
          done()
        })
      }
    })

    it("TextQuestion, TextColumnQuestion", function (done) {
      this.testUpdate("TextQuestion", {}, "abc", done)
    })

    it("NumberQuestion, NumberColumnQuestion", function (done) {
      this.testUpdate("NumberQuestion", {}, 123, () => {
        this.testUpdate("NumberColumnQuestion", {}, 123, done)
      })
    })

    it("DropdownQuestion, DropdownColumnQuestion, RadioQuestion", function (done) {
      const choices = [{ id: "a" }, { id: "b" }]
      this.testUpdate("NumberQuestion", { choices }, "a", done)
    })

    it("MulticheckQuestion", function (done) {
      const choices = [{ id: "a" }, { id: "b" }]
      this.testUpdate("NumberQuestion", { choices }, ["a", "b"], done)
    })

    it("DateQuestion (date and datetime)", function (done) {
      this.testUpdate("DateQuestion", { format: "YYYY-MM-DD" }, "2015-12-25", () => {
        this.testUpdate("DateQuestion", { format: "lll" }, "2015-12-25T12:34:56Z", done)
      })
    })

    it("CheckQuestion, CheckColumnQuestion", function (done) {
      this.testUpdate("CheckQuestion", {}, true, () => {
        this.testUpdate("CheckColumnQuestion", {}, true, done)
      })
    })

    it("ImageQuestion", function (done) {
      this.testUpdate("ImageQuestion", {}, { id: "1234" }, done)
    })

    it("ImagesQuestion", function (done) {
      this.testUpdate("ImagesQuestion", {}, [{ id: "1234" }, { id: "1235" }], done)
    })

    it("TextListQuestion", function (done) {
      this.testUpdate("TextListQuestion", {}, ["a", "b"], done)
    })

    it("BarcodeQuestion", function (done) {
      this.testUpdate("BarcodeQuestion", {}, "abc", done)
    })

    it("LocationQuestion value", function (done) {
      this.testUpdate(
        "LocationQuestion",
        {},
        { type: "Point", coordinates: [2, 3] },
        () => {
          this.testUpdate("LocationQuestion", {}, null, done, null)
        },
        { latitude: 3, longitude: 2 }
      )
    })
  })

  describe("Complex questions", function () {
    before(function () {
      // Test updating a single expression. answer is expected answer
      this.testUpdate = function (
        questionType: any,
        options: any,
        column: any,
        value: any,
        oldAnswer: any,
        newAnswer: any,
        done: any
      ) {
        // Make simple question
        const question = {
          _id: "q1234",
          _type: questionType,
          text: { en: "Q1234" }
        }
        _.extend(question, options)

        const formDesign = {
          _type: "Form",
          contents: [question]
        }

        const updater = new ResponseDataExprValueUpdater(formDesign as any, null as any, null as any)

        // Simple field
        const expr: Expr = { type: "field", table: "responses:form1234", column }

        return updater.updateData({ q1234: oldAnswer }, expr, value, (error, data) => {
          assert(!error)
          compare(data, { q1234: newAnswer })
          return done()
        })
      }
    })

    describe("LikertQuestion", function () {
      it("creates new answer", function (done) {
        this.testUpdate(
          "LikertQuestion",
          {
            items: [
              { id: "item1", label: { _base: "en", en: "Item 1" } },
              { id: "item2", label: { _base: "en", en: "Item 2" } }
            ],
            choices: [
              { id: "yes", label: { _base: "en", en: "Yes" } },
              { id: "no", label: { _base: "en", en: "No" } }
            ]
          },
          "data:q1234:value:item1",
          "yes",
          null,
          { value: { item1: "yes" } },
          done
        )
      })

      it("keeps existing answer", function (done) {
        this.testUpdate(
          "LikertQuestion",
          {
            items: [
              { id: "item1", label: { _base: "en", en: "Item 1" } },
              { id: "item2", label: { _base: "en", en: "Item 2" } }
            ],
            choices: [
              { id: "yes", label: { _base: "en", en: "Yes" } },
              { id: "no", label: { _base: "en", en: "No" } }
            ]
          },
          "data:q1234:value:item1",
          "yes",
          { value: { item2: "no" } },
          { value: { item1: "yes", item2: "no" } },
          done
        )
      })
    })

    describe("MatrixQuestion", function () {
      it("updates simple column", function (done) {
        this.testUpdate(
          "MatrixQuestion",
          {
            items: [
              { id: "item1", label: { _base: "en", en: "Item 1" } },
              { id: "item2", label: { _base: "en", en: "Item 2" } }
            ],
            columns: [{ _id: "col1", _type: "TextColumnQuestion" }]
          },
          "data:q1234:value:item1:col1:value",
          "sometext",
          { value: { item2: { col1: { value: "xyz" } } } },
          { value: { item1: { col1: { value: "sometext" } }, item2: { col1: { value: "xyz" } } } },
          done
        )
      })

      it("updates units magnitude column", function (done) {
        this.testUpdate(
          "MatrixQuestion",
          {
            items: [
              { id: "item1", label: { _base: "en", en: "Item 1" } },
              { id: "item2", label: { _base: "en", en: "Item 2" } }
            ],
            columns: [{ _id: "col1", _type: "DropdownColumnQuestion", units: [{ id: "a" }, { id: "b" }] }]
          },
          "data:q1234:value:item1:col1:value:quantity",
          123,
          { value: { item2: { col1: { value: "xyz" } } } },
          { value: { item1: { col1: { value: { quantity: 123 } } }, item2: { col1: { value: "xyz" } } } },
          done
        )
      })

      it("updates units units column", function (done) {
        this.testUpdate(
          "MatrixQuestion",
          {
            items: [
              { id: "item1", label: { _base: "en", en: "Item 1" } },
              { id: "item2", label: { _base: "en", en: "Item 2" } }
            ],
            columns: [{ _id: "col1", _type: "DropdownColumnQuestion", units: [{ id: "a" }, { id: "b" }] }]
          },
          "data:q1234:value:item1:col1:value:units",
          "a",
          { value: { item2: { col1: { value: "xyz" } } } },
          { value: { item1: { col1: { value: { units: "a" } } }, item2: { col1: { value: "xyz" } } } },
          done
        )
      })
    })
  })

  describe("special cases", function () {
    beforeEach(function () {
      // Make simple question
      this.question = {
        _id: "q1234",
        text: { en: "Q1234" }
      }

      return (this.formDesign = {
        _type: "Form",
        contents: [this.question]
      })
    })

    describe("UnitsQuestion", function () {
      it("quantity from empty", function (done) {
        this.question._type = "UnitsQuestion"
        this.question.units = [{ id: "a" }, { id: "b" }]
        const updater = new ResponseDataExprValueUpdater(this.formDesign, null as any, null as any)

        // Quantity
        const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:quantity" }

        return updater.updateData({}, expr, 4, (error, data) => {
          assert(!error)
          compare(data, { q1234: { value: { quantity: 4 } } })
          return done()
        })
      })

      it("quantity with existing data", function (done) {
        this.question._type = "UnitsQuestion"
        this.question.units = [{ id: "a" }, { id: "b" }]
        const updater = new ResponseDataExprValueUpdater(this.formDesign, null as any, null as any)

        // Quantity
        const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:quantity" }

        return updater.updateData({ q1234: { value: { quantity: 3, units: "a" } } }, expr, 4, (error, data) => {
          assert(!error)
          compare(data, { q1234: { value: { quantity: 4, units: "a" } } })
          return done()
        })
      })

      it("units with existing data", function (done) {
        this.question._type = "UnitsQuestion"
        this.question.units = [{ id: "a" }, { id: "b" }]
        const updater = new ResponseDataExprValueUpdater(this.formDesign, null as any, null as any)

        // Quantity
        const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:units" }

        return updater.updateData({ q1234: { value: { quantity: 3, units: "a" } } }, expr, "b", (error, data) => {
          assert(!error)
          compare(data, { q1234: { value: { quantity: 3, units: "b" } } })
          return done()
        })
      })
    })

    describe("SiteQuestion", function () {
      beforeEach(function () {
        // Create form
        const question = {
          _id: "q1234",
          _type: "SiteQuestion",
          text: { en: "Q1234" },
          siteTypes: ["Community"]
        }

        return (this.formDesign = { _type: "Form", contents: [question] })
      })

      it("nulls", function (done) {
        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, null as any, null as any)

        // Update by name
        const expr = {
          type: "scalar",
          table: "responses:form123",
          joins: ["data:q1234:value"],
          expr: { type: "field", table: "entities.community", column: "name" }
        }

        updater.updateData({ q1234: { value: { code: "somecode" } } }, expr, null, (error, data) => {
          assert(!error)
          assert.equal(data.q1234.value, null)
          done()
        })
      })

      it("searches", async function () {
        // Mock data source
        const dataSource = {
          performQuery: (query: any, callback: any) => {
            // Should query for communities, getting the code and searching by name
            compare(query, {
              type: "query",
              selects: [
                { type: "select", expr: { type: "field", tableAlias: "main", column: "code" }, alias: "value" }
              ],
              from: { type: "table", table: "entities.community", alias: "main" },
              where: {
                type: "op",
                op: "and",
                exprs: [
                  { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "name" }, "Name1"] }
                ]
              },
              limit: 2
            })
            return callback(null, [{ value: "code1" }])
          }
        }

        // Create schema with communities
        let schema = new Schema()
        schema = schema.addTable({
          id: "entities.community",
          name: { en: "Communities" },
          primaryKey: "_id",
          contents: [
            { id: "code", type: "text", name: { en: "Code" } },
            { id: "name", type: "text", name: { en: "Name" } }
          ]
        })

        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, schema, dataSource)

        // Update by name
        const expr = {
          type: "scalar",
          table: "responses:form123",
          joins: ["data:q1234:value"],
          expr: { type: "field", table: "entities.community", column: "name" }
        }

        assert.isTrue(updater.canUpdate(expr), "Should be able to update")

        const data = await updater.updateData({}, expr, "Name1")
        return compare(data.q1234.value, { code: "code1" })
      })

      it("searches with direct _id", function (done) {
        // Mock data source
        const dataSource = {
          performQuery: (query: any, callback: any) => {
            // Should query for communities, getting the code and searching by name
            compare(query, {
              type: "query",
              selects: [
                { type: "select", expr: { type: "field", tableAlias: "main", column: "code" }, alias: "value" }
              ],
              from: { type: "table", table: "entities.community", alias: "main" },
              where: {
                type: "op",
                op: "and",
                exprs: [{ type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "_id" }, "1234"] }]
              },
              limit: 2
            })
            return callback(null, [{ value: "code1" }])
          }
        }

        // Create schema with communities
        let schema = new Schema()
        schema = schema.addTable({
          id: "entities.community",
          name: { en: "Communities" },
          primaryKey: "_id",
          contents: [
            { id: "code", type: "text", name: { en: "Code" } },
            { id: "name", type: "text", name: { en: "Name" } }
          ]
        })

        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, schema, dataSource)

        // Update by name
        const expr: Expr = { type: "field", table: "responses:form123", column: "data:q1234:value" }

        assert.isTrue(updater.canUpdate(expr), "Should be able to update")

        return updater.updateData({}, expr, "1234", (error, data) => {
          assert(!error)

          compare(data.q1234.value, { code: "code1" })
          return done()
        })
      })

      it("shortcuts if has code", function (done) {
        // Mock data source
        const dataSource = {
          performQuery: (query: any, callback: any) => {
            return callback(new Error("Should not query"))
          }
        }

        // Create schema with communities
        let schema = new Schema()
        schema = schema.addTable({
          id: "entities.community",
          name: { en: "Communities" },
          primaryKey: "_id",
          contents: [
            { id: "code", type: "text", name: { en: "Code" } },
            { id: "name", type: "text", name: { en: "Name" } }
          ]
        })

        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, schema, dataSource)

        // Update by name
        const expr = {
          type: "scalar",
          table: "responses:form123",
          joins: ["data:q1234:value"],
          expr: { type: "field", table: "entities.community", column: "code" }
        }

        assert.isTrue(updater.canUpdate(expr), "Should be able to update")

        return updater.updateData({}, expr, "10007", (error, data) => {
          assert(!error)

          compare(data.q1234.value, { code: "10007" })
          return done()
        })
      })
    })

    describe("EntityQuestion", function () {
      beforeEach(function () {
        // Create form
        const question = {
          _id: "q1234",
          _type: "EntityQuestion",
          text: { en: "Q1234" },
          entityType: "community"
        }

        return (this.formDesign = { _type: "Form", contents: [question] })
      })

      it("nulls", function (done) {
        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, null as any, null as any)

        // Update by name
        const expr = {
          type: "scalar",
          table: "responses:form123",
          joins: ["data:q1234:value"],
          expr: { type: "field", table: "entities.community", column: "name" }
        }

        return updater.updateData({ q1234: { value: "12345" } }, expr, null, (error, data) => {
          assert(!error)
          assert.equal(data.q1234.value, null)
          return done()
        })
      })

      it("searches", function (done) {
        // Mock data source
        const dataSource = {
          performQuery: (query: any, callback: any) => {
            // Should query for communities, getting the code and searching by name
            compare(query, {
              type: "query",
              selects: [{ type: "select", expr: { type: "field", tableAlias: "main", column: "_id" }, alias: "value" }],
              from: { type: "table", table: "entities.community", alias: "main" },
              where: {
                type: "op",
                op: "and",
                exprs: [
                  { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "name" }, "Name1"] }
                ]
              },
              limit: 2
            })
            return callback(null, [{ value: "12345" }])
          }
        }

        // Create schema with communities
        let schema = new Schema()
        schema = schema.addTable({
          id: "entities.community",
          name: { en: "Communities" },
          primaryKey: "_id",
          contents: [{ id: "name", type: "text", name: { en: "Name" } }]
        })

        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, schema, dataSource)

        // Update by name
        const expr = {
          type: "scalar",
          table: "responses:form123",
          joins: ["data:q1234:value"],
          expr: { type: "field", table: "entities.community", column: "name" }
        }

        assert.isTrue(updater.canUpdate(expr), "Should be able to update")

        return updater.updateData({}, expr, "Name1", (error, data) => {
          assert(!error)

          compare(data.q1234.value, "12345")
          return done()
        })
      })
    })

    describe("AdminRegionQuestion", function () {
      beforeEach(function () {
        // Create form
        const question = {
          _id: "q1234",
          _type: "AdminRegionQuestion",
          text: { en: "Q1234" },
          entityType: "community"
        }

        return (this.formDesign = { _type: "Form", contents: [question] })
      })

      it("nulls", function (done) {
        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, null as any, null as any)

        // Update by name
        const expr = {
          type: "scalar",
          table: "responses:form123",
          joins: ["data:q1234:value"],
          expr: { type: "field", table: "entities.community", column: "name" }
        }

        return updater.updateData({ q1234: { value: "12345" } }, expr, null, (error, data) => {
          assert(!error)
          assert.equal(data.q1234.value, null)
          return done()
        })
      })

      it("searches", function (done) {
        // Mock data source
        const dataSource = {
          performQuery: (query: any, callback: any) => {
            // Should query for communities, getting the code and searching by name
            compare(query, {
              type: "query",
              selects: [{ type: "select", expr: { type: "field", tableAlias: "main", column: "_id" }, alias: "value" }],
              from: { type: "table", table: "admin_regions", alias: "main" },
              where: {
                type: "op",
                op: "and",
                exprs: [
                  { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "full_name" }, "Name1"] }
                ]
              },
              limit: 2
            })
            return callback(null, [{ value: "12345" }])
          }
        }

        // Create schema with communities
        let schema = new Schema()
        schema = schema.addTable({
          id: "admin_regions",
          primaryKey: "_id",
          name: { _base: "en", en: "Administrative Regions" },
          contents: [{ id: "full_name", name: { _base: "en", en: "Name" }, type: "text" }]
        })

        // Create updater
        const updater = new ResponseDataExprValueUpdater(this.formDesign, schema, dataSource)

        // Update by name
        const expr = {
          type: "scalar",
          table: "responses:form123",
          joins: ["data:q1234:value"],
          expr: { type: "field", table: "admin_regions", column: "full_name" }
        }

        assert.isTrue(updater.canUpdate(expr), "Should be able to update")

        return updater.updateData({}, expr, "Name1", (error, data) => {
          assert(!error)

          compare(data.q1234.value, "12345")
          return done()
        })
      })
    })
  })

  describe("locations", function () {
    beforeEach(function () {
      const formDesign = {
        _type: "Form",
        contents: [
          {
            _id: "q1234",
            _type: "LocationQuestion",
            text: { en: "Q1234" }
          }
        ]
      }

      return (this.updater = new ResponseDataExprValueUpdater(formDesign, null, null))
    })

    it("updates latitude individually", function (done) {
      // Latitude
      const expr = {
        type: "op",
        op: "latitude",
        exprs: [{ type: "field", table: "responses:form1234", column: "data:q1234:value" }]
      }

      return this.updater.updateData(
        { q1234: { value: { latitude: 2, longitude: 3, altitude: 4 } } },
        expr,
        45,
        (error: any, data: any) => {
          assert(!error)
          compare(data, { q1234: { value: { latitude: 45, longitude: 3, altitude: 4 } } })
          return done()
        }
      )
    })

    it("updates longitude individually", function (done) {
      // Latitude
      const expr = {
        type: "op",
        op: "longitude",
        exprs: [{ type: "field", table: "responses:form1234", column: "data:q1234:value" }]
      }

      return this.updater.updateData(
        { q1234: { value: { latitude: 2, longitude: 3, altitude: 4 } } },
        expr,
        45,
        (error: any, data: any) => {
          assert(!error)
          compare(data, { q1234: { value: { latitude: 2, longitude: 45, altitude: 4 } } })
          return done()
        }
      )
    })

    it("updates accuracy", function (done) {
      const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:accuracy" }

      return this.updater.updateData(
        { q1234: { value: { latitude: 2, longitude: 3, altitude: 4 } } },
        expr,
        45,
        (error: any, data: any) => {
          assert(!error)
          compare(data, { q1234: { value: { latitude: 2, longitude: 3, accuracy: 45, altitude: 4 } } })
          return done()
        }
      )
    })

    it("updates altitude", function (done) {
      const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:altitude" }

      return this.updater.updateData(
        { q1234: { value: { latitude: 2, longitude: 3, altitude: 4 } } },
        expr,
        45,
        (error: any, data: any) => {
          assert(!error)
          compare(data, { q1234: { value: { latitude: 2, longitude: 3, altitude: 45 } } })
          return done()
        }
      )
    })

    it("updates method", function (done) {
      const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:method" }

      return this.updater.updateData(
        { q1234: { value: { latitude: 2, longitude: 3, altitude: 4 } } },
        expr,
        "gps",
        (error: any, data: any) => {
          assert(!error)
          compare(data, { q1234: { value: { latitude: 2, longitude: 3, altitude: 4, method: "gps" } } })
          return done()
        }
      )
    })
  })

  it("updates na/don't know", function (done) {
    const formDesign = {
      _type: "Form",
      contents: [
        {
          _id: "q1234",
          _type: "TextQuestion",
          text: { en: "Q1234" },
          alternates: { na: true }
        }
      ]
    }

    const updater = new ResponseDataExprValueUpdater(formDesign, null, null)
    const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:na" }

    return updater.updateData({}, expr, true, (error, data) => {
      assert(!error)
      compare(data, { q1234: { alternate: "na" } })
      return done()
    })
  })

  it("updates contains with one value", function (done) {
    const formDesign = {
      _type: "Form",
      contents: [
        {
          _id: "q1234",
          _type: "MulticheckQuestion",
          text: { en: "Q1234" },
          choices: [{ id: "a" }, { id: "b" }, { id: "c" }]
        }
      ]
    }

    // Contains expression
    const expr = {
      type: "op",
      op: "contains",
      exprs: [
        { type: "field", table: "responses:form1234", column: "data:q1234:value" },
        { type: "literal", valueType: "enumset", value: ["b"] }
      ]
    }
    const updater = new ResponseDataExprValueUpdater(formDesign, null, null)

    // Set contains to true
    return updater.updateData({}, expr, true, (error, data) => {
      assert(!error)
      compare(data, { q1234: { value: ["b"] } })

      // Set it to false
      return updater.updateData({ q1234: { value: ["b", "c"] } }, expr, false, (error, data) => {
        assert(!error)
        compare(data, { q1234: { value: ["c"] } })
        return done()
      })
    })
  })

  it("updates specify", function (done) {
    const formDesign = {
      _type: "Form",
      contents: [
        {
          _id: "q1234",
          _type: "RadioQuestion",
          text: { en: "Q1234" },
          choices: [{ id: "a" }, { id: "b", specify: true }]
        }
      ]
    }

    const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:specify:b" }
    const updater = new ResponseDataExprValueUpdater(formDesign, null, null)

    return updater.updateData({}, expr, "apple", (error, data) => {
      assert(!error)
      compare(data, { q1234: { specify: { b: "apple" } } })
      return done()
    })
  })

  it("updates comments", function (done) {
    const formDesign = {
      _type: "Form",
      contents: [
        {
          _id: "q1234",
          _type: "TextQuestion",
          text: { en: "Q1234" },
          commentsField: true
        }
      ]
    }

    const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:comments" }
    const updater = new ResponseDataExprValueUpdater(formDesign, null, null)

    return updater.updateData({}, expr, "apple", (error, data) => {
      assert(!error)
      compare(data, { q1234: { comments: "apple" } })
      return done()
    })
  })

  it("cleans data", function (done) {
    // Make a form with a condition
    const design = {
      _type: "Form",
      contents: [
        {
          _id: "q1",
          _type: "TextQuestion",
          text: { en: "Q1" },
          conditions: [],
          validations: []
        },
        {
          _id: "q2",
          _type: "TextQuestion",
          text: { en: "Q2" },
          // Conditional on q1
          conditions: [{ lhs: { question: "q1" }, op: "present" }],
          validations: []
        }
      ]
    }

    const updater = new ResponseDataExprValueUpdater(design, null, null)

    // q1
    const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1:value" }

    // Set q1 = null
    return updater.updateData({ q1: { value: "a" }, q2: { value: "b" } }, expr, null, (error, data) => {
      assert(!error)
      return updater.cleanData(
        data,
        function () {},
        (error, cleanData) => {
          compare(cleanData, { q1: { value: null } }, JSON.stringify(data))
          return done()
        }
      )
    })
  })

  describe("CBT tests", function () {
    beforeEach(function () {
      const formDesign = {
        _type: "Form",
        contents: [
          {
            _id: "q1234",
            _type: "AquagenxCBTQuestion",
            text: { en: "Q1234" }
          }
        ]
      }

      this.updater = new ResponseDataExprValueUpdater(formDesign, null, null)

      this.testIndividualCBTField = (field: any, value: any, done: any) => {
        const expr: Expr = { type: "field", table: "responses:form1234", column: `data:q1234:value:cbt:${field}` }

        return this.updater.updateData({}, expr, value, (error: any, data: any) => {
          assert(!error)
          const cbt = {}
          cbt[field] = value
          compare(data, { q1234: { value: { cbt } } })
          return done()
        })
      }

      return (this.testExistingCBTField = (field: any, value: any, done: any) => {
        const expr: Expr = { type: "field", table: "responses:form1234", column: `data:q1234:value:cbt:${field}` }

        return this.updater.updateData(
          { q1234: { value: { cbt: { mpn: 4, confidence: 80, healthRisk: "Unsafe" } } } },
          expr,
          value,
          (error: any, data: any) => {
            assert(!error)
            const expected = { q1234: { value: { cbt: { mpn: 4, confidence: 80, healthRisk: "Unsafe" } } } }
            expected["q1234"]["value"]["cbt"][field] = value
            compare(data, expected)
            return done()
          }
        )
      })
    })

    it("updates c1 individually", function (done) {
      return this.testIndividualCBTField("c1", 4, done)
    })

    it("updates existing c1", function (done) {
      return this.testIndividualCBTField("c1", 4, done)
    })

    it("updates c2 individually", function (done) {
      return this.testIndividualCBTField("c2", 4, done)
    })

    it("updates existing c2", function (done) {
      return this.testIndividualCBTField("c2", 4, done)
    })

    it("updates c3 individually", function (done) {
      return this.testIndividualCBTField("c3", 4, done)
    })

    it("updates existing c3", function (done) {
      return this.testIndividualCBTField("c3", 4, done)
    })

    it("updates c4 individually", function (done) {
      return this.testIndividualCBTField("c4", 4, done)
    })

    it("updates existing c4", function (done) {
      return this.testIndividualCBTField("c4", 4, done)
    })

    it("updates c5 individually", function (done) {
      return this.testIndividualCBTField("c5", 4, done)
    })

    it("updates existing c5", function (done) {
      return this.testIndividualCBTField("c5", 4, done)
    })

    it("updates mpn individually", function (done) {
      return this.testIndividualCBTField("mpn", 4, done)
    })

    it("updates mpn existing data", function (done) {
      return this.testExistingCBTField("mpn", 6, done)
    })

    it("updates confidence individually", function (done) {
      return this.testIndividualCBTField("confidence", 4, done)
    })

    it("updates confidence existing data", function (done) {
      return this.testExistingCBTField("confidence", 96, done)
    })

    it("updates healthRisk individually", function (done) {
      return this.testIndividualCBTField("healthRisk", 4, done)
    })

    it("updates healthRisk existing data", function (done) {
      return this.testExistingCBTField("healthRisk", "High Risk/Probably Unsafe", done)
    })

    it("updates image individually", function (done) {
      // mpn
      const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:image" }

      return this.updater.updateData({}, expr, "https://api.mwater.co/v3/images/abc", (error: any, data: any) => {
        assert(!error)
        compare(data, { q1234: { value: { image: "https://api.mwater.co/v3/images/abc" } } })
        return done()
      })
    })

    it("updates image existing data", function (done) {
      // mpn
      const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:image" }

      return this.updater.updateData(
        { q1234: { value: { image: "https://api.mwater.co/v3/images/abc" } } },
        expr,
        "https://api.mwater.co/v3/images/xyz",
        (error: any, data: any) => {
          assert(!error)
          compare(data, { q1234: { value: { image: "https://api.mwater.co/v3/images/xyz" } } })
          return done()
        }
      )
    })
  })

  describe("handles cascading list question", function () {
    beforeEach(function () {
      const formDesign = {
        _type: "Form",
        contents: [
          {
            _id: "q1234",
            rows: [
              { c0: "2ayqhjNBZX", c1: "uydFCX1vUF", id: "93afddb8823047b98195c729ba70dc9f" },
              { c0: "p2xQ94JFfe", c1: "jAUfpz3tQu", id: "a936f4a85b8f4bb08f6681732fadab24" },
              { c0: "FH75Bd8sGs", c1: "9Hfz7rQtX1", id: "a847771205894fc1bb0584a567ef275e" },
              { c0: "FH75Bd8sGs", c1: "B65b32j5zP", id: "a847771205894fc1bb0584a567ef275e" },
              { c0: "2ayqhjNBZX", c1: "rxq8WyVxaP", id: "92120789a93e4b40aaf61acbf3b94c44" }
            ],
            text: { en: "Food", _base: "en" },
            _type: "CascadingListQuestion",
            columns: [
              {
                id: "c0",
                name: { en: "Type", _base: "en" },
                type: "enum",
                enumValues: [
                  { id: "B5AGJ1Gy8r", name: { en: "Ve", _base: "en" } },
                  { id: "2ayqhjNBZX", name: { en: "Vegitable", _base: "en" } },
                  { id: "p2xQ94JFfe", name: { en: "Fruit", _base: "en" } },
                  { id: "FH75Bd8sGs", name: { en: "Meat", _base: "en" } }
                ]
              },
              {
                id: "c1",
                name: { en: "Item", _base: "en" },
                type: "enum",
                enumValues: [
                  { id: "B65b32j5zP", name: { en: "Lettu", _base: "en" } },
                  { id: "jAUfpz3tQu", name: { en: "Banana", _base: "en" } },
                  { id: "9Hfz7rQtX1", name: { en: "Beef", _base: "en" } },
                  { id: "rxq8WyVxaP", name: { en: "Carrot", _base: "en" } },
                  { id: "uydFCX1vUF", name: { en: "Lettuce", _base: "en" } }
                ]
              }
            ],
            required: false,
            textExprs: [],
            conditions: [],
            validations: []
          }
        ]
      }

      return (this.updater = new ResponseDataExprValueUpdater(formDesign, null, null))
    })

    it("handles cascading field", function (done) {
      const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:c0" }
      return this.updater.updateData({}, expr, "FH75Bd8sGs", (error: any, data: any) => {
        assert(!error)
        compare(data, { q1234: { value: { c0: "FH75Bd8sGs" } } })
        return done()
      })
    })

    it("rejects unknown field value", function (done) {
      const expr: Expr = { type: "field", table: "responses:form1234", column: "data:q1234:value:c0" }
      return this.updater.updateData({}, expr, "123", (error: any, data: any) => {
        assert(error)
        assert.equal('Column "Type" value 123 in question "Food" not found', error.message)
        return done()
      })
    })

    it("updates cascading answer", function (done) {
      const expr1 = { type: "field", table: "responses:form1234", column: "data:q1234:value:c0" }
      const expr2 = { type: "field", table: "responses:form1234", column: "data:q1234:value:c1" }

      return this.updater.updateData({}, expr1, "FH75Bd8sGs", (error: any, data: any) => {
        assert(!error)
        compare(data, { q1234: { value: { c0: "FH75Bd8sGs" } } })

        return this.updater.updateData(data, expr2, "9Hfz7rQtX1", (error: any, data: any) => {
          assert(!error)
          compare(data, { q1234: { value: { c0: "FH75Bd8sGs", c1: "9Hfz7rQtX1" } } })

          // Cleaning should fill in the id by finding the row
          return this.updater.cleanData(
            data,
            function () {},
            (error: any, cleanData: any) => {
              compare(cleanData, {
                q1234: { value: { c0: "FH75Bd8sGs", c1: "9Hfz7rQtX1", id: "a847771205894fc1bb0584a567ef275e" } }
              })
              return done()
            }
          )
        })
      })
    })

    it("prevents selecting a non-existant row", function (done) {
      const expr1 = { type: "field", table: "responses:form1234", column: "data:q1234:value:c0" }
      const expr2 = { type: "field", table: "responses:form1234", column: "data:q1234:value:c1" }

      return this.updater.updateData({}, expr1, "FH75Bd8sGs", (error: any, data: any) => {
        assert(!error)
        compare(data, { q1234: { value: { c0: "FH75Bd8sGs" } } })

        return this.updater.updateData(data, expr2, "rxq8WyVxaP", (error: any, data2: any) => {
          // This row combination doesn't exist, so it should fail here
          // If we waited for the cleaning, it would just remove bad data rather than flag it
          assert(error)
          assert.equal('Row referenced in question "Food" not found', error.message)

          compare(data, { q1234: { value: { c0: "FH75Bd8sGs" } } })

          // Cleaning should clear the answer
          return this.updater.cleanData(
            data,
            function () {},
            (error: any, cleanData: any) => {
              compare(cleanData, { q1234: {} })
              return done()
            }
          )
        })
      })
    })
  })

  describe("handles cascading ref question", function () {
    beforeEach(function () {
      return (this.formDesign = {
        _type: "Form",
        contents: [
          {
            _id: "q1234",
            text: { en: "Food", _base: "en" },
            _type: "CascadingRefQuestion",
            tableId: "custom.ts1.t1",
            dropdowns: [],
            required: false,
            textExprs: [],
            conditions: [],
            validations: []
          }
        ]
      })
    })

    it("searches", async function () {
      // Mock data source
      const dataSource = {
        performQuery: (query: any, callback: any) => {
          // Should query for row matching c1 and c2, returning _id
          compare(query, {
            type: "query",
            selects: [{ type: "select", expr: { type: "field", tableAlias: "main", column: "_id" }, alias: "value" }],
            from: { type: "table", table: "custom.ts1.t1", alias: "main" },
            where: {
              type: "op",
              op: "and",
              exprs: [
                { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "c1" }, "v1"] },
                { type: "op", op: "=", exprs: [{ type: "field", tableAlias: "main", column: "c2" }, "v2"] }
              ]
            },
            limit: 2
          })
          return callback(null, [{ value: "12345" }])
        }
      }

      // Create schema with communities
      let schema = new Schema()
      schema = schema.addTable({
        id: "custom.ts1.t1",
        primaryKey: "_id",
        name: { _base: "en", en: "Custom 1" },
        contents: [
          { id: "c1", name: { _base: "en", en: "C1" }, type: "text" },
          { id: "c2", name: { _base: "en", en: "C2" }, type: "text" }
        ]
      })

      const expr1 = {
        type: "scalar",
        table: "responses:form1234",
        joins: ["data:q1234:value"],
        expr: { type: "field", table: "custom.ts1.t1", column: "c1" }
      }

      const expr2 = {
        type: "scalar",
        table: "responses:form1234",
        joins: ["data:q1234:value"],
        expr: { type: "field", table: "custom.ts1.t1", column: "c2" }
      }

      const updater = new ResponseDataExprValueUpdater(this.formDesign, schema, dataSource)

      assert.isTrue(updater.canUpdate(expr1), "Cannot update")

      const data = await updater.updateDataMultiple({}, [
        { expr: expr1, value: "v1" },
        { expr: expr2, value: "v2" }
      ])
      return compare(data, { q1234: { value: "12345" } })
    })
  })
})
