_ = require 'underscore'
$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $
assert = require("chai").assert
forms = require '../src'
UIDriver = require './helpers/UIDriver'
sinon = require 'sinon'
FormCompiler = require '../src/FormCompiler'
commonQuestionTests = require './commonQuestionTests'

class MockImageManager 
  getImageThumbnailUrl: (imageUid, success, error) ->
    success "images/" + imageUid + ".jpg"

  getImageUrl: (imageUid, success, error) ->
    success "images/" + imageUid + ".jpg"

class MockImageAcquirer
  acquire: (success, error) ->
    success("1234")

describe 'ImagesQuestion', ->
  beforeEach ->
    # Create model
    @model = new Backbone.Model 

  context 'With a no image acquirer', ->
    beforeEach ->
      # Create context
      @ctx = {
        imageManager: new MockImageManager()
      }

      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
      @q = {
        _id: "q1234"
        _type: "ImagesQuestion"
        text: { _base: "en", en: "English", es: "Spanish" }
      }
      @qview = @compiler.compileQuestion(@q).render()

    # Run common tests
    commonQuestionTests.call(this)

    it 'displays no image', ->
      @model.set(q1234: { value: [] })
      assert.isTrue true

    it 'displays one image', ->
      @model.set(q1234: { value: [{id: "1234"}]})
      assert.equal @qview.$("img.img-thumbnail").attr("src"), "images/1234.jpg"

    it 'opens page', ->
      @model.set(q1234: {value:[{id: "1234"}]})
      spy = sinon.spy()
      @ctx.displayImage = spy 
      @qview.$("img.img-thumbnail").click()

      assert.isTrue spy.calledOnce
      assert.equal spy.args[0][0].id, "1234"

    it 'allows removing image', ->
      @model.set(q1234: {value: [{id: "1234"}]})
      @ctx.displayImage = (options) ->
        options.remove()

      changed = false
      @model.on "change", ->
        changed = true

      @qview.$("img.img-thumbnail").click()
      assert.equal @qview.$("img#add").length, 0
      assert.isTrue changed, "Should fire changed"

    it 'allows setting cover', ->
      @model.set(q1234: {value: [{id: "1234"}, {id: "5678", cover: true}]})
      @ctx.displayImage = (options) ->
        options.setCover()

      changed = false
      @model.on "change", ->
        changed = true

      @qview.$("img.img-thumbnail").first().click()

      assert.deepEqual @model.get("q1234").value, [{id: "1234", cover: true}, {id: "5678"}]
      assert.isTrue changed, "Should fire changed"

    it 'cannot double-set cover', ->
      @model.set(q1234: {value: [{id: "1234", cover: true}, {id: "5678"}]})
      @ctx.displayImage = (options) ->
        assert not options.setCover?

      @qview.$("img.img-thumbnail").first().click()

    it 'displays no add', ->
      assert.equal @qview.$("img#add").length, 0

  context 'With an image acquirer', ->
    beforeEach ->
      # Create context
      @ctx = {
        imageManager: new MockImageManager()
        imageAcquirer: new MockImageAcquirer()
      }

      @model = new Backbone.Model()
      @compiler = new FormCompiler(model: @model, locale: "es", ctx: @ctx)
      @q = {
        _id: "q1234"
        _type: "ImagesQuestion"
        text: { _base: "en", en: "English", es: "Spanish" }
      }
      @qview = @compiler.compileQuestion(@q).render()

    it 'gets an image, setting cover', ->
      changed = false
      @model.on "change", ->
        changed = true

      @qview.$("img#add").click()
      assert.isTrue _.isEqual(@model.get("q1234"), {value: [{id:"1234", cover: true}]}), @model.get("q1234")
      assert.isTrue changed, "Should fire changed"

    it "gets consent before photo taken", ->
      @q.consentPrompt = { _base: "en", en: "Do you consent?" }
      @qview = @compiler.compileQuestion(@q).render()

      confirmed = false

      _oldConfirm = window.confirm
      window.confirm = (msg) =>
        confirmed = true
        assert.equal msg, @q.consentPrompt.en
        return false

      @qview.$("img#add").click()
      assert.isTrue confirmed, "Not confirmed"
      assert.isUndefined @model.get("q1234"), JSON.stringify(@model.get("q1234"))

      window.confirm = (msg) =>
        confirmed = true
        assert.equal msg, @q.consentPrompt.en
        return true

      confirmed = false
      @qview.$("img#add").click()
      assert.isTrue confirmed, "Not confirmed"
      assert.isTrue _.isEqual(@model.get("q1234"), {value: [{id:"1234", cover: true}]}), @model.get("q1234")

      window.confirm = _oldConfirm


        