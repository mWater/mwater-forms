assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'

# Tests related to the entities connections with forms
describe "Entities", ->
  beforeEach ->
    # Create sample properties
    @propText = { _id: "1", code: "text", type: "text", name: { en: "Text" } }
    @propInteger = { _id: "2", code: "integer", type: "integer", name: { en: "Integer" } }
    @propDecimal = { _id: "3", code: "decimal", type: "decimal", name: { en: "Decimal" } }
    @propEnum = { _id: "4", code: "enum", type: "enum", name: { en: "Enum", es: "Enumes" }, values: [
      { code: "x", name: { en: "X", es: "Xes" }}
      { code: "y", name: { en: "Y" }}
    ] } 
    @propBoolean = { _id: "5", code: "boolean", type: "boolean", name: { en: "Boolean" } } 
    @propBoolean2 = { _id: "8", code: "boolean2", type: "boolean", name: { en: "Boolean2" } } 
    @propGeometry = { _id: "6", code: "geometry", type: "geometry", name: { en: "Geometry" } } 
    @propMeasurement = { _id: "7", code: "measurement", type: "measurement", name: { en: "Measurement" }, units: [
      { code: "degF", symbol: "oF", name: { "Fahrenheit" }}
      { code: "degC", symbol: "oC", name: { "Celsius" }}
    ] } 

    @props = [@propText, @propInteger, @propDecimal, @propEnum, @propGeometry, @propBoolean, @propBoolean2, @propMeasurement]

    ctx = {
      getProperty: (id) => _.findWhere(@props, { _id: id })
    }
    @model = new Backbone.Model()
    @compiler = new FormCompiler(ctx: ctx, model: @model)

  describe "(deprecated) form-level entity creation", ->
    beforeEach ->
      @form = {
        contents: [
          {
            _id: "q1"
            _type: "TextQuestion"
            text: { _base: "en", en: "English", es: "Spanish" }
            format: "singleline"
          }
        ]
        entitySettings: {
          entityType: "type1"
          propertyLinks: [
            { propertyId: @propText._id, type: "direct", direction: "both", questionId: "q1" }
          ]
        }
      }

      ctx = {
        getProperty: (id) => _.findWhere(@props, { _id: id })
      }
      @model = new Backbone.Model()
      @compiler = new FormCompiler(ctx: ctx, model: @model)
      @formView = @compiler.compileForm(@form)

    it "creates entities", ->
      @model.set('q1', {value: "sometext"})
      entities = @formView.getEntityCreates()
      assert.isTrue _.isEqual(entities, [
        { type: "type1", entity: { text: "sometext" } }
      ]), JSON.stringify(entities)

      entities = @formView.getEntityUpdates()
      assert.deepEqual entities, []

    it "updates entity if was set", ->
      @formView.setEntity("type1", { _id: "1234", text: "sometext1"})

      @model.set('q1', {value: "sometext2"})
      entities = @formView.getEntityUpdates()
      assert.isTrue _.isEqual(entities, [
        { _id: "1234", type: "type1", updates: { text: "sometext2" } }
        ])

      entities = @formView.getEntityCreates()
      assert.deepEqual entities, []
  
  describe "EntityQuestions", ->
    beforeEach ->
      @form = {
        contents: [
          {
            _id: "q1"
            _type: "TextQuestion"
            text: { _base: "en", en: "English", es: "Spanish" }
            format: "singleline"
          }
          {
            _id: "q2"
            _type: "EntityQuestion"
            text: { _base: "en", en: "English" }
            entityType: "type1"
            entityFilter: {}
            displayProperties: [@propText, @propInteger, @propDecimal, @propEnum]
            selectProperties: [@propText]
            mapProperty: null
            selectText: { en: "Select" }
            propertyLinks: [
              { propertyId: @propText._id, direction: "both", questionId: "q1", type: "direct" }
            ]
          }          
        ]
      }

      ctx = {
        getProperty: (id) => _.findWhere(@props, { _id: id })
      }
      @model = new Backbone.Model()
      @compiler = new FormCompiler(ctx: ctx, model: @model)
      @formView = @compiler.compileForm(@form)

    it "includes entity update", ->
      # Set entity for entity question
      @model.set("q2", { value: "1234" })

      # Set text value for q1
      @model.set('q1', { value: "answer" })

      # Get updates
      entities = @formView.getEntityUpdates()
      assert.deepEqual entities, [
        { _id: "1234", type: "type1", updates: { text: "answer" }, questionId: "q2" }
      ], JSON.stringify(entities)

    it "does not include empty entity updates", ->
      # Set property link to load only, so no updates
      @form.contents[1].propertyLinks[0].direction = "load"

      # Recompile form
      @formView = @compiler.compileForm(@form)

      # Set entity for entity question
      @model.set("q2", { value: "1234" })

      # Set text value for q1
      @model.set('q1', { value: "answer"})

      # Get updates
      entities = @formView.getEntityUpdates()
      assert.deepEqual entities, []

    it "includes entity creates from blank EntityQuestions with createEntity true", ->
      @form.contents[1].createEntity = true

      # Recompile form
      @formView = @compiler.compileForm(@form)

      # Set text value for q1
      @model.set('q1', { value: "answer"})

      # Zero updates
      assert.deepEqual @formView.getEntityUpdates(), []

      # One create
      entities = @formView.getEntityCreates()
      assert.isTrue _.isEqual(entities, [
        { type: "type1", entity: { text: "answer" }, questionId: "q2" }
      ]), JSON.stringify(entities)      

    it "does not include entity creates from blank EntityQuestions with createEntity false", ->
      # Set text value for q1
      @model.set('q1', { value: "answer"})

      # Zero updates
      assert.deepEqual @formView.getEntityUpdates(), []

      # Zero creates
      assert.deepEqual @formView.getEntityCreates(), []

    it "marks created entities", ->
      @form.contents[1].createEntity = true

      # Recompile form
      @formView = @compiler.compileForm(@form)

      # Mark created
      @formView.markEntityCreated("q2", { _id: "1234", text: "abc" })

      assert.deepEqual @model.get('q2').value, "1234"

  describe "property links loading", ->
    it "loads direct links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propText._id, type: "direct", direction: "load", questionId: "q1" }
        { propertyId: @propInteger._id, type: "direct", direction: "load", questionId: "q2" }
        ])

      # Load text
      compiled({ text: "sometext"})
      assert.equal @model.get("q1").value, "sometext"

      # Load integer
      compiled({ integer: 123 })
      assert.equal @model.get("q2").value, 123

    it "loads geometry:location links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propGeometry._id, type: "geometry:location", direction: "load", questionId: "q1" }
        ])

      # Load point
      compiled({ geometry: { type: "Point", coordinates: [1,2]}})
      assert.deepEqual @model.get("q1").value, { latitude: 2, longitude: 1 }

    it "loads enum:choice links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propEnum._id, type: "enum:choice", direction: "load", questionId: "q1", mappings: [
          { from: "x", to: "xx" }
          { from: "y", to: "yy" }
          ] }
        ])

      compiled({ enum: "x"})
      assert.equal @model.get("q1").value, "xx"

    it "loads boolean:choices links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propBoolean._id, type: "boolean:choices", direction: "load", questionId: "q1", choice: "xx"}
        { propertyId: @propBoolean2._id, type: "boolean:choices", direction: "load", questionId: "q1", choice: "yy"}
        ])

      compiled(boolean: true)
      assert.deepEqual @model.get("q1").value, ["xx"]

      compiled(boolean: true, boolean2: true)
      assert.deepEqual @model.get("q1").value, ["xx", "yy"]

      compiled(boolean: false, boolean2: false)
      assert.deepEqual @model.get("q1").value, []

    it "loads boolean:choice links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propBoolean._id, type: "boolean:choice", direction: "load", questionId: "q1", mappings: [
          { from: "true", to: "T" }
          { from: "false", to: "F" }
        ]}
      ])

      compiled(boolean: true)
      assert.deepEqual @model.get("q1").value, "T"

      @model.set("q1", null)

      compiled(boolean: false)
      assert.deepEqual @model.get("q1").value, "F"

    it "loads boolean:alternate links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propBoolean._id, type: "boolean:alternate", direction: "load", questionId: "q1", alternate: "dontknow"}])

      compiled(boolean: true)
      assert.deepEqual @model.get("q1").alternate, "dontknow"

      @model.set("q1", null)

      compiled(boolean: false)
      assert.deepEqual @model.get("q1").alternate, null

    it "loads measurement:units links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propMeasurement._id, type: "measurement:units", direction: "load", questionId: "q1", mappings: [
          { from: "degC", to: "C" }
          { from: "degF", to: "F" }
          ] }
        ])

      compiled({ measurement: { magnitude: 3, unit: "degC" }})
      assert.deepEqual @model.get("q1").value, { quantity: 3, units: "C" }

    it "loads text:specify links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propText._id, type: "text:specify", direction: "load", questionId: "q1", choice: "xx"}
        ])

      compiled(text: "abc")
      assert.deepEqual @model.get("q1").specify, { "xx": "abc" }

    it "loads decimal:location_accuracy links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { propertyId: @propGeometry._id, type: "geometry:location", direction: "load", questionId: "q1" }
        { propertyId: @propDecimal._id, type: "decimal:location_accuracy", direction: "load", questionId: "q1" }
        ])

      # Load point
      compiled({ geometry: { type: "Point", coordinates: [1,2]}, decimal: 23 })
      assert.deepEqual @model.get("q1").value, { latitude: 2, longitude: 1, accuracy: 23 }

  describe "property links saving", ->
    it "saves direct links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propText._id, type: "direct", direction: "save", questionId: "q1" }
        ])

      # Save text
      @model.set("q1", { value: "sometext"})
      assert.deepEqual compiled(), { text: "sometext" }

    it "saves geometry:location links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propGeometry._id, type: "geometry:location", direction: "save", questionId: "q1" }
        ])

      # Save text
      @model.set("q1", { value: { latitude: 1, longitude: 2 }})
      assert.deepEqual compiled(), { geometry: { type: "Point", coordinates: [2, 1]} }

    it "doesn't save if question not visible", ->
      form = { 
        contents: [
          {
            _id: "q1"
            _type: "TextQuestion"
            text: { _base: "en", en: "English", es: "Spanish" }
            format: "singleline"
          },
          {
            _id: "q2"
            _type: "TextQuestion"
            text: { _base: "en", en: "English", es: "Spanish" }
            format: "singleline"
            conditions: [{ lhs: {question: "q1"}, op: "present"}]
          }
        ]
      }

      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propText._id, type: "direct", direction: "save", questionId: "q2" }
        ], form)

      # Save text
      @model.set("q2", { value: "sometext"})
      assert.deepEqual compiled(), {  }

      # Save text
      @model.set("q1", { value: "answered"})
      assert.deepEqual compiled(), { text: "sometext" }

    it "saves enum:choice links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propEnum._id, type: "enum:choice", direction: "save", questionId: "q1", mappings: [
          { from: "x", to: "xx" }
          { from: "y", to: "yy" }
          ] }
        ])

      # Save text
      @model.set("q1", { value: "xx"})
      assert.deepEqual compiled(), { enum: "x" }

    it "saves boolean:choices links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propBoolean._id, type: "boolean:choices", direction: "save", questionId: "q1", choice: "xx"}
        { propertyId: @propBoolean2._id, type: "boolean:choices", direction: "save", questionId: "q1", choice: "yy"}
        ])

      @model.set("q1", { value: ["xx"]})
      assert.deepEqual compiled(), { boolean: true, boolean2: false }

      @model.set("q1", { value: ["xx", "yy"]})
      assert.deepEqual compiled(), { boolean: true, boolean2: true }

      @model.set("q1", { value: []})
      assert.deepEqual compiled(), { boolean: false, boolean2: false }

    it "saves boolean:alternate links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propBoolean._id, type: "boolean:alternate", direction: "save", questionId: "q1", alternate: "dontknow"}
        ])

      @model.set("q1", { alternate: "dontknow"})
      assert.deepEqual compiled(), { boolean: true }

      @model.set("q1", { value: ["xx", "yy"]})
      assert.deepEqual compiled(), { boolean: false }

      @model.set("q1", { alternate: "na"})
      assert.deepEqual compiled(), { boolean: false }

    it "saves boolean:choices link", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propBoolean._id, type: "boolean:choice", direction: "save", questionId: "q1", mappings: [
          { from: "true", to: "T" }
          { from: "false", to: "F" }
        ]}
      ])

      @model.set("q1", { value: "T"})
      assert.deepEqual compiled(), { boolean: true }

      @model.set("q1", { value: "F"})
      assert.deepEqual compiled(), { boolean: false }

    it "saves measurement:units links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propMeasurement._id, type: "measurement:units", direction: "save", questionId: "q1", mappings: [
          { from: "degC", to: "C" }
          { from: "degF", to: "F" }
          ] }
        ])

      @model.set("q1", { value: { units: "C", quantity: 3 }})
      assert.deepEqual compiled().measurement, { magnitude: 3, unit: "degC" }

    it "saves measurement:units null links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propMeasurement._id, type: "measurement:units", direction: "save", questionId: "q1", mappings: [
          { from: "degC", to: "C" }
          { from: "degF", to: "F" }
          ] }
        ])

      @model.set("q1", { value: { units: "C", quantity: null }})
      assert.deepEqual compiled().measurement, null

    it "saves text:specify links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propText._id, type: "text:specify", direction: "save", questionId: "q1", choice: "xx"}
        ])

      @model.set("q1", { specify: { "xx": "abc" }})
      assert.deepEqual compiled().text, "abc"

    it "saves location accuracy links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { propertyId: @propGeometry._id, type: "geometry:location", direction: "save", questionId: "q1" }
        { propertyId: @propDecimal._id, type: "decimal:location_accuracy", direction: "save", questionId: "q1" }
        ])

      # Save text
      @model.set("q1", { value: { latitude: 1, longitude: 2, accuracy: 23 }})
      assert.deepEqual compiled(), { geometry: { type: "Point", coordinates: [2, 1]}, decimal: 23 }
