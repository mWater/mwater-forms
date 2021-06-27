import { assert } from 'chai';
import TestComponent from 'react-library/lib/TestComponent';
import ReactTestUtils from 'react-dom/test-utils';
import EntityAnswerComponent from '../../src/answers/EntityAnswerComponent';
import React from 'react';
import ReactDOM from 'react-dom';
const R = React.createElement;

describe('EntityAnswerComponent', function() {
  before(function() {
    this.toDestroy = [];

    return this.render = (options = {}) => {
      const elem = R(EntityAnswerComponent, options);
      const comp = new TestComponent(elem);
      this.toDestroy.push(comp);
      return comp;
    };
  });

  return afterEach(function() {
    for (let comp of this.toDestroy) {
      comp.destroy();
    }
    return this.toDestroy = [];});
});

// NOTE: All of this was already commented before we switched from EntityQuestion to EntityAnswerComponent
/*
  * describe "EntityQuestion", ->
*   before ->
*     # Create sample properties
*     @propText = { _id: "1", code: "text", type: "text", name: { en: "Text" } }
*     @propInteger = { _id: "2", code: "integer", type: "integer", name: { en: "Integer" } }
*     @propDecimal = { _id: "3", code: "decimal", type: "decimal", name: { en: "Decimal" } }
*     @propEnum = { _id: "4", code: "enum", type: "enum", name: { en: "Enum", es: "Enumes" }, values: [
*       { code: "x", name: { en: "X", es: "Xes" }}
*       { code: "y", name: { en: "Y" }}
*     ] }
*     @propGeometry = { _id: "5", code: "geometry", type: "geometry", name: { en: "Geometry" } }
*     @propBoolean = { _id: "6", code: "boolean", type: "boolean", name: { en: "Boolean" } }
*     @propDate = { _id: "7", code: "date", type: "date", name: { en: "Date" } }
*     @propEntity = { _id: "8", code: "entity", type: "entity", name: { en: "Entity" } }
*     @propMeasurement = { _id: "9", code: "measurement", type: "measurement", name: { en: "Measurement" }, units:['degC', 'degF'] }
*     @props = [@propText, @propInteger, @propDecimal, @propEnum, @propGeometry, @propBoolean, @propDate, @propEntity, @propMeasurement]

*     @units = [
*       { code: "degF", symbol: "oF", name: { "Fahrenheit" }}
*       { code: "degC", symbol: "oC", name: { "Celsius" }}
*     ]

*   describe "EntityQuestion", ->
*     describe "with multiple displayed properties", ->
*       beforeEach ->
*         @entity = {
*           _id: "1234"
*           text: "abc"
*           integer: 123
*           decimal: 123.4
*           enum: "x"
*           geometry: { type: "Point", coordinates: [3, 4]}
*           boolean: true
*           date: "2014-12-31"
*           entity: "abc123"
*           measurement: { magnitude: 21, unit: "degC" }
*         }

*         # Create a context which selects a sample entity
*         @ctx = {
*           selectEntity: (options) => options.callback("1234")
*           getEntity: (type, _id, callback) =>
*             if _id == "1234"
*               callback(@entity)
*             else
*               callback(null)
*           getProperty: (id) => _.findWhere(@props, { _id: id })
*           getUnit: (code) => _.findWhere(@units, { code: code })
*         }

*         # Create an entity question which displays all properties
*         @model = new Backbone.Model()
*         @compiler = new FormCompiler(model: @model, locale: "en", ctx: @ctx)
*         @q = {
*           _id: "q1"
*           _type: "EntityQuestion"
*           text: { _base: "en", en: "English" }
*           entityType: "type1"
*           entityFilter: {}
*           displayProperties: _.pluck(@props, "_id")
*           selectProperties: [@propText._id]
*           selectText: { en: "Select" }
*         }
*         @qview = @compiler.compileQuestion(@q).render()

*       it "displays entity if loaded", ->
*         @model.set("q1", { value: "1234" })

*         assert.match(@qview.$el.text(), /Text/)
*         assert.match(@qview.$el.text(), /abc/)
*         assert.match(@qview.$el.text(), /Integer/)
*         assert.match(@qview.$el.text(), /123/)
*         assert.match(@qview.$el.text(), /Decimal/)
*         assert.match(@qview.$el.text(), /123\.4/)
*         assert.match(@qview.$el.text(), /Enum/)
*         assert.match(@qview.$el.text(), /X/)
*         assert.match(@qview.$el.text(), /Geometry/)
*         assert.match(@qview.$el.text(), /4, 3/)
*         assert.match(@qview.$el.text(), /Boolean/)
*         assert.match(@qview.$el.text(), /true/)
*         assert.match(@qview.$el.text(), /Date/)
*         assert.match(@qview.$el.text(), /2014-12-31/)
*         assert.match(@qview.$el.text(), /Entity/)
*         assert.match(@qview.$el.text(), /abc123/)
*         assert.match(@qview.$el.text(), /Measurement/)
*         assert.match(@qview.$el.text(), /oC/)

*       it "displays localized entity", ->
*         @model = new Backbone.Model()
*         @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
*         @qview = @compiler.compileQuestion(@q).render()

*         @model.set("q1", { value: "1234" })
*         # Shows Spanish instead
*         assert.match(@qview.$el.html(), /Enumes/)
*         assert.match(@qview.$el.html(), /Xes/)

*       it "displays entity if selected", ->
*         @qview.selectEntity()

*         assert.match(@qview.$el.html(), /Text/)
*         assert.match(@qview.$el.html(), /abc/)

*     describe "with linked questions", ->
*       beforeEach ->
*         # Create a sample property
*         @propA = { _id: "1", code: "a", type: "text", name: { en: "A" } }

*         # Create a context which supports entity selection
*         @ctx = {
*           selectEntity: (options) -> options.callback("1234")
*           getEntity: (type, id, callback) -> return null
*           getProperty: (id) => if id == "1" then @propA
*           getUnit: (code) => _.findWhere(@units, { code: code })
*         }

*         # Create an entity question
*         @model = new Backbone.Model()
*         @compiler = new FormCompiler(model: @model, locale: "en", ctx: @ctx)
*         @q = {
*           _id: "q1"
*           _type: "EntityQuestion"
*           text: { _base: "en", en: "English" }
*           entityType: "type1"
*           entityFilter: {}
*           displayProperties: [@propA._id]
*           selectProperties: [@propA._id]
*           mapProperty: null
*           selectText: { en: "Select" }
*           propertyLinks: [
*             { propertyId: @propA._id, direction: "both", questionId: "q2", type: "direct" }
*           ]
*         }
*         @qview = @compiler.compileQuestion(@q).render()

*       it "pre-selected entity does not set linked empty answer", ->
*         @model.set("q1", { value: "1234" })

*         # Check that linked question is not set
*         assert not @model.get("q2")?

*       it "selecting entity sets linked empty answer", ->
*         # Set callback to select entity with property A set
*         @ctx.getEntity = (type, _id, callback) -> callback({  a: "newtext" })
*         @qview.selectEntity()

*         # Check that linked question is set
*         assert.equal @model.get("q2").value, "newtext"

*       it "selecting entity overwrites linked filled answer", ->
*         @model.set("q2", { value: "oldtext" })

*         # Set callback to select entity with property A set
*         @ctx.getEntity = (type, _id, callback) -> callback({ a: "newtext" })
*         @qview.selectEntity()

*         # Check that linked question is set
*         assert.equal @model.get("q2").value, "newtext"

*   describe "Legacy WWMC-style EntityQuestion", ->
*     describe "with multiple displayed properties", ->
*       beforeEach ->
*         @entity = {
*           _id: "1234"
*           text: "abc"
*           integer: 123
*           decimal: 123.4
*           enum: "x"
*           geometry: { type: "Point", coordinates: [3, 4]}
*           boolean: true
*           date: "2014-12-31"
*           entity: "abc123"
*           measurement: { magnitude: 21, unit: "degC" }
*         }

*         # Create a context which selects a sample entity
*         @ctx = {
*           selectEntity: (options) => options.callback("1234")
*           getEntity: (type, _id, callback) =>
*             if _id == "1234"
*               callback(@entity)
*             else
*               callback(null)
*           getProperty: (id) => _.findWhere(@props, { _id: id })
*           getUnit: (code) => _.findWhere(@units, { code: code })
*         }

*         # Create an entity question which displays all properties
*         @model = new Backbone.Model()
*         @compiler = new FormCompiler(model: @model, locale: "en", ctx: @ctx)
*         @q = {
*           _id: "q1"
*           _type: "EntityQuestion"
*           text: { _base: "en", en: "English" }
*           entityType: "type1"
*           entityFilter: {}
*           displayProperties: [@propText, @propInteger, @propDecimal, @propEnum, @propGeometry, @propBoolean, @propDate, @propEntity, @propMeasurement]
*           selectProperties: [@propText]
*           mapProperty: null
*           selectText: { en: "Select" }
*         }
*         @qview = @compiler.compileQuestion(@q).render()

*       it "displays entity if loaded", ->
*         @model.set("q1", { value: "1234" })

*         assert.match(@qview.$el.text(), /Text/)
*         assert.match(@qview.$el.text(), /abc/)
*         assert.match(@qview.$el.text(), /Integer/)
*         assert.match(@qview.$el.text(), /123/)
*         assert.match(@qview.$el.text(), /Decimal/)
*         assert.match(@qview.$el.text(), /123\.4/)
*         assert.match(@qview.$el.text(), /Enum/)
*         assert.match(@qview.$el.text(), /X/)
*         assert.match(@qview.$el.text(), /Geometry/)
*         assert.match(@qview.$el.text(), /4, 3/)
*         assert.match(@qview.$el.text(), /Boolean/)
*         assert.match(@qview.$el.text(), /true/)
*         assert.match(@qview.$el.text(), /Date/)
*         assert.match(@qview.$el.text(), /2014-12-31/)
*         assert.match(@qview.$el.text(), /Entity/)
*         assert.match(@qview.$el.text(), /abc123/)
*         assert.match(@qview.$el.text(), /Measurement/)
*         assert.match(@qview.$el.text(), /oC/)

*       it "displays localized entity", ->
*         @model = new Backbone.Model()
*         @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
*         @qview = @compiler.compileQuestion(@q).render()

*         @model.set("q1", { value: "1234" })
*         # Shows Spanish instead
*         assert.match(@qview.$el.html(), /Enumes/)
*         assert.match(@qview.$el.html(), /Xes/)

*       it "displays entity if selected", ->
*         @qview.selectEntity()

*         assert.match(@qview.$el.html(), /Text/)
*         assert.match(@qview.$el.html(), /abc/)

*     describe "with linked questions", ->
*       beforeEach ->
*         # Create a sample property
*         @propA = { _id: "1", code: "a", type: "text", name: { en: "A" } }

*         # Create a context which supports entity selection
*         @ctx = {
*           selectEntity: (options) -> options.callback("1234")
*           getEntity: (type, id, callback) -> return null
*           getProperty: (id) => if id == "1" then @propA
*           getUnit: (code) => _.findWhere(@units, { code: code })
*         }

*         # Create an entity question
*         @model = new Backbone.Model()
*         @compiler = new FormCompiler(model: @model, locale: "en", ctx: @ctx)
*         @q = {
*           _id: "q1"
*           _type: "EntityQuestion"
*           text: { _base: "en", en: "English" }
*           entityType: "type1"
*           entityFilter: {}
*           displayProperties: [@propA]
*           selectProperties: [@propA]
*           mapProperty: null
*           selectText: { en: "Select" }
*           propertyLinks: [
*             { property: @propA, direction: "both", question: "q2", type: "direct", propertyId: @propA._id, questionId: "q2" }
*           ]
*         }
*         @qview = @compiler.compileQuestion(@q).render()

*       it "pre-selected entity does not set linked empty answer", ->
*         @model.set("q1", { value: "1234" })

*         # Check that linked question is not set
*         assert not @model.get("q2")?

*       it "selecting entity sets linked empty answer", ->
*         # Set callback to select entity with property A set
*         @ctx.getEntity = (type, _id, callback) -> callback({  a: "newtext" })
*         @qview.selectEntity()

*         # Check that linked question is set
*         assert.equal @model.get("q2").value, "newtext"

*       it "selecting entity overwrites linked filled answer", ->
*         @model.set("q2", { value: "oldtext" })

*         # Set callback to select entity with property A set
*         @ctx.getEntity = (type, _id, callback) -> callback({ a: "newtext" })
*         @qview.selectEntity()

*         # Check that linked question is set
*         assert.equal @model.get("q2").value, "newtext"

*   describe "hidden", ->
*     before ->
*       # Create a hidden entity question
*       @model = new Backbone.Model()
*       @compiler = new FormCompiler(model: @model, locale: "en", ctx: @ctx)
*       @q = {
*         _id: "q1"
*         _type: "EntityQuestion"
*         text: { _base: "en", en: "English" }
*         entityType: "type1"
*         entityFilter: {}
*         displayProperties: []
*         selectProperties: []
*         mapProperty: null
*         selectText: { en: "Select" }
*         hidden: true
*       }
*       @qview = @compiler.compileQuestion(@q).render()

*     it "does not display", ->
*       assert.isFalse @qview.shouldBeVisible()
*/