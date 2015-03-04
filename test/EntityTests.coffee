assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'

# Tests related to the entities connections with forms
describe "Entities", ->
  beforeEach ->
    @model = new Backbone.Model()
    @compiler = new FormCompiler(model: @model)

    # Create sample properties
    @propText = { id: 1, code: "text", type: "text", name: { en: "Text" } }
    @propInteger = { id: 2, code: "integer", type: "integer", name: { en: "Integer" } }
    @propDecimal = { id: 3, code: "decimal", type: "decimal", name: { en: "Decimal" } }
    @propEnum = { id: 4, code: "enum", type: "enum", name: { en: "Enum", es: "Enumes" }, values: [
      { code: "x", name: { en: "X", es: "Xes" }}
      { code: "y", name: { en: "Y" }}
    ] } 
    @propBoolean = { id: 5, code: "boolean", type: "boolean", name: { en: "Boolean" } } 

  describe "form-level entity creation", ->
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
          type: "type1"
          propertyLinks: [
            { property: @propText, type: "direct", direction: "load", question: "q1" }
          ]
        }
      }

      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model)
      @formView = @compiler.compileForm(@form)

    it "loads property links at FormView level", ->
      @formView.setEntity({ _id: "1234", text: "sometext"})
      assert.equal @model.get('q1').value, "sometext"

    it "creates entities", ->
      @model.set('q1', {value: "sometext"})
      entities = @formView.getEntityCreates()
      assert.deepEqual entities, [
        { type: "type1", text: "sometext" }
      ]

      entities = @formView.getEntityUpdates()
      assert.deepEqual entities, []

    it "updates entity if was set", ->
      @formView.setEntity({ _id: "1234", text: "sometext1"})

      @model.set('q1', {value: "sometext2"})
      entities = @formView.getEntityUpdates()
      assert.deepEqual entities, [
        { _id: "1234", updates: { text: "sometext2" } }
      ]

      entities = @formView.getEntityCreates()
      assert.deepEqual entities, []

    it "includes entity updates from EntityQuestions", ->
      # Add entity question
      @form.contents.push({
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
          { property: @propText, direction: "both", question: "q1", type: "direct" }
        ]
      })

      # Recompile form
      @formView = @compiler.compileForm(@form)

      # Set entity for entity question
      @model.set('q2', { value: "1234"})

      # Set text value for q1
      @model.set('q1', { value: "answer"})

      # Get updates
      entities = @formView.getEntityUpdates()
      assert.deepEqual entities, [
        { _id: "1234", updates: { text: "answer" } }
      ]


  describe "property links loading", ->
    it "copies direct links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { property: @propText, type: "direct", direction: "load", question: "q1" }
        { property: @propInteger, type: "direct", direction: "load", question: "q2" }
        ])

      # Load text
      compiled({ text: "sometext"})
      assert.equal @model.get("q1").value, "sometext"

      # Load integer
      compiled({ integer: 123 })
      assert.equal @model.get("q2").value, 123

    it "translates enum:choice links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { property: @propEnum, type: "enum:choice", direction: "load", question: "q1", mappings: [
          { from: "x", to: "xx" }
          { from: "y", to: "yy" }
          ] }
        ])

      compiled({ enum: "x"})
      assert.equal @model.get("q1").value, "xx"

    it "translates boolean:choices links", ->
      compiled = @compiler.compileLoadLinkedAnswers([
        { property: @propBoolean, type: "boolean:choices", direction: "load", question: "q1", choice: "xx"}
        ])

      compiled(boolean: true)
      assert.deepEqual @model.get("q1").value, ["xx"]

      compiled(boolean: false)
      assert.deepEqual @model.get("q1").value, []

  describe "property links saving", ->
    it "copies direct links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { property: @propText, type: "direct", direction: "load", question: "q1" }
        ])

      # Save text
      @model.set("q1", { value: "sometext"})
      assert.deepEqual compiled(), { text: "sometext" }

    it "doesn't copy if question not visible", ->
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
        { property: @propText, type: "direct", direction: "load", question: "q2" }
        ], form)

      # Save text
      @model.set("q2", { value: "sometext"})
      assert.deepEqual compiled(), {  }

      # Save text
      @model.set("q1", { value: "answered"})
      assert.deepEqual compiled(), { text: "sometext" }

    it "translates enum:choice links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { property: @propEnum, type: "enum:choice", direction: "save", question: "q1", mappings: [
          { from: "x", to: "xx" }
          { from: "y", to: "yy" }
          ] }
        ])

      # Save text
      @model.set("q1", { value: "xx"})
      assert.deepEqual compiled(), { enum: "x" }

    it "translates boolean:choices links", ->
      compiled = @compiler.compileSaveLinkedAnswers([
        { property: @propBoolean, type: "boolean:choices", direction: "load", question: "q1", choice: "xx"}
        ])

      @model.set("q1", { value: ["xx"]})
      assert.deepEqual compiled(), { boolean: true }

      @model.set("q1", { value: []})
      assert.deepEqual compiled(), { boolean: false }



#     before ->
#       # Create an entity question
#       @model = new Backbone.Model()
#       @compiler = new FormCompiler(model: @model, locale: "en")
#       @q = {
#         _id: "q1234"
#         _type: "EntityQuestion"
#         text: { _base: "en", en: "English" }

#       }
#       @qview = @compiler.compileQuestion(@q).render()

#     it "selecting entity sets linked empty answer"
#     it "selecting entity does not overwrite linked filled answer"

#   describe "EntityQuestion with answer and linked questions", ->
#     describe "linked question answered", ->
#       it "getEntityUpdates includes update"
#     describe "linked question answered but not visible", ->
#       it "getEntityUpdates does not include update"
#     describe "linked question empty answer", ->
#       it "getEntityUpdates includes update"

#   describe "Entity creation", ->
#     it "fills default answers"
#     it "getEntityCreates returns new entity"

#   describe "Entity updating", ->
#     describe "with entity set", ->
#       it "fills answers with existing properties"
#       describe "linked question answered", ->
#         it "getEntityUpdates includes update"
#       describe "linked question answered but not visible", ->
#         it "getEntityUpdates does not include update"
#       describe "linked question empty answer", ->
#         it "getEntityUpdates includes update"