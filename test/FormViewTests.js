// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
import Backbone from "backbone"
import { assert } from "chai"

// Tests related to the FormView component
describe("FormView", () =>
  beforeEach(function () {
    // Create sample properties
    this.propText = { _id: "1", code: "text", type: "text", name: { en: "Text" } }

    return (this.ctx = {
      getProperty: (id) => {
        if (id === "1") {
          return this.propText
        }
      }
    })
  }))

// describe "setEntity of form-level entity (deprecated)", ->
//   beforeEach ->
//     @form = {
//       contents: [
//         {
//           _id: "q1"
//           _type: "TextQuestion"
//           text: { _base: "en", en: "English", es: "Spanish" }
//           format: "singleline"
//         }
//       ]
//       entitySettings: {
//         entityType: "type1"
//         propertyLinks: [
//           { propertyId: @propText._id, type: "direct", direction: "both", questionId: "q1" }
//         ]
//       }
//     }

//     @model = new Backbone.Model()
//     @compiler = new FormCompiler(ctx: @ctx, model: @model)
//     @formView = @compiler.compileForm(@form)

//   it "loads property links at FormView level", ->
//     @formView.setEntity("type1", { _id: "1234", text: "sometext"})
//     assert.equal @model.get('q1').value, "sometext"

// describe "entity loading", ->
//   it "loads property links", ->
//     @form = {
//       contents: [
//         {
//           _id: "q1"
//           _type: "TextQuestion"
//           text: { _base: "en", en: "English", es: "Spanish" }
//           format: "singleline"
//         }
//         {
//           _id: "q2"
//           _type: "EntityQuestion"
//           text: { _base: "en", en: "English" }
//           entityType: "type1"
//           entityFilter: {}
//           displayProperties: [@propText, @propInteger, @propDecimal, @propEnum]
//           selectProperties: [@propText]
//           mapProperty: null
//           selectText: { en: "Select" }
//           propertyLinks: [
//             { propertyId: @propText._id, direction: "both", questionId: "q1", type: "direct" }
//           ]
//         }
//       ]
//     }

//     @model = new Backbone.Model()
//     @compiler = new FormCompiler(ctx: @ctx, model: @model)
//     @formView = @compiler.compileForm(@form, { entity: { _id: "1234", text: "sometext"}, entityType: "type1" })
//     assert.equal @model.get('q1').value, "sometext"
//     assert.equal @model.get('q2').value, "1234"

//   it "loads site questions", ->
//     @form = {
//       contents: [
//         {
//           _id: "q2"
//           _type: "SiteQuestion"
//           text: { _base: "en", en: "English" }
//           siteTypes: ["Water point"]
//         }
//       ]
//     }

//     @model = new Backbone.Model()
//     @compiler = new FormCompiler(ctx: @ctx, model: @model)
//     @formView = @compiler.compileForm(@form, { entity: { _id: "1234", code: "abc", text: "sometext"}, entityType: "water_point" })
//     assert.deepEqual @model.get('q2').value, { code: "abc" }
