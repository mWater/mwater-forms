assert = require('chai').assert
FormCompiler = require '../src/FormCompiler'

describe "EntityQuestion", ->
  before ->
    # Create sample properties
    @propText = { id: 1, code: "text", type: "text", name: { en: "Text" } }
    @propInteger = { id: 2, code: "integer", type: "integer", name: { en: "Integer" } }
    @propDecimal = { id: 3, code: "decimal", type: "decimal", name: { en: "Decimal" } }
    @propEnum = { id: 4, code: "enum", type: "enum", name: { en: "Enum", es: "Enumes" }, values: [
      { code: "x", name: { en: "X", es: "Xes" }}
      { code: "y", name: { en: "Y" }}
    ] } 

  describe "with multiple displayed properties", ->
    beforeEach ->
      @entity = { 
        _id: "1234"
        text: "abc"
        integer: 123
        decimal: 123.4
        enum: "x"
      }

      # Create a context which selects a sample entity
      @ctx = {
        selectEntity: (options) => options.callback(@entity)
        getEntity: (_id, callback) => 
          console.log _id
          if _id == "1234" 
            callback(@entity) 
          else 
            callback(null)
      }

      # Create an entity question which displays all properties
      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "en", ctx: @ctx)
      @q = {
        _id: "q1"
        _type: "EntityQuestion"
        text: { _base: "en", en: "English" }
        entityType: "type1"
        entityFilter: {}
        displayProperties: [@propText, @propInteger, @propDecimal, @propEnum]
        selectProperties: [@propText]
        mapProperty: null
        selectText: { en: "Select" }
      }
      @qview = @compiler.compileQuestion(@q).render()

    it "displays entity if loaded", ->
      @model.set("q1", { value: "1234" })

      assert.match(@qview.$el.html(), /Text/)
      assert.match(@qview.$el.html(), /abc/)
      assert.match(@qview.$el.html(), /Integer/)
      assert.match(@qview.$el.html(), /123/)
      assert.match(@qview.$el.html(), /Decimal/)
      assert.match(@qview.$el.html(), /123\.4/)
      assert.match(@qview.$el.html(), /Enum/)
      assert.match(@qview.$el.html(), /X/)

    it "displays localized entity", ->
      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
      @qview = @compiler.compileQuestion(@q).render()

      @model.set("q1", { value: "1234" })
      # Shows Spanish instead
      assert.match(@qview.$el.html(), /Enumes/)
      assert.match(@qview.$el.html(), /Xes/)

    it "displays entity if selected", ->
      @qview.selectEntity()

      assert.match(@qview.$el.html(), /Text/)
      assert.match(@qview.$el.html(), /abc/)
      assert.match(@qview.$el.html(), /Integer/)
      assert.match(@qview.$el.html(), /123/)
      assert.match(@qview.$el.html(), /Decimal/)
      assert.match(@qview.$el.html(), /123\.4/)
      assert.match(@qview.$el.html(), /Enum/)
      assert.match(@qview.$el.html(), /X/)

  describe "with linked questions", ->
    beforeEach ->
      # Create a sample property
      @propA = { id: 1, code: "a", type: "text", name: { en: "A" } }

      # Create a context which supports entity selection
      @ctx = {
        selectEntity: (options) -> return null
      }

      # Create an entity question
      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "en", ctx: @ctx)
      @q = {
        _id: "q1"
        _type: "EntityQuestion"
        text: { _base: "en", en: "English" }
        entityType: "type1"
        entityFilter: {}
        displayProperties: [@propA]
        selectProperties: [@propA]
        mapProperty: null
        selectText: { en: "Select" }
        propertyLinks: [
          { property: @propA, direction: "both", question: "q2", type: "direct" }
        ]
      }
      @qview = @compiler.compileQuestion(@q).render()

    it "pre-selected entity does not set linked empty answer", ->
      @model.set("q1", { value: "1234" })

      # Check that linked question is not set
      assert not @model.get("q2")?

    it "selecting entity sets linked empty answer", ->
      # Set callback to select entity with property A set
      @ctx.selectEntity = (options) -> options.callback({ a: "newtext" })
      @qview.selectEntity()

      # Check that linked question is set
      assert.equal @model.get("q2").value, "newtext"

    it "selecting entity does not overwrite linked filled answer", ->
      @model.set("q2", { value: "oldtext" })

      # Set callback to select entity with property A set
      @ctx.selectEntity = (options) -> options.callback({ a: "newtext" })
      @qview.selectEntity()

      # Check that linked question is not set
      assert.equal @model.get("q2").value, "oldtext"

  describe "with answer", ->
    describe "linked question answered", ->
      it "getEntityUpdates includes update"
    describe "linked question answered but not visible", ->
      it "getEntityUpdates does not include update"
    describe "linked question empty answer", ->
      it "getEntityUpdates includes update"

